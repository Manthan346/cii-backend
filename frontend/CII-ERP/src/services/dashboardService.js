// dashboardService.js
// Service layer for the candidate Dashboard. Every UI component is
// presentational and only receives data via props — this file is the
// single place that knows where that data comes from.
//
// Right now it resolves the local mock data. To go live, replace the
// body of `fetchDashboardData` with a real request, e.g.:
//
//   export async function fetchDashboardData() {
//     const res = await fetch('/api/candidate/dashboard');
//     if (!res.ok) throw new Error('Failed to load dashboard data');
//     return res.json();
//   }
//
// No component needs to change as long as the response shape matches
// `MOCK_DASHBOARD_DATA` in `src/data/mockDashboardData.js`.

import { MOCK_DASHBOARD_DATA } from '../data/mockDashboardData';

const SIMULATED_LATENCY_MS = 0; // bump this during dev to test loading states

export async function fetchDashboardData() {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_LATENCY_MS));
  return MOCK_DASHBOARD_DATA;
}
