import { X, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

const WaitlistModal = ({
  isOpen,
  onClose,
  email,
  setEmail,
  firstName,
  setFirstName,
  loading,
  handleSubmit,
}) => {
  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    handleSubmit(e);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-scale-in relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 transition-colors hover:bg-gray-100"
          type="button"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-600"></span>
            </span>
            Limited Early Access
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Join the Waitlist</h2>
          <p className="text-gray-600">Be the first to experience Elyxa</p>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label
              htmlFor="modal-firstName"
              className="mb-2 block text-left text-sm font-semibold text-gray-700"
            >
              First Name <span className="font-normal text-gray-400">(Optional)</span>
            </label>
            <input
              id="modal-firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Alex"
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="modal-email"
              className="mb-2 block text-left text-sm font-semibold text-gray-700"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                id="modal-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full rounded-xl border-2 border-gray-200 py-3 pr-4 pl-12 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                <span>Joining...</span>
              </div>
            ) : (
              <>
                Join the Waitlist
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Limited spots • Invitations sent gradually
          </p>
        </form>
      </div>
    </div>
  );
};

export default WaitlistModal;
