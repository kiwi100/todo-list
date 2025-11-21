import { PRIORITY_LABEL } from '../constants';

function TodoItem({ todo, categoryLabel, onToggle, onDelete }) {
  return (
    <article
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
      data-priority={todo.priority}
    >
      <div className="todo-content">
        <div className="todo-headline">
          <h2>{todo.title}</h2>
          <span className={`priority-chip priority-${todo.priority}`}>
            {PRIORITY_LABEL[todo.priority] ?? '未知'}
          </span>
          <span className="category-pill category-pill--outlined">
            {categoryLabel || '未分类'}
          </span>
        </div>
        {todo.description && <p>{todo.description}</p>}
      </div>
      <div className="todo-actions">
        <button
          type="button"
          className="toggle"
          onClick={() => onToggle(todo.id)}
        >
          {todo.completed ? '标记未完成' : '标记完成'}
        </button>
        <button type="button" className="delete" onClick={() => onDelete(todo.id)}>
          删除
        </button>
      </div>
    </article>
  );
}

export default TodoItem;

