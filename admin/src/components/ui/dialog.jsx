import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const DialogContext = React.createContext({
  open: false,
  setOpen: () => {},
});

const Dialog = ({ children, open, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <DialogContext.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ children, asChild, ...props }) => {
  const { setOpen } = React.useContext(DialogContext);
  return (
    <div onClick={() => setOpen(true)} className="inline-block cursor-pointer" {...props}>
      {children}
    </div>
  );
};

const DialogPortal = ({ children }) => {
  const { open } = React.useContext(DialogContext);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center">{children}</div>;
};

const DialogOverlay = ({ className, ...props }) => {
  const { setOpen } = React.useContext(DialogContext);
  return (
    <div
      onClick={() => setOpen(false)}
      className={cn(
        'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in-0',
        className
      )}
      {...props}
    />
  );
};

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(DialogContext);
  if (!open) return null;

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        ref={ref}
        className={cn(
          'fixed z-50 grid w-full max-w-lg gap-4 border border-brand-200 bg-brand-50 p-6 shadow-lg duration-200 sm:rounded-2xl',
          className
        )}
        {...props}
      >
        {children}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4 text-text-secondary" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </DialogPortal>
  );
});
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight text-text-primary', className)}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-text-secondary', className)} {...props} />
));
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
