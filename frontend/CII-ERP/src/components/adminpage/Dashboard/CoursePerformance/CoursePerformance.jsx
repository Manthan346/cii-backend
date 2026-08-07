import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import './CoursePerformance.css';

/**
 * CoursePerformance
 *
 * Table of per-course stats: enrolled candidates, active candidates,
 * progress against the yearly target, and certificates issued.
 *
 * Props:
 *  - courses: array of { id, course, enrolled, active, yearlyTarget, certificates }
 *             see Dashboard/data.js -> coursePerformance for the shape.
 */
const CoursePerformance = ({ courses = [] }) => {
  return (
    <SectionCard title="Course Performance">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Enrolled Candidates</th>
              <th>Active Candidates</th>
              <th>Yearly Target</th>
              <th>Certificates</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((row) => (
              <tr key={row.id}>
                <td>
                  <span className="admin-table__bullet">•</span>
                  {row.course}
                </td>
                <td>{row.enrolled}</td>
                <td>{row.active}</td>
                <td>{row.yearlyTarget}</td>
                <td>{row.certificates}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
};

export default CoursePerformance;
