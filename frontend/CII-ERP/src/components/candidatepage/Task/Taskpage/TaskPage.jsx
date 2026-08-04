// TaskPage.jsx
// "Task Assignment" page — stat overview + filterable task list.
//
// Props:
//   candidateName {string}
//   sessionsLeft  {number}  – sessions remaining to finish current course
//   stats         {object}  – { total, pending, inProgress, inProgressPct }
//   filterOptions {object}  – { batches, courses, assignees, statuses } (arrays of {value,label})
//   tasks         {array}   – [{ id, index, title, dueLabel, status: 'completed'|'in-progress', onNotify }]

import { useState } from 'react';
import Icon from '../../shared/Icon/Icon';
import './TaskPage.css';

function StatCard({ icon, iconColor, label, value, valueColor, footer, footerIcon, footerColor, progressPct }) {
  return (
    <div className="task-stat">
      <div className="task-stat__top">
        <div className="task-stat__label">{label}</div>
        <div className="task-stat__icon-wrap">
          <Icon name={icon} size={18} color={iconColor || 'var(--blue)'} />
        </div>
      </div>

      <div className="task-stat__value" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </div>

      {progressPct != null ? (
        <div className="task-stat__progress">
          <div className="task-stat__progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      ) : (
        <div className="task-stat__footer" style={footerColor ? { color: footerColor } : undefined}>
          {footerIcon && <Icon name={footerIcon} size={12} color={footerColor} />}
          {footer}
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, placeholder, options = [], value, onChange }) {
  return (
    <div className="task-filter">
      <div className="task-filter__label">{label}</div>
      <select
        className="task-filter__select"
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function StatusPill({ status }) {
  const isDone = status === 'completed';
  return (
    <span className={`task-status-pill ${isDone ? 'is-done' : 'is-progress'}`}>
      {isDone ? 'Completed' : 'In Progress'}
    </span>
  );
}

function TaskItem({ index, title, dueLabel, status, onNotify }) {
  return (
    <div className="task-item">
      <div className="task-item__icon">
        <Icon name="edit" size={16} color="var(--white)" />
      </div>

      <div className="task-item__body">
        <div className="task-item__index">Task {index}</div>
        <div className="task-item__title">{title}</div>
        <div className="task-item__due">{dueLabel}</div>
      </div>

      <div className="task-item__actions">
        <StatusPill status={status} />
        <button className="task-item__notify" type="button" onClick={onNotify}>
          Notify
          <Icon name="bell" size={14} color="var(--blue)" />
        </button>
      </div>
    </div>
  );
}

const defaultFilterOptions = { batches: [], courses: [], assignees: [], statuses: [] };

export default function TaskPage({
  candidateName = '',
  sessionsLeft = 0,
  stats = { total: 0, pending: 0, inProgress: 0, inProgressPct: 0 },
  filterOptions = defaultFilterOptions,
  tasks = [],
}) {
  const [selected, setSelected] = useState({ batch: '', course: '', assignee: '', status: '' });

  const updateFilter = (key) => (val) =>
    setSelected(prev => ({ ...prev, [key]: val }));

  return (
    <div className="task-page">
      <h1 className="task-page__title">Task Assignment</h1>
      <p className="task-page__subtitle">
        Welcome back, {candidateName}. You're {sessionsLeft} sessions away from completing your current course. Keep going!
      </p>

      <div className="task-page__stats">
        <StatCard
          icon="document"
          label="Total Tasks"
          value={stats.total}
          footer="Across all teams"
        />
        <StatCard
          icon="clock"
          label="Pending"
          value={stats.pending}
          valueColor="var(--blue)"
          footer="Requires attention"
          footerIcon="trendingUp"
          footerColor="var(--orange)"
        />
        <StatCard
          icon="arrow"
          iconColor="var(--green)"
          label="In Progress"
          value={stats.inProgress}
          progressPct={stats.inProgressPct}
        />
      </div>

      <div className="task-page__filters">
        <FilterSelect
          label="BATCH TASK"
          placeholder="Select Batch"
          options={filterOptions.batches}
          value={selected.batch}
          onChange={updateFilter('batch')}
        />
        <FilterSelect
          label="COURSES"
          placeholder="Select Courses"
          options={filterOptions.courses}
          value={selected.course}
          onChange={updateFilter('course')}
        />
        <FilterSelect
          label="ASSIGNEE"
          placeholder="Select Assignee"
          options={filterOptions.assignees}
          value={selected.assignee}
          onChange={updateFilter('assignee')}
        />
        <FilterSelect
          label="STATUS"
          placeholder="Select Status"
          options={filterOptions.statuses}
          value={selected.status}
          onChange={updateFilter('status')}
        />
        <button className="task-page__apply-filter" type="button">
          Apply Filter
          <Icon name="filter" size={14} color="var(--blue)" />
        </button>
      </div>

      <div className="task-page__list">
        {tasks.length === 0 ? (
          <div className="task-page__empty">No tasks assigned yet.</div>
        ) : (
          tasks.map(t => (
            <TaskItem
              key={t.id}
              index={t.index}
              title={t.title}
              dueLabel={t.dueLabel}
              status={t.status}
              onNotify={t.onNotify}
            />
          ))
        )}
      </div>
    </div>
  );
}