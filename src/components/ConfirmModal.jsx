export default function ConfirmModal({ title, message, confirmLabel = 'Eliminar', loading, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-outline btn-sm" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button className="btn btn-danger btn-sm" onClick={onConfirm} disabled={loading}>
            {loading ? 'Eliminando…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
