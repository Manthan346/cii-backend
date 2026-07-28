import React from "react";
import { SectionCard, PriorityDot } from "../../../shared";
import { tasksAssigned } from "../../../data";
import "./TaskAssigned.css";

/**
 * TaskAssigned
 *
 * Dashboard list of tasks assigned to the trainer, each with a due date
 * and priority. Built on the reusable <SectionCard> (with its "View
 * all" action) and <PriorityDot> from /shared.
 */
const TaskAssigned = () => {
  return (
    <SectionCard
      title="Task Assigned"
      actionLabel="View all"
      className="task-assigned"
    >
      <ul className="task-assigned__list">
        {tasksAssigned.map((task) => (
          <li className="task-assigned__item" key={task.id}>
            <PriorityDot priority={task.priority} />
            <div className="task-assigned__content">
              <p className="task-assigned__title">{task.title}</p>
              <p className="task-assigned__meta">
                {task.due} &bull; {task.priority} Priority
              </p>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
};

export default TaskAssigned;
