import { useNavigate } from 'react-router';
import {
  Megaphone,
  CheckCircle2,
  FileDown,
  Hash,
  ArrowUpRight,
  Clock,
  Plus,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAppContext } from '../context/AppContext';
import { monthlyCampaignStats } from '../data/mockData';
import { CampaignStatus } from '../data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusConfig: Record<CampaignStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Borrador', color: '#8E8E93', bg: '#F5F5F7' },
  review: { label: 'En Revisión', color: '#FF9500', bg: '#FFF5E6' },
  active: { label: 'Activa', color: '#34C759', bg: '#F0FBF3' },
  exported: { label: 'Exportada', color: '#007AFF', bg: '#EAF3FF' },
  archived: { label: 'Archivada', color: '#8E8E93', bg: '#F5F5F7' },
};

function StatusBadge({ status }: { status: CampaignStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full"
      style={{ backgroundColor: cfg.bg, color: cfg.color, fontSize: '0.75rem', fontWeight: 500 }}
    >
      {cfg.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, onClick }: {
  icon: React.ElementType; label: string; value: string | number; sub: string; color: string; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-50 text-left w-full hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + '15', color }}
        >
          <Icon size={20} strokeWidth={1.75} />
        </div>
        <ArrowUpRight size={16} className="text-gray-300" />
      </div>
      <div className="mt-4">
        <p style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1C1C1E', lineHeight: 1.1 }}>{value}</p>
        <p style={{ fontSize: '0.875rem', color: '#3C3C43', fontWeight: 500, marginTop: '2px' }}>{label}</p>
        <p style={{ fontSize: '0.75rem', color: '#8E8E93', marginTop: '4px' }}>{sub}</p>
      </div>
    </button>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3" style={{ fontSize: '0.8125rem' }}>
        <p style={{ fontWeight: 600, color: '#1C1C1E', marginBottom: '4px' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>
            {p.name === 'campaigns' ? 'Campañas' : p.name === 'lines' ? 'Líneas' : 'Exportadas'}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const { campaigns, auditEvents } = useAppContext();
  const navigate = useNavigate();

  const total = campaigns.length;
  const active = campaigns.filter(c => c.status === 'active').length;
  const pending = campaigns.filter(c => c.status === 'draft' || c.status === 'review').length;
  const totalLines = campaigns.reduce((sum, c) => sum + c.lines.length, 0);
  const recent = [...campaigns].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C1C1E', lineHeight: 1.2 }}>
            Buenos días, María 👋
          </h1>
          <p style={{ color: '#8E8E93', marginTop: '4px', fontSize: '0.9375rem' }}>
            {format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es })}
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

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={Megaphone}
          label="Total Campañas"
          value={total}
          sub="en el sistema"
          color="#007AFF"
          onClick={() => navigate('/campaigns')}
        />
        <StatCard
          icon={CheckCircle2}
          label="Campañas Activas"
          value={active}
          sub="en ejecución ahora"
          color="#34C759"
          onClick={() => navigate('/campaigns')}
        />
        <StatCard
          icon={Clock}
          label="Pendientes"
          value={pending}
          sub="borradores y en revisión"
          color="#FF9500"
          onClick={() => navigate('/campaigns')}
        />
        <StatCard
          icon={Hash}
          label="Líneas Totales"
          value={totalLines}
          sub="filas de promoción generadas"
          color="#AF52DE"
        />
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-3 gap-5 mb-5">
        {/* Chart */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 style={{ fontWeight: 600, color: '#1C1C1E' }}>Actividad de Campañas</h3>
              <p style={{ fontSize: '0.8125rem', color: '#8E8E93', marginTop: '2px' }}>Últimos 7 meses</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1.5 rounded-full bg-[#007AFF]" />
                <span style={{ fontSize: '0.75rem', color: '#8E8E93' }}>Campañas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1.5 rounded-full bg-[#34C759]" />
                <span style={{ fontSize: '0.75rem', color: '#8E8E93' }}>Exportadas</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart id="dashboard-campaign-chart" data={monthlyCampaignStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dashboardColorCampaigns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007AFF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dashboardColorExported" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34C759" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#34C759" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8E8E93' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8E8E93' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area id="area-campaigns" type="monotone" dataKey="campaigns" name="campaigns" stroke="#007AFF" strokeWidth={2.5} fill="url(#dashboardColorCampaigns)" dot={false} activeDot={{ r: 4, fill: '#007AFF', strokeWidth: 0 }} />
              <Area id="area-exported" type="monotone" dataKey="exported" name="exported" stroke="#34C759" strokeWidth={2.5} fill="url(#dashboardColorExported)" dot={false} activeDot={{ r: 4, fill: '#34C759', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-50">
          <div className="flex items-center justify-between mb-5">
            <h3 style={{ fontWeight: 600, color: '#1C1C1E' }}>Actividad Reciente</h3>
            <TrendingUp size={16} className="text-gray-300" />
          </div>
          <div className="space-y-4">
            {auditEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: '#007AFF15', color: '#007AFF' }}
                >
                  <span style={{ fontSize: '0.625rem', fontWeight: 700 }}>
                    {event.userName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '0.8125rem', color: '#1C1C1E', lineHeight: 1.4 }}>
                    <strong style={{ fontWeight: 600 }}>{event.action}</strong>
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#8E8E93', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {event.entityName}
                  </p>
                  <p style={{ fontSize: '0.6875rem', color: '#C7C7CC', marginTop: '1px' }}>
                    {event.userName} · {format(new Date(event.timestamp), "d MMM", { locale: es })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent campaigns */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h3 style={{ fontWeight: 600, color: '#1C1C1E' }}>Campañas Recientes</h3>
          <button
            onClick={() => navigate('/campaigns')}
            className="flex items-center gap-1 text-[#007AFF] hover:underline transition-all"
            style={{ fontSize: '0.875rem', fontWeight: 500 }}
          >
            Ver todas <ArrowUpRight size={14} />
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="py-3 px-6 text-left" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nombre</th>
              <th className="py-3 px-4 text-left" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado</th>
              <th className="py-3 px-4 text-left" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Marca</th>
              <th className="py-3 px-4 text-left" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Período</th>
              <th className="py-3 px-4 text-right" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Líneas</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((campaign) => (
              <tr
                key={campaign.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/campaigns/${campaign.id}`)}
              >
                <td className="py-4 px-6">
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1C1C1E' }}>{campaign.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#8E8E93', marginTop: '1px' }}>
                      {campaign.geographyScope === 'national' ? '🌍 Nacional' : campaign.geographyScope === 'regional' ? '📍 Regional' : '📌 Departamental'}
                      {' · '}v{campaign.version}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <StatusBadge status={campaign.status} />
                </td>
                <td className="py-4 px-4">
                  <span style={{ fontSize: '0.875rem', color: '#3C3C43' }}>{campaign.brandName}</span>
                </td>
                <td className="py-4 px-4">
                  <span style={{ fontSize: '0.8125rem', color: '#8E8E93' }}>
                    {format(new Date(campaign.startDate), "d MMM", { locale: es })} – {format(new Date(campaign.endDate), "d MMM yyyy", { locale: es })}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span
                    className="inline-flex items-center justify-center px-2 py-0.5 rounded-lg"
                    style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#007AFF', backgroundColor: '#EAF3FF', minWidth: '32px' }}
                  >
                    {campaign.lines.length}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pending alert */}
        {pending > 0 && (
          <div className="px-6 py-4 border-t border-gray-50 flex items-center gap-3 bg-[#FFF9EE]">
            <AlertCircle size={16} className="text-[#FF9500] flex-shrink-0" />
            <p style={{ fontSize: '0.8125rem', color: '#3C3C43' }}>
              Hay <strong style={{ color: '#FF9500' }}>{pending} campaña{pending > 1 ? 's' : ''}</strong> pendiente{pending > 1 ? 's' : ''} de revisión o aprobación.
            </p>
            <button
              onClick={() => navigate('/campaigns')}
              style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#FF9500', marginLeft: 'auto', whiteSpace: 'nowrap' }}
            >
              Revisar →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}