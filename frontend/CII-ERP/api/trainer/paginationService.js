export async function fetchPaginatedPage({
  fetchPage,
  page,
  limit,
  itemsKey,
  totalKeys = ["totalRecords", "totalCandidates"],
}) {
  const firstPage = await fetchPage(1);
  const pagination = firstPage.pagination ?? {};
  const firstItems = firstPage[itemsKey] ?? [];
  const reportedPageSize = Number(pagination.limit);
  const total = totalKeys.reduce((value, key) => {
    if (value !== undefined && value !== null) return value;
    return pagination[key] ?? firstPage[key];
  }, undefined);
  const totalItems = Number(total ?? firstItems.length);
  const serverPageSize =
    firstItems.length > 0 && firstItems.length < limit && firstItems.length < totalItems
      ? firstItems.length
      : reportedPageSize || firstItems.length || limit;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const withPagination = (data, items) => ({
    ...data,
    [itemsKey]: items,
    pagination: {
      ...data.pagination,
      currentPage: page,
      totalRecords: totalItems,
      totalPages,
      limit,
    },
  });

  if (serverPageSize >= limit) {
    const data = page === 1 ? firstPage : await fetchPage(page);
    return withPagination(data, data[itemsKey] ?? []);
  }

  const startIndex = (page - 1) * limit;
  const firstServerPage = Math.floor(startIndex / serverPageSize) + 1;
  const offsetInFirstPage = startIndex % serverPageSize;
  const serverTotalPages =
    Math.ceil(totalItems / serverPageSize) ||
    Number(pagination.totalPages) ||
    1;
  const items = [];

  for (
    let serverPage = firstServerPage;
    serverPage <= serverTotalPages && items.length < offsetInFirstPage + limit;
    serverPage += 1
  ) {
    const data = serverPage === 1 ? firstPage : await fetchPage(serverPage);
    items.push(...(data[itemsKey] ?? []));
  }

  return withPagination(
    firstPage,
    items.slice(offsetInFirstPage, offsetInFirstPage + limit),
  );
}
