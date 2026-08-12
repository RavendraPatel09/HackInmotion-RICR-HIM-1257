import { issueService } from '../services/issueService.js';
import { Icons } from '../utils/icons.js';

export function renderCitizenMap() {
  return `
    <style>
      .map-container {
        position: relative;
        width: 100vw;
        height: calc(100vh - 80px); /* Account for bottom nav */
        margin-left: calc(-50vw + 50%); /* Full bleed */
        margin-top: calc(-1 * var(--spacing-md));
        overflow: hidden;
        background: #e2e8f0;
      }

      /* Mock Map Grid */
      .map-grid {
        position: absolute;
        width: 200vw;
        height: 200vh;
        left: -50vw;
        top: -50vh;
        background-image: 
          radial-gradient(#cbd5e1 2px, transparent 2px),
          radial-gradient(#94a3b8 1px, transparent 1px);
        background-size: 20px 20px, 100px 100px;
        background-position: 0 0, 0 0;
        cursor: grab;
      }
      
      .map-grid:active {
        cursor: grabbing;
      }

      /* Floating Overlays */
      .map-overlays {
        position: absolute;
        top: var(--spacing-md);
        left: var(--spacing-md);
        right: var(--spacing-md);
        z-index: 10;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        pointer-events: none;
      }

      .map-overlays > * {
        pointer-events: auto;
      }

      .map-controls {
        position: absolute;
        right: var(--spacing-md);
        bottom: 220px;
        z-index: 10;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
      }

      .map-btn {
        width: 44px;
        height: 44px;
        background: var(--surface-container-lowest);
        border: 1px solid var(--outline-variant);
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: var(--elevation-1);
        cursor: pointer;
      }

      /* Map Pins */
      .interactive-pin {
        position: absolute;
        transform: translate(-50%, -100%);
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        background: var(--brand-navy);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        box-shadow: var(--elevation-2);
        cursor: pointer;
        transition: transform 0.2s, z-index 0s;
        z-index: 5;
      }
      
      .interactive-pin::after {
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        bottom: -4px;
        left: -4px;
        z-index: -1;
        filter: blur(2px);
      }

      .interactive-pin:hover, .interactive-pin.active {
        transform: translate(-50%, -100%) scale(1.15);
        z-index: 20;
      }

      /* Bottom Sheet Preview */
      .map-preview-sheet {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--surface-container-lowest);
        border-top-left-radius: var(--radius-lg);
        border-top-right-radius: var(--radius-lg);
        box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
        padding: var(--spacing-lg);
        z-index: 30;
        transform: translateY(110%);
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      
      .map-preview-sheet.active {
        transform: translateY(0);
      }
      
      @media(min-width: 768px) {
        .map-container { width: 100%; margin-left: 0; border-radius: var(--radius-md); border: 1px solid var(--outline-variant); }
        .map-preview-sheet { left: var(--spacing-lg); bottom: var(--spacing-lg); right: auto; width: 350px; border-radius: var(--radius-md); }
      }
    </style>

    <div class="map-container" id="map-container">
      
      <!-- Draggable Map Grid -->
      <div class="map-grid" id="map-grid">
        <!-- Pins will be injected here -->
      </div>

      <!-- Overlays (Search & Filters) -->
      <div class="map-overlays">
        <div class="input-group" style="margin: 0; box-shadow: var(--elevation-2);">
          <input type="text" id="map-search" class="input" placeholder="Search map..." style="background: var(--surface-container-lowest);" />
        </div>
        <div class="flex gap-sm">
          <select id="map-category-filter" class="select" style="flex: 1; box-shadow: var(--elevation-1); background: var(--surface-container-lowest);">
            <option value="All">All Categories</option>
            <option value="Roads">Roads</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Electricity">Electricity</option>
          </select>
          <select id="map-status-filter" class="select" style="flex: 1; box-shadow: var(--elevation-1); background: var(--surface-container-lowest);">
            <option value="Active">Active</option>
            <option value="Resolved">Resolved</option>
            <option value="All">All Statuses</option>
          </select>
        </div>
      </div>

      <!-- Map Controls -->
      <div class="map-controls">
        <div class="map-btn" id="btn-my-location">${Icons.location}</div>
        <div class="map-btn" id="btn-zoom-in">+</div>
        <div class="map-btn" id="btn-zoom-out">-</div>
      </div>

      <!-- Issue Preview Bottom Sheet -->
      <div class="map-preview-sheet" id="map-preview">
        <div class="flex justify-between items-start mb-sm">
          <div>
            <span class="badge badge-neutral mb-xs" id="preview-id">BH-XXXX</span>
            <h3 class="title-md m-0" id="preview-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;">Issue Title</h3>
          </div>
          <button class="btn-icon" id="preview-close" style="margin-top: -8px; margin-right: -8px;">×</button>
        </div>
        
        <div class="flex gap-sm mb-md pb-sm" style="border-bottom: 1px solid var(--outline-variant);">
          <span class="caption flex items-center" id="preview-status"><span class="status-dot"></span> Status</span>
          <span class="caption" id="preview-priority" style="font-weight: 600;">Priority</span>
          <span class="caption text-muted" id="preview-category">Category</span>
        </div>
        
        <p class="body-sm text-muted mb-md" id="preview-loc" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${Icons.location} Location details</p>
        
        <a href="#/citizen/issues" id="preview-link" class="btn btn-primary" style="width: 100%; justify-content: center;">View Full Details</a>
      </div>

    </div>
  `;
}

