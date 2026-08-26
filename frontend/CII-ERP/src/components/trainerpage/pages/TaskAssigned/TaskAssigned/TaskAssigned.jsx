import { useState } from "react";
import {
  LayoutGrid,
  CalendarClock,
  CheckCircle2,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import { StatCard, Dropdown, Button, Pagination } from "../../../shared";
import TaskTable from "../TaskTable/TaskTable";
import AssignTaskModal from "../AssignTaskModal/AssignTaskModal";
import MarkAssessment from "../MarkAssessment/MarkAssessment";
import {
  taskAssignedMeta,
  taskAssignedRecords as defaultRecords,
  taskPriorityOptions,
  taskStatusOptions,
} from "../../../data";
import "../../../styles/variables.css";
import "./TaskAssigned.css";

/**
 * No backend exists yet for tasks (no getTasks/createTask/mark
 * endpoints shared) — everything here is local-only state, same
 * pattern Study Material used before it was connected. Swap for real
 * API calls once those endpoints exist.
 */
const TaskAssigned = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchTask, setSearchTask] = useState("");
  const [priority, setPriority] = useState(taskPriorityOptions[0]);
  const [status, setStatus] = useState(taskStatusOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);

  const [records, setRecords] = useState(defaultRecords);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // view switching: "list" (default) or "assessment" (Mark Assesment
  // page, opened via the eye icon on a row)
  const [view, setView] = useState("list");
  const [selectedTask, setSelectedTask] = useState(null);

  // Stats derived from local records instead of a separate stats
  // array, so a newly-assigned task immediately reflects in the count
  // without needing to know the exact shape of an unseen stats file.
  const totalTasks = records.length;
  const inProgressCount = records.filter(
    (t) => t.status?.toLowerCase() === "in progress",
  ).length;
  const completedCount = records.filter(
    (t) => t.status?.toLowerCase() === "completed",
  ).length;
  const pendingCount = records.filter(
    (t) => t.status?.toLowerCase() !== "completed",
  ).length;

  const handleAssignTask = (formValues) => {
    const newTask = {
      id: Date.now(),
      title: formValues.title,
      subtitle: formValues.course || "",
      assignedTo: formValues.batch || formValues.assignTo || "—",
      priority: formValues.priority || "medium", // default until the modal exposes a priority field
      dueDate: formValues.dueDate || "—",
      status: "In progress",
    };
    setRecords((prev) => [newTask, ...prev]);
    setShowAssignModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setView("assessment");
  };

  if (view === "assessment") {
    return (
      <div className="staff-dashboard">
        <Topbar
          user={{ name: "Staff Admin" }}
          hasUnreadNotifications={true}
          onMenuToggle={() => setSidebarOpen((o) => !o)}
        />
        <div className="staff-dashboard__content">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="staff-dashboard__main">
            <main className="staff-dashboard__body">
              <MarkAssessment
                task={selectedTask}
                onBack={() => {
                  setView("list");
                  setSelectedTask(null);
                }}
              />
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-dashboard">
      <Topbar
        user={{ name: "Staff Admin" }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
      />

      <div className="staff-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
            <div className="task-assigned-page">
              {showToast && (
                <div className="task-assigned-page__toast" role="status">
                  Task assigned successfully
                </div>
              )}

              <div className="task-assigned-page__header">
                <div>
                  <h1 className="task-assigned-page__title">Assigned tasks</h1>
                  <p className="task-assigned-page__subtitle">
                    {totalTasks} task. {pendingCount} pending across the team
                  </p>
                </div>
                <Button
                  variant="primary"
                  icon={Plus}
                  iconPosition="left"
                  onClick={() => setShowAssignModal(true)}
                >
                  Assign task
                </Button>
              </div>

              <div className="task-assigned-page__stats-grid">
                <StatCard
                  icon={LayoutGrid}
                  value={totalTasks}
                  label="Total Task"
                  tone="blue"
                />
                <StatCard
                  icon={CalendarClock}
                  value={inProgressCount}
                  label="In progress"
                  tone="green"
                />
                <StatCard
                  icon={CheckCircle2}
                  value={completedCount}
                  label="Completed"
                  tone="blue"
                />
              </div>

              <div className="task-assigned-page__filter-bar">
                <div className="task-assigned-page__field">
                  <label className="task-assigned-page__label">
                    Search Task
                  </label>
                  <div className="task-assigned-page__search-input-wrap">
                    <Search
                      size={16}
                      className="task-assigned-page__search-icon"
                    />
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
                </div>

                <TaskTable records={records} onView={handleViewTask} />

                <Pagination
                  showing={records.length}
                  total={taskAssignedMeta.totalRecords}
                  currentPage={currentPage}
                  totalPages={taskAssignedMeta.totalPages}
                  onPageChange={setCurrentPage}
                  label={`Showing 1-${records.length} out of ${taskAssignedMeta.totalRecords}`}
                />
              </section>
            </div>
          </main>
        </div>
      </div>

      {showAssignModal && (
        <AssignTaskModal
          onCancel={() => setShowAssignModal(false)}
          onAssign={handleAssignTask}
        />
      )}
    </div>
  );
};

export default TaskAssigned;
