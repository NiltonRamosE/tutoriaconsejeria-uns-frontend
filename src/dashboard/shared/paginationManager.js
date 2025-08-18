export function createPagination(idPrefix, itemsPerPage = 5) {
  let currentPage = 1;
  let totalItems = 0;

  const el = (suffix) => document.getElementById(`${idPrefix}-${suffix}`);
  const safe = (suffix, fn) => { const n = el(suffix); if (n) fn(n); };

  function showPagination() {
    safe('paginationContainer', (c) => c.style.display = 'flex');
  }
  function hiddenPagination() {
    safe('paginationContainer', (c) => c.style.display = 'none');
  }

  function getPaginationIndex(dataLength) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, dataLength);
    return { startIndex, endIndex };
  }

  function calculateVisibleElements(data) {
    const { startIndex, endIndex } = getPaginationIndex(data.length);
    return data.slice(startIndex, endIndex);
  }

  function updateIndicators(dataLength) {
    const { startIndex, endIndex } = getPaginationIndex(dataLength);
    safe('currentPageStart', (n) => n.textContent = startIndex + 1);
    safe('currentPageEnd',   (n) => n.textContent = endIndex);
    totalItems = dataLength;
    safe('totalItems',       (n) => n.textContent = dataLength);
  }

  function setupPagination(loadData) {
    // Evita listeners duplicados: primero limpia
    ['prevPage','nextPage','prevPageMobile','nextPageMobile'].forEach(id => {
      const node = el(id);
      if (!node) return;
      const clone = node.cloneNode(true);
      node.parentNode.replaceChild(clone, node);
    });

    safe('prevPage',        (n) => n.addEventListener('click', () => goToPreviousPage(loadData)));
    safe('nextPage',        (n) => n.addEventListener('click', () => goToNextPage(loadData)));
    safe('prevPageMobile',  (n) => n.addEventListener('click', () => goToPreviousPage(loadData)));
    safe('nextPageMobile',  (n) => n.addEventListener('click', () => goToNextPage(loadData)));
  }

  function updatePaginationControls(loadData, count) {
    const totalPages = Math.ceil(count / itemsPerPage);

    safe('pageNumbers', (container) => {
      container.innerHTML = '';
      if (totalPages <= 1) return;

      let startPage = Math.max(1, currentPage - 2);
      let endPage   = Math.min(totalPages, currentPage + 2);
      if (currentPage <= 3) endPage = Math.min(5, totalPages);
      else if (currentPage >= totalPages - 2) startPage = Math.max(totalPages - 4, 1);

      if (startPage > 1) {
        const first = document.createElement('button');
        first.textContent = '1';
        first.className = 'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50';
        first.addEventListener('click', () => goToPage(1, loadData));
        container.appendChild(first);
        if (startPage > 2) {
          const dot = document.createElement('span');
          dot.textContent = '...';
          dot.className = 'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700';
          container.appendChild(dot);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.textContent = i.toString();
        btn.className = `relative inline-flex items/items-center px-4 py-2 border text-sm font-medium ${
          i === currentPage ? 'z-10 bg-theme-keppel border-theme-keppel text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`;
        btn.addEventListener('click', () => goToPage(i, loadData));
        container.appendChild(btn);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          const dot = document.createElement('span');
          dot.textContent = '...';
          dot.className = 'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700';
          container.appendChild(dot);
        }
        const last = document.createElement('button');
        last.textContent = totalPages.toString();
        last.className = 'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50';
        last.addEventListener('click', () => goToPage(totalPages, loadData));
        container.appendChild(last);
      }
    });

    // habilita/deshabilita
    safe('prevPage',       (n) => n.disabled = currentPage === 1);
    safe('nextPage',       (n) => n.disabled = currentPage === totalPages || totalPages === 0);
    safe('prevPageMobile', (n) => n.disabled = currentPage === 1);
    safe('nextPageMobile', (n) => n.disabled = currentPage === totalPages || totalPages === 0);
  }

  function goToPreviousPage(loadData) {
    if (currentPage > 1) goToPage(currentPage - 1, loadData);
  }
  function goToNextPage(loadData) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < totalPages) goToPage(currentPage + 1, loadData);
  }
  function goToPage(page, loadData) {
    currentPage = page;
    loadData();
  }

  return {
    showPagination,
    hiddenPagination,
    calculateVisibleElements,
    updateIndicators,
    setupPagination,
    updatePaginationControls,
  };
}
