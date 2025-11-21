import { useEffect, useMemo, useState } from 'react';
import './App.css';
import TodoItem from './components/TodoItem';
import {
  DEFAULT_PRIORITY,
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORY_ID,
  PRIORITY_OPTIONS,
  PRIORITY_RANK,
} from './constants';
import CategoryManager from './components/CategoryManager';
import {
  loadCategories,
  loadSortMode,
  loadTodos,
  saveCategories,
  saveSortMode,
  saveTodos,
} from './storage';

const ADD_CATEGORY_OPTION_VALUE = '__add_category__';

function App() {
  const [todos, setTodos] = useState(() => loadTodos());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(DEFAULT_PRIORITY);
  const [categories, setCategories] = useState(() =>
    loadCategories(DEFAULT_CATEGORIES),
  );
  const [categoryId, setCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  // time-desc | time-asc | priority-desc | priority-asc
  const [sortMode, setSortMode] = useState(() => loadSortMode('time-desc'));

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  useEffect(() => {
    saveSortMode(sortMode);
  }, [sortMode]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].id ?? DEFAULT_CATEGORY_ID);
    }
  }, [categories, categoryId]);

  const handleCategorySelectChange = (event) => {
    const value = event.target.value;
    if (value === ADD_CATEGORY_OPTION_VALUE) {
      setCategoryModalOpen(true);
      return;
    }
    setCategoryId(value);
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
  };

  const handleAddTodo = (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !categoryId) {
      return;
    }

    const newTodo = {
      id: Date.now(),
      title: trimmedTitle,
      description: trimmedDescription,
      completed: false,
      priority,
      categoryId,
    };

    setTodos((prev) => [newTodo, ...prev]);
    setTitle('');
    setDescription('');
    setPriority(DEFAULT_PRIORITY);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleSortModeChange = (event) => {
    const nextMode = event.target.value;
    setSortMode(nextMode);
  };

  const categoryMap = useMemo(() => {
    return categories.reduce((result, category) => {
      result[category.id] = category.name;
      return result;
    }, {});
  }, [categories]);

  const handleAddCategory = (event) => {
    event.preventDefault();
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      return;
    }

    if (categories.some((category) => category.name === trimmedName)) {
      setNewCategoryName('');
      return;
    }

    const newCategory = {
      id: `cat-${Date.now()}`,
      name: trimmedName,
    };

    setCategories((prev) => [...prev, newCategory]);
    // 默认不变
    setCategoryId((current) => (current ? current : newCategory.id));
    setNewCategoryName('');
  };

  const handleRenameCategory = (id, nextName) => {
    const trimmed = nextName.trim();
    if (!trimmed) {
      return false;
    }

    const duplicate = categories.some(
      (category) =>
        category.id !== id &&
        category.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );

    if (duplicate) {
      return false;
    }

    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, name: trimmed } : category,
      ),
    );
    return true;
  };

  const handleDeleteCategory = (id) => {
    setCategories((prevCategories) => {
      const updatedCategories = prevCategories.filter(
        (category) => category.id !== id,
      );
      const fallbackId = updatedCategories[0]?.id ?? '';

      setCategoryId((current) => (current === id ? fallbackId : current));
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.categoryId === id ? { ...todo, categoryId: fallbackId } : todo,
        ),
      );

      return updatedCategories;
    });
  };

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      switch (sortMode) {
        case 'time-asc':
          // 时间：旧 → 新
          return a.id - b.id;
        case 'priority-desc': {
          // 优先级：高 → 低（高优先，高在前；相同优先级按时间新 → 旧）
          const priorityDiff =
            PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
          if (priorityDiff !== 0) return priorityDiff;
          return b.id - a.id;
        }
        case 'priority-asc': {
          // 优先级：低 → 高（低优先，低在前；相同优先级按时间新 → 旧）
          const priorityDiff =
            PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
          if (priorityDiff !== 0) return priorityDiff;
          return b.id - a.id;
        }
        case 'time-desc':
        default:
          // 时间：新 → 旧（默认）
          return b.id - a.id;
      }
    });
  }, [todos, sortMode]);

  return (
    <div className="app-shell">
      <div className="todo-card">
        <h1>我的待办清单</h1>
        <div className="todo-layout">
          <section className="panel details-panel">
            <div className="panel-header">
              <h2>添加事项</h2>
              <p>填写事项信息并保存到右侧列表。</p>
            </div>
            <form onSubmit={handleAddTodo} className="todo-form">
              <label>
                标题 *
                <input
                  type="text"
                  placeholder="输入待办标题"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </label>
              <label>
                描述
                <textarea
                  placeholder="可选：描述你的待办事项"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                />
              </label>
              <label>
                优先级 *
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                分类 *
                <select
                  value={categoryId}
                  onChange={handleCategorySelectChange}
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                  <option value={ADD_CATEGORY_OPTION_VALUE}>+ 新增分类...</option>
                </select>
              </label>
              <button type="submit">添加待办</button>
            </form>
          </section>

          <section className="panel list-panel">
            <div className="panel-header list-header">
              <h2>待办列表</h2>
              <div className="sort-toolbar">
                <label>
                  排序
                  <select
                    value={sortMode}
                    onChange={handleSortModeChange}
                  >
                    <option value="time-desc">时间：新 → 旧（默认）</option>
                    <option value="time-asc">时间：旧 → 新</option>
                    <option value="priority-desc">优先级：高 → 低</option>
                    <option value="priority-asc">优先级：低 → 高</option>
                  </select>
                </label>
              </div>
            </div>

            <section className="todo-list">
              {sortedTodos.length === 0 ? (
                <p className="empty-hint">暂无待办，开始添加吧！</p>
              ) : (
                sortedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    categoryLabel={categoryMap[todo.categoryId]}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                ))
              )}
            </section>
          </section>
        </div>
      </div>
      <CategoryManager
        isOpen={isCategoryModalOpen}
        categories={categories}
        newCategoryName={newCategoryName}
        onNewCategoryNameChange={setNewCategoryName}
        onAddCategory={handleAddCategory}
        onEditCategory={handleRenameCategory}
        onDeleteCategory={handleDeleteCategory}
        onClose={closeCategoryModal}
      />
    </div>
  );
}

export default App;
