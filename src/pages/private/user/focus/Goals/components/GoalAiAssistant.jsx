import { useEffect, useRef, useState } from 'react';
import { Sparkles, X, ExternalLink, Send, ListTodo, Pencil, Repeat } from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Add tasks', icon: ListTodo },
  { label: 'Improve description', icon: Pencil },
  { label: 'Add habits', icon: Repeat },
];

function UserBubble({ children }) {
  return (
    <div className="flex justify-end">
      <div className="relative max-w-[222px] rounded-xl bg-[#8022fe] px-3 py-2">
        <p className="text-[14px] font-medium text-white">{children}</p>
        <span className="absolute -top-0.5 -right-0.5 size-[11px] rounded-full bg-[#8022fe]" />
      </div>
    </div>
  );
}

function AiBubble({ children }) {
  return (
    <div className="flex justify-start">
      <div className="relative max-w-[250px] rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-[14px] font-medium whitespace-pre-line text-[#5d5d5d] dark:text-gray-300">
          {children}
        </p>
        <span className="absolute -top-0.5 -left-0.5 size-3 rounded-full border-2 border-white bg-[#fcfcfc] dark:border-zinc-800 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

export default function GoalAiAssistant() {
  const [prompt, setPrompt] = useState('');
  const [chatStep, setChatStep] = useState('confirm');
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 80)}px`;
  }, [prompt]);

  return (
    <div className="flex h-full w-full max-w-[400px] flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex shrink-0 items-center justify-between border-b border-[#f2f2f2] px-3 py-2.5 dark:border-zinc-700">
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-[#8022fe]" />
          <p className="text-[14px] font-medium text-[#5d5d5d] dark:text-gray-300">AI Assistant</p>
        </div>
        <div className="flex items-center gap-3 text-[#a3a3a3]">
          <button type="button" aria-label="Open in new window" className="hover:text-[#5d5d5d]">
            <ExternalLink size={12} />
          </button>
          <button type="button" aria-label="Close assistant" className="hover:text-[#5d5d5d]">
            <X size={10} />
          </button>
        </div>
      </div>

      <div className="scrollbar-hidden flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3">
        <p className="mb-2.5 text-center text-[12px] font-medium text-[#c2c2c2]">
          Tuesday, May 5 • 7:39 PM
        </p>
        <div className="flex flex-col gap-5">
          <UserBubble>Hi, I want to improve this goal</UserBubble>

          <AiBubble>
            {'Sure, I can update this task. This will:\n• improve clarity\n• improve tracking'}
          </AiBubble>

          <div className="flex flex-col gap-2.5">
            <AiBubble>Do you want me to apply these changes?</AiBubble>
            {chatStep === 'confirm' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChatStep('applied')}
                  className="rounded-md border border-[#8022fe] bg-[#8022fe] px-2 pt-0.5 pb-[3px] text-[14px] font-medium text-white"
                >
                  Yes, apply
                </button>
                <button
                  type="button"
                  onClick={() => setChatStep('cancelled')}
                  className="rounded-md border border-[#f2f2f2] px-2 pt-0.5 pb-[3px] text-[14px] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300"
                >
                  No, cancel
                </button>
              </div>
            )}
          </div>

          {chatStep === 'applied' && (
            <>
              <UserBubble>Yes, apply</UserBubble>
              <div className="flex flex-col gap-2.5">
                <AiBubble>Done. The goal has been updated</AiBubble>
                <button
                  type="button"
                  className="w-fit rounded-md border border-[#f2f2f2] px-2 pt-0.5 pb-[3px] text-[14px] font-medium text-[#8022fe] dark:border-zinc-700"
                >
                  Undo changes
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-[#f2f2f2] px-2.5 pt-2.5 pb-3 dark:border-zinc-700">
        <div className="mb-3 flex flex-wrap gap-2">
          {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-[#f2f2f2] px-2 pt-0.5 pb-[3px] text-[14px] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300"
            >
              <Icon size={12} className="shrink-0" />
              {label}
            </button>
          ))}
        </div>
        <div className="relative rounded-xl border border-[#f2f2f2] bg-white dark:border-zinc-700 dark:bg-zinc-800">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to change..."
            rows={1}
            className="max-h-20 w-full resize-none bg-transparent py-3.5 pl-3.5 pr-12 text-[14px] font-medium text-[#5d5d5d] placeholder:text-[#c2c2c2] focus:outline-none dark:text-gray-300"
          />
          <button
            type="button"
            aria-label="Send message"
            className="absolute right-2.5 bottom-2.5 flex size-[30px] items-center justify-center rounded-full bg-[#8022fe] text-white"
          >
            <Send size={14} />
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-[#c2c2c2]">
          AI can make mistakes. Verify important info
        </p>
      </div>
    </div>
  );
}
