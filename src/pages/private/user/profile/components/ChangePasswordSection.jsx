export default function ChangePasswordSection({
  inputClassName,
  currentPassword,
  newPassword,
  confirmPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[#f2f2f2] bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900"
    >
      <h2 className="text-[16px] font-semibold text-[#181818] dark:text-white">Change Password</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            Current Password
          </label>
          <input
            type="password"
            className={inputClassName}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            New Password
          </label>
          <input
            type="password"
            className={inputClassName}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            Confirm Password
          </label>
          <input
            type="password"
            className={inputClassName}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-[#8022fe] px-4 py-2 text-[13px] font-semibold text-white transition hover:opacity-90"
        >
          Change Password
        </button>
      </div>
    </form>
  );
}
