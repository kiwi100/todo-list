import { PRIORITY_LABEL } from '../constants';

const formatDueDate = (value) => {
  if (!value) {
    return '无截止时间';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '无截止时间';
  }
  return date.toLocaleString();
};

function TodoItem({ todo, categoryLabel, onToggle, onDelete, isRemoving }) {
  const now = Date.now();
  let expired = false;
  if (todo.dueDate && !todo.completed) {
    const due = new Date(todo.dueDate).getTime();
    expired = !Number.isNaN(due) && due < now;
  }
  return (
    <article
      className={`todo-item${todo.completed ? ' completed' : ''}${expired ? ' expired' : ''}${isRemoving ? ' removing' : ''}`}
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
        <p className="todo-meta">
          截止：<span>{formatDueDate(todo.dueDate)}</span>
        </p>
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

