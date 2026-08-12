import { authService } from '../services/authService.js';
import { showToast } from '../utils/components.js';

// --- LOGIN ---
export function renderLogin() {
  return `
    <div style="max-width: 400px; margin: var(--spacing-2xl) auto;">
      <div class="card" style="padding: var(--spacing-xl);">
        <h2 class="headline-md mb-sm text-center">Welcome Back</h2>
        <p class="body-md text-muted text-center mb-lg">Log in to Smart Bhopal Civic Connect.</p>
        
        <div id="login-error" class="badge badge-error hidden mb-md" style="width: 100%; justify-content: center; padding: 8px;"></div>
        
        <form id="login-form">
          <div class="input-group">
            <label class="input-label">Email Address</label>
            <input type="email" id="login-email" class="input" placeholder="Enter your email" required />
          </div>
          
          <div class="input-group mb-sm">
            <label class="input-label">Password</label>
            <input type="password" id="login-password" class="input" placeholder="Enter your password" required />
          </div>
          
          <div class="flex justify-between items-center mb-lg">
            <label class="flex items-center gap-xs body-md"><input type="checkbox"> Remember me</label>
            <a href="#/forgot-password" class="body-md" style="color: var(--brand-green); font-weight: 600;">Forgot Password?</a>
          </div>

          <button type="submit" id="login-btn" class="btn btn-primary" style="width: 100%;">Log In</button>
        </form>
        
        <div class="mt-lg text-center body-md">
          Don't have an account? <a href="#/register" style="color: var(--brand-green); font-weight: 600;">Sign up</a>
        </div>
      </div>
    </div>
  `;
}

export function initLoginLogic() {
  const form = document.getElementById('login-form');
  const btn = document.getElementById('login-btn');
  const errorBadge = document.getElementById('login-error');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      errorBadge.classList.add('hidden');
      btn.disabled = true;
      btn.innerHTML = 'Logging in <span class="status-dot active" style="margin-left: 8px; animation: pulse 1s infinite;"></span>';

      try {
        const user = await authService.login(email, password);
        showToast('Login successful!');
        // Route based on role
        if (user.role === 'Admin') {
          window.location.hash = '#/admin';
        } else {
          window.location.hash = '#/citizen';
        }
      } catch (err) {
        errorBadge.textContent = err.message || 'Invalid credentials. Please try again.';
        errorBadge.classList.remove('hidden');
      } finally {
        btn.disabled = false;
        btn.innerHTML = 'Log In';
      }
    });
  }
}


// --- REGISTER ---
export function renderRegister() {
  return `
    <div style="max-width: 450px; margin: var(--spacing-2xl) auto;">
      <div class="card" style="padding: var(--spacing-xl);">
        <h2 class="headline-md mb-sm text-center">Create an Account</h2>
        <p class="body-md text-muted text-center mb-lg">Join Smart Bhopal to start reporting.</p>
        
        <div id="reg-error" class="badge badge-error hidden mb-md" style="width: 100%; justify-content: center; padding: 8px;"></div>
        
        <form id="reg-form">
          <div class="input-group">
            <label class="input-label">Full Name</label>
            <input type="text" id="reg-name" class="input" placeholder="Rajesh Kumar" required />
          </div>

          <div class="input-group">
            <label class="input-label">Email Address</label>
            <input type="email" id="reg-email" class="input" placeholder="rajesh@example.com" required />
          </div>

          <div class="input-group">
            <label class="input-label">Phone Number</label>
            <input type="tel" id="reg-phone" class="input" placeholder="10-digit mobile number" required />
          </div>

          <div class="input-group">
            <label class="input-label">I am a...</label>
            <select id="reg-role" class="select" required>
              <option value="Citizen" selected>Citizen</option>
              <option value="Admin">Municipal Staff / Admin</option>
            </select>
          </div>

          <div class="input-group">
            <label class="input-label">Password</label>
            <input type="password" id="reg-password" class="input" placeholder="Create a password" required minlength="6" />
          </div>

          <div class="input-group mb-lg">
            <label class="input-label">Confirm Password</label>
            <input type="password" id="reg-confirm" class="input" placeholder="Confirm your password" required minlength="6" />
          </div>

          <button type="submit" id="reg-btn" class="btn btn-primary" style="width: 100%;">Create Account</button>
        </form>
        
        <div class="mt-lg text-center body-md">
          Already have an account? <a href="#/login" style="color: var(--brand-green); font-weight: 600;">Log In</a>
        </div>
      </div>
    </div>
  `;
}

export function initRegisterLogic() {
  const form = document.getElementById('reg-form');
  const btn = document.getElementById('reg-btn');
  const errorBadge = document.getElementById('reg-error');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const data = {
        name: document.getElementById('reg-name').value,
        email: document.getElementById('reg-email').value,
        phone: document.getElementById('reg-phone').value,
        role: document.getElementById('reg-role').value,
        password: document.getElementById('reg-password').value,
        confirmPassword: document.getElementById('reg-confirm').value
      };
      
      errorBadge.classList.add('hidden');
      btn.disabled = true;
      btn.innerHTML = 'Creating Account...';

      try {
        await authService.register(data);
        showToast('Registration successful! Please log in.');
        window.location.hash = '#/login';
      } catch (err) {
        errorBadge.textContent = err.message || 'Error creating account.';
        errorBadge.classList.remove('hidden');
      } finally {
        btn.disabled = false;
        btn.innerHTML = 'Create Account';
      }
    });
  }
}


// --- FORGOT PASSWORD ---
export function renderForgotPassword() {
  return `
    <div style="max-width: 400px; margin: var(--spacing-2xl) auto;">
      <div class="card" style="padding: var(--spacing-xl);">
        <h2 class="headline-md mb-sm text-center">Reset Password</h2>
        <p class="body-md text-muted text-center mb-lg">Enter your email and we'll send a link to reset your password.</p>
        
        <div id="reset-msg" class="badge hidden mb-md" style="width: 100%; justify-content: center; padding: 8px;"></div>
        
        <form id="reset-form">
          <div class="input-group mb-lg">
            <label class="input-label">Email Address</label>
            <input type="email" id="reset-email" class="input" placeholder="Enter your email" required />
          </div>

          <button type="submit" id="reset-btn" class="btn btn-primary" style="width: 100%;">Send Reset Link</button>
        </form>
        
        <div class="mt-lg text-center body-md">
          <a href="#/login" style="color: var(--brand-navy); font-weight: 600;">← Back to Login</a>
        </div>
      </div>
    </div>
  `;
}

export function initForgotLogic() {
  const form = document.getElementById('reset-form');
  const btn = document.getElementById('reset-btn');
  const msgBadge = document.getElementById('reset-msg');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('reset-email').value;
      
      msgBadge.classList.add('hidden');
      btn.disabled = true;
      btn.innerHTML = 'Sending...';

      try {
        await authService.resetPassword(email);
        msgBadge.className = 'badge badge-success mb-md';
        msgBadge.textContent = 'Recovery email sent successfully.';
        form.reset();
      } catch (err) {
        msgBadge.className = 'badge badge-error mb-md';
        msgBadge.textContent = err.message || 'Error sending link.';
      } finally {
        msgBadge.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = 'Send Reset Link';
      }
    });
  }
}
