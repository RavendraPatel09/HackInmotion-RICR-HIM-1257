import { issueService } from './issueService.js';

// Helper to simulate AI/Network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const duplicateDetectionService = {
  /**
   * Evaluates the draft report state against existing issues.
   * @param {Object} reportState - The user's draft (category, location, description)
   * @returns {Object|null} Match object if a duplicate is found, null otherwise
   */
  async checkDuplicate(reportState) {
    await delay(1200); // Simulate processing time

    // Hackathon specific deterministic trigger:
    // If they type "pothole" or select "Roads" near Arera Colony/MP Nagar
    const desc = (reportState.description || "").toLowerCase();
    const loc = (reportState.location || "").toLowerCase();
    const cat = reportState.category;

    if (
      (cat === 'Roads' || desc.includes('pothole')) && 
      (loc.includes('arera') || loc.includes('mp nagar') || desc.includes('arera'))
    ) {
      return {
        issue: {
          id: 'BH-10218',
          title: 'Pothole near Arera Colony',
          category: 'Roads',
          status: 'Under Review'
        },
        similarity: 87,
        distance: '120m away',
        timeAgo: '3 hours ago'
      };
    }

    // Fallback: check against mock data for exact category match + keyword overlap
    try {
      const issues = await issueService.getIssues();
      const existing = issues.find(i => i.category === cat && i.status !== 'Resolved');
      
      if (existing) {
        // Very basic string overlap simulation
        const existingLocWords = existing.location.toLowerCase().split(' ');
        const isLocMatch = existingLocWords.some(w => w.length > 3 && loc.includes(w));
        
        if (isLocMatch) {
          return {
            issue: existing,
            similarity: 74,
            distance: '350m away',
            timeAgo: 'Yesterday'
          };
        }
      }
    } catch (e) {
      console.warn("Failed to check issues for duplicates", e);
    }

    return null; // No duplicate detected
  }
};
