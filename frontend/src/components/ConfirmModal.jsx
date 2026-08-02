import { createPortal } from "react-dom";
import { Check, X } from "lucide-react";
import "./ConfirmModal.css";

export default function ConfirmModal({
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="confirm-actions">
          <button className="cancel-btn icon-btn" onClick={onCancel}>
            <X size={15} strokeWidth={2.4} />
            {cancelText}
          </button>

          <button className="confirm-btn icon-btn" onClick={onConfirm}>
            <Check size={15} strokeWidth={2.6} />
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}