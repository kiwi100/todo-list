function CategoryManager({
  isOpen,
  categories,
  newCategoryName,
  onNewCategoryNameChange,
  onAddCategory,
  onClose,
}) {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className="modal-shell">
        <button
          type="button"
          className="modal-close"
          aria-label="关闭分类弹窗"
          onClick={onClose}
        >
          ×
        </button>
        <section className="category-manager">
          <header className="category-manager__header">
            <h3>分类管理</h3>
            <p>使用默认分类或添加自定义分类，方便快速筛选待办事项。</p>
          </header>

          <div className="category-chips">
            {categories.map((category) => (
              <span key={category.id} className="category-pill">
                {category.name}
              </span>
            ))}
          </div>

          <form className="category-form" onSubmit={onAddCategory}>
            <label>
              新分类名称
              <input
                type="text"
                placeholder="例如：家庭、健身..."
                value={newCategoryName}
                onChange={(event) => onNewCategoryNameChange(event.target.value)}
              />
            </label>
            <button type="submit">新增分类</button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default CategoryManager;

