import { Routes, Route, Navigate } from "react-router-dom";
import SuperAdminLayout from "../components/superadminpage/layout/SuperAdminLayout";
import Dashboard from "../components/superadminpage/Dashboard/Dashboard/Dashboard";

export default function SuperAdminDashboard() {
    return(
        <Routes>
            <Route element={<SuperAdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    );
}