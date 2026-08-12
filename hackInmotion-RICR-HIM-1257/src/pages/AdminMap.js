import { issueService } from '../services/issueService.js';

export function renderAdminMap() {
  return `
    <style>
      .admin-map-wrapper {
        position: relative;
        width: 100vw;
        height: calc(100vh - 64px);
        margin-left: calc(-50vw + 50%);
        margin-top: calc(-1 * var(--spacing-md));
        overflow: hidden;
        background: #0f172a; /* Dark theme for Admin Map */
      }
      
      @media(min-width: 768px) {
        .admin-map-wrapper {
          width: calc(100% + 2 * var(--spacing-md));
          margin-left: calc(-1 * var(--spacing-md));
        }
      }

      .admin-map-grid {
        position: absolute;
        width: 200vw;
        height: 200vh;
        left: -50vw;
        top: -50vh;
        background-image: 
          radial-gradient(#1e293b 2px, transparent 2px),
          radial-gradient(#334155 1px, transparent 1px);
        background-size: 20px 20px, 100px 100px;
        background-position: 0 0, 0 0;
        cursor: grab;
      }
      .admin-map-grid:active { cursor: grabbing; }

      /* Hotspots */
      .hotspot-blob {
        position: absolute;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        filter: blur(60px);
        opacity: 0.15;
        pointer-events: none;
      }

      /* Admin Pins - More compact */
      .admin-pin {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid #0f172a;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        cursor: pointer;
        z-index: 5;
        transition: transform 0.2s, z-index 0s;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      }
      .admin-pin:hover, .admin-pin.active {
        transform: translate(-50%, -50%) scale(1.5);
        z-index: 20;
      }
      
      /* Priority Rings */
      .admin-pin.priority-high::before {
        content: ''; position: absolute; top: -4px; left: -4px; right: -4px; bottom: -4px;
        border-radius: 50%; border: 1px dashed var(--error); animation: spin 4s linear infinite;
      }
      @keyframes spin { 100% { transform: rotate(360deg); } }

      /* Floating Overlays */
      .admin-map-filters {
        position: absolute;
        top: var(--spacing-md);
        left: var(--spacing-md);
        z-index: 10;
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.1);
        padding: var(--spacing-sm);
        border-radius: var(--radius-md);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        width: 280px;
        box-shadow: var(--elevation-2);
      }
      
      .admin-map-filters .input, .admin-map-filters .select {
        background: rgba(0,0,0,0.2);
        color: white;
        border-color: rgba(255,255,255,0.2);
      }

      /* Side Preview Panel */
      .admin-map-preview {
        position: absolute;
        top: var(--spacing-md);
        right: -400px;
        width: 320px;
        height: calc(100% - 2 * var(--spacing-md));
        background: var(--surface-container-lowest);
        border-radius: var(--radius-md);
        box-shadow: var(--elevation-3);
        z-index: 30;
        transition: right 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }
      .admin-map-preview.active { right: var(--spacing-md); }

    </style>

    <div class="admin-map-wrapper">
      
      <!-- Draggable Map Grid -->
      <div class="admin-map-grid" id="admin-map-grid">
        <!-- Pins and Hotspots injected via JS -->
      </div>

      <!-- Left Filters Panel -->
      <div class="admin-map-filters">
        <div class="title-md mb-xs" style="color: white;">Command Filters</div>
        <input type="text" id="map-search" class="input" placeholder="Search ID, Location..." />
        <select id="map-status" class="select">
          <option value="Active">Open / Active</option>
          <option value="Critical">Critical Priority</option>
          <option value="All">All Issues</option>
        </select>
        <select id="map-category" class="select">
          <option value="All">All Categories</option>
          <option value="Roads">Roads</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Electricity">Electricity</option>
          <option value="Water">Water</option>
        </select>
      </div>

      <!-- Right Side Preview Panel -->
      <div class="admin-map-preview" id="admin-map-preview">
        <div style="padding: var(--spacing-md); border-bottom: 1px solid var(--outline-variant); position: sticky; top: 0; background: var(--surface-container-lowest); z-index: 2; display: flex; justify-content: space-between; items-center;">
          <h3 class="title-md m-0" id="preview-id">BH-XXXX</h3>
          <button class="btn-icon" id="preview-close" style="margin: -8px;">✕</button>
        </div>
        
        <div style="padding: var(--spacing-md); flex: 1;">
          <h2 class="title-lg mb-sm" id="preview-title">Title</h2>
          
          <div class="flex flex-wrap gap-xs mb-md">
            <span class="badge badge-neutral" id="preview-status">Status</span>
            <span class="priority-indicator" id="preview-priority">Priority</span>
            <span class="badge badge-neutral" style="background: var(--surface-container-high); border: none;" id="preview-category">Category</span>
          </div>

          <div class="caption text-muted mb-xs uppercase">Location</div>
          <div class="body-md mb-md">📍 <span id="preview-loc">Location</span></div>

          <div class="caption text-muted mb-xs uppercase">Reported By</div>
          <div class="body-md mb-md">👤 Citizen #<span id="preview-citizen">xxxx</span></div>

          <a href="#" id="preview-link" class="btn btn-primary w-full" style="justify-content: center;">Open Command Detail</a>
        </div>
      </div>

    </div>
  `;
}

