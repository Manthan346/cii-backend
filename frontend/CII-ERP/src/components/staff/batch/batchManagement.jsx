import Sidebar from "../reusableComp/staffSideBar";
import Topbar from "../reusableComp/staffTopBar";
import { StatGrid } from "../../candidatepage/shared/StatCard/StatCard";
import "../batch/batchManagement.css"
const STAT_META = [
  { key: 'totalBatches', icon: 'attendance', iconBg: '#E6EEF8', iconColor: '#2F6FB0', label: 'Total Batches', suffix: '' },
  { key: 'activeBatches', icon: 'checkCircle', iconBg: '#E4F6EC', iconColor: '#1B8A4F', label: 'Active', suffix: '' },
  { key: 'endingBatches', icon: 'xCircle', iconBg: '#FBE8E4', iconColor: '#D8432B', label: 'Ending Soon', suffix: '' },
  { key: 'upcomingBatches', icon: 'clock', iconBg: '#FCEFD9', iconColor: '#B8892A', label: 'Upcoming', suffix: '' },
];

export default function BatchManagement(){

  const summary = {
   totalBatches:9,
   activeBatches:6,
   endingBatches:2,
   upcomingBatches:1
  };
  const stats = STAT_META.map(meta => ({
  icon: meta.icon,
  iconBg: meta.iconBg,
  iconColor: meta.iconColor,
  label: meta.label,
  value: `${summary[meta.key]}${meta.suffix}`,
}));
   
    return (
    <div className="batch-management">
        <Topbar />
      <div className="batch-layout">
        <Sidebar />
      <main className="batch-management-main">
        
        <div className = "batch-management__body">
          
            <div className = "batch-management__heading">
              <h1>Batch List</h1>
              <p className="para">9 batches running across 4 courses</p>
            </div>
            <div className = "batch-management__stats">
              
              <StatGrid stats={stats}/>
            </div>
           
            <div className="batch-management__filters-card">
            <div className="batch-management__filters">
            <div className="batch-management__filter-item">
              <input
                type="text"
                placeholder="Search batch..."
                className="batch-management__search"
              />
            </div>

            

            <div className="batch-management__filter-item">
              <select className="batch-management__select">
                <option>All Courses</option>
              </select>
            </div>

            <div className="batch-management__filter-item">
              <select className="batch-management__select">
                <option>All Status</option>
              </select>
            </div>

            <div className="batch-management__filter-item">
              <button className="batch-management__filter-btn">
                Apply Filter
              </button>
            </div>
          </div>
          </div>
            <div className="batch-management__table">

              <div className="batch-management__table-header">

                <h2 className="batch-management__table-title">
                  All Batches
                </h2>

                <div className="batch-management__table-actions">

                  <button className="batch-management__icon-btn">
                    Download
                  </button>

                  <button className="batch-management__icon-btn">
                    Print
                  </button>

                </div>

              </div>

              <table className="batch-management__table-content">

                <thead>
                  <tr>
                    <th>Batch</th>
                    <th>Trainer</th>
                    <th>Course</th>
                    <th>Candidates</th>
                    <th>Start Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                  {/* Rows will come here */}
                  <td>DS-24</td>
                  <td>Rohit Mehta</td>
                  <td>Data Science</td>
                  <td>32</td>
                  <td>12 Jan 2026</td>
                  <td>
                    <span className="status-pill status-pill--active">
                      Active
                    </span>
                  </td>
                  <td>View</td>
                  </tr>
                  <tr>
                  {/* Rows will come here */}
                  <td>DS-24</td>
                  <td>Rohit Mehta</td>
                  <td>Data Science</td>
                  <td>32</td>
                  <td>12 Jan 2026</td>
                  <td>
                    <span className="status-pill status-pill--upcoming">
                      Upcoming
                    </span>
                  </td>
                  <td>View</td>
                  </tr>
                  <tr>
                  {/* Rows will come here */}
                  <td>DS-24</td>
                  <td>Rohit Mehta</td>
                  <td>Data Science</td>
                  <td>32</td>
                  <td>12 Jan 2026</td>
                  
                  <td>
                    <span className="status-pill status-pill--completed">
                      Completed
                    </span>
                  </td>
                  <td>View</td>
                  </tr>

                </tbody>

              </table>
            <div className="batch-management__pagination">
                <div className="batch-management__pagination-info">
                    Showing 1 to 10 of 95 entries
                </div>

                <div className="batch-management__pagination-controls">

                    <button className="batch-management__page-btn">
                        Previous
                    </button>

                    <button className="batch-management__page-number batch-management__page-number--active">
                        1
                    </button>

                    <button className="batch-management__page-number">
                        2
                    </button>

                    <button className="batch-management__page-number">
                        3
                    </button>

                    <button className="batch-management__page-btn">
                        Next
                    </button>

                </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
    );
}