/**
 * data/index.js
 *
 * Barrel export for every data source in mobilizerpage/data - same
 * convention as adminpage/data. Components import from the folder
 * itself (e.g. `from '../../data'`); new data files (dashboardData.js,
 * enquiriesData.js, ...) just need an `export * from './fileName'`
 * line here to become available, no import paths change elsewhere.
 */
export * from './sidebarMenu';
export * from './dashboardData';
export * from './enquiriesData';
export * from './reportData';
