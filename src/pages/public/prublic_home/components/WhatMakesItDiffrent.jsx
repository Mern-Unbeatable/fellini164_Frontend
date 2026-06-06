import React from 'react';

const WhatMakesItDiffrent = () => {
    const comparisons = [
        {
            tool: 'Calendars',
            breakdown: "They manage when things happen, but they can't adapt when you miss a slot.",
            withElyxa: 'Your schedule becomes responsive, automatically shifting when life changes.',
        },
        {
            tool: 'Task Managers',
            breakdown: 'They just collect "guilt". The list only grows longer, never smarter.',
            withElyxa: 'Tasks are reprioritized based on your actual capacity and execution speed.',
        },
        {
            tool: 'Habit Trackers',
            breakdown: "They measure streaks but don't understand context. One bad day kills your progress.",
            withElyxa: 'We distinguish between a missed habit and a necessary pivot.',
        },
        {
            tool: 'Notion/Docs',
            breakdown: 'You spend more time "building the system" than doing the work.',
            withElyxa: "There is no setup. It's an engine built for execution, not documentation.",
        },
    ];

    return (
        <section className="w-full py-16 md:py-24 bg-white dark:bg-black">
            <div className="container mx-auto  px-4 sm:px-6 lg:px-20">

                <div className="flex flex-col items-center justify-start gap-12 md:gap-12">
                    {/* Header */}

                    <div className="flex flex-col items-center gap-3 text-center">
                        <h2 className="font-['Inter'] text-3xl font-bold text-black dark:text-white md:text-4xl lg:text-5xl leading-tight">
                            The layer your{' '}
                            <span className="text-violet-600 dark:text-violet-400">workflow is missing</span>
                        </h2>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg lg:block">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30">
                                    <th className="border-b-2 border-r border-gray-200 dark:border-zinc-800 px-8 py-5 text-left font-['Inter'] text-base font-bold text-zinc-900 dark:text-white">
                                        If you use...
                                    </th>
                                    <th className="border-b-2 border-r border-gray-200 dark:border-zinc-800 px-8 py-5 text-left font-['Inter'] text-base font-bold text-zinc-900 dark:text-white">
                                        The breakdown is...
                                    </th>
                                    <th className="border-b-2 border-gray-200 dark:border-zinc-800 px-8 py-5 text-left font-['Inter'] text-base font-bold text-violet-700 dark:text-violet-400">
                                        With Elyxa...
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                                {comparisons.map((item, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            className="group transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                                        >
                                            <td className="border-r border-gray-200 dark:border-zinc-800 px-8 py-6">
                                                <span className="font-['Inter'] text-base font-semibold text-zinc-900 dark:text-white">
                                                    {item.tool}
                                                </span>
                                            </td>
                                            <td className="border-r border-gray-200 dark:border-zinc-800 px-8 py-6 font-['Inter'] text-base leading-7 text-zinc-600 dark:text-zinc-400">
                                                {item.breakdown}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="font-['Inter'] text-base leading-7 font-medium text-zinc-800 dark:text-zinc-200">
                                                    {item.withElyxa}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="flex w-full flex-col gap-8 lg:hidden">
                        {comparisons.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-md"
                                >
                                    {/* Tool Header */}
                                    <div className="flex items-center px-6 py-5 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                                        <h3 className="font-['Inter'] text-xl font-bold text-zinc-900 dark:text-white">
                                            {item.tool}
                                        </h3>
                                    </div>

                                    <div className="flex flex-col gap-6 p-6">
                                        {/* Problem */}
                                        <div className="flex flex-col gap-2">
                                            <div className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                                The Problem
                                            </div>
                                            <p className="font-['Inter'] text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                                {item.breakdown}
                                            </p>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px bg-gray-200 dark:bg-zinc-800"></div>

                                        {/* Solution */}
                                        <div className="flex flex-col gap-2">
                                            <div className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-400">
                                                How Elyxa Solves It
                                            </div>
                                            <p className="font-['Inter'] text-sm leading-6 font-medium text-zinc-800 dark:text-zinc-200">
                                                {item.withElyxa}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhatMakesItDiffrent;
