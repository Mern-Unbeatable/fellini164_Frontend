const TableHead = () => {
  return (
    <thead>
      <tr className="border-b border-[#f2f2f2] dark:border-zinc-700 bg-[#fcfcfc] dark:bg-zinc-800">
        <th className="px-6 py-2.5 text-left text-[12px] font-medium text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">User</th>
        <th className="px-6 py-2.5 text-left text-[12px] font-medium text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">Status</th>
        <th className="px-6 py-2.5 text-left text-[12px] font-medium text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">Referrals</th>
        <th className="px-6 py-2.5 text-left text-[12px] font-medium text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">Joined Date</th>
        <th className="px-6 py-2.5 text-right text-[12px] font-medium text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">Action</th>
      </tr>
    </thead>
  );
};

export default TableHead;
