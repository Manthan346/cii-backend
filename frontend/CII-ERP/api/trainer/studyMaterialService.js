import api from "../api";
import { fetchPaginatedPage } from "./paginationService";

function isAllBatchOption(value) {
  return !value || value.toLowerCase().startsWith("all batch");
}

function getLocalDateKey(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function fetchStudyMaterials({
  page = 1,
  limit = 15,
  search,
  batchId,
  dateFrom,
  dateTo,
} = {}) {
  const params = { limit };

  if (search && search.trim()) params.search = search.trim();
  if (batchId && !isAllBatchOption(batchId)) params.batch_id = batchId;

  const fetchPage = async (requestPage) => {
    const res = await api.get("/instructor/study-material/get-all-material", {
      params: { ...params, page: requestPage },
    });
    return res.data.data;
  };

  if (!dateFrom && !dateTo) {
    return fetchPaginatedPage({
      fetchPage,
      page,
      limit,
      itemsKey: "studyMaterials",
    });
  }

  const firstPage = await fetchPage(1);
  const firstMaterials = firstPage.studyMaterials ?? [];
  const pagination = firstPage.pagination ?? {};
  const totalRecords = Number(
    pagination.totalRecords ??
      pagination.totalStudyMaterials ??
      pagination.total ??
      firstPage.totalRecords ??
      firstPage.totalStudyMaterials ??
      firstMaterials.length,
  );
  const reportedPageSize = Number(pagination.limit);
  const serverPageSize =
    firstMaterials.length > 0 && firstMaterials.length < totalRecords
      ? Math.min(reportedPageSize || firstMaterials.length, firstMaterials.length)
      : reportedPageSize || firstMaterials.length || limit;
  const serverTotalPages =
    Math.ceil(totalRecords / serverPageSize) ||
    Number(pagination.totalPages) ||
    1;
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(0, serverTotalPages - 1) }, (_, index) =>
      fetchPage(index + 2),
    ),
  );
  const allMaterials = [
    ...firstMaterials,
    ...remainingPages.flatMap((result) => result.studyMaterials ?? []),
  ];
  const matchingMaterials = allMaterials.filter((material) => {
    const createdDate = getLocalDateKey(material.created_at);
    return (
      createdDate &&
      (!dateFrom || createdDate >= dateFrom) &&
      (!dateTo || createdDate <= dateTo)
    );
  });
  const startIndex = (page - 1) * limit;
  const filteredTotal = matchingMaterials.length;
  const filteredTotalPages = Math.max(1, Math.ceil(filteredTotal / limit));

  return {
    ...firstPage,
    totalRecords: filteredTotal,
    totalPages: filteredTotalPages,
    studyMaterials: matchingMaterials.slice(startIndex, startIndex + limit),
    pagination: {
      ...pagination,
      currentPage: page,
      totalRecords: filteredTotal,
      totalPages: filteredTotalPages,
      limit,
    },
  };
}

export async function fetchStudyMaterialFilterOptions() {
  const batchResponse = await api.get(
    "/instructor/get-all-courses-and-batches",
  );

  const rawBatches = batchResponse.data.data?.batches ?? [];
  const batches = rawBatches
    .map((batch) => ({
      label: batch.batch_code ?? batch.batch_name,
      value: batch.batch_id ?? batch.batchId ?? batch.id,
    }))
    .filter((batch) => batch.label && batch.value);
  return { batches: [{ label: "All Batches", value: "" }, ...batches] };
}

export function mapStudyMaterialRecord(item) {
  return {
    id: item.study_material_id ?? item.id,
    name: item.title ?? "Untitled material",
    batch: item.batch_details?.batch_code ?? "-",
    description: item.description ?? "",
    link: item.document_link ?? item.documentLink ?? "",
    uploadedBy: item.uploaded_by ?? "-",
    date: item.created_at
      ? new Date(item.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-",
  };
}

export async function createStudyMaterial({
  batchId,
  title,
  description,
  documentLink,
}) {
  const res = await api.post("/instructor/study-material/create-material", {
    batch_id: batchId,
    title,
    description,
    document_link: documentLink,
  });
  return res.data.data;
}

export async function updateStudyMaterial({
  studyMaterialId,
  title,
  description,
  documentLink,
}) {
  const payload = { study_material_id: studyMaterialId };
  if (title !== undefined) payload.title = title;
  if (description !== undefined) payload.description = description;
  if (documentLink !== undefined) payload.document_link = documentLink;

  const res = await api.patch(
    "/instructor/study-material/update-material",
    payload,
  );
  return res.data.data;
}
