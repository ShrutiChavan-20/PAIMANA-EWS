// ============================================================
//  CivicSense · TrustGrid AI — Data Store
//  Powered by Official MoSPI PAIMANA National Infrastructure Dataset (July 2026)
// ============================================================

import {
  paimanaProjects,
  paimanaSummary,
  sectorAnalytics,
  ministryAnalytics,
  trendData as paimanaTrendData,
  statusColor as pStatusColor,
  severityColor as pSeverityColor
} from './paimanaData';

export const projects = paimanaProjects;
export { paimanaSummary, sectorAnalytics, ministryAnalytics };

export const statusColor = pStatusColor;
export const severityColor = pSeverityColor;

export const trendData = paimanaTrendData;

// National Infrastructure Milestones & Bottlenecks (MoSPI Common Upload Form - CUF)
export const initialIssues = [];
