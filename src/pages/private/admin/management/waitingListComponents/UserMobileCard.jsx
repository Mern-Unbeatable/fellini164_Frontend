import { Clock2, Loader2, Share2 } from 'lucide-react';

const UserMobileCard = ({ user, getStatusStyles, handleToggleSubscription, updatingId }) => (
  <div className="mb-4 rounded-lg border border-gray-100 bg-white dark:border-gray-600 dark:bg-zinc-800 p-4 shadow-sm">
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full font-medium ${
            user.id % 2 === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-50 text-blue-500'
          }`}
        >
          {user.name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</div>
          <div className="text-xs text-gray-400 dark:text-gray-200">{user.email}</div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 border-t border-gray-50 dark:border-gray-600 pt-3">
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase dark:text-gray-300">Status</p>
        <span
          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${getStatusStyles(user.status)}`}
        >
          {user.status}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase dark:text-gray-300">Referrals</p>
        <div className="mt-1 flex items-center gap-1.5 text-sm font-bold text-gray-700 dark:text-gray-200">
          {user.referralCount || 0}
          <Share2 className="h-4 w-4 text-black dark:text-gray-200" />
        </div>
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-200">
        <span className="flex h-4 w-4 items-center justify-center rounded-full  text-[8px] ">
<Clock2 size={18} />
        </span>
        {user.date}
      </div>

      <button
        disabled={updatingId === user.id}
        onClick={() => handleToggleSubscription(user.id, user.status)}
        className={`inline-flex min-w-[110px] items-center justify-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 ${
          user.status === 'UNSUBSCRIBED'
            ? 'bg-green-600 text-white'
            : 'border border-gray-200  bg-gray-100  text-black'
        }`}
      >
        {updatingId === user.id ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : user.status === 'UNSUBSCRIBED' ? (
          'Resubscribe'
        ) : (
          'Unsubscribe'
        )}
      </button>
    </div>
  </div>
);

export default UserMobileCard;
