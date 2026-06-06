import { X } from 'lucide-react';

const EditModal = ({ onClose, children, closeEditModal }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Soft blurred background */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" onClick={onClose} />
      {/* EditModal content */}
      <div className="relative mx-4 w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        {/* Close button */}
        <button
          onClick={closeEditModal}
          className="absolute top-4 right-4 z-10 rounded-full bg-white p-2 text-gray-700 transition hover:bg-gray-200 hover:text-gray-900"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        {/* Body */}
        <div className="p-6">{children} </div>
      </div>
    </div>
  );
};

export default EditModal;
