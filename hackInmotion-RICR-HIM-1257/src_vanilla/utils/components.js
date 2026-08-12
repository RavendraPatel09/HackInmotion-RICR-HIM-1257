// Core UI Component Logic

export function initComponents() {
  initTabs();
  initDropdowns();
  initModals();
  initDrawers();
}

function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll('.tab-item');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        
        const targetId = e.target.getAttribute('data-target');
        if (targetId) {
          const contents = document.querySelectorAll(tabGroup.getAttribute('data-content-group'));
          contents.forEach(c => c.classList.add('hidden'));
          const targetEl = document.getElementById(targetId);
          if (targetEl) targetEl.classList.remove('hidden');
        }
      });
    });
  });
}

function initDropdowns() {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close other dropdowns
      document.querySelectorAll('.dropdown').forEach(d => {
        if (d !== dropdown) d.classList.remove('active');
      });
      dropdown.classList.toggle('active');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
  });
}

function initModals() {
  document.querySelectorAll('[data-modal-trigger]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-modal-trigger');
      const modal = document.getElementById(targetId);
      if (modal) modal.classList.add('active');
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
    const closeBtns = overlay.querySelectorAll('[data-modal-close]');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => overlay.classList.remove('active'));
    });
  });
}

function initDrawers() {
  document.querySelectorAll('[data-drawer-trigger]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-drawer-trigger');
      const overlay = document.getElementById(targetId + '-overlay');
      const drawer = document.getElementById(targetId);
      if (overlay) overlay.classList.add('active');
      if (drawer) drawer.classList.add('active');
    });
  });

  document.querySelectorAll('.drawer-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        const drawerId = overlay.id.replace('-overlay', '');
        const drawer = document.getElementById(drawerId);
        if (drawer) drawer.classList.remove('active');
      }
    });
    const closeBtns = overlay.querySelectorAll('[data-drawer-close]');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        overlay.classList.remove('active');
        const drawerId = overlay.id.replace('-overlay', '');
        const drawer = document.getElementById(drawerId);
        if (drawer) drawer.classList.remove('active');
      });
    });
  });
}

export function showToast(msg) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${msg}</span>`;
  container.appendChild(toast);
  
  // Trigger reflow for animation
  void toast.offsetWidth;
  toast.classList.add('active');
  
  setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
