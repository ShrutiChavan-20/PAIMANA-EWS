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
export const initialIssues = [
  {
    id: 1,
    projectId: 1,
    title: "Stage-II Environmental & Forest Clearance Pending",
    severity: "high",
    status: "open",
    reports: 14,
    lat: 15.9129,
    lng: 79.7400,
    date: "2026-06-12",
    reporter: "MoSPI Regional Inspector",
    description: "Delay in obtaining mandatory forest diversion approval for runway expansion zone. Construction halted on northern periphery."
  },
  {
    id: 2,
    projectId: 2,
    title: "Contractor Liquidity Crunch & Slow Earthwork Execution",
    severity: "high",
    status: "in-review",
    reports: 28,
    lat: 16.5062,
    lng: 80.6480,
    date: "2026-05-18",
    reporter: "Project Monitoring Unit",
    description: "Physical progress lagging financial expenditure by 20.2%. Contractor cash flow constraint impacting terminal structural framing."
  },
  {
    id: 3,
    projectId: 4,
    title: "Land Acquisition Encroachment along Access Corridor",
    severity: "high",
    status: "open",
    reports: 42,
    lat: 26.1158,
    lng: 91.7086,
    date: "2026-07-02",
    reporter: "District Collectorate Liaison",
    description: "12 hectares of approach road land contested in court. Milestone 4 (access link) delayed by 15 months."
  },
  {
    id: 4,
    projectId: 14,
    title: "Extreme Weather Sub-zero Concreting Halt",
    severity: "medium",
    status: "resolved",
    reports: 8,
    lat: 34.1526,
    lng: 77.5771,
    date: "2026-03-15",
    reporter: "AAI Cold Climate Division",
    description: "Sub-zero temperatures required specialized heating blankets and frost additives for terminal foundation cure."
  },
  {
    id: 5,
    projectId: 298178,
    title: "Turbine Equipment Supply Chain Slippage (Forex Volatility)",
    severity: "high",
    status: "open",
    reports: 19,
    lat: 25.1327,
    lng: 81.8214,
    date: "2026-07-10",
    reporter: "NTPC Thermal Cell",
    description: "Supercritical boiler turbine deliveries delayed from overseas vendor due to shipping constraints and revised tariff clearances."
  },
  {
    id: 6,
    projectId: 7,
    title: "High-Tension Utility Cable Line Shifting Pending",
    severity: "medium",
    status: "in-review",
    reports: 11,
    lat: 25.5941,
    lng: 85.1376,
    date: "2026-06-25",
    reporter: "Patna Infra Cell",
    description: "State electricity transmission utility has not de-energized 132kV overhead grid line crossing passenger terminal roof zone."
  },
  {
    id: 7,
    projectId: 10,
    title: "Geological Riverbed Siltation in Embankment Piling",
    severity: "high",
    status: "open",
    reports: 22,
    lat: 32.7266,
    lng: 74.8570,
    date: "2026-06-30",
    reporter: "Jammu Civil Wing",
    description: "Tawi riverbed soil bearing capacity required redesign of deep friction piles for aircraft apron."
  }
];
