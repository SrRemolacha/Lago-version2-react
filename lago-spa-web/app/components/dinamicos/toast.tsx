'use client';

import { useEffect } from 'react';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
  duration?: number;
};

export default function Toast({
  message,
  type = 'info',
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgClass =
    type === 'success'
      ? 'bg-success'
      : type === 'error'
      ? 'bg-danger'
      : 'bg-primary';

  return (
    <div
      className={`toast show position-fixed top-0 end-0 m-4 text-white ${bgClass}`}
      style={{ zIndex: 9999, minWidth: 280 }}
    >
      <div className="toast-body d-flex justify-content-between align-items-center">
        <span>{message}</span>
        <button
          type="button"
          className="btn-close btn-close-white ms-3"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}