import type { User, Issue, Comment, DepartmentTransparency } from '../types';
import type { AppNotification } from './notificationService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const TOKEN_KEY = 'cityfix_token';
const REFRESH_TOKEN_KEY = 'cityfix_refresh_token';

// Centralized Fetch Client
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Set default Content-Type for JSON payloads
  if (options.body && !(options.body instanceof Blob) && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Session expired: logout gracefully
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.dispatchEvent(new Event('auth-logout'));
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || 'API request failed');
  }

  return response.json();
}

export const authApi = {
  login: async (email: string, password: string): Promise<any> => {
    const data = await request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.access_token) {
      localStorage.setItem(TOKEN_KEY, data.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    }
    return data;
  },

  register: async (payload: any): Promise<any> => {
    const data = await request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (data.access_token) {
      localStorage.setItem(TOKEN_KEY, data.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    }
    return data;
  },

  sendOtp: async (email: string, purpose: string = 'verification'): Promise<any> => {
    return request<any>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email, purpose }),
    });
  },

  verifyOtp: async (email: string, otp: string, purpose: string = 'verification'): Promise<any> => {
    return request<any>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, purpose }),
    });
  },

  resendOtp: async (email: string): Promise<any> => {
    return request<any>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  me: async (): Promise<User> => {
    return request<User>('/auth/me');
  },

  updateMe: async (payload: any): Promise<User> => {
    return request<User>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};

export const reportsApi = {
  list: async (filters: any = {}): Promise<Issue[]> => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.department && filters.department !== 'all') params.append('department', filters.department);
    if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
    if (filters.city) params.append('city', filters.city);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return request<Issue[]>(`/reports${queryStr}`);
  },

  get: async (id: string): Promise<Issue> => {
    return request<Issue>(`/reports/${id}`);
  },

  track: async (trackingId: string): Promise<Issue> => {
    return request<Issue>(`/reports/track/${trackingId}`);
  },

  create: async (payload: any): Promise<Issue> => {
    return request<Issue>('/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  vote: async (reportId: string): Promise<Issue> => {
    return request<Issue>(`/reports/${reportId}/vote`, {
      method: 'POST',
    });
  },

  unvote: async (reportId: string): Promise<Issue> => {
    return request<Issue>(`/reports/${reportId}/vote`, {
      method: 'DELETE',
    });
  },

  save: async (reportId: string): Promise<any> => {
    return request<any>(`/reports/${reportId}/save`, {
      method: 'POST',
    });
  },

  unsave: async (reportId: string): Promise<any> => {
    return request<any>(`/reports/${reportId}/save`, {
      method: 'DELETE',
    });
  },

  addComment: async (reportId: string, text: string): Promise<Comment> => {
    return request<Comment>(`/reports/${reportId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text, id: '', issue_id: '', author_id: '', author_name: '', author_role: 'citizen', created_at: '' }),
    });
  },

  getComments: async (reportId: string): Promise<Comment[]> => {
    return request<Comment[]>(`/reports/${reportId}/comments`);
  },

  updateStatus: async (reportId: string, status: string, note?: string, photoUrl?: string): Promise<Issue> => {
    return request<Issue>(`/reports/${reportId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note, resolutionPhotoUrl: photoUrl }),
    });
  },

  submitSatisfaction: async (reportId: string, rating: number, comment?: string): Promise<Issue> => {
    return request<Issue>(`/reports/${reportId}/satisfaction`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  },
};

export const notificationApi = {
  list: async (): Promise<AppNotification[]> => {
    return request<AppNotification[]>('/notifications');
  },

  read: async (id: string): Promise<AppNotification> => {
    return request<AppNotification>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  readAll: async (): Promise<any> => {
    return request<any>('/notifications/read-all', {
      method: 'PATCH',
    });
  },

  clearAll: async (): Promise<any> => {
    return request<any>('/notifications/clear-all', {
      method: 'DELETE',
    });
  },
};

export const transparencyApi = {
  getScoreboard: async (): Promise<DepartmentTransparency[]> => {
    return request<DepartmentTransparency[]>('/transparency');
  },
};

export const feedbackApi = {
  submitFeedback: async (rating: number, message: string, category: string): Promise<any> => {
    return request<any>('/feedback', {
      method: 'POST',
      body: JSON.stringify({ rating, message, category }),
    });
  },

  submitBugReport: async (payload: any): Promise<any> => {
    return request<any>('/bug-report', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export const mapApi = {
  getMarkers: async (filters: any = {}): Promise<any[]> => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
    if (filters.department && filters.department !== 'all') params.append('department', filters.department);
    if (filters.city) params.append('city', filters.city);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return request<any[]>(`/map/reports${queryStr}`);
  },
};
