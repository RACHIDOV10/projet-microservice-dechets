import { LayoutDashboard, Bot, BarChart3, PlusCircle, Settings, Trash2, LogOut } from 'lucide-react';

type SidebarProps = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  darkMode: boolean;
  onLogout?: () => void;
};

export function Sidebar({ currentPage, setCurrentPage, darkMode, onLogout }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'robots', label: 'Robots', icon: Bot },
    { id: 'waste', label: 'Waste Management', icon: Trash2 },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'add-robot', label: 'Add Robot', icon: PlusCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 glass border-r border-white/20 dark:border-white/10 flex flex-col transition-colors shadow-premium-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 opacity-50"></div>
      <div className="p-6 border-b border-white/10 dark:border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg transition-premium hover:scale-110 hover:rotate-3">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900 dark:text-white font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">WasteBot</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Admin Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 relative z-10">
        <ul className="space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id} className="animate-slideIn" style={{ animationDelay: `${index * 50}ms` }}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-premium relative overflow-hidden group ${
                    isActive
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/10 dark:from-green-500/30 dark:to-emerald-500/20 text-green-600 dark:text-green-400 shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-sm'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'opacity-100' : ''}`}></div>
                  <Icon className={`w-5 h-5 relative z-10 transition-premium ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="relative z-10 font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-400 rounded-r-full"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10 dark:border-white/5 relative z-10">
        <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl bg-white/30 dark:bg-white/5 backdrop-blur-sm">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 dark:text-white font-semibold truncate">Admin User</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@wastebot.com</p>
          </div>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5 transition-premium hover:shadow-sm group"
          >
            <LogOut className="w-5 h-5 transition-premium group-hover:scale-110" />
            <span className="font-medium">Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}
