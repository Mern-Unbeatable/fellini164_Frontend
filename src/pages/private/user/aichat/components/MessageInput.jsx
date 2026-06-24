import React from 'react';
import { SendHorizontal } from 'lucide-react';

export default function MessageInput({ inputValue, setInputValue, onSend, isLoading }) {
  return (
    <div className="shrink-0 border-t border-gray-200 bg-white px-3 py-3 sm:px-4 md:px-6 md:py-4 dark:border-zinc-500 dark:bg-zinc-800">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 bg-[#FFFFFF] px-3 py-2 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-400 sm:gap-3 sm:px-4 dark:bg-zinc-800">
          <input
            type="text"
            placeholder="Ask anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            className="h-8 flex-1 bg-transparent text-xs text-gray-900 focus:outline-none sm:text-sm dark:text-white dark:placeholder-gray-200"
          />
        </div>
        <button
          onClick={onSend}
          disabled={isLoading}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] text-white shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:w-10 md:h-12 md:w-12"
        >
          {isLoading ? (
            <svg
              className="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <SendHorizontal className="h-6 w-6" />
          )}
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-[#616161] sm:text-sm md:text-base dark:text-white">
        AI can make mistakes. Verify important info.
      </p>
    </div>
  );
}
