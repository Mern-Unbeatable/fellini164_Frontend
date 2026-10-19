import { useState } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import SettingsCard from './SettingsCard';

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
  id,
  inputClassName,
  currentPassword,
  newPassword,
  confirmPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  saving = false,
  onSubmit,
}) {
  return (
    <SettingsCard
      as="form"
      id={id}
      onSubmit={onSubmit}
      icon={ShieldCheck}
      title="Password & Security"
      description="Update your password to keep your account secure"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
        <PasswordField
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          inputClassName={inputClassName}
        />
        </div>
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
          disabled={saving}
          className="rounded-xl bg-[#8022fe] px-4 py-2 text-[13px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Changing...' : 'Change Password'}
        </button>
      </div>
    </SettingsCard>
  );
}
