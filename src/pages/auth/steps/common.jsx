export const Accent = ({ children }) => <span className="text-[#8022FE]">{children}</span>;
export const Dot = () => <span className="text-[#14F1D9]">.</span>;

export const SectionHeading = ({ children }) => (
  <h1 className="text-center font-['Inter',sans-serif] text-[clamp(28px,4vw,54px)] leading-[1.3] font-bold text-[#181818]">
    {children}
  </h1>
);

export const Body = ({ children, maxWidth = '100%' }) => (
  <p
    className="mx-auto text-center font-['Inter',sans-serif] text-[16px] leading-normal font-medium text-[#272727] sm:whitespace-nowrap"
    style={{ maxWidth }}
  >
    {children}
  </p>
);

export const PrimaryBtn = ({ onClick, disabled = false, children, fullWidthMobile = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`${fullWidthMobile ? 'w-full sm:w-auto' : ''} h-11 rounded-[10px] px-10 font-['Inter',sans-serif] text-[16px] leading-none font-semibold text-white transition-colors ${disabled ? 'cursor-not-allowed bg-[#E2E2E2] text-[#C3C3C3]' : 'bg-[#8022FE] hover:bg-[#6B1BDB]'}`}
  >
    {children}
  </button>
);

export const OptionCard = ({ selected, onClick, icon: Icon, title, description }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full flex-col items-start gap-1.5 rounded-xl border border-solid p-3 text-left transition-colors ${selected ? 'border-purple-600 bg-white' : 'border-gray-200 bg-gray-50'}`}
  >
    <div className="flex h-8.5 items-center gap-2.5">
      {Icon && (
        <div
          className={`flex h-8.5 w-8.5 items-center justify-center rounded-lg ${selected ? 'bg-purple-50' : 'bg-purple-50'}`}
        >
          <Icon className={`h-5 w-5 ${selected ? 'text-purple-600' : 'text-gray-800'}`} />
        </div>
      )}
      <span
        className={`font-['Inter',sans-serif] text-[20px] font-medium ${selected ? 'text-purple-600' : 'text-gray-800'}`}
      >
        {title}
      </span>
    </div>
    <p className="m-0 font-['Inter',sans-serif] text-[14px] font-medium text-gray-400">
      {description}
    </p>
  </button>
);

export const GoalChip = ({ goal, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-14 w-full items-center gap-3 rounded-xl border-[1.5px] px-4 text-left transition-colors ${selected ? 'border-[#8022FE] bg-white' : 'border-[#E2E2E2]/50 bg-gray-50'}`}
  >
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] ${selected ? 'border-[#8022FE] bg-[#8022FE]' : 'border-[#D0D0D0] bg-transparent'}`}
    >
      {selected && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6L5 9L10 3"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
    <span
      className={`font-['Inter',sans-serif] text-[16px] font-medium ${selected ? 'text-[#8022FE]' : 'text-[#202020]'}`}
    >
      {goal}
    </span>
  </button>
);
