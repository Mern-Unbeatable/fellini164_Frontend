import { useSelector, useDispatch } from 'react-redux';
import { selectUser, logout } from '../../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const DashView = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Daily Plans</h3>
            <p className="text-4xl font-bold mt-2">12</p>
            <p className="text-sm mt-2 opacity-90">Completed this month</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Habits Tracked</h3>
            <p className="text-4xl font-bold mt-2">5</p>
            <p className="text-sm mt-2 opacity-90">Current streak: 7 days</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Productivity</h3>
            <p className="text-4xl font-bold mt-2">85%</p>
            <p className="text-sm mt-2 opacity-90">This week's score</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Plan */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Plan</h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <input type="checkbox" className="mr-3 h-5 w-5" />
                <span className="text-gray-700">Morning workout (7:00 AM)</span>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <input type="checkbox" className="mr-3 h-5 w-5" />
                <span className="text-gray-700">Team meeting (10:00 AM)</span>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <input type="checkbox" className="mr-3 h-5 w-5" />
                <span className="text-gray-700">Project work (2:00 PM)</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="p-3 border-l-4 border-green-500 bg-gray-50">
                <p className="text-sm text-gray-600">Completed: Morning meditation</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
              <div className="p-3 border-l-4 border-blue-500 bg-gray-50">
                <p className="text-sm text-gray-600">Started: Daily journal</p>
                <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
              </div>
              <div className="p-3 border-l-4 border-purple-500 bg-gray-50">
                <p className="text-sm text-gray-600">AI suggestion: Take a break</p>
                <p className="text-xs text-gray-400 mt-1">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashView;
