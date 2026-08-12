import { renderPublicLayout } from './layouts/PublicLayout.js';
import { renderCitizenLayout } from './layouts/CitizenLayout.js';
import { renderAdminLayout, initAdminLayout } from './layouts/AdminLayout.js';
import { renderBlankPage } from './pages/BlankPage.js';
import { renderLandingPage } from './pages/LandingPage.js';
import { renderLogin, renderRegister, renderForgotPassword, initLoginLogic, initRegisterLogic, initForgotLogic } from './pages/AuthPages.js';
import { renderCitizenDashboard, initCitizenDashboard } from './pages/CitizenDashboard.js';
import { initComponents } from './utils/components.js';

const app = document.getElementById('app');

function navigate() {
  const hash = window.location.hash || '#/';
  
  // 1. Determine the active route segment and layout
  if (hash.startsWith('#/citizen')) {
    
    // Citizen Routes
    let pageContent = '';
    let isCitizenDashboard = false;
    
    if (hash === '#/citizen') {
      pageContent = renderCitizenDashboard();
      isCitizenDashboard = true;
    } else if (hash === '#/citizen/report') {
      pageContent = renderBlankPage('Report an Issue', 'Form to submit a new civic complaint.');
    } else if (hash === '#/citizen/track') {
      pageContent = renderBlankPage('Track Status', 'Track the progress of your submitted issues.');
    } else {
      pageContent = renderBlankPage('Citizen Area', 'Under construction.');
    }
    
    // Mount layout
    const activeRoute = hash.replace('#', '');
    app.innerHTML = renderCitizenLayout(pageContent, activeRoute);
    
    if (isCitizenDashboard) initCitizenDashboard();
    
  } else if (hash.startsWith('#/admin')) {
    
    // Admin Routes
    let pageContent = '';
    if (hash === '#/admin') {
      pageContent = renderBlankPage('Admin Dashboard', 'Command center overview.');
    } else if (hash === '#/admin/issues') {
      pageContent = renderBlankPage('Manage Issues', 'Global queue of civic complaints.');
    } else if (hash === '#/admin/analytics') {
      pageContent = renderBlankPage('Analytics', 'Data insights and reporting.');
    } else {
      pageContent = renderBlankPage('Admin Area', 'Under construction.');
    }
    
    // Mount layout
    const activeRoute = hash.replace('#', '');
    app.innerHTML = renderAdminLayout(pageContent, activeRoute);
    initAdminLayout(); // initialize sidebar toggles
    
  } else {
    
    // Public Routes (Including Auth)
    let pageContent = '';
    let isAuthRoute = false;
    
    if (hash === '#/') {
      pageContent = renderLandingPage();
    } else if (hash === '#/login') {
      pageContent = renderLogin();
      isAuthRoute = 'login';
    } else if (hash === '#/register') {
      pageContent = renderRegister();
      isAuthRoute = 'register';
    } else if (hash === '#/forgot-password') {
      pageContent = renderForgotPassword();
      isAuthRoute = 'forgot';
    } else {
      pageContent = renderBlankPage('Public Area', 'Under construction.');
    }
    
    // Mount layout
    app.innerHTML = renderPublicLayout(pageContent);
    
    // Initialize Auth Logic
    if (isAuthRoute === 'login') initLoginLogic();
    if (isAuthRoute === 'register') initRegisterLogic();
    if (isAuthRoute === 'forgot') initForgotLogic();
  }

  // 2. Re-initialize interactive components (dropdowns, modals, etc.)
  setTimeout(() => {
    initComponents();
  }, 0);
}

// Listen to hash changes
window.addEventListener('hashchange', navigate);

export function initRouter() {
  navigate();
}
