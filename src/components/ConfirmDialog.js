function ConfirmDialog({ isOpen, title, message, confirmText = '确认', cancelText = '取消', onConfirm, onCancel }) {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className="confirm-dialog">
        <div className="confirm-dialog__header">
          <h3>{title || '确认操作'}</h3>
        </div>
        <div className="confirm-dialog__body">
          <p>{message || '确定要执行此操作吗？'}</p>
        </div>
        <div className="confirm-dialog__footer">
          <button
            type="button"
            className="confirm-dialog__button confirm-dialog__button--cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="confirm-dialog__button confirm-dialog__button--confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;

