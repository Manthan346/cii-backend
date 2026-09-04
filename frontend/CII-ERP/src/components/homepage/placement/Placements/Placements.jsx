import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../header/Header";
import Navbar from "../../navbar/Navbar";
import Footer from "../../footer/Footer";
import styles from "./Placements.module.css";
import JobCard from "../JobCard/JobCard.jsx";
import ApplyModal from "../ApplyModal/ApplyModal.jsx";
import { ChevronDownIcon } from "../icons.jsx";
import { getPublicJobPostings } from "../../../../../api/homepage/placementPageService.js";

const PAGE_SIZE = 40;

const FILTERS = [
  {
    key: "title",
    label: "Job Role",
    getOptions: (list) => unique(list.map((job) => job.title)),
  },
  {
    key: "location",
    label: "Location",
    getOptions: (list) => unique(list.map((job) => job.location)),
  },
  {
    key: "workMode",
    label: "Work Mode",
    getOptions: (list) => unique(list.map((job) => job.workMode)),
  },
  {
    key: "sector",
    label: "Sector",
    getOptions: (list) => unique(list.map((job) => job.sector)),
  },
];

function unique(values) {
  return Array.from(new Set(values));
}

function FilterSelect({ label, options, value, onChange }) {
  return (
    <div className={styles.filterPill}>
      <select
        className={styles.filterSelect}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDownIcon className={styles.filterChevron} />
    </div>
  );
}

export default function Placements() {
  const navigate = useNavigate();
  const [filterValues, setFilterValues] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [applyJob, setApplyJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadJobs() {
      setLoading(true);
      setError("");
      try {
        const result = await getPublicJobPostings({ limit: PAGE_SIZE });
        if (active) {
          setJobs(result.jobs);
          setNextCursor(result.pagination.nextCursor);
          setHasNextPage(result.pagination.hasNextPage);
        }
      } catch {
        if (active) setError("Unable to load job openings right now.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadJobs();
    return () => {
      active = false;
    };
  }, []);

  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) =>
        FILTERS.every(({ key }) => {
          const wanted = appliedFilters[key];
          return !wanted || job[key] === wanted;
        }),
      ),
    [jobs, appliedFilters],
  );
  const visibleJobs = filteredJobs.slice(0, visibleCount);

  const handleApplyFilters = () => {
    setAppliedFilters(filterValues);
    setVisibleCount(PAGE_SIZE);
  };

  const handleNextPage = async () => {
    if (!nextCursor || pageLoading) return;

    setPageLoading(true);
    setError("");
    try {
      const result = await getPublicJobPostings({
        limit: PAGE_SIZE,
        cursor: nextCursor,
      });
      setJobs(result.jobs);
      setNextCursor(result.pagination.nextCursor);
      setHasNextPage(result.pagination.hasNextPage);
      setCurrentPage((page) => page + 1);
      setVisibleCount(PAGE_SIZE);
      setAppliedFilters({});
      setFilterValues({});
    } catch {
      setError("Unable to load the next page of job openings.");
    } finally {
      setPageLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <Navbar />

      <main className={styles.page}>
        <div className={styles.filterBar}>
          {FILTERS.map((filter) => (
            <FilterSelect
              key={filter.key}
              label={filter.label}
              options={filter.getOptions(jobs)}
              value={filterValues[filter.key] || ""}
              onChange={(value) =>
                setFilterValues((previous) => ({
                  ...previous,
                  [filter.key]: value,
                }))
              }
            />
          ))}
          <button
            type="button"
            className={styles.applyFilterBtn}
            onClick={handleApplyFilters}
          >
            Apply Filter
          </button>
        </div>

        {loading ? (
          <div className={styles.emptyState}>Loading job openings...</div>
        ) : error ? (
          <div className={styles.emptyState}>{error}</div>
        ) : filteredJobs.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No openings match those filters right now.</p>
            <button
              type="button"
              className={styles.applyFilterBtn}
              onClick={() => {
                setFilterValues({});
                setAppliedFilters({});
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className={styles.gridWrap}>
            <div className={styles.grid}>
              {visibleJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSeeDetails={(j) => navigate(`/placements/${j.id}`)}
                  onApply={(j) => setApplyJob(j)}
                />
              ))}
            </div>

            {(hasNextPage || currentPage > 1) && (
              <div className={styles.loadMoreWrap}>
                <div className={styles.loadMoreFade} />
                {hasNextPage && (
                  <button
                    type="button"
                    className={styles.loadMoreBtn}
                    onClick={handleNextPage}
                    disabled={pageLoading}
                  >
                    {pageLoading ? "Loading..." : "Next Page"}
                  </button>
                )}
                <span>Page {currentPage}</span>
              </div>
            )}
          </div>
        )}

        {applyJob && (
          <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />
        )}
      </main>

      <Footer />
    </div>
  );
}
