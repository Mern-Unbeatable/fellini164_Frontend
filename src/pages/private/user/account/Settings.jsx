import React, { useState } from 'react';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    /* Changed: added 'flex flex-col justify-center' and ensured 'min-h-screen' */
    <div className="flex h-full flex-col justify-center  p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-2xl rounded-lg bg-white dark:bg-zinc-800 p-6 shadow-md">
            <h3 className="mb-4 text-xl font-medium md:text-2xl dark:text-white">Settings</h3>

            <div className="space-y-4 md:space-y-6">
              {/* Notifications Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold md:text-base dark:text-white">Notifications</div>
                  <div className="text-xs font-normal text-[#6B7280] dark:text-gray-300">
                    Receive daily briefings and reminders
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                  />
                  <span
                    className={`inline-block h-7 w-12 rounded-full transition-colors ${notifications ? 'bg-[#7C3AED]' : 'bg-gray-200 dark:bg-zinc-400'}`}
                  ></span>
                  <span
                    className={`absolute top-1 left-1 h-5 w-5 transform rounded-full bg-white shadow transition-transform ${notifications ? 'translate-x-5' : 'translate-x-0'}`}
                  ></span>
                </label>
              </div>

              {/* Dark Mode Toggle */}
              {/* <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold md:text-base dark:text-white">Dark Mode</div>
                  <div className="text-xs font-normal text-[#6B7280] dark:text-gray-300">
                    Switch between light and dark themes
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <span
                    className={`inline-block h-7 w-12 rounded-full transition-colors ${darkMode ? 'bg-[#7C3AED]' : 'bg-gray-200 dark:bg-zinc-400'}`}
                  ></span>
                  <span
                    className={`absolute top-1 left-1 h-5 w-5 transform rounded-full bg-white shadow transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`}
                  ></span>
                </label>
              </div> */}

              {/* AI Personality */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold md:text-base dark:text-white">AI Personality</div>
                  <div className="text-xs font-normal text-[#6B7280] dark:text-gray-300">
                    Current Sage (Calm & Mindful)
                  </div>
                </div>
                <button className="text-xs font-normal text-black dark:text-white">Change</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
