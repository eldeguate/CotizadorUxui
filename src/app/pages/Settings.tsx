import { useState } from 'react';
import { Check, Pencil, X, Shield, Tag, Users, Globe, Bell } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { users } from '../data/mockData';

type TabKey = 'labels' | 'users' | 'general';

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'labels', label: 'Etiquetas y Taxonomía', icon: Tag },
  { key: 'users', label: 'Usuarios y Roles', icon: Users },
  { key: 'general', label: 'General', icon: Globe },
];

const roleConfig = {
  admin: { label: 'Administrador', color: '#AF52DE', bg: '#F5ECFF', desc: 'Acceso total: datos maestros, configuración, exportación' },
  commercial: { label: 'Comercial', color: '#007AFF', bg: '#EAF3FF', desc: 'Puede crear, editar y exportar campañas' },
  manager: { label: 'Gerente', color: '#34C759', bg: '#F0FBF3', desc: 'Puede aprobar campañas y exportar' },
  viewer: { label: 'Visualizador', color: '#8E8E93', bg: '#F5F5F7', desc: 'Solo lectura, sin permisos de edición' },
};

// ─── Labels Tab ───────────────────────────────────────────────────────────────
function LabelsTab() {
  const { labelConfigs, updateLabelConfig } = useAppContext();
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const categories = [...new Set(labelConfigs.map(l => l.category))];

  return (
    <div className="p-6 space-y-6">
      <div className="p-4 rounded-xl bg-[#EAF3FF] border border-blue-100">
        <p style={{ fontSize: '0.875rem', color: '#007AFF', fontWeight: 600, marginBottom: '2px' }}>
          Sistema de Etiquetas Configurable
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#3C3C43' }}>
          Cambia los nombres que ve el usuario en la interfaz sin afectar el modelo de datos interno ni los mapeos de exportación.
        </p>
      </div>

      {categories.map(cat => (
        <div key={cat}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
            {cat}
          </h3>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #F5F5F7' }}>
                  {['Clave Interna', 'Etiqueta por Defecto', 'Etiqueta Personalizada', ''].map(h => (
                    <th key={h} className="py-3 px-5 text-left" style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {labelConfigs.filter(l => l.category === cat).map(label => (
                  <tr key={label.key} style={{ borderBottom: '1px solid #F9F9F9' }} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-5">
                      <code className="px-2 py-0.5 bg-gray-100 rounded-lg" style={{ fontSize: '0.8125rem', color: '#3C3C43' }}>
                        {label.key}
                      </code>
                    </td>
                    <td className="py-3.5 px-5" style={{ fontSize: '0.875rem', color: '#8E8E93' }}>{label.defaultLabel}</td>
                    <td className="py-3.5 px-5">
                      {editing === label.key ? (
                        <div className="flex items-center gap-2">
                          <input
                            autoFocus
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') { updateLabelConfig(label.key, editValue); setEditing(null); }
                              if (e.key === 'Escape') setEditing(null);
                            }}
                            className="px-3 py-1.5 border border-[#007AFF] rounded-lg outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                            style={{ fontSize: '0.875rem', width: '180px' }}
                          />
                          <button
                            onClick={() => { updateLabelConfig(label.key, editValue); setEditing(null); }}
                            className="w-7 h-7 bg-[#34C759] rounded-lg flex items-center justify-center"
                          >
                            <Check size={13} className="text-white" strokeWidth={3} />
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center"
                          >
                            <X size={13} className="text-gray-500" />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.9375rem', fontWeight: label.customLabel !== label.defaultLabel ? 600 : 400, color: label.customLabel !== label.defaultLabel ? '#1C1C1E' : '#8E8E93' }}>
                          {label.customLabel}
                          {label.customLabel !== label.defaultLabel && (
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-[#007AFF]/10 text-[#007AFF]" style={{ fontSize: '0.6875rem', fontWeight: 600 }}>
                              Personalizado
                            </span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {editing !== label.key && (
                        <button
                          onClick={() => { setEditing(label.key); setEditValue(label.customLabel); }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors ml-auto"
                        >
                          <Pencil size={14} className="text-gray-400" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────
function UsersTab() {
  return (
    <div className="p-6 space-y-6">
      {/* Role legend */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(roleConfig).map(([key, cfg]) => (
          <div key={key} className="p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-1.5">
              <Shield size={14} style={{ color: cfg.color }} />
              <span className="px-2 py-0.5 rounded-full" style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: cfg.bg, color: cfg.color }}>
                {cfg.label}
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#8E8E93' }}>{cfg.desc}</p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h3 style={{ fontWeight: 600, color: '#1C1C1E' }}>Usuarios del Sistema</h3>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] text-white rounded-xl hover:bg-[#0071E3] transition-colors"
            style={{ fontSize: '0.875rem', fontWeight: 600 }}
          >
            + Invitar Usuario
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #F5F5F7' }}>
              {['Usuario', 'Email', 'Rol', 'Acciones'].map(h => (
                <th key={h} className="py-3 px-5 text-left" style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const cfg = roleConfig[user.role as keyof typeof roleConfig];
              return (
                <tr key={user.id} style={{ borderBottom: '1px solid #F9F9F9' }} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: user.color + '20', color: user.color }}
                      >
                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{user.initials}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#1C1C1E' }}>{user.name}</p>
                        {user.id === 'u2' && (
                          <span className="px-1.5 py-0.5 rounded bg-[#007AFF]/10 text-[#007AFF]" style={{ fontSize: '0.6875rem', fontWeight: 600 }}>
                            Tú
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5" style={{ fontSize: '0.875rem', color: '#8E8E93' }}>{user.email}</td>
                  <td className="py-4 px-5">
                    <span className="px-3 py-1 rounded-full" style={{ fontSize: '0.8125rem', fontWeight: 600, backgroundColor: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#3C3C43' }}>
                        Cambiar rol
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── General Tab ──────────────────────────────────────────────────────────────
function GeneralTab() {
  const [settings, setSettings] = useState({
    companyName: 'Grupo UMA',
    defaultCurrency: 'COP',
    defaultCountry: 'Colombia',
    requireApproval: true,
    autoValidate: true,
    emailNotifications: true,
    exportFormat: 'csv',
  });

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full relative transition-colors ${value ? 'bg-[#34C759]' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Company info */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 style={{ fontWeight: 600, color: '#1C1C1E' }}>Configuración de la Empresa</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Nombre de la empresa', key: 'companyName' },
              { label: 'Moneda por defecto', key: 'defaultCurrency' },
              { label: 'País por defecto', key: 'defaultCountry' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3C3C43', display: 'block', marginBottom: '6px' }}>
                  {field.label}
                </label>
                <input
                  value={settings[field.key as keyof typeof settings] as string}
                  onChange={e => setSettings(p => ({ ...p, [field.key]: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/10 transition-all"
                  style={{ fontSize: '0.9375rem' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workflow */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 style={{ fontWeight: 600, color: '#1C1C1E' }}>Flujo de Trabajo</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { key: 'requireApproval', label: 'Requerir aprobación del gerente', desc: 'Las campañas deben ser aprobadas antes de poder exportarse' },
            { key: 'autoValidate', label: 'Validación automática antes de exportar', desc: 'Verifica campos requeridos y mapeos antes de cada exportación' },
            { key: 'emailNotifications', label: 'Notificaciones por email', desc: 'Envía notificaciones cuando el estado de una campaña cambia' },
          ].map(setting => (
            <div key={setting.key} className="flex items-center justify-between px-5 py-4">
              <div>
                <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#1C1C1E' }}>{setting.label}</p>
                <p style={{ fontSize: '0.8125rem', color: '#8E8E93', marginTop: '2px' }}>{setting.desc}</p>
              </div>
              <Toggle
                value={settings[setting.key as keyof typeof settings] as boolean}
                onChange={v => setSettings(p => ({ ...p, [setting.key]: v }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          className="flex items-center gap-2 px-6 py-2.5 bg-[#007AFF] text-white rounded-xl hover:bg-[#0071E3] transition-colors shadow-[0_2px_8px_rgba(0,122,255,0.3)]"
          style={{ fontSize: '0.875rem', fontWeight: 600 }}
        >
          <Check size={15} strokeWidth={2.5} />
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function Settings() {
  const [activeTab, setActiveTab] = useState<TabKey>('labels');

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C1C1E' }}>Configuración</h1>
        <p style={{ color: '#8E8E93', marginTop: '4px', fontSize: '0.9375rem' }}>
          Administra etiquetas, usuarios, roles y configuración general del sistema
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-gray-100">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-4 relative transition-colors ${
                  activeTab === tab.key ? 'text-[#007AFF]' : 'text-gray-500 hover:text-gray-700'
                }`}
                style={{ fontSize: '0.875rem', fontWeight: activeTab === tab.key ? 600 : 500 }}
              >
                <Icon size={15} />
                {tab.label}
                {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007AFF]" />}
              </button>
            );
          })}
        </div>

        {activeTab === 'labels' && <LabelsTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'general' && <GeneralTab />}
      </div>
    </div>
  );
}
