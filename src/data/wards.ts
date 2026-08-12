import type { Ward, WardAnnouncement, CivicBadge } from '../types';

export const WARDS: Ward[] = [
  {
    id: 'ward-01',
    name: 'Zone I — MP Nagar',
    nameHi: 'ज़ोन I — एमपी नगर',
    officerName: 'Rajendra Patel',
    officerPhone: '+91 755 401 0001',
    centerLat: 23.2332,
    centerLng: 77.4345,
    boundaryBox: { nLat: 23.2450, sLat: 23.2200, eLng: 77.4500, wLng: 77.4200 },
    color: '#6366f1',
  },
  {
    id: 'ward-02',
    name: 'Zone II — Arera Colony',
    nameHi: 'ज़ोन II — अरेरा कॉलोनी',
    officerName: 'Meena Sharma',
    officerPhone: '+91 755 401 0002',
    centerLat: 23.2185,
    centerLng: 77.4281,
    boundaryBox: { nLat: 23.2300, sLat: 23.2050, eLng: 77.4450, wLng: 77.4100 },
    color: '#0d9488',
  },
  {
    id: 'ward-03',
    name: 'Zone III — TT Nagar',
    nameHi: 'ज़ोन III — टीटी नगर',
    officerName: 'Arjun Singh',
    officerPhone: '+91 755 401 0003',
    centerLat: 23.2389,
    centerLng: 77.4012,
    boundaryBox: { nLat: 23.2480, sLat: 23.2300, eLng: 77.4200, wLng: 77.3850 },
    color: '#059669',
  },
  {
    id: 'ward-04',
    name: 'Zone IV — Shahpura',
    nameHi: 'ज़ोन IV — शाहपुरा',
    officerName: 'Kavita Joshi',
    officerPhone: '+91 755 401 0004',
    centerLat: 23.1988,
    centerLng: 77.4312,
    boundaryBox: { nLat: 23.2100, sLat: 23.1850, eLng: 77.4450, wLng: 77.4150 },
    color: '#d97706',
  },
  {
    id: 'ward-05',
    name: 'Zone V — Kolar Road',
    nameHi: 'ज़ोन V — कोलार रोड',
    officerName: 'Vikram Mehta',
    officerPhone: '+91 755 401 0005',
    centerLat: 23.1762,
    centerLng: 77.4189,
    boundaryBox: { nLat: 23.1900, sLat: 23.1600, eLng: 77.4350, wLng: 77.4000 },
    color: '#dc2626',
  },
  {
    id: 'ward-06',
    name: 'Zone VI — Hoshangabad Road',
    nameHi: 'ज़ोन VI — होशंगाबाद रोड',
    officerName: 'Priya Deshmukh',
    officerPhone: '+91 755 401 0006',
    centerLat: 23.1894,
    centerLng: 77.4521,
    boundaryBox: { nLat: 23.2000, sLat: 23.1750, eLng: 77.4700, wLng: 77.4350 },
    color: '#7c3aed',
  },
  {
    id: 'ward-07',
    name: 'Zone VII — Bairagarh',
    nameHi: 'ज़ोन VII — बैरागढ़',
    officerName: 'Suresh Gwalia',
    officerPhone: '+91 755 401 0007',
    centerLat: 23.2654,
    centerLng: 77.3456,
    boundaryBox: { nLat: 23.2800, sLat: 23.2500, eLng: 77.3650, wLng: 77.3250 },
    color: '#2563eb',
  },
  {
    id: 'ward-08',
    name: 'Zone VIII — New Market / Malviya Nagar',
    nameHi: 'ज़ोन VIII — न्यू मार्केट / मालवीय नगर',
    officerName: 'Deepak Tiwari',
    officerPhone: '+91 755 401 0008',
    centerLat: 23.2421,
    centerLng: 77.4019,
    boundaryBox: { nLat: 23.2520, sLat: 23.2350, eLng: 77.4150, wLng: 77.3880 },
    color: '#ec4899',
  },
];

export function getWardById(wardId: string): Ward | undefined {
  return WARDS.find((w) => w.id === wardId);
}

export function getWardForLocation(lat: number, lng: number): Ward | undefined {
  return WARDS.find((w) => {
    const { nLat, sLat, eLng, wLng } = w.boundaryBox;
    return lat >= sLat && lat <= nLat && lng >= wLng && lng <= eLng;
  });
}

export function getClosestWard(lat: number, lng: number): Ward {
  let closest = WARDS[0];
  let minDist = Infinity;
  for (const w of WARDS) {
    const d = Math.sqrt((w.centerLat - lat) ** 2 + (w.centerLng - lng) ** 2);
    if (d < minDist) {
      minDist = d;
      closest = w;
    }
  }
  return closest;
}

export const MOCK_ANNOUNCEMENTS: WardAnnouncement[] = [
  {
    id: 'ann-01',
    wardId: 'ward-06',
    title: 'Water Supply Disruption',
    body: 'Scheduled pipeline maintenance on Hoshangabad Road from Aug 14–15. Water supply may be intermittent between 10 AM – 4 PM.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    severity: 'warning',
  },
  {
    id: 'ann-02',
    wardId: 'ward-01',
    title: 'Road Resurfacing Complete',
    body: 'The pothole repair work near DB City Mall on the main road has been completed. Please report if any further issues remain.',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    severity: 'info',
  },
  {
    id: 'ann-03',
    wardId: 'ward-07',
    title: 'Monsoon Drain Inspection',
    body: 'All storm drains in Zone VII will be inspected and cleared before the upcoming heavy rainfall warning. Report blocked drains immediately.',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    severity: 'critical',
  },
];

export const CIVIC_BADGES: CivicBadge[] = [
  { id: 'badge-first-report', label: 'First Report', icon: '🏁', description: 'Filed your first civic issue report', threshold: 1 },
  { id: 'badge-five-reports', label: 'Active Reporter', icon: '📢', description: 'Filed 5 civic issue reports', threshold: 5 },
  { id: 'badge-community-voice', label: 'Community Voice', icon: '🗣️', description: 'Received 10 upvotes on your reports', threshold: 10 },
  { id: 'badge-neighborhood-watch', label: 'Neighborhood Watch', icon: '👁️', description: 'Verified 3 resolved issues in your ward', threshold: 15 },
  { id: 'badge-top-reporter', label: 'Top Reporter', icon: '🏆', description: 'Earned 50+ civic points', threshold: 50 },
  { id: 'badge-civic-champion', label: 'Civic Champion', icon: '🌟', description: 'Earned 100+ civic points', threshold: 100 },
];

export function getBadgesForPoints(points: number): CivicBadge[] {
  return CIVIC_BADGES.filter((b) => points >= b.threshold);
}
