import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function PasswordField({ label, value, onChange, placeholder, inputClassName }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          className={`${inputClassName} pr-11`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-[#c2c2c2] transition-colors hover:text-[#8022fe]"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

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
      <div className="mt-4 flex flex-col gap-4">
        <PasswordField
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          inputClassName={inputClassName}
        />
        <PasswordField
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          inputClassName={inputClassName}
        />
        <PasswordField
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          inputClassName={inputClassName}
        />
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
