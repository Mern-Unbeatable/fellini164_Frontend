import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, LogOut, PanelLeft, PanelLeftClose } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, menuItems, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const showExpanded = !collapsed || isOpen;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-lg lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`scrollbar-hidden fixed inset-y-0 left-0 z-50 flex h-screen w-[220px] flex-col overflow-y-auto border-r border-[#f2f2f2] bg-white transition-transform duration-300 ease-in-out dark:border-zinc-700 dark:bg-zinc-900 lg:static lg:translate-x-0 max-lg:w-[75%] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-[72px]' : ''}`}
      >
        {/* Logo / Header */}
        <div
          className={`flex h-[52px] w-full shrink-0 items-center border-b border-[#f2f2f2] px-[12px] dark:border-zinc-700 ${
            showExpanded ? 'justify-between' : 'justify-center'
          }`}
        >
          {showExpanded && (
            <Link to="/" onClick={onClose} className="flex h-[30px] w-[133px] shrink-0 items-center no-underline">
              <img
                src="/logo.png"
                alt="Elyxa.Ai"
                width={133}
                height={30}
                className="h-[30px] w-[133px] shrink-0 object-contain object-left"
              />
            </Link>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="inline-flex shrink-0 items-center justify-center rounded-lg p-1.5 text-[#5d5d5d] hover:bg-[#f2f2f2] lg:hidden dark:text-gray-300 dark:hover:bg-zinc-800"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden shrink-0 text-[#c2c2c2] hover:text-[#5d5d5d] dark:text-zinc-500 dark:hover:text-gray-300 lg:flex"
          >
            {collapsed ? (
              <PanelLeft size={18} strokeWidth={1.5} />
            ) : (
              <PanelLeftClose size={18} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {menuItems.map((section, idx) => (
            <div key={idx} className="flex w-full flex-col gap-1.5 px-2 py-3">
              {showExpanded && (
                <div className="flex w-full items-center px-2.5">
                  <p className="flex-1 text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">
                    {section.section}
                  </p>
                </div>
              )}
              <div className="flex w-full flex-col gap-1">
                {section.items.map((item, itemIdx) => {
                  const IconComponent = item.icon;
                  return (
                    <NavLink
                      key={itemIdx}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `relative flex h-[33px] w-full items-center gap-2 rounded-[10px] px-2.5 py-1.5 no-underline transition-all duration-200 ease-in-out ${
                          isActive
                            ? 'bg-[#f9f4ff] text-[#8022fe] dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-white text-[#5d5d5d] hover:bg-[#fcfcfc] dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800'
                        } ${!showExpanded ? 'justify-center' : ''}`
                      }
                      title={!showExpanded ? item.label : undefined}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 top-[9px] h-[15px] w-[2px] rounded-r-xl bg-[#8022fe]" />
                          )}
                          <IconComponent size={18} className="shrink-0" strokeWidth={1.75} />
                          {showExpanded && (
                            <p className="min-w-0 flex-1 text-[14px] font-medium whitespace-nowrap">
                              {item.label}
                            </p>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Info / Logout */}
        <div className="border-t border-[#f2f2f2] dark:border-zinc-700 p-4">
          <button
            onClick={onLogout}
            className={`flex w-full items-center gap-2 rounded-[10px] px-2.5 py-1.5 text-[#5d5d5d] hover:bg-[#fcfcfc] dark:text-gray-300 dark:hover:bg-zinc-800 transition ${
              !showExpanded ? 'justify-center' : ''
            }`}
            title={!showExpanded ? 'Logout' : undefined}
          >
            <LogOut size={18} strokeWidth={1.75} className="shrink-0" />
            {showExpanded && (
              <span className="text-[14px] font-medium whitespace-nowrap">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
