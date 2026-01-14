import React, { ReactElement, useEffect, useRef, useMemo, useCallback, memo } from "react";

type Props = {
  open: boolean;
  handleClose: () => void;
  header?: ReactElement;
  body: ReactElement;
  footer?: ReactElement;
};

const CustomModal = memo(({
  handleClose,
  open,
  header = <></>,
  body = <></>,
  footer = <></>,
}: Props) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") handleClose();
  }, [handleClose]);

  const handleBackdropClick = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleContentClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", handleKeyDown);
    const id = window.setTimeout(() => dialogRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(id);
    };
  }, [open, handleKeyDown]);

  const modalContent = useMemo(() => {
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
        <div className="absolute inset-0 bg-black/60" onClick={handleBackdropClick} />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div
            ref={dialogRef}
            tabIndex={-1}
            className="w-full max-w-md rounded-md bg-white p-4 shadow-2xl outline-none"
            onClick={handleContentClick}
          >
            <div className="relative">
              {header}
              <button
                type="button"
                className="absolute right-3 top-2 inline-flex h-8 w-8 items-center justify-center rounded hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                onClick={handleClose}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="max-h-[90vh] overflow-y-auto rounded-md">{body}</div>
            {footer}
          </div>
        </div>
      </div>
    );
  }, [open, header, body, footer, handleBackdropClick, handleContentClick, handleClose]);

  return modalContent;
});

CustomModal.displayName = 'CustomModal';

export default CustomModal;
