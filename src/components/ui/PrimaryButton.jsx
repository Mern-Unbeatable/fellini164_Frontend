const PrimaryButton = ({ children, onClick, type = 'submit', className = '', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded border border-black bg-[#7C3AED] px-6 py-3 text-base font-normal text-[#FFFBFB] transition-all duration-200 hover:bg-[#b388fc] disabled:opacity-50 disabled:cursor-not-allowed md:px-8 md:py-3.5 ${className}`}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