export async function initAdminMap() {
  const mapGrid = document.getElementById('admin-map-grid');
  const previewPanel = document.getElementById('admin-map-preview');
  const btnClose = document.getElementById('preview-close');
  let allIssues = [];
  
  // Dragging logic
  let isDragging = false;
  let startX, startY, currentX = 0, currentY = 0;
  
  const startDrag = (x, y) => { isDragging = true; startX = x - currentX; startY = y - currentY; };
  const moveDrag = (x, y) => { if (isDragging) { currentX = x - startX; currentY = y - startY; mapGrid.style.transform = \`translate(\${currentX}px, \${currentY}px)\`; } };
  const stopDrag = () => { isDragging = false; };

  mapGrid.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
  window.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
  window.addEventListener('mouseup', stopDrag);
  
  mapGrid.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX, e.touches[0].clientY), {passive: true});
  window.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY), {passive: true});
  window.addEventListener('touchend', stopDrag);

  btnClose.addEventListener('click', () => {
    previewPanel.classList.remove('active');
    document.querySelectorAll('.admin-pin').forEach(p => p.classList.remove('active'));
  });

  // Mock deterministic coords
  const getMockCoords = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return { left: 20 + Math.abs(hash % 60), top: 20 + Math.abs((hash >> 4) % 60) };
  };

  const renderMap = () => {
    const search = document.getElementById('map-search').value.toLowerCase();
    const statusVal = document.getElementById('map-status').value;
    const catVal = document.getElementById('map-category').value;

    let filtered = allIssues.filter(i => {
      if (search && !(\`\${i.id} \${i.location} \${i.title}\`.toLowerCase().includes(search))) return false;
      if (catVal !== 'All' && i.category !== catVal) return false;
      if (statusVal === 'Active' && (i.status === 'Resolved' || i.status === 'Verified' || i.status === 'Closed')) return false;
      if (statusVal === 'Critical' && i.priority !== 'High') return false;
      return true;
    });

    mapGrid.innerHTML = '';
    
    // Inject Hotspots (Simulated based on density, hardcoded for mock visuals)
    if (filtered.length > 5) {
      mapGrid.innerHTML += \`<div class="hotspot-blob" style="left: 45%; top: 35%; background: var(--error);"></div>\`;
      mapGrid.innerHTML += \`<div class="hotspot-blob" style="left: 70%; top: 60%; background: var(--warning);"></div>\`;
    }

    filtered.forEach(issue => {
      const coords = getMockCoords(issue.id + issue.location);
      
      let bgColor = '#3b82f6'; // Default Blue
      if (issue.priority === 'High') bgColor = 'var(--error)';
      else if (issue.status === 'Resolved' || issue.status === 'Verified') bgColor = 'var(--success)';
      
      let icon = '';
      if (issue.category === 'Roads') icon = '🛣️';
      if (issue.category === 'Sanitation') icon = '🗑️';
      if (issue.category === 'Electricity') icon = '⚡';

      const pin = document.createElement('div');
      pin.className = \`admin-pin \${issue.priority === 'High' && issue.status !== 'Resolved' ? 'priority-high' : ''}\`;
      pin.style.left = \`\${coords.left}%\`;
      pin.style.top = \`\${coords.top}%\`;
      pin.style.backgroundColor = bgColor;
      pin.innerHTML = icon;

      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.admin-pin').forEach(p => p.classList.remove('active'));
        pin.classList.add('active');
        
        // Populate Preview
        document.getElementById('preview-id').textContent = issue.id;
        document.getElementById('preview-title').textContent = issue.title;
        document.getElementById('preview-loc').textContent = issue.location;
        document.getElementById('preview-citizen').textContent = issue.userId.substring(0, 5);
        document.getElementById('preview-category').textContent = issue.category;
        
        document.getElementById('preview-status').textContent = issue.status;
        document.getElementById('preview-status').className = \`badge badge-neutral \${['Resolved', 'Verified'].includes(issue.status) ? 'inactive' : ''}\`;
        
        const prioEl = document.getElementById('preview-priority');
        prioEl.textContent = issue.priority;
        prioEl.className = \`priority-indicator \${issue.priority === 'High' ? 'priority-high' : (issue.priority === 'Medium' ? 'priority-medium' : 'priority-low')}\`;
        
        document.getElementById('preview-link').href = \`#/admin/issue/\${issue.id}\`;
        
        previewPanel.classList.add('active');
      });

      mapGrid.appendChild(pin);
    });
  };

  try {
    allIssues = await issueService.getIssues();
    renderMap();
  } catch (e) {
    console.error("Failed to load map data", e);
  }

  document.getElementById('map-search').addEventListener('input', renderMap);
  document.getElementById('map-status').addEventListener('change', renderMap);
  document.getElementById('map-category').addEventListener('change', renderMap);
}
