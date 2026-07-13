import React from 'react';
import { Sparkles, ExternalLink, X, Scale, Zap, Send, List } from 'lucide-react';

const CHIP_CLASS =
  'flex w-fit items-center gap-1.5 rounded-lg border border-[#F2F2F2] bg-white px-3 py-1.75 text-xs font-semibold text-[#5D5D5D] transition-colors hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-850 dark:text-gray-200 max-lg:text-base';

const ACTION_BTN =
  'rounded-lg bg-[#f9f4ff] px-3.5 py-1.5 text-[12px] font-semibold text-[#8022fe] transition-colors hover:bg-[#f0e7ff] dark:bg-zinc-800 dark:text-[#a78bfa] dark:hover:bg-zinc-700 max-lg:text-base';

export default function AIAssistant({
  messages,
  chatInput,
  setChatInput,
  handleSendMessage,
  handleActionClick,
  handleQuickAction,
  chatContainerRef,
  hasAcceptedPlan,
  viewMode,
}) {
  const emptyStateChips = [
    { label: 'Adjust before accepting', icon: Sparkles, actionId: 'adjust_before_accepting' },
    { label: "Show what's included", icon: List, actionId: 'show_whats_included' },
  ];

  if (viewMode === 'Weekly') {
    emptyStateChips.push({
      label: 'Generate Weekly Plan',
      icon: Sparkles,
      actionId: 'generate_weekly_plan',
    });
  } else if (viewMode === 'Monthly') {
    emptyStateChips.push({
      label: 'Generate Monthly Plan',
      icon: Sparkles,
      actionId: 'generate_monthly_plan',
    });
  }

  const acceptedChips = [
    { label: 'Balance my schedule', icon: Scale, actionId: 'balance' },
    { label: 'Free up my evening', icon: Zap, actionId: 'free_evening' },
  ];

  if (viewMode === 'Weekly') {
    acceptedChips.push({
      label: 'Generate Weekly Plan',
      icon: Sparkles,
      actionId: 'generate_weekly_plan',
    });
  } else if (viewMode === 'Monthly') {
    acceptedChips.push({
      label: 'Generate Monthly Plan',
      icon: Sparkles,
      actionId: 'monthly_plan',
    });
  }

  const quickChips = hasAcceptedPlan ? acceptedChips : emptyStateChips;

  return (
    <div className="flex h-[600px] w-full shrink-0 flex-col items-center overflow-hidden md:h-[500px] lg:h-[780px] lg:w-96">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-[#F2F2F2] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-[#F2F2F2] px-5 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#A3A3A3] dark:text-zinc-500" />
            <span className="text-sm font-semibold text-[#181818] dark:text-white">AI Assistant</span>
          </div>
          <div className="flex items-center gap-3 text-[#5D5D5D] dark:text-gray-400">
            <button
              type="button"
              className="rounded p-1 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              <ExternalLink size={16} />
            </button>
            <button
              type="button"
              className="rounded p-1 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div
          ref={chatContainerRef}
          className="scrollbar-white relative flex-1 space-y-4 overflow-y-auto bg-white p-5 dark:bg-zinc-900"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {msg.timestamp && (
                <div className="mb-2 w-full text-center text-xs font-medium text-gray-400 dark:text-gray-500">
                  {msg.timestamp}
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-4 text-sm leading-relaxed font-medium ${
                  msg.sender === 'user'
                    ? 'bg-primary rounded-tr-none text-white'
                    : 'rounded-tl-none border border-[#F2F2F2] bg-white text-[#181818] dark:border-zinc-800 dark:bg-zinc-800 dark:text-gray-100'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>

              {msg.actions && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {msg.actions.map((act) => (
                    <button
                      key={act.actionId}
                      type="button"
                      onClick={() => handleActionClick(act.actionId)}
                      className={ACTION_BTN}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              )}

              {msg.links && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {msg.links.map((link) => (
                    <button
                      key={link.actionId}
                      type="button"
                      onClick={() => handleActionClick(link.actionId)}
                      className={ACTION_BTN}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start gap-2 bg-white px-5 py-3 dark:bg-zinc-900">
          {quickChips.map(({ label, icon: Icon, actionId }) => (
            <button
              key={actionId}
              type="button"
              onClick={() => handleQuickAction(actionId)}
              className={CHIP_CLASS}
            >
              <Icon size={14} className="text-[#A3A3A3]" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="border-t border-[#F2F2F2] bg-white p-5 pt-2 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Describe what you want to change..."
              className="focus:ring-primary/30 w-full rounded-2xl border border-[#F2F2F2] bg-[#FAFAFA] py-3 pr-12 pl-4 text-[13px] font-medium text-slate-800 placeholder-gray-400 transition-all focus:ring-1 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-gray-100"
            />
            <button
              type="submit"
              className="bg-primary absolute right-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-2 text-white transition-opacity hover:opacity-90"
            >
              <Send size={14} className="fill-white/10" />
            </button>
          </div>
        </form>
      </div>

      <div className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
        AI can make mistakes. Verify important info
      </div>
    </div>
  );
}
