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
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  if (!isOpen) {
    return null;
  }

  const resetInlineState = () => {
    setEditingId(null);
    setEditingName('');
    setEditingError('');
    setPendingDeleteId(null);
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
      resetInlineState();
    }
  };

  const startEditing = (category) => {
    setPendingDeleteId(null);
    setEditingId(category.id);
    setEditingName(category.name);
    setEditingError('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
    setEditingError('');
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
    setEditingId(null);
    setEditingName('');
    setEditingError('');
  };

  const requestDelete = (id) => {
    setPendingDeleteId(id);
    if (editingId === id) {
      setEditingId(null);
      setEditingName('');
      setEditingError('');
    }
  };

  const cancelDeleteRequest = () => {
    setPendingDeleteId(null);
  };

  const confirmDelete = (id) => {
    onDeleteCategory(id);
    setPendingDeleteId(null);
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
            resetInlineState();
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
                  ) : pendingDeleteId === category.id ? (
                    <div className="category-delete-confirm">
                      <p>
                        删除后，所有属于「{category.name}」的待办都会标记为“未分类”。
                        确认继续吗？
                      </p>
                      <div className="category-row-actions">
                        <button
                          type="button"
                          className="danger-link"
                          onClick={() => confirmDelete(category.id)}
                        >
                          确认删除
                        </button>
                        <button
                          type="button"
                          className="link-button"
                          onClick={cancelDeleteRequest}
                        >
                          取消
                        </button>
                      </div>
                    </div>
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
                          onClick={() => requestDelete(category.id)}
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

