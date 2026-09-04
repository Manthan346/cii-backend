import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FileDown, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/Button/Button";
import UsersOverview from "../UsersOverview/UsersOverview";
import UsersFilterBar from "../UsersFilterBar/UsersFilterBar";
import UsersTable from "../UsersTable/UsersTable";
import AddUserModal from "../AddUserModal/AddUserModal";
import {
  userStats,
  userRoleOptions,
  userStatusOptions,
} from "../../data/totalUsersData";
import {
  fetchAdminUsers,
  fetchAdminUserFilterOptions,
} from "../../../../../api/admin/adminUsersService";
import "./TotalUsers.css";

const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  totalResults: 0,
};

const formatUserRole = (role) => {
  if (!role) return "Unknown";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const getFirstDefined = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const normalizeRoleValue = (value) => {
  if (!value) return "";

  const normalized = String(value).trim().toLowerCase();
  const compact = normalized.replace(/[_\s-]+/g, "");

  if (["candidate", "candidates"].includes(compact)) return "candidate";
  if (["trainer", "trainers", "instructor", "instructors"].includes(compact))
    return "trainer";
  if (["mobilizer", "mobilizers"].includes(compact)) return "mobilizer";
  if (["hr", "hrs", "recruiter", "recruiters"].includes(compact)) return "hr";
  if (["admin", "admins"].includes(compact)) return "admin";

  return compact;
};

const collectDetailObject = (profile = {}) => {
  const role = getFirstDefined(profile.user_role, profile.role);

  if (role) {
    const directKey = `${role}_details`;
    if (profile[directKey] && typeof profile[directKey] === "object") {
      return profile[directKey];
    }
  }

  const detailKeys = Object.keys(profile).filter(
    (key) =>
      key.endsWith("_details") &&
      typeof profile[key] === "object" &&
      profile[key] !== null,
  );

  for (const key of detailKeys) {
    const value = profile[key];
    if (value && Object.keys(value).length) {
      return value;
    }
  }

  return {};
};

const extractNameFromProfile = (profile = {}) => {
  const detailObject = collectDetailObject(profile);
  const nameParts = [
    detailObject?.admin_first_name,
    detailObject?.admin_last_name,
    detailObject?.candidate_first_name,
    detailObject?.candidate_last_name,
    detailObject?.hr_first_name,
    detailObject?.hr_last_name,
    detailObject?.instructor_first_name,
    detailObject?.instructor_last_name,
    detailObject?.mobilizer_first_name,
    detailObject?.mobilizer_last_name,
    profile?.first_name,
    profile?.last_name,
    profile?.name,
  ].filter(Boolean);

  if (nameParts.length) {
    return nameParts.join(" ");
  }

  const email = getFirstDefined(
    profile.user_email,
    profile.email,
    profile?.user?.user_email,
  );
  return email || "User profile";
};

const normalizeUsers = (payload = []) =>
  payload.map((user) => {
    const role = normalizeRoleValue(user.role || user.user_role || "unknown");
    const name =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.name ||
      "Unknown User";

    return {
      id: user.user_id || user.id,
      userId: user.user_id || user.id,
      name,
      email: user.email || user.user_email || "",
      mobile: user.mobile || user.contact_number || "",
      role,
      roleLabel: formatUserRole(role),
      status: user.is_active === false ? "inactive" : "active",
      lastLogin: user.last_login || "—",
    };
  });

const TotalUsers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roleOptions, setRoleOptions] = useState(userRoleOptions);
  const [statusOptions, setStatusOptions] = useState(userStatusOptions);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await fetchAdminUserFilterOptions();

        if (response?.roles?.length) {
          setRoleOptions(response.roles);
        }

        if (response?.statuses?.length) {
          setStatusOptions(response.statuses);
        }
      } catch (err) {
        console.warn("Failed to load admin user filter options:", err);
      }
    };

    loadFilterOptions();
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchAdminUsers({
        search,
        role,
        status,
        page,
        limit: 10,
      });
      const serverUsers = response?.users ?? [];
      const totalResults =
        response?.pagination?.activeUsers ?? serverUsers.length ?? 0;
      const totalPages = response?.pagination?.totalPages ?? 1;
      const limit = response?.pagination?.limit ?? 10;

      setUsers(normalizeUsers(serverUsers));
      setPagination({
        currentPage: Number(response?.pagination?.page ?? page),
        totalPages: Number(totalPages),
        pageSize: Number(limit),
        totalResults: Number(totalResults),
      });
    } catch (err) {
      console.error("Unable to load admin users:", err);
      setError("Unable to load users right now.");
      setUsers([]);
      setPagination(DEFAULT_PAGINATION);
    } finally {
      setLoading(false);
    }
  }, [search, role, status, page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers, refreshTick]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      const matchesRole =
        role === "all" ||
        normalizeRoleValue(user.role) === normalizeRoleValue(role);
      const matchesStatus = status === "all" || user.status === status;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, role, status, users]);

  const handleApplyFilters = () => {
    setPage(1);
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sel) => sel !== id) : [...prev, id],
    );
  };

  const handleToggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === filteredUsers.length
        ? []
        : filteredUsers.map((u) => u.id),
    );
  };

  const handleAddUser = () => {
    setIsAddUserOpen(true);
  };

  const handleUserCreated = () => {
    // Refresh the table so the newly created / enrolled user shows up.
    setPage(1);
    setRefreshTick((tick) => tick + 1);
  };

  const handleViewUser = (userId) => {
    if (!userId) return;
    navigate(`/admin/total-users/${userId}`);
  };

  const handleExport = () => {
    console.log("export users");
  };

  const handleViewDeactivated = () => {
    navigate("/admin/total-users/deactivated-accounts");
  };

  return (
    <div className="admin-total-users">
      <div className="admin-total-users__heading">
        <div>
          <h1 className="admin-total-users__title">Total users</h1>
          <p className="admin-total-users__subtitle">
            Manage every user across the platform .{" "}
            {pagination.totalResults.toLocaleString()} total
          </p>
        </div>
        <div className="admin-total-users__heading-actions">
          <Button variant="danger" icon={Lock} onClick={handleViewDeactivated}>
            Deactivated Account
          </Button>
          <Button icon={FileDown} onClick={handleExport}>
            Export As
          </Button>
        </div>
      </div>

      <UsersOverview stats={userStats} />

      <UsersFilterBar
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        status={status}
        onStatusChange={setStatus}
        roleOptions={roleOptions}
        statusOptions={statusOptions}
        onApply={handleApplyFilters}
      />

      {error && <div className="admin-users-table__error">{error}</div>}

      <UsersTable
        users={filteredUsers}
        pagination={{ ...pagination, currentPage: page }}
        onPageChange={setPage}
        onAddUser={handleAddUser}
        onViewUser={handleViewUser}
        onRowMenu={(id) => console.log("menu", id)}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
      />

      {loading && (
        <div className="admin-users-table__loading">Loading users...</div>
      )}

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onUserCreated={handleUserCreated}
        defaultRole="candidate"
      />
    </div>
  );
};

export default TotalUsers;
