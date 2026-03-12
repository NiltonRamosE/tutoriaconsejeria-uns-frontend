export interface PaginationManager {
  showPagination: () => void;
  hiddenPagination: () => void;
  calculateVisibleElements: <T>(data: T[]) => T[];
  updateIndicators: (dataLength: number) => void;
  setupPagination: (loadData: () => void) => void;
  updatePaginationControls: (loadData: () => void, count: number) => void;
}

export function createPagination(
  idPrefix: string, 
  itemsPerPage: number = 5
): PaginationManager {
  let currentPage: number = 1;
  let totalItems: number = 0;

  // Función auxiliar para obtener elementos por ID
  const el = (suffix: string): HTMLElement | null => 
    document.getElementById(`${idPrefix}-${suffix}`);

  // Función auxiliar segura para manipular elementos
  const safe = (suffix: string, fn: (element: HTMLElement) => void): void => {
    const element = el(suffix);
    if (element) fn(element);
  };

  function showPagination(): void {
    safe('paginationContainer', (c) => c.style.display = 'flex');
  }

  function hiddenPagination(): void {
    safe('paginationContainer', (c) => c.style.display = 'none');
  }

  function getPaginationIndex(dataLength: number): { startIndex: number; endIndex: number } {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, dataLength);
    return { startIndex, endIndex };
  }

  function calculateVisibleElements<T>(data: T[]): T[] {
    const { startIndex, endIndex } = getPaginationIndex(data.length);
    return data.slice(startIndex, endIndex);
  }

  function updateIndicators(dataLength: number): void {
    const { startIndex, endIndex } = getPaginationIndex(dataLength);
    safe('currentPageStart', (n) => n.textContent = String(startIndex + 1));
    safe('currentPageEnd', (n) => n.textContent = String(endIndex));
    totalItems = dataLength;
    safe('totalItems', (n) => n.textContent = String(dataLength));
  }

  function setupPagination(loadData: () => void): void {
    // Evita listeners duplicados: primero limpia
    const ids = ['prevPage', 'nextPage', 'prevPageMobile', 'nextPageMobile'] as const;
    
    ids.forEach(id => {
      const node = el(id);
      if (!node) return;
      const clone = node.cloneNode(true);
      node.parentNode?.replaceChild(clone, node);
    });

    safe('prevPage', (n) => n.addEventListener('click', () => goToPreviousPage(loadData)));
    safe('nextPage', (n) => n.addEventListener('click', () => goToNextPage(loadData)));
    safe('prevPageMobile', (n) => n.addEventListener('click', () => goToPreviousPage(loadData)));
    safe('nextPageMobile', (n) => n.addEventListener('click', () => goToNextPage(loadData)));
  }

  function updatePaginationControls(loadData: () => void, count: number): void {
    const totalPages = Math.ceil(count / itemsPerPage);

    safe('pageNumbers', (container) => {
      container.innerHTML = '';
      if (totalPages <= 1) return;

      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        endPage = Math.min(5, totalPages);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(totalPages - 4, 1);
      }

      // Botón primera página si es necesario
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

      // Páginas centrales
      for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.textContent = i.toString();
        btn.className = `relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
          i === currentPage 
            ? 'z-10 bg-theme-keppel border-theme-keppel text-white' 
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`;
        btn.addEventListener('click', () => goToPage(i, loadData));
        container.appendChild(btn);
      }

      // Botón última página si es necesario
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

    // Habilita/deshabilita botones de navegación
    safe('prevPage', (n) => {
      (n as HTMLButtonElement).disabled = currentPage === 1;
    });
    safe('nextPage', (n) => {
      (n as HTMLButtonElement).disabled = currentPage === totalPages || totalPages === 0;
    });
    safe('prevPageMobile', (n) => {
      (n as HTMLButtonElement).disabled = currentPage === 1;
    });
    safe('nextPageMobile', (n) => {
      (n as HTMLButtonElement).disabled = currentPage === totalPages || totalPages === 0;
    });
  }

  function goToPreviousPage(loadData: () => void): void {
    if (currentPage > 1) goToPage(currentPage - 1, loadData);
  }

  function goToNextPage(loadData: () => void): void {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < totalPages) goToPage(currentPage + 1, loadData);
  }

  function goToPage(page: number, loadData: () => void): void {
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