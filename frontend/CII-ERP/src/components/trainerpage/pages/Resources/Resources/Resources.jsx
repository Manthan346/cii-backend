import React, { useState } from 'react';
import {
  LayoutGrid,
  CheckCircle2,
  Hourglass,
  CalendarDays,
  Layers,
  BarChart3,
  Bookmark,
  Search,
  Filter,
  Download,
  Printer,
  Upload,
} from 'lucide-react';
import Sidebar from '../../../layout/Sidebar/Sidebar';
import Topbar from '../../../layout/Topbar/Topbar';
import { Dropdown, Button, Pagination } from '../../../shared';
import StatCard from '../StatCard/StatCard';
import QuickAccessCard from '../QuickAccessCard/QuickAccessCard';
import ResourceTable from '../ResourceTable/ResourceTable';
import {
  resourceStats,
  quickAccessCards,
  resourceCategoryOptions,
  resourceTypeOptions,
  resourceMeta,
  resourceRecords,
} from '../../../data/resourcesData';
import '../../../styles/variables.css';
import './Resources.css';
import './Resources.css';

/**
 * Resources
 *
 * Staff "Resources" page. Mounts the shared Topbar + Sidebar shell
 * (identical composition to every other staff page) around the
 * resources-specific content: summary stat cards, the three quick-
 * access shortcut tiles, a Search/Category/Type filter bar, the
 * "All Task" resource table, and a pagination footer - matches the
 * reference "Resources" screen.
 */
const STAT_ICONS = {
  grid: LayoutGrid,
  check: CheckCircle2,
  hourglass: Hourglass,
  calendar: CalendarDays,
};
const QUICK_ACCESS_ICONS = {
  layers: Layers,
  chart: BarChart3,
  bookmark: Bookmark,
};
const QUICK_ACCESS_TONES = {
  'study-material': 'teal',
  reports: 'mint',
  guidelines: 'mint',
};
const Resources = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(resourceCategoryOptions[0]);
  const [type, setType] = useState(resourceTypeOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div className="staff-dashboard">
      <Topbar
        user={{
          name: 'Staff Admin',
        }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        onSearch={setSearchValue}
      />

      <div className="staff-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
            <div className={'resources-content'}>
              <div className={'resources-page-header'}>
                <div>
                  <h1 className={'resources-title'}>Resources</h1>
                  <p className={'resources-subtitle'}>
                    Study material, reports, and shared documents in one place
                  </p>
                </div>
                <Button variant="primary" icon={Upload} iconPosition="left">
                  Upload Material
                </Button>
              </div>

              <div className={'resources-stats-grid'}>
                {resourceStats.map((stat) => (
                  <StatCard
                    key={stat.id}
                    icon={STAT_ICONS[stat.icon]}
                    value={stat.value}
                    label={stat.label}
                    tone={stat.tone}
                  />
                ))}
              </div>

              <div className={'resources-quick-access-grid'}>
                {quickAccessCards.map((card) => (
                  <QuickAccessCard
                    key={card.id}
                    icon={QUICK_ACCESS_ICONS[card.icon]}
                    title={card.title}
                    subtitle={card.subtitle}
                    tone={QUICK_ACCESS_TONES[card.id]}
                  />
                ))}
              </div>

              <div className={'resources-filter-bar'}>
                <div className={'resources-search-field'}>
                  <label className={'resources-filter-label'}>SEARCH</label>
                  <div className={'resources-search-input-wrap'}>
                    <Search size={16} className={'resources-search-icon'} />
                    <input
                      type="text"
                      placeholder="Search by name or course"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      className={'resources-search-input'}
                    />
                  </div>
                </div>

                <Dropdown
                  label="CATEGORY"
                  options={resourceCategoryOptions}
                  value={category}
                  onChange={setCategory}
                />
                <Dropdown
                  label="TYPE"
                  options={resourceTypeOptions}
                  value={type}
                  onChange={setType}
                />

                <div className={'resources-apply-wrap'}>
                  <Button variant="outline" icon={Filter}>
                    Apply Filter
                  </Button>
                </div>
              </div>

              <section className={'resources-table-section'}>
                <div className={'resources-table-header'}>
                  <h2 className={'resources-table-title'}>All Task</h2>
                  <div className={'resources-table-actions'}>
                    <button
                      type="button"
                      className={'resources-icon-btn'}
                      aria-label="Download list"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      type="button"
                      className={'resources-icon-btn'}
                      aria-label="Print list"
                    >
                      <Printer size={16} />
                    </button>
                  </div>
                </div>

                <ResourceTable records={resourceRecords} />

                <Pagination
                  showing={resourceRecords.length}
                  total={resourceMeta.totalResources}
                  currentPage={currentPage}
                  totalPages={resourceMeta.totalPages}
                  onPageChange={setCurrentPage}
                  label={`Showing 1-${resourceRecords.length} out of ${resourceMeta.totalResources}`}
                />
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
export default Resources;
