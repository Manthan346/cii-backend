import API from "../../api/api"; // adjust the relative path to wherever api.js actually lives

// UI tab id -> backend `category` query param.
// "Finance" is intentionally omitted: the backend's CATEGORY_MAP has no
// finance/system group, so category=finance would 400. Add it here once
// the backend supports it.
const CATEGORY_PARAM = {
  All: undefined,
  Job: "job",
  Examination: "examination",
  Academics: "academics",
};

/**
 * Fetch one page of notifications.
 * @param {string} tabId - one of the keys in CATEGORY_PARAM
 * @param {string|undefined} cursor - user_notification_id of the last item on the previous page
 */
export async function fetchNotifications(tabId = "All", cursor) {
  const category = CATEGORY_PARAM[tabId];
  const params = {};
  if (category) params.category = category;
  if (cursor) params.cursor = cursor;
  params.limit = 20;

  const { data } = await API.get("/candidate/get-all-notifications", {
    params,
  });

  // The backend returns a wrapped payload like { statusCode, data, message }.
  // Support both wrapped and direct responses so the UI works with either format.
  return data?.data ?? data;
}
