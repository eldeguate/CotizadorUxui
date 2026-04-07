import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Plus, Search, Filter, Copy, Pencil, FileDown, Archive,
  ChevronDown, MoreHorizontal, Eye, RefreshCcw,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Campaign, CampaignStatus } from '../data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusConfig: Record<CampaignStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Borrador', color: '#8E8E93', bg: '#F5F5F7' },
  review: { label: 'En Revisión', color: '#FF9500', bg: '#FFF5E6' },
  active: { label: 'Activa', color: '#34C759', bg: '#F0FBF3' },
  exported: { label: 'Exportada', color: '#007AFF', bg: '#EAF3FF' },
  archived: { label: 'Archivada', color: '#8E8E93', bg: '#F5F5F7' },
};

const tabs: { key: CampaignStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'draft', label: 'Borrador' },
  { key: 'review', label: 'En Revisión' },
  { key: 'active', label: 'Activas' },
  { key: 'exported', label: 'Exportadas' },
  { key: 'archived', label: 'Archivadas' },
];

function StatusBadge({ status }: { status: CampaignStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full"
      style={{ backgroundColor: cfg.bg, color: cfg.color, fontSize: '0.75rem', fontWeight: 500 }}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0" style={{ backgroundColor: cfg.color }} />
      {cfg.label}
    </span>
  );
}

