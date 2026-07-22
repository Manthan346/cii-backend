import React, { useState } from "react";
import { UserRound, CheckCircle2, Clock, Phone } from "lucide-react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import { FilterBar, Pagination, Button } from "../../../shared";
import StatCard from "../StatCard/StatCard";
import CandidateTable from "../CandidateTable/CandidateTable";
import { candidateStats } from "../../../data/stats";
import { candidates } from "../../../data/candidates";
import { batchOptions, courseOptions, statusOptions } from "../../../data/filterOptions";
import "../../../styles/variables.css";
import styles from "./CandidateManagement.module.css";

/**
 * CandidateManagement
 *
 * Staff "Candidate List" page. Mounts the shared Topbar + Sidebar shell
 * (identical composition to every other staff page) around the
 * candidate-list-specific content: stat cards, filter bar, candidate
 * table, and pagination footer.
 */
const STAT_ICONS = {
  user: UserRound,
  check: CheckCircle2,
  clock: Clock,
  phone: Phone,
};

const TOTAL_CANDIDATES = 128;
const TOTAL_BATCHES = 6;
const TOTAL_PAGES = 22;

const CandidateManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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
            <div className={styles.content}>
              <div className={styles.pageHeader}>
                <h1 className={styles.title}>Candidate List</h1>
                <p className={styles.subtitle}>
                  {TOTAL_CANDIDATES} candidate across {TOTAL_BATCHES} batches
                </p>
              </div>

              <div className={styles.statsGrid}>
                {candidateStats.map((stat) => (
                  <StatCard
                    key={stat.id}
                    icon={STAT_ICONS[stat.icon]}
                    value={stat.value}
                    label={stat.label}
                    tone={stat.tone}
                  />
                ))}
              </div>

              <FilterBar
                batchOptions={batchOptions}
                courseOptions={courseOptions}
                statusOptions={statusOptions}
              />

              <section className={styles.tableSection}>
                <div className={styles.tableHeader}>
                  <h2 className={styles.tableTitle}>All Candidates</h2>
                  <div className={styles.tableActions}>
                    <Button variant="primary">Add Candidate</Button>
                    <Button variant="outline">Export CSV</Button>
                    <Button variant="outline">Export Excel</Button>
                  </div>
                </div>

                <CandidateTable candidates={candidates} />

                <Pagination
                  showing={candidates.length}
                  total={TOTAL_CANDIDATES}
                  currentPage={1}
                  totalPages={TOTAL_PAGES}
                />
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CandidateManagement;
