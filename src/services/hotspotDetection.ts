import type { Issue, HotspotZone, Priority } from '../types';
import { calculateDistanceMeters } from '../utils/distance';

export function detectHotspotZones(issues: Issue[]): HotspotZone[] {
  const openIssues = issues.filter(
    (i) => i.status !== 'Resolved' && i.status !== 'Verified'
  );

  const hotspots: HotspotZone[] = [];
  const processedIds = new Set<string>();

  for (let i = 0; i < openIssues.length; i++) {
    const seed = openIssues[i];
    if (processedIds.has(seed.id)) continue;

    const cluster: Issue[] = [seed];
    let totalLat = seed.lat;
    let totalLng = seed.lng;

    for (let j = i + 1; j < openIssues.length; j++) {
      const candidate = openIssues[j];
      if (processedIds.has(candidate.id)) continue;

      if (candidate.category === seed.category) {
        const dist = calculateDistanceMeters(seed.lat, seed.lng, candidate.lat, candidate.lng);
        if (dist <= 350) {
          cluster.push(candidate);
          totalLat += candidate.lat;
          totalLng += candidate.lng;
        }
      }
    }

    if (cluster.length >= 3) {
      cluster.forEach((c) => processedIds.add(c.id));
      const centerLat = totalLat / cluster.length;
      const centerLng = totalLng / cluster.length;

      const sampleAddress = seed.address.split(',')[0] || seed.address;

      const hasCritical = cluster.some((c) => c.priority === 'Critical' || c.escalated);
      const severity: Priority = hasCritical ? 'Critical' : cluster.length >= 5 ? 'High' : 'Medium';

      hotspots.push({
        id: `hs-${seed.category}-${Math.floor(centerLat * 100)}`,
        name: `${sampleAddress} Zone`,
        category: seed.category,
        reportCount: cluster.length,
        centerLat,
        centerLng,
        trend: cluster.length >= 5 ? 'rising' : 'stable',
        severity,
      });
    }
  }

  return hotspots.sort((a, b) => b.reportCount - a.reportCount);
}
