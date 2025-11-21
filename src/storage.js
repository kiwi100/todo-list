const TODOS_STORAGE_KEY = 'todo-list-items';
const SORT_MODE_STORAGE_KEY = 'todo-list-sort-mode';

function isStorageAvailable() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    const testKey = '__test_storage__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function loadTodos() {
  if (!isStorageAvailable()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(TODOS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos) {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    window.localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // ignore write errors
  }
}

export function loadSortMode(defaultValue = 'time-desc') {
  if (!isStorageAvailable()) {
    return defaultValue;
  }

  try {
    return window.localStorage.getItem(SORT_MODE_STORAGE_KEY) || defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveSortMode(mode) {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    window.localStorage.setItem(SORT_MODE_STORAGE_KEY, mode);
  } catch {
    // ignore write errors
  }
}


