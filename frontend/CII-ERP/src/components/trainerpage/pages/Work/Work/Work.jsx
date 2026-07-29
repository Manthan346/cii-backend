import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  CheckCircle2,
  Hourglass,
  CalendarDays,
  ClipboardCheck,
  Bell,
} from 'lucide-react';
import Sidebar from '../../../layout/Sidebar/Sidebar';
import Topbar from '../../../layout/Topbar/Topbar';
import { Button } from '../../../shared';
import StatCard from '../StatCard/StatCard';
import ShortcutCard from '../ShortcutCard/ShortcutCard';
import RecentActivity from '../RecentActivity/RecentActivity';
import {
  workStats,
  workShortcuts,
  recentActivity,
  workMeta,
} from '../../../data';
import '../../../styles/variables.css';
import './Work.css';

/**
 * Work
 *
 * Staff "Work" page. Mounts the shared Topbar + Sidebar shell
 * (identical composition to every other staff page) around the
 * page-specific content: summary stat cards, the "Task Assigned" /
 * "Notification" shortcut tiles, and the "Recent activity" feed -
 * matches the reference "Work" screen.
 *
 * The top-right "view task" button and the "Task Assigned" /
 * "Notification" tiles all navigate to their matching sidebar routes
 * (/staff/task-assigned, /staff/notifications) via react-router's
 * useNavigate, so clicking them takes the staff member straight to
 * that page.
 */
const STAT_ICONS = {
  grid: LayoutGrid,
  check: CheckCircle2,
  hourglass: Hourglass,
  calendar: CalendarDays,
};

const SHORTCUT_ICONS = {
  clipboard: ClipboardCheck,
  bell: Bell,
};

const Work = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="staff-dashboard">
      <Topbar
        user={{ name: 'Staff Admin' }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        onSearch={setSearchValue}
      />

      <div className="staff-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
            <div className="work-page">
              <div className="work-page__header">
                <div>
                  <h1 className="work-page__title">Work</h1>
                  <p className="work-page__subtitle">{workMeta.subtitle}</p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => navigate(workMeta.viewTaskRoute)}
                >
                  view task
                </Button>
              </div>

              <div className="work-page__stats-grid">
                {workStats.map((stat) => (
                  <StatCard
                    key={stat.id}
                    icon={STAT_ICONS[stat.icon]}
                    value={stat.value}
                    label={stat.label}
                    tone={stat.tone}
                  />
                ))}
              </div>

              <div className="work-page__shortcuts-grid">
                {workShortcuts.map((shortcut) => (
                  <ShortcutCard
                    key={shortcut.id}
                    icon={SHORTCUT_ICONS[shortcut.icon]}
                    title={shortcut.title}
                    subtitle={shortcut.subtitle}
                    tone={shortcut.tone}
                    onClick={() => navigate(shortcut.route)}
                  />
                ))}
              </div>

              <RecentActivity
                items={recentActivity}
                onViewAll={() => navigate(workMeta.recentActivityRoute)}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Work;
