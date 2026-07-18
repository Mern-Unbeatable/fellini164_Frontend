import { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Maximize2, Minimize2, Send, ListTodo, Pencil, Repeat } from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Add tasks', icon: ListTodo },
  { label: 'Improve description', icon: Pencil },
  { label: 'Add habits', icon: Repeat },
];

function UserBubble({ children }) {
  return (
    <div className="flex justify-end pl-15">
      <div className="relative rounded-tl-[10px] rounded-bl-[10px] rounded-br-[10px] rounded-tr-none bg-[#8022fe] px-3 py-2">
        <p className="text-[14px] font-medium text-white">{children}</p>
        <svg className="absolute top-0 -right-[11px]" width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
          <path d="M11 0C4.92487 0 0 4.92487 0 11V0H11Z" fill="#8022fe" />
        </svg>
      </div>
    </div>
  );
}

function AiBubble({ children }) {
  return (
    <div className="flex justify-start pr-15">
      <div className="relative rounded-tr-[10px] rounded-bl-[10px] rounded-br-[10px] rounded-tl-none border border-[#f2f2f2] bg-[#fcfcfc] px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-[14px] font-medium whitespace-pre-line text-[#181818] dark:text-gray-200">
          {children}
        </p>
        <svg className="absolute -top-px -left-[13px] text-[#f2f2f2] dark:text-zinc-700" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M0 0C6.62742 0 12 5.37258 12 12V0H0Z" fill="currentColor" />
        </svg>
        <svg className="absolute top-0 -left-1.5 text-[#fcfcfc] dark:text-zinc-800" width="8" height="9.5" viewBox="0 0 8 9.5" fill="none" aria-hidden="true">
          <path d="M0 0C2.5 0.5 6 4.5 6 9.5L8 0H0Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

function ActionPill({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-fit rounded-md bg-[#f9f4ff] px-2 pt-0.5 pb-0.75 text-[14px] font-medium text-[#8022fe]"
    >
      {children}
    </button>
  );
}

export default function GoalAiAssistant({ onClose, onToggleExpand, isExpanded = false }) {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 80)}px`;
  }, [prompt]);

  return (
    <div className="flex h-full w-full flex-col gap-2.5">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex shrink-0 items-center gap-1.5 border-b border-[#f2f2f2] px-3 py-2.5 dark:border-zinc-700">
          <Sparkles size={14} className="shrink-0 text-[#8022fe]" />
          <p className="flex-1 text-[14px] font-medium text-[#5d5d5d] dark:text-gray-300">AI Assistant</p>
          <div className="flex items-center gap-3 text-[#a3a3a3]">
            <button
              type="button"
              onClick={onToggleExpand}
              aria-label={isExpanded ? 'Collapse AI Assistant' : 'Expand AI Assistant'}
              className="hover:text-[#5d5d5d]"
            >
              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button type="button" onClick={onClose} aria-label="Close AI Assistant" className="hover:text-[#5d5d5d]">
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="scrollbar-white flex min-h-0 flex-1 flex-col overflow-y-auto py-3 pl-3 pr-4.5">
          <p className="mb-2.5 text-center text-[12px] font-medium text-[#c2c2c2]">
            Tuesday, May 5 • 7:39 PM
          </p>
          <div className="flex flex-col gap-5">
            <UserBubble>Hi, I want to improve this goal</UserBubble>

            <AiBubble>
              {'Sure, I can update this task.\n\nThis will:\n• improve clarity\n• improve tracking'}
            </AiBubble>

            <div className="flex flex-col gap-2.5">
              <AiBubble>Do you want me to apply these changes?</AiBubble>
              <div className="flex items-center gap-2">
                <ActionPill>Yes, apply</ActionPill>
                <ActionPill>No, cancel</ActionPill>
              </div>
            </div>

            <UserBubble>Yes, apply</UserBubble>

            <div className="flex flex-col gap-2.5">
              <AiBubble>Done. The goal has been updated</AiBubble>
              <ActionPill>Undo changes</ActionPill>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3">
          <div className="flex flex-wrap gap-2 px-2.5">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                className="flex items-center gap-1.5 rounded-md border border-[#f2f2f2] bg-[#fcfcfc] px-2 pt-0.5 pb-0.75 text-[14px] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300"
              >
                <action.icon size={12} className="shrink-0" />
                {action.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-[#f2f2f2] px-3.5 py-2.5 dark:border-zinc-700">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to change..."
              rows={1}
              className="max-h-20 min-w-0 flex-1 resize-none bg-transparent text-[14px] font-medium text-[#5d5d5d] placeholder:text-[#c2c2c2] focus:outline-none dark:text-gray-300"
            />
            <button
              type="button"
              aria-label="Send message"
              className="ml-2 flex size-7.5 shrink-0 items-center justify-center rounded-full bg-[#8022fe] text-white"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      <p className="shrink-0 text-center text-[10px] font-medium text-[#c2c2c2]">
        AI can make mistakes. Verify important info
      </p>
    </div>
  );
}
