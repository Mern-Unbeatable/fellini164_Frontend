import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import PrimaryButton from '../../../../components/ui/PrimaryButton';
import { getUserProfile, updateUserProfile, getSubscriptionStatus } from '../../../../features/auth/profileApi';
import { clearUpdateSuccess } from '../../../../features/auth/profileSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, subscription, loading, error, updateSuccess } = useSelector((state) => state.profile);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');

  // Fetch profile data on component mount (only if not already loaded)
  useEffect(() => {
    if (!profile && !loading) {
      dispatch(getUserProfile());
    }
    if (!subscription && !loading) {
      dispatch(getSubscriptionStatus());
    }
  }, [dispatch, profile, subscription, loading]);

  // Update form fields when profile data is loaded
  useEffect(() => {
    if (profile) {
      // Split fullName into firstName and lastName
      const nameParts = profile.fullName?.split(' ') || [];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  // Show success message when profile is updated
  useEffect(() => {
    if (updateSuccess) {
      toast.success('Profile updated successfully!');
      dispatch(clearUpdateSuccess());
    }
  }, [updateSuccess, dispatch]);

  // Show error message when update fails
  useEffect(() => {
    if (error && !loading) {
      console.error('Profile update error:', error);
      // Extract more detailed error message
      const errorMessage = error?.response?.data?.message || error?.message || error;
      toast.error(`Update failed: ${errorMessage}`);
    }
  }, [error, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Combine firstName and lastName into fullName
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    // Only include non-empty fields in the update
    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (email && email.trim()) updateData.email = email.trim();
    if (phone && phone.trim()) updateData.phone = phone.trim();
    if (address && address.trim()) updateData.address = address.trim();
    if (bio && bio.trim()) updateData.bio = bio.trim();

    console.log('Updating profile with data:', updateData);

    // Validate that we have at least some data to update
    if (Object.keys(updateData).length === 0) {
      toast.error('Please fill in at least one field to update');
      return;
    }

    // Dispatch update profile action
    dispatch(updateUserProfile(updateData));
  };

  // Show minimal loading state on first load only
  const isFirstLoad = loading && !profile;
  const isSaving = loading && profile;

  return (
    <div className=" flex flex-col  p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Show error banner if profile fetch failed */}
        {error && !profile && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-center">
            <div className="text-sm font-medium text-red-800">Error: {error}</div>
            <button
              onClick={() => dispatch(getUserProfile())}
              className="mt-2 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex items-start justify-center py-6">
          <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-zinc-800 p-6 shadow-md relative">
            {/* Show loading overlay on first load */}
            {isFirstLoad && (
              <div className="absolute inset-0 bg-white/80 dark:bg-zinc-600/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                  <div className="text-sm text-gray-600 dark:text-white">Loading profile...</div>
                </div>
              </div>
            )}
            <div className="mb-4 flex items-start gap-4">
              {/* <img
                src={profile?.avatar }
                alt="Avatar"
                className="h-22 w-22 rounded-full object-cover"
              /> */}

              <div className="flex-1">
                <div>
                  <div className="text-xl font-medium text-black dark:text-white">
                    {profile?.fullName || `${firstName} ${lastName}` || 'User'}
                  </div>
                  <div className="text-base font-normal text-black dark:text-white/80">
                    {profile?.email || email || 'email@example.com'}
                  </div>
                  <div className="mt-2">
                    <span className="rounded bg-[#E0E7FF] px-3 py-1 text-xs font-normal text-[#4338CA]">
                      {subscription?.plan?.toUpperCase() || profile?.subscriptionPlan?.toUpperCase() || 'FREE'} PLAN
                    </span>

                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-base font-semibold text-black dark:text-white" >
                    First Name
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alex"
                    className="w-full rounded border border-[#000000] dark:border-white bg-[#FFFFFF] dark:bg-zinc-800 px-3 py-2 text-base font-normal text-[#5D5D5D] dark:text-white focus:border-black dark:focus:border-white focus:ring-0 focus:outline-none placeholder:text-[#5D5D5D]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-base font-semibold text-black dark:text-white">Last Name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder=""
                    className="w-full rounded border border-[#000000] dark:border-white bg-[#FFFFFF] dark:bg-zinc-800 px-3 py-2 text-base font-normal text-[#5D5D5D] dark:text-white focus:border-black dark:focus:border-white focus:ring-0 focus:outline-none placeholder:text-[#5D5D5D]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-base font-semibold text-black dark:text-white">
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full rounded border border-[#000000] dark:border-white bg-[#FFFFFF] dark:bg-zinc-800 px-3 py-2 text-base font-normal text-[#5D5D5D] dark:text-white focus:border-black dark:focus:border-white focus:ring-0 focus:outline-none placeholder:text-[#5D5D5D]"
                />
              </div>

              <div>
                <label className="mb-1 block text-base font-semibold text-black dark:text-white">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="1234567890"
                  className="w-full rounded border border-[#000000] dark:border-white bg-[#FFFFFF] dark:bg-zinc-800 px-3 py-2 text-base font-normal text-[#5D5D5D] dark:text-white focus:border-black dark:focus:border-white focus:ring-0 focus:outline-none placeholder:text-[#5D5D5D]"
                />
              </div>

              <div>
                <label className="mb-1 block text-base font-semibold text-black dark:text-white">
                  Address
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="w-full rounded border border-[#000000] dark:border-white bg-[#FFFFFF] dark:bg-zinc-800 px-3 py-2 text-base font-normal text-[#5D5D5D] dark:text-white focus:border-black dark:focus:border-white focus:ring-0 focus:outline-none placeholder:text-[#5D5D5D]"
                />
              </div>
              <div className="flex justify-end items-center gap-3">

                <PrimaryButton
                  type="submit"
                  disabled={isSaving}
                >
                  Save Changes
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
