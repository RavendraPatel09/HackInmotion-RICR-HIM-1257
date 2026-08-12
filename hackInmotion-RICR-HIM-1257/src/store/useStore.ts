import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type IssueStatus = 'Under Review' | 'Acknowledged' | 'Assigned' | 'In Progress' | 'Resolved' | 'Verified' | 'Closed';
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Role = 'Citizen' | 'Administrator' | null;

export interface Issue {
  id: string;
  title: string;
  category: string;
  description: string;
  status: IssueStatus;
  reportedAt: string;
  location: string;
  imageUrl: string | null;
  priority: IssuePriority;
  department?: string;
  duplicateProbability?: number;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  issueId: string;
  read: boolean;
  createdAt: string;
}

interface StoreState {
  role: Role;
  issues: Issue[];
  notifications: Notification[];
  setRole: (role: Role) => void;
  addIssue: (issue: Omit<Issue, 'id' | 'status' | 'reportedAt'>) => Issue;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  initializeMockData: () => void;
}

const INITIAL_MOCK_ISSUES: Issue[] = [
  {
    id: "BH-10241",
    title: "Deep pothole in MP Nagar",
    category: "Infrastructure",
    description: "Deep pothole near Zone 1 causing severe traffic issues and vehicle damage during peak hours.",
    status: "In Progress",
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    location: "MP Nagar Zone 1, Bhopal",
    imageUrl: null,
    priority: "High",
    department: "Road Maintenance"
  },
  {
    id: "BH-10198",
    title: "Streetlight not working",
    category: "Electricity",
    description: "Pole number 45 near Arera Colony E-3 is completely dark.",
    status: "Resolved",
    reportedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    location: "Arera Colony E-3, Bhopal",
    imageUrl: null,
    priority: "Medium",
    department: "Electrical"
  },
  {
    id: "BH-10305",
    title: "Garbage overflow",
    category: "Sanitation",
    description: "Garbage bins are overflowing outside the public park.",
    status: "Under Review",
    reportedAt: new Date().toISOString(),
    location: "Shahpura Lake, Bhopal",
    imageUrl: null,
    priority: "High"
  }
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      role: null,
      issues: [],
      notifications: [],
      
      setRole: (role) => set({ role }),
      
      addIssue: (issueData) => {
        const newId = `BH-${10000 + Math.floor(Math.random() * 9000)}`;
        const newIssue: Issue = {
          ...issueData,
          id: newId,
          status: 'Under Review',
          reportedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          issues: [newIssue, ...state.issues]
        }));
        
        get().addNotification({
          type: 'Issue submitted',
          title: 'Report Submitted Successfully',
          message: `Thank you. Your report ${newId} has been logged and is under review.`,
          issueId: newId
        });
        
        return newIssue;
      },
      
      updateIssue: (id, updates) => {
        set((state) => {
          const newIssues = [...state.issues];
          const index = newIssues.findIndex(i => i.id === id);
          if (index !== -1) {
            const oldStatus = newIssues[index].status;
            newIssues[index] = { ...newIssues[index], ...updates };
            const newStatus = newIssues[index].status;
            
            // Handle Status Change Notifications
            if (oldStatus !== newStatus && newStatus) {
              const notifications = {
                'Acknowledged': { title: 'Issue Acknowledged', message: `The authorities have acknowledged your report ${id}.` },
                'Assigned': { title: 'Issue Assigned', message: `${id} has been assigned to the relevant department.` },
                'In Progress': { title: 'Work Started', message: `The team is currently working on resolving ${id}.` },
                'Resolved': { title: 'Action Required: Verification', message: `The municipal team has marked ${id} as resolved. Please verify if the issue was actually fixed.` },
                'Verified': { title: 'Issue Verified & Resolved', message: `Good news! Your report ${id} has been fully resolved and verified.` },
                'Closed': { title: 'Ticket Closed', message: `Ticket ${id} has been archived and closed.` }
              };
              
              const notif = notifications[newStatus];
              if (notif) {
                // We use setTimeout to avoid dispatching during a reducer execution
                setTimeout(() => {
                  get().addNotification({
                    type: `Issue ${newStatus.toLowerCase()}`,
                    title: notif.title,
                    message: notif.message,
                    issueId: id
                  });
                }, 0);
              }
            }
          }
          return { issues: newIssues };
        });
      },
      
      addNotification: (notifData) => {
        const newNotif: Notification = {
          ...notifData,
          id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          read: false,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications]
        }));
      },
      
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
        }));
      },
      
      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true }))
        }));
      },
      
      initializeMockData: () => {
        const { issues } = get();
        if (issues.length === 0) {
          set({ issues: INITIAL_MOCK_ISSUES });
        }
      }
    }),
    {
      name: 'smart-bhopal-storage',
    }
  )
);
