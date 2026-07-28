import React, { useState } from "react";
import {
  LayoutGrid,
  History,
  CheckCircle2,
  CalendarClock,
  Search,
  Filter,
  Plus,
  Download,
  Printer,
} from "lucide-react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import { StatCard, Dropdown, Button, Pagination } from "../../../shared";
import TaskTable from "../TaskTable/TaskTable";
import {
  taskAssignedStats,
  taskAssignedMeta,
  taskAssignedRecords,
  taskAssigneeOptions,
  taskPriorityOptions,
  taskStatusOptions,
} from "../../../data";
import "../../../styles/variables.css";
import "./TaskAssigned.css";

/**
 * TaskAssigned (full page)
 *
 * Staff "Task assigned" page. Mounts the shared Topbar + Sidebar shell
 * (identical composition to every other staff page, e.g.
 * CandidateManagement/AttendanceManagement) around the task-specific
 * content: stat cards, filter bar, "All Task" table, and pagination
 * footer. All fake data comes from data/tasksAssignedData.js +
 * data/filterOptions.js so it can be swapped for API responses later
 * without touching this file.
 *
 * Not to be confused with pages/Dashboard/TaskAssigned, which is only
 * the 4-item preview widget shown on the Dashboard.
 */
const STAT_ICONS = {
  grid: LayoutGrid,
  history: History,
  check: CheckCircle2,
  calendar: CalendarClock,
};

const TaskAssigned = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [searchTask, setSearchTask] = useState("");
  const [assignee, setAssignee] = useState(taskAssigneeOptions[0]);
  const [priority, setPriority] = useState(taskPriorityOptions[0]);
  const [status, setStatus] = useState(taskStatusOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="staff-dashboard">
      <Topbar
        user={{ name: "Staff Admin" }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        onSearch={setSearchValue}
      />

      <div className="staff-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
            <div className="task-assigned-page">
              <div className="task-assigned-page__header">
                <div>
                  <h1 className="task-assigned-page__title">Task assigned</h1>
                  <p className="task-assigned-page__subtitle">
                    {taskAssignedMeta.totalRecords} task. {taskAssignedMeta.pendingCount} pending across the team
                  </p>
                </div>
                <Button variant="primary" icon={Plus} iconPosition="left">
                  Assign task
                </Button>
              </div>

              <div className="task-assigned-page__stats-grid">
                {taskAssignedStats.map((stat) => (
                  <StatCard
                    key={stat.id}
                    icon={STAT_ICONS[stat.icon]}
                    value={stat.value}
                    label={stat.label}
                    tone={stat.tone}
                  />
                ))}
              </div>

              <div className="task-assigned-page__filter-bar">
                <div className="task-assigned-page__field">
                  <label className="task-assigned-page__label">Search Task</label>
                  <div className="task-assigned-page__search-input-wrap">
                    <Search size={16} className="task-assigned-page__search-icon" />
                    <input
                      type="text"
                      placeholder="search task"
                      value={searchTask}
                      onChange={(event) => setSearchTask(event.target.value)}
                      className="task-assigned-page__search-input"
                    />
                  </div>
                </div>

                <Dropdown
                  label="Assignee"
                  options={taskAssigneeOptions}
                  value={assignee}
                  onChange={setAssignee}
                />
                <Dropdown
                  label="Priority"
                  options={taskPriorityOptions}
                  value={priority}
                  onChange={setPriority}
                />
                <Dropdown
                  label="Status"
                  options={taskStatusOptions}
                  value={status}
                  onChange={setStatus}
                />

                <div className="task-assigned-page__apply-wrap">
                  <Button variant="outline" icon={Filter}>
                    Apply Filter
                  </Button>
                </div>
              </div>

              <section className="task-assigned-page__table-section">
                <div className="task-assigned-page__table-header">
                  <h2 className="task-assigned-page__table-title">All Task</h2>
                  <div className="task-assigned-page__table-actions">
                    <button
                      type="button"
                      className="task-assigned-page__icon-btn"
                      aria-label="Download"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      type="button"
                      className="task-assigned-page__icon-btn"
                      aria-label="Print"
                    >
                      <Printer size={16} />
                    </button>
                  </div>
                </div>

                <TaskTable tasks={taskAssignedRecords} />

                <Pagination
                  showing={taskAssignedRecords.length}
                  total={taskAssignedMeta.totalRecords}
                  currentPage={currentPage}
                  totalPages={taskAssignedMeta.totalPages}
                  onPageChange={setCurrentPage}
                  label={`Showing 1-${taskAssignedRecords.length} out of ${taskAssignedMeta.totalRecords}`}
                />
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TaskAssigned;