function ActionMenu({ campaign, onDuplicate, onExport, onArchive }: {
  campaign: Campaign;
  onDuplicate: () => void;
  onExport: () => void;
  onArchive: () => void;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setOpen(p => !p)}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden w-48 py-1">
            <button
              onClick={() => { navigate(`/campaigns/${campaign.id}`); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
              style={{ fontSize: '0.875rem', color: '#1C1C1E' }}
            >
              <Eye size={15} className="text-gray-400" />
              Ver detalle
            </button>
            <button
              onClick={() => { navigate(`/campaigns/${campaign.id}/edit`); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
              style={{ fontSize: '0.875rem', color: '#1C1C1E' }}
            >
              <Pencil size={15} className="text-gray-400" />
              Editar
            </button>
            <button
              onClick={() => { onDuplicate(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
              style={{ fontSize: '0.875rem', color: '#1C1C1E' }}
            >
              <Copy size={15} className="text-gray-400" />
              Duplicar
            </button>
            <button
              onClick={() => { onExport(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
              style={{ fontSize: '0.875rem', color: '#007AFF' }}
            >
              <FileDown size={15} />
              Exportar
            </button>
            <div className="h-px bg-gray-100 my-1" />
            <button
              onClick={() => { onArchive(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
              style={{ fontSize: '0.875rem', color: '#FF3B30' }}
            >
              <Archive size={15} />
              Archivar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function Campaigns() {
  const navigate = useNavigate();
  const { campaigns, duplicateCampaign, updateCampaign } = useAppContext();
  const [activeTab, setActiveTab] = useState<CampaignStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'name' | 'lines'>('updatedAt');
  const [exportNotif, setExportNotif] = useState<string | null>(null);

  const filtered = campaigns
    .filter(c => {
      if (activeTab !== 'all' && c.status !== activeTab) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.brandName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'lines') return b.lines.length - a.lines.length;
      return b.updatedAt.localeCompare(a.updatedAt);
    });

  const tabCounts = tabs.map(t => ({
    ...t,
    count: t.key === 'all' ? campaigns.length : campaigns.filter(c => c.status === t.key).length,
  }));

  const handleDuplicate = (id: string) => {
    const newC = duplicateCampaign(id);
    if (newC) {
      setExportNotif(`Campaña duplicada: "${newC.name}"`);
      setTimeout(() => setExportNotif(null), 3000);
    }
  };

  const handleExport = (campaign: Campaign) => {
    navigate('/export');
  };

  const handleArchive = (id: string) => {
    updateCampaign(id, { status: 'archived' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Toast notification */}
      {exportNotif && (
        <div className="fixed top-6 right-6 z-50 bg-[#1C1C1E] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3"
          style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          <RefreshCcw size={15} className="text-[#34C759]" />
          {exportNotif}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C1C1E' }}>Campañas</h1>
          <p style={{ color: '#8E8E93', marginTop: '4px', fontSize: '0.9375rem' }}>
            {campaigns.length} campañas en total
          </p>
        </div>
        <button
          onClick={() => navigate('/campaigns/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#007AFF] text-white rounded-xl hover:bg-[#0071E3] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(0,122,255,0.3)]"
          style={{ fontSize: '0.875rem', fontWeight: 600 }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Nueva Campaña
        </button>
      </div>

      {/* Tabs + Search */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center px-4 pt-4 gap-1 border-b border-gray-100">
          {tabCounts.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-t-lg transition-all relative ${
                activeTab === tab.key ? 'text-[#007AFF]' : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{ fontSize: '0.875rem', fontWeight: activeTab === tab.key ? 600 : 500 }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-full"
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    backgroundColor: activeTab === tab.key ? '#EAF3FF' : '#F5F5F7',
                    color: activeTab === tab.key ? '#007AFF' : '#8E8E93',
                    minWidth: '20px',
                    textAlign: 'center',
                  }}
                >
                  {tab.count}
                </span>
              )}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007AFF] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-50">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar campañas..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-[#007AFF]/40 focus:ring-2 focus:ring-[#007AFF]/10 transition-all"
              style={{ fontSize: '0.875rem' }}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span style={{ fontSize: '0.8125rem', color: '#8E8E93' }}>Ordenar por:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="appearance-none pl-3 pr-8 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none cursor-pointer"
                style={{ fontSize: '0.8125rem', color: '#1C1C1E' }}
              >
                <option value="updatedAt">Más reciente</option>
                <option value="name">Nombre</option>
                <option value="lines">Líneas</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search size={20} className="text-gray-400" />
            </div>
            <p style={{ fontWeight: 600, color: '#3C3C43' }}>No se encontraron campañas</p>
            <p style={{ fontSize: '0.875rem', color: '#8E8E93', marginTop: '4px' }}>Prueba con otros filtros de búsqueda</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #F5F5F7' }}>
                <th className="py-3 px-5 text-left" style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Campaña</th>
                <th className="py-3 px-4 text-left" style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Estado</th>
                <th className="py-3 px-4 text-left" style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Alcance</th>
                <th className="py-3 px-4 text-left" style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Período</th>
                <th className="py-3 px-4 text-left" style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Descuento</th>
                <th className="py-3 px-4 text-right" style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Líneas</th>
                <th className="py-3 px-4 text-right" style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(campaign => (
                <tr
                  key={campaign.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer group"
                  style={{ borderBottom: '1px solid #F9F9F9' }}
                  onClick={() => navigate(`/campaigns/${campaign.id}`)}
                >
                  <td className="py-4 px-5">
                    <div>
                      <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#1C1C1E' }}>{campaign.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#8E8E93', marginTop: '2px' }}>
                        {campaign.brandName} · v{campaign.version} · por {campaign.createdByName}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={campaign.status} />
                  </td>
                  <td className="py-4 px-4">
                    <span style={{ fontSize: '0.8125rem', color: '#3C3C43' }}>
                      {campaign.geographyScope === 'national' ? '🌍 Nacional' :
                       campaign.geographyScope === 'regional' ? `📍 ${campaign.regions?.join(', ')}` :
                       `📌 ${campaign.departments?.join(', ')}`}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p style={{ fontSize: '0.8125rem', color: '#1C1C1E', fontWeight: 500 }}>
                        {format(new Date(campaign.startDate), "d MMM", { locale: es })} – {format(new Date(campaign.endDate), "d MMM", { locale: es })}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#8E8E93' }}>
                        {format(new Date(campaign.endDate), "yyyy", { locale: es })}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C1C1E' }}>
                      {campaign.discountType === 'fixed'
                        ? `$${campaign.discountValue.toLocaleString('es-CO')}`
                        : `${campaign.discountValue}%`}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#8E8E93', marginLeft: '4px' }}>
                      {campaign.currency}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span
                      className="inline-flex items-center justify-center px-2 py-0.5 rounded-lg"
                      style={{ fontSize: '0.875rem', fontWeight: 600, color: '#007AFF', backgroundColor: '#EAF3FF', minWidth: '32px' }}
                    >
                      {campaign.lines.length}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <ActionMenu
                      campaign={campaign}
                      onDuplicate={() => handleDuplicate(campaign.id)}
                      onExport={() => handleExport(campaign)}
                      onArchive={() => handleArchive(campaign.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
          <p style={{ fontSize: '0.8125rem', color: '#8E8E93' }}>
            Mostrando {filtered.length} de {campaigns.length} campañas
          </p>
          <button
            onClick={() => navigate('/campaigns/new')}
            className="flex items-center gap-1.5 text-[#007AFF] hover:underline"
            style={{ fontSize: '0.8125rem', fontWeight: 500 }}
          >
            <Plus size={14} />
            Crear campaña
          </button>
        </div>
      </div>
    </div>
  );
}
