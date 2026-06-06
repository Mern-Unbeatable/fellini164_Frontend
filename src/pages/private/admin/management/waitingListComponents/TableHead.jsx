const TableHead = () => {
  return (
    <thead>
      <tr className="border-b border-[#FCFCFD] bg-[#F8FBFE]  dark:text-white dark:border-gray-700  dark:bg-zinc-700">
        <th className="px-8 py-5 pl-10 text-sm font-medium text-[#666B74] uppercase dark:text-gray-200 ">User</th>
        <th className="px-6 py-5 text-sm font-medium text-[#666B74] uppercase dark:text-gray-200">Status</th>
        <th className="px-6 py-5 text-sm font-medium text-[#666B74] uppercase dark:text-gray-200">Referrals</th>
        <th className="px-6 py-5 text-sm font-medium text-[#666B74] uppercase dark:text-gray-200">Joined Date</th>
        <th className="px-6 py-5 pr-10 text-right text-sm font-medium text-[#666B74] uppercase dark:text-gray-200">
          Action
        </th>
      </tr>
    </thead>
  );
};

export default TableHead;
