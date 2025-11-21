import { useState } from 'react';

function CategoryManager({
  isOpen,
  categories,
  newCategoryName,
  onNewCategoryNameChange,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onClose,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingError, setEditingError] = useState('');

  if (!isOpen) {
    return null;
  }

  const resetEditingState = () => {
    setEditingId(null);
    setEditingName('');
    setEditingError('');
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
      resetEditingState();
    }
  };

  const startEditing = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setEditingError('');
  };

  const cancelEditing = () => {
    resetEditingState();
  };

  const submitEditing = () => {
    if (!editingId) return;
    const trimmed = editingName.trim();
    if (!trimmed) {
      setEditingError('分类名称不能为空');
      return;
    }
    const success = onEditCategory(editingId, trimmed);
    if (!success) {
      setEditingError('分类名称已存在或无效');
      return;
    }
    resetEditingState();
  };

  const handleDelete = (id) => {
    if (
      window.confirm('删除后使用该分类的待办会显示为“未分类”，确认删除？')
    ) {
      onDeleteCategory(id);
      if (editingId === id) {
        resetEditingState();
      }
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
          onClick={() => {
            onClose();
            resetEditingState();
          }}
        >
          ×
        </button>
        <section className="category-manager">
          <header className="category-manager__header">
            <h3>分类管理</h3>
            <p>新增、重命名或删除分类，方便组织你的待办事项。</p>
          </header>

          <div className="category-list">
            {categories.length === 0 ? (
              <p className="category-empty">暂无分类，先创建一个吧。</p>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className={`category-row ${
                    editingId === category.id ? 'editing' : ''
                  }`}
                >
                  {editingId === category.id ? (
                    <>
                      <input
                        className="category-edit-input"
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                      />
                      <div className="category-row-actions">
                        <button type="button" onClick={submitEditing}>
                          保存
                        </button>
                        <button type="button" onClick={cancelEditing}>
                          取消
                        </button>
                      </div>
                      {editingError && (
                        <span className="category-error">{editingError}</span>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="category-pill">{category.name}</span>
                      <div className="category-row-actions">
                        <button
                          type="button"
                          className="link-button"
                          onClick={() => startEditing(category)}
                        >
                          编辑
                        </button>
                        <button
                          type="button"
                          className="danger-link"
                          onClick={() => handleDelete(category.id)}
                        >
                          删除
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
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

