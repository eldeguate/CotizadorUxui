import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft, Pencil, Copy, FileDown, MoreHorizontal,
  MapPin, Calendar, Tag, Package, Clock, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { CampaignStatus } from '../data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';

const statusConfig: Record<CampaignStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Borrador', color: '#8E8E93', bg: '#F5F5F7' },
  review: { label: 'En Revisión', color: '#FF9500', bg: '#FFF5E6' },
  active: { label: 'Activa', color: '#34C759', bg: '#F0FBF3' },
  exported: { label: 'Exportada', color: '#007AFF', bg: '#EAF3FF' },
  archived: { label: 'Archivada', color: '#8E8E93', bg: '#F5F5F7' },
};

export function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { campaigns, duplicateCampaign, updateCampaign, auditEvents } = useAppContext();
  const [activeTab, setActiveTab] = useState<'lines' | 'history'>('lines');

  const campaign = campaigns.find(c => c.id === id);

  if (!campaign) {
    return (
      <div className="p-8 text-center">
        <h2 style={{ color: '#1C1C1E' }}>Campaña no encontrada</h2>
        <button onClick={() => navigate('/campaigns')} className="mt-4 text-[#007AFF]">← Volver a campañas</button>
      </div>
    );
  }

  const cfg = statusConfig[campaign.status];
  const campaignAudit = auditEvents.filter(e => e.entityId === campaign.id);
  const avgDiscount = campaign.lines.length > 0
    ? campaign.lines.reduce((s, l) => s + l.discountValue, 0) / campaign.lines.length
    : campaign.discountValue;

  const handleDuplicate = () => {
    const newC = duplicateCampaign(campaign.id);
    if (newC) navigate(`/campaigns/${newC.id}`);
  };

  const handleStatusChange = (newStatus: CampaignStatus) => {
    updateCampaign(campaign.id, { status: newStatus });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate('/campaigns')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-6"
        style={{ fontSize: '0.875rem', fontWeight: 500 }}
      >
        <ArrowLeft size={16} />
        Campañas
      </button>

      {/* Header card */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-50 mb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full"
                style={{ backgroundColor: cfg.bg, color: cfg.color, fontSize: '0.8125rem', fontWeight: 600 }}
              >
                <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: cfg.color }} />
                {cfg.label}
              </span>
              <span style={{ fontSize: '0.8125rem', color: '#8E8E93' }}>Versión {campaign.version}</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1C1C1E' }}>{campaign.name}</h1>
            {campaign.description && (
              <p style={{ color: '#8E8E93', marginTop: '6px', fontSize: '0.9375rem' }}>{campaign.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDuplicate}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              style={{ fontSize: '0.875rem', color: '#3C3C43', fontWeight: 500 }}
            >
              <Copy size={15} />
              Duplicar
            </button>
            <button
              onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              style={{ fontSize: '0.875rem', color: '#3C3C43', fontWeight: 500 }}
            >
              <Pencil size={15} />
              Editar
            </button>
            <button
              onClick={() => navigate('/export')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#007AFF] text-white hover:bg-[#0071E3] transition-colors shadow-[0_2px_8px_rgba(0,122,255,0.3)]"
              style={{ fontSize: '0.875rem', fontWeight: 600 }}
            >
              <FileDown size={15} />
              Exportar
            </button>
          </div>
        </div>

        {/* Meta info */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-5 border-t border-gray-50">
          <div>
            <p style={{ fontSize: '0.75rem', color: '#8E8E93', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Marca
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <Tag size={14} className="text-[#007AFF]" />
              <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1C1C1E' }}>{campaign.brandName}</p>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#8E8E93', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Período
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar size={14} className="text-[#007AFF]" />
              <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1C1C1E' }}>
                {format(new Date(campaign.startDate), "d MMM", { locale: es })} – {format(new Date(campaign.endDate), "d MMM yyyy", { locale: es })}
              </p>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#8E8E93', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Alcance
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={14} className="text-[#007AFF]" />
              <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1C1C1E' }}>
                {campaign.geographyScope === 'national' ? 'Nacional' :
                 campaign.geographyScope === 'regional' ? campaign.regions?.join(', ') :
                 campaign.departments?.join(', ')}
              </p>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#8E8E93', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Líneas
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <Package size={14} className="text-[#007AFF]" />
              <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1C1C1E' }}>
                {campaign.lines.length} líneas · ${avgDiscount.toLocaleString('es-CO')} desc.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status workflow */}
      {(campaign.status === 'draft' || campaign.status === 'review') && (
        <div className="bg-[#FFF9EE] border border-[#FF9500]/20 rounded-2xl p-4 mb-5 flex items-center gap-4">
          <AlertCircle size={18} className="text-[#FF9500] flex-shrink-0" />
          <div className="flex-1">
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C1C1E' }}>
              {campaign.status === 'draft' ? 'Campaña en borrador' : 'Campaña en revisión'}
            </p>
            <p style={{ fontSize: '0.8125rem', color: '#8E8E93' }}>
              {campaign.status === 'draft' ? 'Envía a revisión para que un gerente pueda aprobarla.' : 'Aprueba o devuelve a borrador.'}
            </p>
          </div>
          <div className="flex gap-2">
            {campaign.status === 'draft' && (
              <button
                onClick={() => handleStatusChange('review')}
                className="px-4 py-2 bg-[#FF9500] text-white rounded-xl hover:bg-orange-500 transition-colors"
                style={{ fontSize: '0.875rem', fontWeight: 600 }}
              >
                Enviar a revisión
              </button>
            )}
            {campaign.status === 'review' && (
              <>
                <button
                  onClick={() => handleStatusChange('draft')}
                  className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  style={{ fontSize: '0.875rem', fontWeight: 500, color: '#3C3C43' }}
                >
                  Devolver
                </button>
                <button
                  onClick={() => handleStatusChange('active')}
                  className="px-4 py-2 bg-[#34C759] text-white rounded-xl hover:bg-green-600 transition-colors"
                  style={{ fontSize: '0.875rem', fontWeight: 600 }}
                >
                  <CheckCircle2 size={15} className="inline mr-1.5" />
                  Aprobar
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tabs + content */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {([['lines', 'Líneas de Promoción'], ['history', 'Historial']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-4 relative transition-colors ${activeTab === key ? 'text-[#007AFF]' : 'text-gray-500 hover:text-gray-700'}`}
              style={{ fontSize: '0.875rem', fontWeight: activeTab === key ? 600 : 500 }}
            >
              {label}
              {activeTab === key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007AFF]" />}
            </button>
          ))}
        </div>

        {activeTab === 'lines' && (
          <>
            <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between">
              <p style={{ fontSize: '0.8125rem', color: '#8E8E93' }}>
                {campaign.lines.length} líneas de promoción generadas
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #F5F5F7' }}>
                    {['SKU', 'Modelo', 'Año', 'Color', 'Geografía', 'PVP Base', 'Descuento', 'Precio Final'].map(h => (
                      <th key={h} className="py-3 px-4 text-left" style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {campaign.lines.map(line => (
                    <tr key={line.id} style={{ borderBottom: '1px solid #F9F9F9' }} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-lg bg-gray-100 font-mono" style={{ fontSize: '0.75rem', color: '#3C3C43' }}>
                          {line.skuCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4" style={{ fontSize: '0.875rem', color: '#1C1C1E', fontWeight: 500 }}>{line.modelName}</td>
                      <td className="py-3.5 px-4" style={{ fontSize: '0.875rem', color: '#3C3C43' }}>{line.modelYear}</td>
                      <td className="py-3.5 px-4" style={{ fontSize: '0.875rem', color: '#3C3C43' }}>{line.color}</td>
                      <td className="py-3.5 px-4" style={{ fontSize: '0.875rem', color: '#3C3C43' }}>{line.geography}</td>
                      <td className="py-3.5 px-4" style={{ fontSize: '0.875rem', color: '#3C3C43' }}>${line.basePVP.toLocaleString('es-CO')}</td>
                      <td className="py-3.5 px-4">
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FF3B30' }}>
                          -${line.discountValue.toLocaleString('es-CO')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#34C759' }}>
                          ${line.finalPrice.toLocaleString('es-CO')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="p-6">
            {campaignAudit.length === 0 ? (
              <div className="text-center py-12">
                <Clock size={32} className="text-gray-300 mx-auto mb-3" />
                <p style={{ color: '#8E8E93', fontSize: '0.875rem' }}>Sin historial de cambios registrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {campaignAudit.map((event, idx) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#007AFF]/10 flex items-center justify-center flex-shrink-0">
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#007AFF' }}>
                          {event.userName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      {idx < campaignAudit.length - 1 && (
                        <div className="w-px flex-1 bg-gray-100 mt-2" />
                      )}
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C1C1E' }}>{event.action}</p>
                          <p style={{ fontSize: '0.8125rem', color: '#8E8E93', marginTop: '2px' }}>{event.userName}</p>
                          {event.details && (
                            <p style={{ fontSize: '0.8125rem', color: '#3C3C43', marginTop: '4px' }}>{event.details}</p>
                          )}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#8E8E93', whiteSpace: 'nowrap' }}>
                          {format(new Date(event.timestamp), "d MMM yyyy, HH:mm", { locale: es })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {campaign.notes && (
        <div className="mt-4 bg-[#F0F9FF] border border-blue-100 rounded-2xl p-4">
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#007AFF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            Notas
          </p>
          <p style={{ fontSize: '0.875rem', color: '#3C3C43' }}>{campaign.notes}</p>
        </div>
      )}
    </div>
  );
}
