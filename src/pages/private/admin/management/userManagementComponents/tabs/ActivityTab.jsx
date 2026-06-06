import React from 'react';

const ActivityTab = () => {
  const activities = [
    { id: 1, action: 'Completed "Morning Meditation"', time: 'Today, 8:00 AM', type: 'completed' },
    { id: 2, action: 'Updated Profile', time: 'Yesterday, 2:35 PM', type: 'updated' },
    { id: 3, action: 'Started "Drink Water" habit', time: '2 days ago, 10:15 AM', type: 'started' },
    { id: 4, action: 'Logged in from new device', time: '3 days ago, 4:20 PM', type: 'login' },
  ];

  const getDotColor = (type) => {
    const colors = {
      completed: 'bg-purple-500',
      updated: 'bg-gray-400',
      started: 'bg-blue-500',
      login: 'bg-green-500',
    };
    return colors[type] || 'bg-gray-400';
  };

  return (
    <div className="p-6">
      <p className="mb-6 text-sm text-gray-500 dark:text-white">Recent user activity logs</p>

      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`h-3 w-3 rounded-full ${getDotColor(activity.type)}`}></div>
              {activity.id !== activities.length && (
                <div className="mt-2 h-12 w-0.5 bg-gray-200"></div>
              )}
            </div>
            <div className="flex-1 pb-6">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-white">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ActivityTab;
