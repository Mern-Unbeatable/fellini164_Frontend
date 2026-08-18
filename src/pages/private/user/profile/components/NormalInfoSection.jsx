export default function NormalInfoSection({
  inputClassName,
  fullName,
  email,
  phone,
  setFullName,
  setEmail,
  setPhone,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[#f2f2f2] bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900"
    >
      <h2 className="text-[16px] font-semibold text-[#181818] dark:text-white">Normal Info</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            Full Name
          </label>
          <input
            className={inputClassName}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            className={inputClassName}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            Phone
          </label>
          <input
            className={inputClassName}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+880..."
          />
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-[#8022fe] px-4 py-2 text-[13px] font-semibold text-white transition hover:opacity-90"
        >
          Save Info
        </button>
      </div>
    </form>
  );
}
