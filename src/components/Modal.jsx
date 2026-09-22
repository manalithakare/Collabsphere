import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div
          className={`relative transform overflow-hidden rounded-3xl bg-[#0B0B12]/95 backdrop-blur-2xl text-left shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_-5px_rgba(124,58,237,0.25)] transition-all w-full ${maxWidth} my-8 border border-white/10 text-white animate-in zoom-in-95 fade-in duration-200`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle top ambient glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-32 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 relative z-10">
            <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 max-h-[80vh] overflow-y-auto relative z-10">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
