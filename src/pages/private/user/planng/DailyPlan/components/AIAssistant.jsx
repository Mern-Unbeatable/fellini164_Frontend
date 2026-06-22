import React from 'react';
import { Sparkles, ExternalLink, X, Scale, Zap, Send } from 'lucide-react';

export default function AIAssistant({
  messages,
  chatInput,
  setChatInput,
  handleSendMessage,
  handleActionClick,
  handleQuickAction,
  chatEndRef
}) {
  return (
    <div className="w-full lg:w-96 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col h-[780px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-violet-600 dark:text-violet-400 fill-violet-600/10" />
          <span className="font-bold text-slate-900 dark:text-white text-sm">AI Assistant</span>
        </div>
        <div className="flex items-center gap-2.5 text-gray-400 hover:text-slate-600">
          <button className="p-1 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded transition-colors">
            <ExternalLink size={14} />
          </button>
          <button className="p-1 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/20 dark:bg-zinc-900/20">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Timestamp */}
            <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-1.5 px-1">
              {msg.timestamp}
            </div>

            {/* Message Bubble */}
            <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
              msg.sender === 'user' 
                ? 'bg-[#7C3AED] text-white rounded-tr-none'
                : 'bg-[#F9FAFB] dark:bg-zinc-800 text-slate-800 dark:text-gray-100 rounded-tl-none border border-gray-100/50 dark:border-zinc-800'
            }`}>
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>
            
            {/* Actions */}
            {msg.actions && (
              <div className="flex items-center gap-2 mt-2">
                {msg.actions.map((act) => (
                  <button
                    key={act.actionId}
                    onClick={() => handleActionClick(act.actionId)}
                    className="px-3.5 py-1.5 border border-[#7C3AED]/20 hover:bg-[#7C3AED]/5 text-[#7C3AED] font-semibold rounded-full text-xs transition-colors"
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            )}

            {/* Inline link buttons */}
            {msg.links && (
              <div className="mt-2 px-1">
                {msg.links.map((link) => (
                  <button
                    key={link.actionId}
                    onClick={() => handleActionClick(link.actionId)}
                    className="text-[#7C3AED] hover:underline font-bold text-xs"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Action Suggestion Chips (Vertical Stack) */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
        <button 
          onClick={() => handleQuickAction('balance')}
          className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100/80 dark:bg-zinc-800 dark:hover:bg-zinc-800/80 text-slate-700 dark:text-gray-200 border border-gray-100 dark:border-zinc-800 rounded-lg text-xs font-semibold transition-colors"
        >
          <Scale size={12} className="text-gray-400" />
          <span>Balance my schedule</span>
        </button>
        <button 
          onClick={() => handleQuickAction('free_evening')}
          className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100/80 dark:bg-zinc-800 dark:hover:bg-zinc-800/80 text-slate-700 dark:text-gray-200 border border-gray-100 dark:border-zinc-800 rounded-lg text-xs font-semibold transition-colors"
        >
          <Zap size={12} className="text-gray-400" />
          <span>Free up my evening</span>
        </button>
        <button 
          onClick={() => handleQuickAction('monthly_plan')}
          className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100/80 dark:bg-zinc-800 dark:hover:bg-zinc-800/80 text-slate-700 dark:text-gray-200 border border-gray-100 dark:border-zinc-800 rounded-lg text-xs font-semibold transition-colors"
        >
          <Sparkles size={12} className="text-gray-400" />
          <span>Generate Monthly Plan</span>
        </button>
      </div>

      {/* Message Form Input */}
      <form 
        onSubmit={handleSendMessage}
        className="p-5 pt-2 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Describe what you want to change..."
            className="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#7C3AED] text-slate-800 dark:text-gray-100 placeholder-gray-400 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 p-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-colors"
          >
            <Send size={12} />
          </button>
        </div>
        <div className="text-center mt-3">
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            AI can make mistakes. Verify important info
          </span>
        </div>
      </form>
    </div>
  );
}
