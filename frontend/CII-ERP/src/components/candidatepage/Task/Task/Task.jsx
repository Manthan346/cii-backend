// Task.jsx
// Page-level wrapper for the Task Assignment screen — composes the shared
// Sidebar + Topbar layout around the TaskPage content component, the same
// way the Profile page composes Sidebar + Topbar + PersonalInfo.
//
// Wire this up to your router, e.g.:
//   <Route path="/tasks" element={<Task />} />

import { useState } from 'react';
import Sidebar from '../../layout/Sidebar/Sidebar';
import Topbar from '../../layout/Topbar/Topbar';
import TaskPage from '../Taskpage/TaskPage';
import './Task.css';

export default function Task() {
  const [search, setSearch] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="task-layout">
      <Sidebar
        activeItem="Task"
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="task-layout__main">
        <Topbar
          search={search}
          onSearch={setSearch}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="task-layout__content">
          {/* TODO: replace this mock data with a real fetch, e.g. from
              GET /api/tasks once the backend endpoint exists */}
          <TaskPage
            candidateName="Aisha"
            sessionsLeft={3}
            stats={{ total: 3, pending: 1, inProgress: 2, inProgressPct: 66 }}
            filterOptions={{
              batches: [{ value: 'ds-24', label: 'DS-24' }],
              courses: [{ value: 'design', label: 'Graphic Design' }],
              assignees: [{ value: 'aisha', label: 'Aisha Sheikh' }],
              statuses: [
                { value: 'completed', label: 'Completed' },
                { value: 'in-progress', label: 'In Progress' },
              ],
            }}
            tasks={[
              {
                id: 1,
                index: 1,
                title: 'Graphic Design Project :- Create a World Cup animated GIF in Photoshop to promote your event',
                dueLabel: 'Project Submit by 20th Jul, 11:59pm',
                status: 'completed',
              },
              {
                id: 2,
                index: 2,
                title: 'Graphic Design Project :- Social Media Template Design for Clients',
                dueLabel: 'Activity Submit by 25th Jul, 11:59pm',
                status: 'in-progress',
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
