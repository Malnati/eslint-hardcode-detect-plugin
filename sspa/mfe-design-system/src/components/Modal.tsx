// sspa/mfe-design-system/src/components/Modal.tsx
import type { ReactNode } from 'react';

type ModalProps = {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children: ReactNode;
};

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="ds-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="ds-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Modal'}
        onClick={(event) => event.stopPropagation()}
      >
        {title ? <h2 className="ds-modal-title">{title}</h2> : null}
        <div className="ds-modal-content">{children}</div>
      </div>
    </div>
  );
}
