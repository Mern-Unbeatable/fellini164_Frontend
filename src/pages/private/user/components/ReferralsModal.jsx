import React from 'react';
import { Users } from 'lucide-react';

const ReferralsModal = ({ isOpen, onClose, referralsList, totalReferrals }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 bg-opacity-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-violet-900/20 w-full max-w-2xl max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Referrals ({totalReferrals})</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {referralsList.length > 0 ? (
                        <div className="space-y-3">
                            {referralsList.map((ref, index) => (
                                <div
                                    key={ref.id || index}
                                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-500 transition-all"
                                >

                                    <div className="flex-1">
                                        <div className="text-sm text-left font-semibold text-gray-800 dark:text-white">
                                            {ref.userName || 'No Name'}
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{ref.userEmail}</p>
                                        </div>

                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-400 dark:text-gray-500">
                                            {new Date(ref.joinedAt).toLocaleDateString()}
                                        </div>
                                        {ref.rewardCredited && (
                                            <div className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                                                +{ref.rewardAmount} credits
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No referrals yet</p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Start sharing your link to invite friends!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReferralsModal;
