import { Outlet, NavLink, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Megaphone,
  Database,
  FileDown,
  Settings,
  ChevronRight,
  Bell,
  Search,
  Plus,
  GitBranch,
  Link2,
  Layers,
} from 'lucide-react';
import { currentUser } from '../data/mockData';
import { useState } from 'react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/campaigns', label: 'Campañas', icon: Megaphone },
  { to: '/master-data', label: 'Datos Maestros', icon: Database },
  { to: '/hierarchy-config', label: 'Configuración Jerarquía', icon: GitBranch },
  { to: '/model-mappings', label: 'Mapeos Externos', icon: Link2 },
  { to: '/external-systems', label: 'Sistemas Externos', icon: Layers },
  { to: '/export', label: 'Motor de Exportación', icon: FileDown },
];

const bottomNavItems = [
  { to: '/settings', label: 'Configuración', icon: Settings },
];

function NavItem({ to, label, icon: Icon, exact }: { to: string; label: string; icon: React.ElementType; exact?: boolean }) {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group select-none ${
        isActive
          ? 'bg-[#007AFF] text-white shadow-[0_2px_8px_rgba(0,122,255,0.3)]'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon size={18} strokeWidth={isActive ? 2 : 1.75} />
      <span style={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 500 }}>{label}</span>
    </NavLink>
  );
}

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  commercial: 'Comercial',
  manager: 'Gerente',
  viewer: 'Visualizador',
};

export function Layout() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F5F5F7] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] flex-shrink-0 h-full bg-white border-r border-gray-100 flex flex-col z-20">
        {/* Logo */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007AFF] flex items-center justify-center shadow-[0_2px_8px_rgba(0,122,255,0.35)]">
              <Megaphone size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, lineHeight: 1.2, color: '#1C1C1E' }}>PromoUMA</p>
              <p style={{ fontSize: '0.6875rem', color: '#8E8E93', lineHeight: 1.2 }}>Grupo UMA</p>
            </div>
          </div>
        </div>

        {/* Quick action */}
        <div className="px-4 pb-4">
          <button
            onClick={() => navigate('/campaigns/new')}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#007AFF] text-white transition-all hover:bg-[#0071E3] active:scale-[0.98] shadow-[0_2px_8px_rgba(0,122,255,0.3)]"
            style={{ fontSize: '0.8125rem', fontWeight: 600 }}
          >
            <Plus size={15} strokeWidth={2.5} />
            Nueva Campaña
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-gray-100 mb-3" />

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <NavItem key={item.to} {...item} />
          ))}

          {/* Divider */}
          <div className="h-px bg-gray-100 my-3 mx-1" />

          {bottomNavItems.map(item => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: currentUser.color + '20', color: currentUser.color }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{currentUser.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1C1C1E', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.name}
              </p>
              <p style={{ fontSize: '0.6875rem', color: '#8E8E93', lineHeight: 1.3 }}>
                {roleLabels[currentUser.role]}
              </p>
            </div>
            <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center px-6 gap-4 flex-shrink-0 z-10">
          <div className="flex-1 flex items-center">
            <div className="relative w-72">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar campañas, modelos, SKUs..."
                className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-xl border-0 outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                style={{ fontSize: '0.8125rem', color: '#1C1C1E' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
              <Bell size={18} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF3B30] rounded-full border-2 border-white" />
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: currentUser.color + '15', color: currentUser.color }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{currentUser.initials}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
