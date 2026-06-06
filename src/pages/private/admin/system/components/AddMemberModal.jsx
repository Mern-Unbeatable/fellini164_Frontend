
import { X, ChevronDown } from 'lucide-react';

const AddMemberModal = ({ open, onClose, onSave }) => {
  if (!open) return null;

  const handleSave = () => {

    onSave();

    onClose();
  };


  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      {/* Modal Container */}
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Add Team Member</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          {/* Full Name Field */}
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Jane Doe"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-600 placeholder-gray-400"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="jane@elyxa.ai"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-600 placeholder-gray-400"
            />
          </div>

          {/* Role Field */}
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">
              Role
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-500 appearance-none bg-white transition-all duration-200 ease-out"
                defaultValue="Support"
              >
                <option>Support</option>
                <option>Super Admin</option>
                <option>Developer</option>
                <option>Content</option>
                <option>Finance</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronDown size={20} className="text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 pb-8 pt-2 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-10 py-2.5 border border-gray-800 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg font-medium transition-colors"
          >
            Add Member
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddMemberModal;