import "../reusableCompstyles/staffSideBar.css";
import {
  LayoutGrid,
  Users,
  Layers3,
  Calendar,
  Boxes,
  Upload,
  BarChart3,
  Briefcase,
} from "lucide-react";
export default function Sidebar() {
  return (
    <aside className="staffSidebar">

    <nav className="staffSidebar__nav">

        <div className="staffSidebar__section">
            <h3 className="staffSidebar__heading">WORKSPACE</h3>

            <ul className="staffSideBar__list">
               <li className="staffSidebar__item staffSidebar__item--active">
                    <LayoutGrid size={18} />
                    <span>Dashboard</span>
                </li>

                <li className="staffSidebar__item">
                    <Users size={18} />
                    <span>Candidate Management</span>
                </li>

                <li className="staffSidebar__item">
                    <Layers3 size={18} />
                    <span>Batch Management</span>
                </li>

                <li className="staffSidebar__item">
                    <Calendar size={18} />
                    <span>Attendance Management</span>
                </li>
            </ul>
        </div>

        <div className="staffSidebar__section">
            <h3 className="staffSidebar__heading">RESOURCES</h3>

            <ul className="staffSideBar__list" style={{ paddingLeft: 0, margin: 0, listStyle: "none" }}>
               <li className="staffSidebar__item">
                    <Boxes size={18} />
                    <span>Resources</span>
                </li>

                <li className="staffSidebar__item">
                    <Upload size={18} />
                    <span>Study Material Upload</span>
                </li>

                <li className="staffSidebar__item">
                    <BarChart3 size={18} />
                    <span>Reports</span>
                </li>
            </ul>
        </div>

        <div className="staffSidebar__section">
            <h3 className="staffSidebar__heading">WORK</h3>

            <ul className="staffSideBar__list">
                <li className="staffSidebar__item">
                    <Briefcase size={18} />
                    <span>Work</span>
                </li>
            </ul>
        </div>

    </nav>

</aside>
  );
}