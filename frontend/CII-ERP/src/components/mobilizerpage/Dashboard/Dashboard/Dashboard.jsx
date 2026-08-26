import React, { useEffect, useState } from 'react';
import StatsGrid from '../StatsGrid/StatsGrid';
import DailyEnrollmentsChart from '../DailyEnrollmentsChart/DailyEnrollmentsChart';
import CandidateStatusChart from '../CandidateStatusChart/CandidateStatusChart';
import WeeklyCallsChart from '../WeeklyCallsChart/WeeklyCallsChart';
import UpcomingJobFairs from '../UpcomingJobFairs/UpcomingJobFairs';
import TodaysFollowUps from '../TodaysFollowUps/TodaysFollowUps';
import { fetchDashboardCharts } from '../../../../../api/mobilizer/dashboardService';
import './Dashboard.css';

/**
 * Dashboard
 * Three independent rows, each sized only by what's inside it:
 *   Row 1: Daily Enrollments | Weekly Calls
 *   Row 2: Candidate Status Distribution | Upcoming Job Fairs
 *   Row 3: Recent Enquiries (full width — the single child of a flex
 *          row with flex:1 naturally fills the whole row, so it needs
 *          no special "full width" class of its own)
 *
 * Because each row is a separate flex container, one row's card heights
 * can never affect another row's spacing — that's what keeps this from
 * regressing into the same gap issue as the old unified-grid version.
 */
export default function Dashboard() {
  const [charts, setCharts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetchDashboardCharts()
      .then((dashboardCharts) => {
        if (isMounted) setCharts(dashboardCharts);
      })
      .catch(() => {
        if (isMounted) setError('Unable to load dashboard charts');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mobilizer-dashboard">
      <StatsGrid />

      {error ? <p>{error}</p> : !charts ? <p>Loading dashboard charts...</p> : (
        <>
          <div className="md-panel-row">
            <DailyEnrollmentsChart data={charts.weeklyEnrollment} />
            <WeeklyCallsChart data={charts.weeklyCalls} />
          </div>

          <div className="md-panel-row">
            <CandidateStatusChart data={charts.candidateDistribution} />
            <UpcomingJobFairs />
          </div>
        </>
      )}

      <div className="md-panel-row">
        <TodaysFollowUps />
      </div>
    </div>
  );
}
