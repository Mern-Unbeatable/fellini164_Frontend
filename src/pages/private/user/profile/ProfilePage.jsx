import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectUser, updateAuthUser } from '../../../../features/auth/authSlice';
import { updateUserProfile, changePassword } from '../../../../features/auth/profileApi';
import NormalInfoSection from './components/NormalInfoSection';
import ChangePasswordSection from './components/ChangePasswordSection';

const inputClassName =
  'w-full rounded-xl border border-[#f2f2f2] bg-white px-3 py-2.5 text-[14px] font-medium text-[#181818] outline-none transition focus:border-[#8022fe] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const savingInfo = useSelector((state) => state.profile?.loading);
  const savingPassword = useSelector((state) => state.profile?.passwordLoading);
  const currentPlan = (user?.subscriptionPlan || user?.plan || 'FREE').toString().toUpperCase();
  const [fullName, setFullName] = useState(user?.fullName || user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    const name = fullName.trim();
    if (!name) {
      toast.error('Please enter your full name.');
      return;
    }

    try {
      const updated = await dispatch(updateUserProfile({ fullName: name })).unwrap();
      const nextName = updated?.fullName || name;
      setFullName(nextName);
      dispatch(updateAuthUser({ fullName: nextName, name: nextName }));
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
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

    try {
      await dispatch(
        changePassword({
          currentPassword,
          newPassword,
          confirmPassword,
        })
      ).unwrap();
      toast.success('Password changed');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error || 'Failed to change password');
    }
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
        setFullName={setFullName}
        saving={savingInfo}
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
        saving={savingPassword}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
}
