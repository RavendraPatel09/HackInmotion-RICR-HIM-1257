const AUTH_KEY = 'smart_bhopal_user';

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  
  async login(email, password) {
    await delay(1000);
    
    if (!email || !password) {
      throw new Error("Empty fields");
    }
    
    // Simulate invalid credentials
    if (password === 'wrong') {
      throw new Error("Invalid credentials");
    }

    // Determine role based on email or default to Citizen
    let role = 'Citizen';
    if (email.includes('admin') || email.includes('@smartbhopal.gov.in')) {
      role = 'Admin';
    }

    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },
  
  async register(data) {
    await delay(1200);
    
    if (!data.name || !data.email || !data.phone || !data.role || !data.password || !data.confirmPassword) {
      throw new Error("Empty fields");
    }

    if (data.password !== data.confirmPassword) {
      throw new Error("Password mismatch");
    }

    // Mock success, but force them to login manually afterwards
    return true;
  },

  async resetPassword(email) {
    await delay(1000);
    if (!email) throw new Error("Empty fields");
    return true; // Success
  },

  getCurrentUser() {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },
  
  logout() {
    localStorage.removeItem(AUTH_KEY);
  }
};
