import React, { useMemo, useState } from 'react';
import { FileDown, Filter } from 'lucide-react';
import Button from '../../../shared/Button/Button';
import Tabs from '../../../shared/Tabs/Tabs';
import CourseManagementOverview from '../CourseManagementOverview/CourseManagementOverview';
import CoursesFilterBar from '../CoursesFilterBar/CoursesFilterBar';
import CoursesTable from '../CoursesTable/CoursesTable';
import ShortTermFilterBar from '../ShortTermFilterBar/ShortTermFilterBar';
import ShortTermTrainingTable from '../ShortTermTrainingTable/ShortTermTrainingTable';
import {
  courseStats,
  courseBatchOptions,
  courseStatusOptions,
  courseNameOptions,
  courseCompanyOptions,
  coursesCatalogList,
  coursesPagination,
  trainingTypeOptions,
  trainingTrainerOptions,
  trainingStatusOptions,
  shortTermTrainingList,
  shortTermPagination,
} from '../../../data';
import './CourseManagement.css';

const TABS = [
  { id: 'courses', label: 'Courses' },
  { id: 'short-term', label: 'Short term Training' },
];

/**
 * CourseManagement (Admin)
 *
 * "Manage course catalog, batches and trainers" page: KPI row, a
 * Courses / Short term Training tab switch, and a filter bar + table
 * that swap based on the active tab. The page-level "Apply Filters"
 * button applies whichever filter set is currently visible.
 *
 * All content currently comes from data/courseManagementData.js
 * mocks, and tab/filter/pagination state is held locally here just to
 * make the UI interactive. Swap in real data-fetching hooks once the
 * backend endpoints noted in courseManagementData.js are ready - the
 * section components don't need to change, they just take the same
 * props.
 */
const CourseManagement = () => {
  const [activeTab, setActiveTab] = useState('courses');

  // Courses tab filter/pagination state
  const [courseSearch, setCourseSearch] = useState('');
  const [batch, setBatch] = useState('all');
  const [courseStatus, setCourseStatus] = useState('all');
  const [courseName, setCourseName] = useState('all');
  const [company, setCompany] = useState('all');
  const [coursePage, setCoursePage] = useState(coursesPagination.currentPage);

  // Short term Training tab filter/pagination state
  const [trainingSearch, setTrainingSearch] = useState('');
  const [trainingType, setTrainingType] = useState('all');
  const [trainer, setTrainer] = useState('all');
  const [trainingStatus, setTrainingStatus] = useState('all');
  const [trainingDate, setTrainingDate] = useState('');
  const [trainingPage, setTrainingPage] = useState(shortTermPagination.currentPage);

  // Client-side filtering, standing in for real
  // `GET /api/admin/courses?...` / `GET /api/admin/short-term-trainings?...` calls.
  const filteredCourses = useMemo(() => {
    return coursesCatalogList.filter((course) => {
      const q = courseSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        course.name.toLowerCase().includes(q) ||
        course.batch.toLowerCase().includes(q);
      const matchesBatch =
        batch === 'all' || course.batch.toLowerCase() === batch;
      const matchesStatus = courseStatus === 'all' || course.status === courseStatus;
      const matchesCourse =
        courseName === 'all' ||
        course.name.toLowerCase().replace(/\s+/g, '-') === courseName;
      const matchesCompany = company === 'all';

      return matchesSearch && matchesBatch && matchesStatus && matchesCourse && matchesCompany;
    });
  }, [courseSearch, batch, courseStatus, courseName, company]);

  const filteredTrainings = useMemo(() => {
    return shortTermTrainingList.filter((training) => {
      const q = trainingSearch.trim().toLowerCase();
      const matchesSearch = !q || training.name.toLowerCase().includes(q);
      const matchesType =
        trainingType === 'all' || training.type.toLowerCase() === trainingType;
      const matchesTrainer =
        trainer === 'all' ||
        training.trainer.toLowerCase().replace(/\.?\s+/g, '-') === trainer;
      const matchesStatus =
        trainingStatus === 'all' || training.status === trainingStatus;

      return matchesSearch && matchesType && matchesTrainer && matchesStatus;
    });
  }, [trainingSearch, trainingType, trainer, trainingStatus]);

  const handleApplyFilters = () => {
    if (activeTab === 'courses') {
      setCoursePage(1);
    } else {
      setTrainingPage(1);
    }
    // TODO: trigger the real fetch for the active tab here once wired to the backend.
  };

  const handleExport = () => {
    // TODO: GET /api/admin/courses/export?format=csv (or the training equivalent)
    console.log('export', activeTab);
  };

  return (
    <div className="admin-course-management">
      <div className="admin-course-management__heading">
        <div>
          <h1 className="admin-course-management__title">Course management</h1>
          <p className="admin-course-management__subtitle">
            Manage course catalog, batches and trainers
          </p>
        </div>
        <Button icon={FileDown} onClick={handleExport}>
          Export As
        </Button>
      </div>

      <CourseManagementOverview stats={courseStats} />

      <div className="admin-course-management__tabs-row">
        <Tabs tabs={TABS} activeId={activeTab} onChange={setActiveTab} />
        <Button icon={Filter} onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>

      {activeTab === 'courses' ? (
        <>
          <CoursesFilterBar
            search={courseSearch}
            onSearchChange={setCourseSearch}
            batch={batch}
            onBatchChange={setBatch}
            status={courseStatus}
            onStatusChange={setCourseStatus}
            course={courseName}
            onCourseChange={setCourseName}
            company={company}
            onCompanyChange={setCompany}
            batchOptions={courseBatchOptions}
            statusOptions={courseStatusOptions}
            courseOptions={courseNameOptions}
            companyOptions={courseCompanyOptions}
          />

          <CoursesTable
            courses={filteredCourses}
            pagination={{ ...coursesPagination, currentPage: coursePage }}
            onPageChange={setCoursePage}
            onEditCourse={(id) => console.log('edit course', id)}
            onDeleteCourse={(id) => console.log('delete course', id)}
          />
        </>
      ) : (
        <>
          <ShortTermFilterBar
            search={trainingSearch}
            onSearchChange={setTrainingSearch}
            type={trainingType}
            onTypeChange={setTrainingType}
            trainer={trainer}
            onTrainerChange={setTrainer}
            status={trainingStatus}
            onStatusChange={setTrainingStatus}
            date={trainingDate}
            onDateChange={setTrainingDate}
            typeOptions={trainingTypeOptions}
            trainerOptions={trainingTrainerOptions}
            statusOptions={trainingStatusOptions}
          />

          <ShortTermTrainingTable
            trainings={filteredTrainings}
            pagination={{ ...shortTermPagination, currentPage: trainingPage }}
            onPageChange={setTrainingPage}
          />
        </>
      )}
    </div>
  );
};

export default CourseManagement;
