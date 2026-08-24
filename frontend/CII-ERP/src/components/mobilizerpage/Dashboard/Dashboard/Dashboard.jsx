import React from 'react';
import StatsGrid from '../StatsGrid/StatsGrid';
import DailyEnrollmentsChart from '../DailyEnrollmentsChart/DailyEnrollmentsChart';
import CandidateStatusChart from '../CandidateStatusChart/CandidateStatusChart';
import WeeklyCallsChart from '../WeeklyCallsChart/WeeklyCallsChart';
import UpcomingJobFairs from '../UpcomingJobFairs/UpcomingJobFairs';
import TodaysFollowUps from '../TodaysFollowUps/TodaysFollowUps';
import './Dashboard.css';

/**
 * Dashboard
 * Three independent rows, each sized only by what's inside it:
 *   Row 1: Daily Enrollments | Weekly Calls
 *   Row 2: Candidate Status Distribution | Upcoming Job Fairs
 *   Row 3: Today's Follow-ups (full width — the single child of a flex
 *          row with flex:1 naturally fills the whole row, so it needs
 *          no special "full width" class of its own)
 *
 * Because each row is a separate flex container, one row's card heights
 * can never affect another row's spacing — that's what keeps this from
 * regressing into the same gap issue as the old unified-grid version.
 */
export default function Dashboard() {
  return (
    <div className="mobilizer-dashboard">
      <StatsGrid />

      <div className="md-panel-row">
        <DailyEnrollmentsChart />
        <WeeklyCallsChart />
      </div>

      <div className="md-panel-row">
        <CandidateStatusChart />
        <UpcomingJobFairs />
      </div>

      <div className="md-panel-row">
        <TodaysFollowUps />
      </div>
    </div>
  );
}
