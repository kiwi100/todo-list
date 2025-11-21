import { useEffect, useMemo, useState } from 'react';
import './App.css';
import TodoItem from './components/TodoItem';
import {
  DEFAULT_PRIORITY,
  PRIORITY_OPTIONS,
  PRIORITY_RANK,
} from './constants';
import {
  loadSortMode,
  loadTodos,
  saveSortMode,
  saveTodos,
} from './storage';

function App() {
  const [todos, setTodos] = useState(() => loadTodos());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(DEFAULT_PRIORITY);
  // time-desc | time-asc | priority-desc | priority-asc
  const [sortMode, setSortMode] = useState(() => loadSortMode('time-desc'));

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  useEffect(() => {
    saveSortMode(sortMode);
  }, [sortMode]);

  const handleAddTodo = (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      return;
    }

    const newTodo = {
      id: Date.now(),
      title: trimmedTitle,
      description: trimmedDescription,
      completed: false,
      priority,
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
          <button type="submit">添加待办</button>
        </form>

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

        <section className="todo-list">
          {sortedTodos.length === 0 ? (
            <p className="empty-hint">暂无待办，开始添加吧！</p>
          ) : (
            sortedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
