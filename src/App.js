import { useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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
    };

    setTodos((prev) => [newTodo, ...prev]);
    setTitle('');
    setDescription('');
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
          <button type="submit">添加待办</button>
        </form>

        <section className="todo-list">
          {todos.length === 0 ? (
            <p className="empty-hint">暂无待办，开始添加吧！</p>
          ) : (
            todos.map((todo) => (
              <article
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
              >
                <div className="todo-content">
                  <h2>{todo.title}</h2>
                  {todo.description && <p>{todo.description}</p>}
                </div>
                <div className="todo-actions">
                  <button
                    type="button"
                    className="toggle"
                    onClick={() => toggleTodo(todo.id)}
                  >
                    {todo.completed ? '标记未完成' : '标记完成'}
                  </button>
                  <button
                    type="button"
                    className="delete"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    删除
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
