import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/Button/Button";
import UsersTable from "../UsersTable/UsersTable";
import { fetchAdminUsers } from "../../../../../api/admin/adminUsersService";
import "../TotalUsers/TotalUsers.css";

const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  totalResults: 0,
};

const formatRole = (role) => {
  if (!role) return "Unknown";
  return String(role).charAt(0).toUpperCase() + String(role).slice(1);
};

const normalizeUsers = (users = []) =>
  users.map((user) => ({
    id: user.user_id || user.id,
    userId: user.user_id || user.id,
    name:
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.name ||
      "Unknown User",
    email: user.email || user.user_email || "",
    mobile: user.mobile || user.contact_number || "",
    roleLabel: formatRole(user.role || user.user_role),
    status: "inactive",
    lastLogin: user.last_login || "—",
  }));

const DeactivatedUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchAdminUsers({
        status: "inactive",
        page,
        limit: 10,
      });
      const serverUsers = response?.users ?? [];
      const responsePagination = response?.pagination ?? {};
      const totalResults =
        responsePagination.inactiveUsers ??
        responsePagination.totalUsers ??
        responsePagination.totalRecords ??
        serverUsers.length;

      setUsers(normalizeUsers(serverUsers));
      setPagination({
        currentPage: Number(responsePagination.page ?? page),
        totalPages: Number(responsePagination.totalPages ?? 1),
        pageSize: Number(responsePagination.limit ?? 10),
        totalResults: Number(totalResults),
      });
    } catch (err) {
      console.error("Unable to load deactivated users:", err);
      setError("Unable to load deactivated users right now.");
      setUsers([]);
      setPagination(DEFAULT_PAGINATION);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="admin-total-users">
      <Button
        icon={ArrowLeft}
        shape="pill"
        onClick={() => navigate("/admin/total-users")}
      >
        Back
      </Button>

      <div className="admin-total-users__heading">
        <div>
          <h1 className="admin-total-users__title">Deactivated Accounts</h1>
          <p className="admin-total-users__subtitle">
            View and manage deactivated accounts across all user types
          </p>
        </div>
      </div>

      {error && <div className="admin-users-table__error">{error}</div>}

      <UsersTable
        users={users}
        pagination={{ ...pagination, currentPage: page }}
        onPageChange={setPage}
        showAddUser={false}
      />

      {loading && (
        <div className="admin-users-table__loading">Loading users...</div>
      )}
    </div>
  );
};

export default DeactivatedUsers;
