import { NavLink, Link } from 'react-router-dom';
import { X, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, menuItems, user, onLogout, userBadge }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose}></div>}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 transform flex-col bg-[#0F172A] dark:bg-zinc-800 text-white transition-transform duration-300 ease-in-out lg:static ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Logo */}
        <div className="border-b border-gray-700  px-6 py-5 lg:py-4.5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/WhiteLogo.png" alt="Logo" className="h-6 lg:h-8 w-auto object-contain " />
            </Link>
            <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="mb-2 px-6 text-xs font-semibold tracking-wider text-gray-400 dark:text-white uppercase">
                {section.section}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => {
                  const IconComponent = item.icon;
                  return (
                    <NavLink
                      key={itemIdx}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center px-6 py-3 text-sm no-underline transition-all duration-200 ease-in-out ${isActive
                          ? 'mx-3 rounded-lg bg-[#7C3AED] dark:bg-violet-600 text-white'
                          : 'text-gray-300 dark:text-gray-300 hover:mx-3 hover:rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
                        }`
                      }
                    >
                      <IconComponent className="mr-3 h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Info */}
        <div className="border-t border-gray-700 dark:border-gray-700 p-4">
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-center rounded-lg bg-white dark:bg-violet-600 py-2 text-base font-semibold text-[#7C3AED] dark:text-white transition"
          >
            <LogOut className="mr-2 h-6 w-6" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
