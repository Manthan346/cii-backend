import api from "../api";

const STATUS_LABEL_TO_IS_SHOW = {
  Published: "true",
  Draft: "false",
};

function isAllStatusOption(value) {
  return !value || value.toLowerCase().startsWith("all status");
}

function isAllBatchOption(value) {
  return !value || value.toLowerCase().startsWith("all batch");
}

export async function fetchStudyMaterials({
  page = 1,
  limit = 10,
  search,
  batchId,
  status,
} = {}) {
  const params = { page, limit };

  if (search && search.trim()) params.search = search.trim();
  if (batchId && !isAllBatchOption(batchId)) params.batch_id = batchId;

  if (!isAllStatusOption(status)) {
    const isShow = STATUS_LABEL_TO_IS_SHOW[status];
    if (isShow !== undefined) params.is_show = isShow;
  }

  const res = await api.get("/instructor/study-material/get-all-material", {
    params,
  });
  return res.data.data;
}

export async function fetchStudyMaterialStats() {
  const [all, published, draft] = await Promise.all([
    fetchStudyMaterials({ page: 1, limit: 1 }),
    fetchStudyMaterials({ page: 1, limit: 1, status: "Published" }),
    fetchStudyMaterials({ page: 1, limit: 1, status: "Draft" }),
  ]);

  return {
    totalMaterials: all.totalRecords,
    published: published.totalRecords,
    draft: draft.totalRecords,
  };
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
    status: item.is_show ? "Published" : "Draft",
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
  isShow,
}) {
  const payload = { study_material_id: studyMaterialId };
  if (title !== undefined) payload.title = title;
  if (description !== undefined) payload.description = description;
  if (documentLink !== undefined) payload.document_link = documentLink;
  if (isShow !== undefined) payload.is_show = isShow;

  const res = await api.patch(
    "/instructor/study-material/update-material",
    payload,
  );
  return res.data.data;
}
