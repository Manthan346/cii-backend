/**
 * data/index.js
 *
 * Barrel export for every data source in adminpage/data. Components
 * import from the folder itself (e.g. `from '../../data'`) instead of
 * reaching into individual files, so new data files just need an
 * `export * from './fileName'` line here to become available
 * app-wide - no import paths change elsewhere.
 */
export * from './sidebarMenu';
export * from './dashboardData';
export * from './totalUsersData';
export * from './candidatesData';
export * from './suspendedAccountsData';
export * from './courseManagementData';
export * from './approvalRequestsPageData';
export * from './profileData';
