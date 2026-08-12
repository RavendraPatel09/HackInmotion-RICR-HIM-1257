import type { User } from '../types';

export const MOCK_CITIZEN_USER: User = {
  id: 'usr-citizen-01',
  name: 'Citizen User',
  email: 'citizen@nagarsathi.demo',
  role: 'citizen',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  wardId: 'ward-01',
  phone: '+91 98765 43210',
  points: 42,
  badges: ['badge-first-report', 'badge-five-reports', 'badge-community-voice'],
};

export const MOCK_ADMIN_USER: User = {
  id: 'usr-admin-01',
  name: 'Rajiv Agrawal',
  email: 'admin@nagarsathi.demo',
  role: 'admin',
  departmentId: 'roads-infra',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  phone: '+91 755 401 9999',
  points: 0,
  badges: [],
};

export const MOCK_WARD_OFFICER_USER: User = {
  id: 'usr-ward-01',
  name: 'Rajendra Patel',
  email: 'wardofficer@nagarsathi.demo',
  role: 'ward-officer',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  wardId: 'ward-01',
  phone: '+91 755 401 0001',
  points: 0,
  badges: [],
};

export const MOCK_USERS = [MOCK_CITIZEN_USER, MOCK_ADMIN_USER, MOCK_WARD_OFFICER_USER];
