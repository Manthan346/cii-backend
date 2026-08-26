import { useState, useEffect, useCallback } from "react";
import {
  Layers,
  CheckCircle2,
  GraduationCap,
  Repeat,
  Search,
  Filter,
} from "lucide-react";
import { Dropdown, Button, Pagination } from "../../../shared";
import StatCard from "../StatCard/StatCard";
import BatchTable from "../BatchTable/BatchTable";
import ViewBatchModal from "../ViewBatchModal/ViewBatchModal";
import { batchStatusOptions } from "../../../data";
import {
  fetchBatches,
  fetchBatchStats,
} from "../../../../../../api/trainer/batchService";
import "./BatchList.css";

const STAT_ICONS = {
  layers: Layers,
  check: CheckCircle2,
  completed: GraduationCap,
  repeat: Repeat,
};

const PAGE_LIMIT = 6;
const ALL_COURSES_LABEL = "All Courses";

const BatchList = ({ onCreateBatch, refreshKey }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState(batchStatusOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);

  // Courses filter is populated client-side from batch responses
  // (no dedicated /courses endpoint available). See batchService.js
  // fetchBatches for how `courses` is derived per-page.
  const [courses, setCourses] = useState([]); // [{ id, name }]
  const [courseId, setCourseId] = useState(""); // "" = All Courses
  const courseNameOptions = [ALL_COURSES_LABEL, ...courses.map((c) => c.name)];

  const [batches, setBatches] = useState([]);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 1,
  });
  const [stats, setStats] = useState({
    totalBatches: 0,
    active: 0,
    upcoming: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedBatch, setSelectedBatch] = useState(null);

  const loadBatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchBatches({
        page: currentPage,
        limit: PAGE_LIMIT,
        search: searchTerm,
        status,
        courseId,
      });
      setBatches(result.batches);
      setPagination(result.pagination);

      // Merge (don't replace) so the dropdown accumulates courses
      // seen across searches/pages instead of resetting each fetch.
      if (result.courses.length) {
        setCourses((prev) => {
          const merged = new Map(prev.map((c) => [c.id, c]));
          result.courses.forEach((c) => merged.set(c.id, c));
          return Array.from(merged.values());
        });
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load batches.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, status, courseId]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage(1);
      loadBatches();
    }, 400);
    return () => clearTimeout(t);
  }, [searchTerm]);
  /* eslint-enable react-hooks/exhaustive-deps */

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    loadBatches();
  }, [currentPage, status, courseId, refreshKey]);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  useEffect(() => {
    fetchBatchStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  const handleCourseChange = (name) => {
    if (name === ALL_COURSES_LABEL) {
      setCourseId("");
    } else {
      const match = courses.find((c) => c.name === name);
      setCourseId(match?.id ?? "");
    }
    setCurrentPage(1);
  };

  const selectedCourseName = courseId
    ? (courses.find((c) => c.id === courseId)?.name ?? ALL_COURSES_LABEL)
    : ALL_COURSES_LABEL;

  const statCards = [
    {
      id: "total",
      icon: "layers",
      value: stats.totalBatches,
      label: "Total batches",
      tone: "blue",
    },
    {
      id: "active",
      icon: "check",
      value: stats.active,
      label: "Active",
      tone: "green",
    },
    {
      id: "completed",
      icon: "completed",
      value: "—",
      label: "Batches Completed",
      tone: "orange",
    },
    {
      id: "upcoming",
      icon: "repeat",
      value: stats.upcoming,
      label: "Upcoming",
      tone: "purple",
    },
  ];

  return (
    <div className={"batch-management-batch-list-content"}>
      <div className={"batch-management-batch-list-page-header"}>
        <div>
          <h1 className={"batch-management-batch-list-title"}>Batch List</h1>
          <p className={"batch-management-batch-list-subtitle"}>
            {stats.totalBatches} batches running across — courses
          </p>
        </div>
        <Button variant="primary" onClick={onCreateBatch}>
          + Create batch
        </Button>
      </div>

      <div className={"batch-management-batch-list-stats-grid"}>
        {statCards.map((stat) => (
          <StatCard
            key={stat.id}
            icon={STAT_ICONS[stat.icon]}
            value={stat.value}
            label={stat.label}
            tone={stat.tone}
          />
        ))}
      </div>

      <div className={"batch-management-batch-list-filter-bar"}>
        <div className={"batch-management-batch-list-search-field"}>
          <label className={"batch-management-batch-list-filter-label"}>
            SEARCH
          </label>
          <div className={"batch-management-batch-list-search-input-wrap"}>
            <Search
              size={16}
              className={"batch-management-batch-list-search-icon"}
            />
            <input
              type="text"
              placeholder="Search by batch name & code"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className={"batch-management-batch-list-search-input"}
            />
          </div>
        </div>

        <Dropdown
          label="COURSES"
          options={courseNameOptions}
          value={selectedCourseName}
          onChange={handleCourseChange}
        />
        <Dropdown
          label="STATUS"
          options={batchStatusOptions}
          value={status}
          onChange={(val) => {
            setStatus(val);
            setCurrentPage(1);
          }}
        />

        <div className={"batch-management-batch-list-apply-wrap"}>
          <Button
            variant="outline"
            icon={Filter}
            onClick={() => {
              setCurrentPage(1);
              loadBatches();
            }}
          >
            Apply Filter
          </Button>
        </div>
      </div>

      <section className={"batch-management-batch-list-table-section"}>
        <div className={"batch-management-batch-list-table-header"}>
          <h2 className={"batch-management-batch-list-table-title"}>
            All Batches
          </h2>
        </div>

        {error && (
          <p style={{ color: "#dc2626", padding: "12px 0" }}>{error}</p>
        )}

        {loading ? (
          <p style={{ padding: "24px 0" }}>Loading batches…</p>
        ) : (
          <BatchTable batches={batches} onView={setSelectedBatch} />
        )}

        <Pagination
          showing={batches.length}
          total={pagination.totalRecords}
          currentPage={pagination.currentPage || currentPage}
          totalPages={pagination.totalPages || 1}
          onPageChange={setCurrentPage}
        />
      </section>

      {selectedBatch && (
        <ViewBatchModal
          batch={selectedBatch}
          onClose={() => setSelectedBatch(null)}
        />
      )}
    </div>
  );
};
export default BatchList;
