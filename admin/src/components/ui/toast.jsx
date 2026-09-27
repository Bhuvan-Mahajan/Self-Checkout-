import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const ToastContext = React.createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = React.useCallback(({ title, description, variant = 'default', duration = 3000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'flex items-start justify-between rounded-xl border p-4 shadow-md transition-all animate-in slide-in-from-bottom-5',
              toast.variant === 'destructive'
                ? 'border-red-300 bg-red-50 text-red-900'
                : toast.variant === 'success'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                : 'border-brand-200 bg-brand-100 text-text-primary'
            )}
          >
            <div>
              {toast.title && <div className="font-semibold text-sm">{toast.title}</div>}
              {toast.description && (
                <div className="text-xs text-text-secondary mt-1">{toast.description}</div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-muted hover:text-text-primary ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return {
    toast: context.addToast,
    dismiss: context.removeToast,
  };
};
