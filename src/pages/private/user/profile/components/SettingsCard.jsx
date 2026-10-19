export default function SettingsCard({ id, icon, title, description, action, children, as, ...rest }) {
  const Tag = as || 'section';
  const Icon = icon;
  return (
    <Tag
      id={id}
      className="scroll-mt-6 rounded-[14px] border border-[#f2f2f2] bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900"
      {...rest}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f9f4ff] text-[#8022fe] dark:bg-purple-950 dark:text-purple-300">
            <Icon size={18} strokeWidth={1.75} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-[16px] font-semibold text-[#181818] dark:text-white">{title}</h2>
          {description && (
            <p className="mt-0.5 text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children && <div className="mt-5">{children}</div>}
    </Tag>
  );
}
