import React from 'react';
import {
  Calendar,
  CalendarDays,
  Flame,
  ListTodo,
  MessageSquare,
  BarChart3,
  Bell,
  Heart,
  Mic,
} from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section id='features' className="w-full py-12 md:py-16 lg:py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex flex-col items-center justify-start gap-12 md:gap-6 lg:gap-12">
          <div className="flex flex-col items-center justify-start gap-4 text-center">
            <div className="flex flex-col justify-start gap-2">
              <span className="font-['Inter'] text-2xl font-semibold text-black dark:text-white md:text-3xl lg:text-4xl">
                Everything You Need — In <br />
              </span>
              <div className="font-['Inter'] text-2xl font-semibold text-black dark:text-white md:text-3xl lg:text-4xl">
                One <span className="text-indigo-600 dark:text-indigo-400">Intelligent System</span>
              </div>
            </div>
            <div className="max-w-2xl justify-start font-['Inter'] text-sm leading-6 font-normal text-zinc-600 dark:text-white md:text-base">
             Elyxa AI combines the best features of a calendar. <br className="hidden sm:block" />
              task manager, habit tracker, and life coach.
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="inline-flex flex-1 flex-col items-start justify-start gap-6 rounded-lg bg-neutral-100 dark:bg-zinc-800 p-6">
              <div className="inline-flex h-10 w-10 items-center justify-start gap-2.5 rounded bg-indigo-100 dark:bg-indigo-900 p-2">
                <Calendar className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex flex-col items-start justify-start gap-1 self-stretch">
                <div className="justify-start self-stretch font-['Inter'] text-xl leading-8 font-medium text-black dark:text-white">
                  AI Daily Planning
                </div>
                <div className="justify-start self-stretch font-['Inter'] text-base leading-6 font-normal text-zinc-600 dark:text-white">
                  Smart scheduling that adapts automatically to your energy and priorities.
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="inline-flex flex-1 flex-col items-start justify-start gap-6 rounded-lg bg-neutral-100 p-6 dark:bg-zinc-800">
              <div className="inline-flex h-10 w-10 items-center justify-start gap-2.5 rounded bg-indigo-100 dark:bg-indigo-900 p-2">
                <Calendar className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex flex-col items-start justify-start gap-1 self-stretch">
                <div className="justify-start self-stretch font-['Inter'] text-xl leading-8 font-medium text-black dark:text-white">
                  Weekly & Monthly Planning
                </div>
                <div className="justify-start self-stretch font-['Inter'] text-base leading-6 font-normal text-zinc-600 dark:text-white">
                  Zoom out to see the big picture and align your daily actions with your long-term goals.
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="inline-flex flex-1 flex-col items-start justify-start gap-6 rounded-lg bg-neutral-100 p-6 dark:bg-zinc-800">
              <div className="inline-flex h-10 w-10 items-center justify-start gap-2.5 rounded bg-yellow-100 dark:bg-yellow-900 p-2">
                <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex flex-col items-start justify-start gap-1 self-stretch">
                <div className="justify-start self-stretch font-['Inter'] text-xl leading-8 font-medium text-black dark:text-white">
                  Habit Tracker with Streaks
                </div>
                <div className="justify-start self-stretch font-['Inter'] text-base leading-6 font-normal text-zinc-600 dark:text-white">
                  Build consistency with visual streaks and smart reminders for your habits.
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="inline-flex flex-1 flex-col items-start justify-start gap-6 rounded-lg bg-neutral-100 p-6 dark:bg-zinc-800">
              <div className="inline-flex h-10 w-10 items-center justify-start gap-2.5 rounded bg-green-100 dark:bg-green-900 p-2">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex flex-col items-start justify-start gap-1 self-stretch">
                <div className="justify-start self-stretch font-['Inter'] text-xl leading-8 font-medium text-black dark:text-white">
                  Smart Task Manager
                </div>
                <div className="justify-start self-stretch font-['Inter'] text-base leading-6 font-normal text-zinc-600 dark:text-white">
                  Organize tasks by project, priority, and the required energy level.
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="inline-flex flex-1 flex-col items-start justify-start gap-6 rounded-lg bg-neutral-100 p-6 dark:bg-zinc-800">
              <div className="inline-flex h-10 w-10 items-center justify-start gap-2.5 rounded bg-violet-100 dark:bg-violet-900 p-2">
                <Calendar className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex flex-col items-start justify-start gap-1 self-stretch">
                <div className="justify-start self-stretch font-['Inter'] text-xl leading-8 font-medium text-black dark:text-white">
                  AI Life Coach Chat
                </div>
                <div className="justify-start self-stretch font-['Inter'] text-base leading-6 font-normal text-zinc-600 dark:text-white">
                  24/7 access to personalized advice, motivation, and clarity.
                </div>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="inline-flex flex-1 flex-col items-start justify-start gap-6 rounded-lg bg-neutral-100 p-6 dark:bg-zinc-800">
              <div className="inline-flex h-10 w-10 items-center justify-start gap-2.5 rounded bg-red-100 dark:bg-red-900 p-2">
                <Calendar className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex flex-col items-start justify-start gap-1 self-stretch">
                <div className="justify-start self-stretch font-['Inter'] text-xl leading-8 font-medium text-black dark:text-white">
                  Progress Analytics
                </div>
                <div className="justify-start self-stretch font-['Inter'] text-base leading-6 font-normal text-zinc-600 dark:text-white">
                  Gain deep insights into your productivity patterns and mood.
                </div>
              </div>
            </div>

            {/* Feature 7 */}
            <div className="inline-flex flex-1 flex-col items-start justify-start gap-6 rounded-lg bg-neutral-100 p-6 dark:bg-zinc-800">
              <div className="inline-flex h-10 w-10 items-center justify-start gap-2.5 rounded bg-orange-100 dark:bg-orange-900 p-2">
                <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex flex-col items-start justify-start gap-1 self-stretch">
                <div className="justify-start self-stretch font-['Inter'] text-xl leading-8 font-medium text-black dark:text-white">
                  Automated Reminders
                </div>
                <div className="justify-start self-stretch font-['Inter'] text-base leading-6 font-normal text-zinc-600 dark:text-white">
                  Custom content and reminders help you start new habits and stay on track every day.
                </div>
              </div>
            </div>

            {/* Feature 8 */}
            <div className="inline-flex flex-1 flex-col items-start justify-start gap-6 rounded-lg bg-neutral-100 p-6 dark:bg-zinc-800">
              <div className="inline-flex h-10 w-10 items-center justify-start gap-2.5 rounded bg-cyan-100 dark:bg-cyan-900 p-2">
                <Calendar className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex flex-col items-start justify-start gap-1 self-stretch">
                <div className="justify-start self-stretch font-['Inter'] text-xl leading-8 font-medium text-black dark:text-white">
                  Ultimate Life Blueprint
                </div>
                <div className="justify-start self-stretch font-['Inter'] text-base leading-6 font-normal text-zinc-600 dark:text-white">
                  Map out your core values, vision, and long-term goals for a clear path forward.
                </div>
              </div>
            </div>

            {/* Feature 9 */}
            <div className="inline-flex flex-1 flex-col items-start justify-start gap-6 rounded-lg bg-neutral-100 p-6 dark:bg-zinc-800">
              <div className="inline-flex h-10 w-10 items-center justify-start gap-2.5 rounded bg-pink-100 dark:bg-pink-900 p-2">
                <Calendar className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div className="flex flex-col items-start justify-start gap-1 self-stretch">
                <div className="justify-start self-stretch font-['Inter'] text-xl leading-8 font-medium text-black dark:text-white">
                  Ultimate AI Voice Coach
                </div>
                <div className="justify-start self-stretch font-['Inter'] text-base leading-6 font-normal text-zinc-600 dark:text-white">
                  Talk to your coach hands-free for morning check-ins and instant motivation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
