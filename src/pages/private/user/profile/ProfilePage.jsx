import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectUser } from '../../../../features/auth/authSlice';
import NormalInfoSection from './components/NormalInfoSection';
import ChangePasswordSection from './components/ChangePasswordSection';

const inputClassName =
  'w-full rounded-xl border border-[#f2f2f2] bg-white px-3 py-2.5 text-[14px] font-medium text-[#181818] outline-none transition focus:border-[#8022fe] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white';

export default function ProfilePage() {
  const user = useSelector(selectUser);
  const currentPlan = (user?.subscriptionPlan || user?.plan || 'FREE').toString().toUpperCase();
  const [fullName, setFullName] = useState(user?.fullName || user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    toast.success('Profile info saved (UI ready).');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    toast.success('Password change form submitted (UI ready).');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-5 py-7.5 max-lg:py-4 max-lg:sm:py-6">
      <div>
        <h1 className="text-[20px] font-medium text-[#181818] dark:text-white">Profile</h1>
        <p className="mt-1 text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">
          Manage your personal information and password
        </p>
      </div>

      <NormalInfoSection
        inputClassName={inputClassName}
        currentPlan={currentPlan}
        fullName={fullName}
        email={email}
        phone={phone}
        setFullName={setFullName}
        setPhone={setPhone}
        onSubmit={handleInfoSubmit}
      />

      <ChangePasswordSection
        inputClassName={inputClassName}
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        setCurrentPassword={setCurrentPassword}
        setNewPassword={setNewPassword}
        setConfirmPassword={setConfirmPassword}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
}
