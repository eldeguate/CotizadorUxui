import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  FileDown, Settings2, Clock, CheckCircle2, AlertCircle,
  Download, Eye, ChevronRight, RefreshCcw, FileText, Table2,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ExportDestination } from '../data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const destinationConfig: Record<ExportDestination, { label: string; color: string; bg: string; icon: string }> = {
  salesforce: { label: 'Salesforce', color: '#00A1E0', bg: '#E6F6FD', icon: '☁️' },
  sap: { label: 'SAP', color: '#003087', bg: '#E6EBF5', icon: '🔷' },
};

function ExportModal({ open, campaign, profile, onClose, onConfirm }: {
  open: boolean;
  campaign: any;
  profile: any;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open || !campaign || !profile) return null;

  const lines = campaign.lines || [];
  const destCfg = destinationConfig[profile.destination as ExportDestination];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-lg overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-gray-50">
          <h2 style={{ fontWeight: 700, color: '#1C1C1E', fontSize: '1.125rem' }}>Exportar Campaña</h2>
          <p style={{ fontSize: '0.8125rem', color: '#8E8E93', marginTop: '2px' }}>Previsualiza y confirma la exportación</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p style={{ fontSize: '0.75rem', color: '#8E8E93', fontWeight: 500 }}>Campaña</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C1C1E', marginTop: '2px' }}>{campaign.name}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p style={{ fontSize: '0.75rem', color: '#8E8E93', fontWeight: 500 }}>Destino</p>
              <div className="flex items-center gap-2 mt-1">
                <span style={{ fontSize: '1rem' }}>{destCfg.icon}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: destCfg.color }}>{destCfg.label}</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p style={{ fontSize: '0.75rem', color: '#8E8E93', fontWeight: 500 }}>Formato</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C1C1E', marginTop: '2px' }}>
                {profile.format.toUpperCase()}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p style={{ fontSize: '0.75rem', color: '#8E8E93', fontWeight: 500 }}>Líneas</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#007AFF', marginTop: '2px' }}>{lines.length}</p>
            </div>
          </div>

          {/* Validation */}
          <div className="p-4 rounded-xl bg-green-50 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} className="text-[#34C759]" />
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C1C1E' }}>Validación OK</p>
            </div>
            <div className="space-y-1.5">
              {['Todos los campos requeridos completos', `${lines.length} líneas válidas`, 'Mapeo de campos configurado', 'Fechas válidas'].map(msg => (
                <p key={msg} style={{ fontSize: '0.8125rem', color: '#3C3C43' }}>✓ {msg}</p>
              ))}
            </div>
          </div>

          {/* Column preview */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Columnas a exportar
            </p>
            <div className="flex flex-wrap gap-1.5">
              {profile.fieldMappings.slice(0, 8).map((fm: any) => (
                <span key={fm.id} className="px-2 py-0.5 rounded-lg bg-gray-100" style={{ fontSize: '0.75rem', color: '#3C3C43', fontFamily: 'monospace' }}>
                  {fm.exportColumn}
                </span>
              ))}
              {profile.fieldMappings.length > 8 && (
                <span className="px-2 py-0.5 rounded-lg bg-gray-100" style={{ fontSize: '0.75rem', color: '#8E8E93' }}>
                  +{profile.fieldMappings.length - 8} más
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#3C3C43' }}>
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-[#007AFF] text-white rounded-xl hover:bg-[#0071E3] transition-colors shadow-[0_2px_8px_rgba(0,122,255,0.3)] flex items-center justify-center gap-2"
            style={{ fontSize: '0.875rem', fontWeight: 600 }}
          >
            <Download size={15} />
            Descargar {profile.format.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ExportEngine() {
  const { campaigns, exportProfiles, exportRecords, addExportRecord, addAuditEvent, updateCampaign } = useAppContext();
  const navigate = useNavigate();
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState('ep1');
  const [activeTab, setActiveTab] = useState<'export' | 'profiles' | 'history'>('export');
  const [showModal, setShowModal] = useState(false);
  const [exported, setExported] = useState(false);

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
  const selectedProfile = exportProfiles.find(p => p.id === selectedProfileId);

  const exportableCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'review');

  const generateCSV = (campaign: any, profile: any) => {
    const headers = profile.fieldMappings.map((fm: any) => fm.exportColumn).join(',');
    const rows = campaign.lines.map((line: any) => {
      return profile.fieldMappings.map((fm: any) => {
        const key = fm.internalKey as keyof typeof line;
        const val = line[key] ?? campaign[key as keyof typeof campaign] ?? fm.defaultValue ?? '';
        return `"${val}"`;
      }).join(',');
    });
    return [headers, ...rows].join('\n');
  };

  const handleExport = () => {
    if (!selectedCampaign || !selectedProfile) return;
    const csv = generateCSV(selectedCampaign, selectedProfile);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCampaign.name.replace(/\s+/g, '_')}_${selectedProfile.destination}_${new Date().toISOString().split('T')[0]}.${selectedProfile.format}`;
    a.click();
    URL.revokeObjectURL(url);

    const record = {
      id: `ex_${Date.now()}`,
      campaignId: selectedCampaign.id,
      campaignName: selectedCampaign.name,
      profileId: selectedProfile.id,
      profileName: selectedProfile.name,
      exportedBy: 'María Torres',
      exportedAt: new Date().toISOString(),
      lineCount: selectedCampaign.lines.length,
      status: 'success' as const,
      version: selectedCampaign.version,
    };
    addExportRecord(record);
    updateCampaign(selectedCampaign.id, { status: 'exported' });
    addAuditEvent({
      id: `ae_${Date.now()}`,
      entityType: 'export',
      entityId: selectedCampaign.id,
      entityName: selectedCampaign.name,
      action: `Exportado a ${selectedProfile.name}`,
      userId: 'u2',
      userName: 'María Torres',
      timestamp: new Date().toISOString(),
      details: `${selectedCampaign.lines.length} líneas exportadas, versión ${selectedCampaign.version}`,
    });
    setShowModal(false);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Toast */}
      {exported && (
        <div className="fixed top-6 right-6 z-50 bg-[#1C1C1E] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3"
          style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          <CheckCircle2 size={15} className="text-[#34C759]" />
          Exportación completada con éxito
        </div>
      )}

      <ExportModal
        open={showModal}
        campaign={selectedCampaign}
        profile={selectedProfile}
        onClose={() => setShowModal(false)}
        onConfirm={handleExport}
      />

      {/* Header */}
      <div className="mb-6">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C1C1E' }}>Motor de Exportación</h1>
        <p style={{ color: '#8E8E93', marginTop: '4px', fontSize: '0.9375rem' }}>
          Exporta campañas a Salesforce y SAP con mapeo de campos configurable
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-2xl w-fit">
        {([
          ['export', '📤 Exportar', FileDown],
          ['profiles', '⚙️ Perfiles', Settings2],
          ['history', '🕐 Historial', Clock],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2.5 rounded-xl transition-all ${activeTab === key ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
            style={{ fontSize: '0.875rem', fontWeight: activeTab === key ? 600 : 500, color: activeTab === key ? '#1C1C1E' : '#8E8E93' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Export configurator */}
          <div className="col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-50">
              <h3 style={{ fontWeight: 600, color: '#1C1C1E', marginBottom: '16px' }}>1. Selecciona la Campaña</h3>
              {exportableCampaigns.length === 0 ? (
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex items-center gap-3">
                  <AlertCircle size={16} className="text-[#FF9500] flex-shrink-0" />
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C1C1E' }}>Sin campañas listas para exportar</p>
                    <p style={{ fontSize: '0.8125rem', color: '#8E8E93' }}>Solo se pueden exportar campañas en estado "Activa" o "En Revisión".</p>
                    <button onClick={() => navigate('/campaigns')} style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#007AFF', marginTop: '4px' }}>
                      Ir a Campañas →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {exportableCampaigns.map(campaign => (
                    <button
                      key={campaign.id}
                      onClick={() => setSelectedCampaignId(campaign.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                        selectedCampaignId === campaign.id
                          ? 'border-[#007AFF] bg-[#007AFF]/5'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        selectedCampaignId === campaign.id ? 'border-[#007AFF]' : 'border-gray-300'
                      }`}>
                        {selectedCampaignId === campaign.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1C1C1E' }}>{campaign.name}</p>
                        <p style={{ fontSize: '0.8125rem', color: '#8E8E93', marginTop: '1px' }}>
                          {campaign.brandName} · {campaign.lines.length} líneas · v{campaign.version}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-green-50 text-[#34C759]" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        Lista
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-50">
              <h3 style={{ fontWeight: 600, color: '#1C1C1E', marginBottom: '16px' }}>2. Selecciona el Perfil de Exportación</h3>
              <div className="space-y-3">
                {exportProfiles.map(profile => {
                  const destCfg = destinationConfig[profile.destination];
                  return (
                    <button
                      key={profile.id}
                      onClick={() => setSelectedProfileId(profile.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                        selectedProfileId === profile.id
                          ? 'border-[#007AFF] bg-[#007AFF]/5'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        selectedProfileId === profile.id ? 'border-[#007AFF]' : 'border-gray-300'
                      }`}>
                        {selectedProfileId === profile.id && <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF]" />}
                      </div>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: destCfg.bg }}
                      >
                        {destCfg.icon}
                      </div>
                      <div className="flex-1">
                        <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1C1C1E' }}>{profile.name}</p>
                        <p style={{ fontSize: '0.8125rem', color: '#8E8E93' }}>
                          {profile.fieldMappings.length} campos mapeados · {profile.format.toUpperCase()}
                        </p>
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-full"
                        style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: destCfg.bg, color: destCfg.color }}
                      >
                        {destCfg.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                if (selectedCampaign && selectedProfile) setShowModal(true);
              }}
              disabled={!selectedCampaignId || !selectedProfileId}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#007AFF] text-white hover:bg-[#0071E3] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_4px_16px_rgba(0,122,255,0.3)] active:scale-[0.99]"
              style={{ fontSize: '1rem', fontWeight: 600 }}
            >
              <FileDown size={20} />
              Previsualizar y Exportar
            </button>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-50">
              <h3 style={{ fontWeight: 600, color: '#1C1C1E', marginBottom: '12px' }}>Exportaciones Recientes</h3>
              <div className="space-y-3">
                {exportRecords.slice(0, 4).map(record => (
                  <div key={record.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={14} className="text-[#34C759]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1C1C1E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {record.campaignName}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#8E8E93' }}>
                        {record.profileName.split(' - ')[0]} · {record.lineCount} líneas
                      </p>
                      <p style={{ fontSize: '0.6875rem', color: '#C7C7CC' }}>
                        {format(new Date(record.exportedAt), "d MMM, HH:mm", { locale: es })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-50">
              <h3 style={{ fontWeight: 600, color: '#1C1C1E', marginBottom: '12px' }}>Guía de Exportación</h3>
              <div className="space-y-3">
                {[
                  { icon: '1', text: 'Activa la campaña desde el módulo de campañas' },
                  { icon: '2', text: 'Selecciona la campaña y el perfil de destino' },
                  { icon: '3', text: 'Previsualiza y valida las columnas' },
                  { icon: '4', text: 'Descarga y carga el archivo al sistema destino' },
                ].map(step => (
                  <div key={step.icon} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#007AFF]/10 flex items-center justify-center flex-shrink-0">
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#007AFF' }}>{step.icon}</span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#3C3C43', lineHeight: 1.5 }}>{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profiles Tab */}
      {activeTab === 'profiles' && (
        <div className="space-y-5">
          {exportProfiles.map(profile => {
            const destCfg = destinationConfig[profile.destination];
            return (
              <div key={profile.id} className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden">
                <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-50">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: destCfg.bg }}>
                    {destCfg.icon}
                  </div>
                  <div className="flex-1">
                    <h3 style={{ fontWeight: 700, color: '#1C1C1E' }}>{profile.name}</h3>
                    <p style={{ fontSize: '0.8125rem', color: '#8E8E93', marginTop: '2px' }}>{profile.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full" style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: destCfg.bg, color: destCfg.color }}>
                      {profile.format.toUpperCase()}
                    </span>
                    <button className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors" style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#3C3C43' }}>
                      Editar mapeo
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: '1px solid #F5F5F7' }}>
                        {['Campo Interno', 'Etiqueta', 'Columna de Exportación', 'Requerido'].map(h => (
                          <th key={h} className="py-3 px-5 text-left" style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {profile.fieldMappings.map(fm => (
                        <tr key={fm.id} style={{ borderBottom: '1px solid #F9F9F9' }} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-5">
                            <code className="px-2 py-0.5 bg-gray-100 rounded-lg" style={{ fontSize: '0.8125rem', color: '#3C3C43' }}>
                              {fm.internalKey}
                            </code>
                          </td>
                          <td className="py-3 px-5" style={{ fontSize: '0.875rem', color: '#1C1C1E' }}>{fm.internalLabel}</td>
                          <td className="py-3 px-5">
                            <code className="px-2 py-0.5 rounded-lg" style={{ fontSize: '0.8125rem', color: destCfg.color, backgroundColor: destCfg.bg }}>
                              {fm.exportColumn}
                            </code>
                          </td>
                          <td className="py-3 px-5">
                            {fm.required ? (
                              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#FF3B30' }}>Requerido</span>
                            ) : (
                              <span style={{ fontSize: '0.8125rem', color: '#8E8E93' }}>Opcional</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <p style={{ fontWeight: 600, color: '#1C1C1E' }}>Historial de Exportaciones</p>
            <p style={{ fontSize: '0.8125rem', color: '#8E8E93' }}>{exportRecords.length} exportaciones</p>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #F5F5F7' }}>
                {['Campaña', 'Perfil', 'Exportado por', 'Fecha', 'Líneas', 'Estado', ''].map(h => (
                  <th key={h} className="py-3 px-5 text-left" style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exportRecords.map(record => (
                <tr key={record.id} style={{ borderBottom: '1px solid #F9F9F9' }} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-5">
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1C1C1E' }}>{record.campaignName}</p>
                    <p style={{ fontSize: '0.75rem', color: '#8E8E93' }}>v{record.version}</p>
                  </td>
                  <td className="py-4 px-5" style={{ fontSize: '0.875rem', color: '#3C3C43' }}>
                    {record.profileName.split(' - ')[0]}
                  </td>
                  <td className="py-4 px-5" style={{ fontSize: '0.875rem', color: '#3C3C43' }}>{record.exportedBy}</td>
                  <td className="py-4 px-5" style={{ fontSize: '0.875rem', color: '#8E8E93' }}>
                    {format(new Date(record.exportedAt), "d MMM yyyy, HH:mm", { locale: es })}
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-2 py-0.5 rounded-lg bg-[#EAF3FF] text-[#007AFF]" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                      {record.lineCount}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`flex items-center gap-1.5 ${record.status === 'success' ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}
                      style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      <span className={`w-1.5 h-1.5 rounded-full ${record.status === 'success' ? 'bg-[#34C759]' : 'bg-[#FF3B30]'}`} />
                      {record.status === 'success' ? 'Exitoso' : 'Fallido'}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button className="flex items-center gap-1 text-[#007AFF] hover:underline" style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      <Download size={13} /> Re-exportar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
