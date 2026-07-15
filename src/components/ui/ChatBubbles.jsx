export function UserChatBubble({ children }) {
  return (
    <div className="flex justify-end pl-15">
      <div className="relative rounded-tl-[10px] rounded-bl-[10px] rounded-br-[10px] rounded-tr-none bg-[#8022fe] px-3 py-2">
        <p className="text-[14px] font-medium whitespace-pre-line text-white">{children}</p>
        <svg
          className="absolute top-0 -right-[11px]"
          width="11"
          height="11"
          viewBox="0 0 11 11"
          fill="none"
          aria-hidden="true"
        >
          <path d="M11 0C4.92487 0 0 4.92487 0 11V0H11Z" fill="#8022fe" />
        </svg>
      </div>
    </div>
  );
}

export function AiChatBubble({ children }) {
  return (
    <div className="flex justify-start pr-15">
      <div className="relative rounded-tr-[10px] rounded-bl-[10px] rounded-br-[10px] rounded-tl-none border border-[#f2f2f2] bg-[#fcfcfc] px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-[14px] font-medium whitespace-pre-line text-[#181818] dark:text-gray-200">
          {children}
        </p>
        <svg
          className="absolute -top-px -left-[13px] text-[#f2f2f2] dark:text-zinc-700"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path d="M0 0C6.62742 0 12 5.37258 12 12V0H0Z" fill="currentColor" />
        </svg>
        <svg
          className="absolute top-0 -left-1.5 text-[#fcfcfc] dark:text-zinc-800"
          width="8"
          height="9.5"
          viewBox="0 0 8 9.5"
          fill="none"
          aria-hidden="true"
        >
          <path d="M0 0C2.5 0.5 6 4.5 6 9.5L8 0H0Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

export function ChatActionPill({ children, onClick, type = 'button', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-fit rounded-md bg-[#f9f4ff] px-2 pt-0.5 pb-0.75 text-[14px] font-medium text-[#8022fe] transition-colors hover:bg-[#f0e7ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8022fe]/30 active:bg-[#e9d9ff] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#f9f4ff] dark:bg-zinc-800 dark:text-[#a78bfa] dark:hover:bg-zinc-700 dark:disabled:hover:bg-zinc-800"
    >
      {children}
    </button>
  );
}
