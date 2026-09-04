import API from "../api";

const DEFAULT_LIMIT = 10;

export async function fetchAdminUsers({
  search = "",
  role = "all",
  status = "all",
  page = 1,
  limit = DEFAULT_LIMIT,
} = {}) {
  const params = { page, limit };

  if (search?.trim()) params.search = search.trim();
  if (role && role !== "all") params.role = role;
  if (status && status !== "all") params.status = status;

  const response = await API.get("/admin/total-users", { params });

  return (
    response?.data?.data ?? {
      users: [],
      pagination: { page, limit, activeUsers: 0, totalPages: 1 },
    }
  );
}

export async function fetchDeactivatedUsers({
  page = 1,
  limit = DEFAULT_LIMIT,
} = {}) {
  const response = await API.get("/admin/total-users/deactivated", {
    params: { page, limit },
  });

  return (
    response?.data?.data ?? {
      users: [],
      pagination: { page, limit, totalUsers: 0, totalPages: 1 },
    }
  );
}

export async function updateAdminUserApproval(userId, isActive) {
  const response = await API.patch(`/admin/total-users/${userId}/approval`, {
    is_active: isActive,
  });

  return response?.data?.data;
}

const normalizeFilterOptionValue = (value) => {
  if (value === null || value === undefined) return "";

  const normalized = String(value).trim();
  if (!normalized) return "";

  return normalized.toLowerCase().replace(/[_\s-]+/g, "");
};

const normalizeFilterOptions = (items = []) => {
  if (!Array.isArray(items)) return [];

  const seen = new Set();

  return items
    .map((item) => {
      const value =
        item?.value ?? item?.id ?? item?.role ?? item?.status ?? item?.name;
      const label =
        item?.label ?? item?.name ?? item?.value ?? item?.role ?? item?.status;

      if (value === undefined || value === null || value === "") return null;

      const normalizedValue = normalizeFilterOptionValue(value);
      if (!normalizedValue || seen.has(normalizedValue)) return null;

      seen.add(normalizedValue);

      return {
        value: normalizedValue,
        label: String(label || value),
      };
    })
    .filter(Boolean);
};

export async function fetchAdminUserFilterOptions() {
  try {
    const response = await fetchAdminUsers({ page: 1, limit: 1000 });
    const users = Array.isArray(response?.users) ? response.users : [];

    const roleValues = [
      ...new Set(
        users.map((user) => user?.role ?? user?.user_role).filter(Boolean),
      ),
    ];
    const statusValues = [
      ...new Set(
        users
          .map((user) => user?.status ?? user?.is_active)
          .filter(
            (value) => value !== undefined && value !== null && value !== "",
          ),
      ),
    ];

    const roles = normalizeFilterOptions(
      roleValues.map((value) => ({ value, label: String(value) })),
    );

    const statuses = normalizeFilterOptions(
      statusValues.map((value) => ({
        value: value === true || value === "active" ? "active" : "inactive",
        label: value === true || value === "active" ? "Active" : "Inactive",
      })),
    );

    return {
      roles: roles.length
        ? [{ value: "all", label: "All roles" }, ...roles]
        : [{ value: "all", label: "All roles" }],
      statuses: statuses.length
        ? [{ value: "all", label: "All statuses" }, ...statuses]
        : [{ value: "all", label: "All statuses" }],
    };
  } catch (err) {
    console.warn(
      "Unable to load Total Users filter options from backend:",
      err,
    );
    return {
      roles: [{ value: "all", label: "All roles" }],
      statuses: [{ value: "all", label: "All statuses" }],
    };
  }
}

export async function fetchUserProfile(userId) {
  if (!userId) {
    throw new Error("User id is required.");
  }

  const response = await API.get(`/admin/total-users/${userId}/view-profile`);

  return response?.data?.data ?? null;
}