export async function initCitizenMap() {
  const mapGrid = document.getElementById('map-grid');
  const previewSheet = document.getElementById('map-preview');
  const btnClose = document.getElementById('preview-close');
  let allIssues = [];
  
  // Dragging logic for the map grid
  let isDragging = false;
  let startX, startY, currentX = 0, currentY = 0;
  
  mapGrid.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
  });
  
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX - startX;
    currentY = e.clientY - startY;
    mapGrid.style.transform = `translate(${currentX}px, ${currentY}px)`;
  });
  
  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch support for map dragging
  mapGrid.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX - currentX;
    startY = e.touches[0].clientY - currentY;
  }, {passive: true});
  
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX - startX;
    currentY = e.touches[0].clientY - startY;
    mapGrid.style.transform = `translate(${currentX}px, ${currentY}px)`;
  }, {passive: true});
  
  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Controls logic
  document.getElementById('btn-my-location').addEventListener('click', () => {
    currentX = 0; currentY = 0;
    mapGrid.style.transform = `translate(0px, 0px)`;
    previewSheet.classList.remove('active');
  });

  btnClose.addEventListener('click', () => {
    previewSheet.classList.remove('active');
    document.querySelectorAll('.interactive-pin').forEach(p => p.classList.remove('active'));
  });

  // Generate deterministic mock coordinates based on string hashing so they don't jump around
  const getMockCoords = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Return % offsets between 20% and 80% to keep them mostly in view
    const left = 20 + Math.abs(hash % 60);
    const top = 20 + Math.abs((hash >> 4) % 60);
    return { left, top };
  };

  const renderPins = () => {
    const searchVal = document.getElementById('map-search').value.toLowerCase();
    const catVal = document.getElementById('map-category-filter').value;
    const statVal = document.getElementById('map-status-filter').value;

    let filtered = allIssues;

    if (searchVal) {
      filtered = filtered.filter(i => 
        (i.title && i.title.toLowerCase().includes(searchVal)) || 
        (i.location && i.location.toLowerCase().includes(searchVal))
      );
    }
    if (catVal !== 'All') {
      filtered = filtered.filter(i => i.category === catVal);
    }
    if (statVal !== 'All') {
      if (statVal === 'Active') {
        filtered = filtered.filter(i => i.status !== 'Resolved');
      } else {
        filtered = filtered.filter(i => i.status === statVal);
      }
    }

    // Clear existing pins
    mapGrid.innerHTML = '';

    filtered.forEach(issue => {
      const coords = getMockCoords(issue.id + issue.location);
      
      // Determine colors based on status/priority
      let bgColor = 'var(--brand-navy)';
      if (issue.status === 'Resolved') bgColor = 'var(--success)';
      else if (issue.priority === 'High') bgColor = 'var(--error)';
      
      let icon = '📝';
      if (issue.category === 'Roads' || issue.category === 'Infrastructure') icon = Icons.roads;
      if (issue.category === 'Sanitation' || issue.category === 'Waste') icon = Icons.trash;
      if (issue.category === 'Electricity') icon = '💡';
      if (issue.category === 'Water' || issue.category === 'Water Supply') icon = '💧';

      const pin = document.createElement('div');
      pin.className = 'interactive-pin';
      pin.style.left = `${coords.left}%`;
      pin.style.top = `${coords.top}%`;
      pin.style.backgroundColor = bgColor;
      
      // The CSS relies on rotation, so we counter-rotate the inner text
      pin.style.transform = 'translate(-50%, -100%) rotate(-45deg)';
      pin.innerHTML = `<span style="transform: rotate(45deg); display:block;">${icon}</span>`;

      pin.addEventListener('click', (e) => {
        // Prevent click from dragging
        e.stopPropagation();
        
        document.querySelectorAll('.interactive-pin').forEach(p => p.classList.remove('active'));
        pin.classList.add('active');
        
        // Populate Preview
        document.getElementById('preview-id').textContent = issue.id;
        document.getElementById('preview-title').textContent = issue.title;
        document.getElementById('preview-loc').textContent = `${Icons.location} ${issue.location}`;
        
        let statusClass = 'active';
        if (issue.status === 'Resolved') statusClass = 'inactive';
        document.getElementById('preview-status').innerHTML = `<span class="status-dot ${statusClass}"></span> ${issue.status}`;
        
        let priorityColor = 'var(--on-surface)';
        if (issue.priority === 'High') priorityColor = 'var(--error)';
        if (issue.priority === 'Medium') priorityColor = 'var(--warning)';
        document.getElementById('preview-priority').textContent = issue.priority;
        document.getElementById('preview-priority').style.color = priorityColor;
        
        document.getElementById('preview-category').textContent = issue.category;
        
        document.getElementById('preview-link').href = `#/citizen/issue/${issue.id}`;
        
        previewSheet.classList.add('active');
      });

      mapGrid.appendChild(pin);
    });
  };

  try {
    allIssues = await issueService.getIssues();
    renderPins();
  } catch (e) {
    console.error("Failed to load issues for map", e);
  }

  // Bind filters
  document.getElementById('map-search').addEventListener('input', renderPins);
  document.getElementById('map-category-filter').addEventListener('change', renderPins);
  document.getElementById('map-status-filter').addEventListener('change', renderPins);
}
