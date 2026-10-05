import { Navigate, Route, Routes } from "react-router-dom";
import SuperAdminLayout from "../components/superadminpage/layout/SuperAdminLayout/SuperAdminLayout";
import Dashboard from "../components/superadminpage/pages/Oversight/Dashboard/Dashboard/Dashboard";
import Centres from "../components/superadminpage/pages/Oversight/Centres/Centres/Centres";
import Admins from "../components/superadminpage/pages/Oversight/Admins/Admins/Admins";
import Reports from "../components/superadminpage/pages/Insights/Reports/Reports/Reports";

export default function SuperAdminDashboard() {
  return (
    <Routes>
      <Route element={<SuperAdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="centres" element={<Centres />} />
        <Route path="admins" element={<Admins />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}
