import { renderPublicLayout } from './layouts/PublicLayout.js';
import { renderCitizenLayout, initCitizenLayout } from './layouts/CitizenLayout.js';
import { renderAdminLayout, initAdminLayout } from './layouts/AdminLayout.js';
import { renderAdminDashboard, initAdminDashboard } from './pages/AdminDashboard.js';
import { renderAdminIssues, initAdminIssues } from './pages/AdminIssues.js';
import { renderAdminIssueDetail, initAdminIssueDetail } from './pages/AdminIssueDetail.js';
import { renderAdminMap, initAdminMap } from './pages/AdminMap.js';
import { renderAdminAnalytics, initAdminAnalytics } from './pages/AdminAnalytics.js';
import { renderAdminHotspots, initAdminHotspots } from './pages/AdminHotspots.js';
import { renderAdminSla, initAdminSla } from './pages/AdminSla.js';
import { renderBlankPage } from './pages/BlankPage.js';
import { renderLandingPage } from './pages/LandingPage.js';
import { renderLogin, renderRegister, renderForgotPassword, initLoginLogic, initRegisterLogic, initForgotLogic } from './pages/AuthPages.js';
import { renderCitizenDashboard, initCitizenDashboard } from './pages/CitizenDashboard.js';
import { renderCitizenReport, initCitizenReport } from './pages/CitizenReport.js';
import { renderCitizenIssues, initCitizenIssues } from './pages/CitizenIssues.js';
import { renderCitizenIssueDetail, initCitizenIssueDetail } from './pages/CitizenIssueDetail.js';
import { renderCitizenMap, initCitizenMap } from './pages/CitizenMap.js';
import { renderCitizenNotifications, initCitizenNotifications } from './pages/CitizenNotifications.js';
import { renderCitizenImpact, initCitizenImpact } from './pages/CitizenImpact.js';
import { initComponents } from './utils/components.js';

const app = document.getElementById('app');

function navigate() {
  const hash = window.location.hash || '#/';
  
  // 1. Determine the active route segment and layout
  if (hash.startsWith('#/citizen')) {
    
    // Citizen Routes
    let pageContent = '';
    let isCitizenDashboard = false;
    let isCitizenReport = false;
    let isCitizenIssues = false;
    let isCitizenMap = false;
    let isCitizenNotifications = false;
    let isCitizenImpact = false;
    let issueDetailId = null;
    
    if (hash === '#/citizen') {
      pageContent = renderCitizenDashboard();
      isCitizenDashboard = true;
    } else if (hash === '#/citizen/report') {
      pageContent = renderCitizenReport();
      isCitizenReport = true;
    } else if (hash === '#/citizen/track' || hash === '#/citizen/issues') {
      pageContent = renderCitizenIssues();
      isCitizenIssues = true;
    } else if (hash === '#/citizen/map') {
      pageContent = renderCitizenMap();
      isCitizenMap = true;
    } else if (hash === '#/citizen/notifications') {
      pageContent = renderCitizenNotifications();
      isCitizenNotifications = true;
    } else if (hash === '#/citizen/impact') {
      pageContent = renderCitizenImpact();
      isCitizenImpact = true;
    } else if (hash.startsWith('#/citizen/issue/')) {
      issueDetailId = hash.replace('#/citizen/issue/', '');
      pageContent = renderCitizenIssueDetail(issueDetailId);
    } else {
      pageContent = renderBlankPage('Citizen Area', 'Under construction.');
    }
    
    // Mount layout
    const activeRoute = hash.replace('#', '');
    app.innerHTML = renderCitizenLayout(pageContent, activeRoute);
    
    setTimeout(() => {
      initCitizenLayout();
      if (isCitizenDashboard) initCitizenDashboard();
      if (isCitizenReport) initCitizenReport();
      if (isCitizenIssues) initCitizenIssues();
      if (isCitizenMap) initCitizenMap();
      if (isCitizenNotifications) initCitizenNotifications();
      if (isCitizenImpact) initCitizenImpact();
      if (issueDetailId) initCitizenIssueDetail(issueDetailId);
    }, 0);
    
  } else if (hash.startsWith('#/admin')) {
    
    // Admin Routes
    let pageContent = '';
    let isAdminDashboard = false;
    let isAdminIssues = false;
    let isAdminMap = false;
    let isAdminAnalytics = false;
    let isAdminHotspots = false;
    let isAdminSla = false;
    let adminIssueDetailId = null;
    
    if (hash === '#/admin') {
      pageContent = renderAdminDashboard();
      isAdminDashboard = true;
    } else if (hash === '#/admin/issues') {
      pageContent = renderAdminIssues();
      isAdminIssues = true;
    } else if (hash === '#/admin/map') {
      pageContent = renderAdminMap();
      isAdminMap = true;
    } else if (hash === '#/admin/analytics') {
      pageContent = renderAdminAnalytics();
      isAdminAnalytics = true;
    } else if (hash === '#/admin/hotspots') {
      pageContent = renderAdminHotspots();
      isAdminHotspots = true;
    } else if (hash === '#/admin/sla') {
      pageContent = renderAdminSla();
      isAdminSla = true;
    } else if (hash.startsWith('#/admin/issue/')) {
      adminIssueDetailId = hash.replace('#/admin/issue/', '');
      pageContent = renderAdminIssueDetail(adminIssueDetailId);
    } else {
      pageContent = renderBlankPage('Admin Area', 'Under construction.');
    }
    
    // Mount layout
    const activeRoute = hash.replace('#', '');
    app.innerHTML = renderAdminLayout(pageContent, activeRoute);
    
    setTimeout(() => {
      initAdminLayout();
      if (isAdminDashboard) initAdminDashboard();
      if (isAdminIssues) initAdminIssues();
      if (isAdminMap) initAdminMap();
      if (isAdminAnalytics) initAdminAnalytics();
      if (isAdminHotspots) initAdminHotspots();
      if (isAdminSla) initAdminSla();
      if (adminIssueDetailId) initAdminIssueDetail(adminIssueDetailId);
    }, 0);
    
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
