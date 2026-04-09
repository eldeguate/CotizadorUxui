import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Check, X, Database, Tag, Cpu, Package, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { brands as allBrands, categories } from '../data/mockData';
import { geoRegions as regions, geoDepartments as departments } from '../data/geographyData';

type TabKey = 'brands' | 'models' | 'skus' | 'geography';

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'brands', label: 'Marcas & Categorías', icon: Tag },
  { key: 'models', label: 'Modelos', icon: Cpu },
  { key: 'skus', label: 'SKUs', icon: Package },
  { key: 'geography', label: 'Geografía', icon: MapPin },
];

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/10 transition-all"
        style={{ fontSize: '0.875rem', color: '#1C1C1E', width: '280px' }}
      />
    </div>
  );
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${active ? 'bg-[#34C759]' : 'bg-gray-300'}`} />
      <span style={{ fontSize: '0.8125rem', color: active ? '#34C759' : '#8E8E93' }}>
        {active ? 'Activo' : 'Inactivo'}
      </span>
    </span>
  );
}

function TableHeader({ columns }: { columns: string[] }) {
  return (
    <thead>
      <tr style={{ borderBottom: '1px solid #F5F5F7' }}>
        {columns.map(col => (
          <th key={col} className="py-3 px-5 text-left" style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {col}
          </th>
        ))}
        <th className="py-3 px-5 text-right" style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Acciones
        </th>
      </tr>
    </thead>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] text-white rounded-xl hover:bg-[#0071E3] transition-colors shadow-[0_2px_8px_rgba(0,122,255,0.25)]"
      style={{ fontSize: '0.875rem', fontWeight: 600 }}
    >
      <Plus size={15} strokeWidth={2.5} />
      Agregar
    </button>
  );
}

function ImportButton() {
  return (
    <button
      className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
      style={{ fontSize: '0.875rem', fontWeight: 500, color: '#3C3C43' }}
    >
      <Database size={15} />
      Importar CSV
    </button>
  );
}

// ─── Brands Tab ───────────────────────────────────────────────────────────────
function BrandsTab() {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: '', code: '' });
  const [brands, setBrands] = useState(allBrands);

  const filtered = brands.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) || b.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar marcas..." />
        <div className="flex gap-2">
          <ImportButton />
          <AddButton onClick={() => setShowAdd(true)} />
        </div>
      </div>

      {showAdd && (
        <div className="px-5 py-4 border-b border-[#007AFF]/20 bg-[#EAF3FF]/50">
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#007AFF', marginBottom: '10px' }}>Nueva Marca</p>
          <div className="flex gap-3">
            <input
              value={newBrand.name}
              onChange={e => setNewBrand(p => ({ ...p, name: e.target.value }))}
              placeholder="Nombre de la marca"
              className="flex-1 px-4 py-2 bg-white border border-[#007AFF]/30 rounded-xl outline-none focus:border-[#007AFF]"
              style={{ fontSize: '0.875rem' }}
            />
            <input
              value={newBrand.code}
              onChange={e => setNewBrand(p => ({ ...p, code: e.target.value.toUpperCase() }))}
              placeholder="CÓDIGO"
              className="w-28 px-4 py-2 bg-white border border-[#007AFF]/30 rounded-xl outline-none focus:border-[#007AFF] uppercase"
              style={{ fontSize: '0.875rem' }}
            />
            <button
              onClick={() => {
                if (newBrand.name && newBrand.code) {
                  setBrands(p => [...p, { id: `b${Date.now()}`, name: newBrand.name, code: newBrand.code, active: true, logoColor: '#007AFF' }]);
                  setNewBrand({ name: '', code: '' });
                  setShowAdd(false);
                }
              }}
              className="px-4 py-2 bg-[#007AFF] text-white rounded-xl hover:bg-[#0071E3] transition-colors"
              style={{ fontSize: '0.875rem', fontWeight: 600 }}
            >
              <Check size={15} />
            </button>
            <button onClick={() => setShowAdd(false)} className="px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors">
              <X size={15} className="text-gray-500" />
            </button>
          </div>
        </div>
      )}

      <table className="w-full">
        <TableHeader columns={['Marca', 'Código', 'Categorías', 'Estado']} />
        <tbody>
          {filtered.map(brand => (
            <tr key={brand.id} style={{ borderBottom: '1px solid #F9F9F9' }} className="hover:bg-gray-50 transition-colors">
              <td className="py-4 px-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: brand.logoColor + '15' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: brand.logoColor }}>{brand.code.slice(0, 2)}</span>
                  </div>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#1C1C1E' }}>{brand.name}</span>
                </div>
              </td>
              <td className="py-4 px-5">
                <code className="px-2 py-0.5 bg-gray-100 rounded-lg" style={{ fontSize: '0.8125rem', color: '#3C3C43' }}>{brand.code}</code>
              </td>
              <td className="py-4 px-5" style={{ fontSize: '0.875rem', color: '#3C3C43' }}>
                {categories.filter(c => c.brandId === brand.id).map(c => c.name).join(', ') || '—'}
              </td>
              <td className="py-4 px-5">
                <StatusDot active={brand.active} />
              </td>
              <td className="py-4 px-5 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                    <Pencil size={14} className="text-gray-400" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Models Tab ───────────────────────────────────────────────────────────────
function ModelsTab() {
  const { models, brands, skus } = useAppContext();
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');

  const filtered = models.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.code.toLowerCase().includes(search.toLowerCase());
    const matchBrand = brandFilter === 'all' || m.brandId === brandFilter;
    return matchSearch && matchBrand;
  });

  return (
    <div>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar modelos..." />
          <div className="relative">
            <select
              value={brandFilter}
              onChange={e => setBrandFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none cursor-pointer"
              style={{ fontSize: '0.8125rem', color: '#1C1C1E' }}
            >
              <option value="all">Todas las marcas</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1L6 6L11 1" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="flex gap-2">
          <ImportButton />
          <AddButton onClick={() => {}} />
        </div>
      </div>

      <table className="w-full">
        <TableHeader columns={['Modelo', 'Código', 'Marca', 'Categoría', 'SKUs', 'Estado']} />
        <tbody>
          {filtered.map(model => {
            const brand = brands.find(b => b.id === model.brandId);
            const cat = categories.find(c => c.id === model.categoryId);
            return (
              <tr key={model.id} style={{ borderBottom: '1px solid #F9F9F9' }} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-5">
                  <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#1C1C1E' }}>{model.name}</span>
                </td>
                <td className="py-4 px-5">
                  <code className="px-2 py-0.5 bg-gray-100 rounded-lg" style={{ fontSize: '0.8125rem', color: '#3C3C43' }}>{model.code}</code>
                </td>
                <td className="py-4 px-5" style={{ fontSize: '0.875rem', color: '#3C3C43' }}>{brand?.name}</td>
                <td className="py-4 px-5" style={{ fontSize: '0.875rem', color: '#3C3C43' }}>{cat?.name}</td>
                <td className="py-4 px-5">
                  <span className="px-2 py-0.5 rounded-lg bg-[#EAF3FF] text-[#007AFF]" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    {/* Count SKUs for this model */}
                    {skus.filter(s => s.modelId === model.id).length}
                  </span>
                </td>
                <td className="py-4 px-5">
                  <StatusDot active={model.active} />
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                      <Pencil size={14} className="text-gray-400" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── SKUs Tab ─────────────────────────────────────────────────────────────────
function SKUsTab() {
  const { skus } = useAppContext();
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('all');

  const filtered = skus.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase());
    const matchYear = yearFilter === 'all' || s.modelYear.toString() === yearFilter;
    return matchSearch && matchYear;
  });

  return (
    <div>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar SKUs..." />
          <div className="relative">
            <select
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none cursor-pointer"
              style={{ fontSize: '0.8125rem', color: '#1C1C1E' }}
            >
              <option value="all">Todos los años</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1L6 6L11 1" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="flex gap-2">
          <ImportButton />
          <AddButton onClick={() => {}} />
        </div>
      </div>

      <div className="px-4 py-2 border-b border-gray-50 flex items-center gap-2">
        <span style={{ fontSize: '0.8125rem', color: '#8E8E93' }}>
          {filtered.length} SKUs · Total inventario disponible
        </span>
      </div>

      <table className="w-full">
        <TableHeader columns={['SKU / Código', 'Modelo', 'Color', 'Año', 'PVP Base', 'Estado']} />
        <tbody>
          {filtered.map(sku => (
            <tr key={sku.id} style={{ borderBottom: '1px solid #F9F9F9' }} className="hover:bg-gray-50 transition-colors">
              <td className="py-4 px-5">
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1C1C1E' }}>{sku.name}</p>
                  <code className="text-gray-500 mt-0.5 block" style={{ fontSize: '0.75rem' }}>{sku.code}</code>
                </div>
              </td>
              <td className="py-4 px-5" style={{ fontSize: '0.875rem', color: '#3C3C43' }}>{sku.modelName}</td>
              <td className="py-4 px-5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: sku.color === 'Negro' ? '#1C1C1E' : sku.color === 'Rojo' ? '#FF3B30' : sku.color === 'Azul' ? '#007AFF' : sku.color === 'Verde' ? '#34C759' : '#8E8E93' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#3C3C43' }}>{sku.color}</span>
                </div>
              </td>
              <td className="py-4 px-5">
                <span className="px-2 py-0.5 bg-gray-100 rounded-lg" style={{ fontSize: '0.8125rem', color: '#3C3C43', fontWeight: 500 }}>
                  {sku.modelYear}
                </span>
              </td>
              <td className="py-4 px-5">
                <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1C1C1E' }}>
                  ${sku.basePVP.toLocaleString('es-CO')}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#8E8E93', marginLeft: '4px' }}>COP</span>
              </td>
              <td className="py-4 px-5">
                <StatusDot active={sku.active} />
              </td>
              <td className="py-4 px-5 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                    <Pencil size={14} className="text-gray-400" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Geography Tab ────────────────────────────────────────────────────────────
function GeographyTab() {
  const [expandedRegion, setExpandedRegion] = useState<string | null>('r1');

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Countries */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ fontWeight: 600, color: '#1C1C1E' }}>Países</h3>
            <button className="flex items-center gap-1 text-[#007AFF]" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              <Plus size={14} /> Agregar
            </button>
          </div>
          <div className="space-y-2">
            {[{ id: 'co1', name: 'Colombia', code: 'COL', flag: '🇨🇴' }, { id: 'co2', name: 'Ecuador', code: 'ECU', flag: '🇪🇨' }, { id: 'co3', name: 'Perú', code: 'PER', flag: '🇵🇪' }].map(country => (
              <div key={country.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                <span style={{ fontSize: '1.5rem' }}>{country.flag}</span>
                <div className="flex-1">
                  <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#1C1C1E' }}>{country.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#8E8E93' }}>{country.code}</p>
                </div>
                <div className="flex gap-1">
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                    <Pencil size={13} className="text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regions & Departments */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ fontWeight: 600, color: '#1C1C1E' }}>Departamentos & Municipios</h3>
            <button className="flex items-center gap-1 text-[#007AFF]" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              <Plus size={14} /> Agregar
            </button>
          </div>
          <div className="space-y-2">
            {regions.map(region => (
              <div key={region.id} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedRegion(expandedRegion === region.id ? null : region.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${expandedRegion === region.id ? 'bg-[#007AFF]/10' : 'bg-gray-100'}`}>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ transform: expandedRegion === region.id ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <path d="M2 1L6 4L2 7" stroke={expandedRegion === region.id ? '#007AFF' : '#8E8E93'} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C1C1E' }}>{region.name}</p>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-gray-100" style={{ fontSize: '0.6875rem', color: '#8E8E93', fontWeight: 600 }}>
                    {departments.filter(d => d.regionId === region.id).length}
                  </span>
                </button>
                {expandedRegion === region.id && (
                  <div className="border-t border-gray-50 divide-y divide-gray-50">
                    {departments.filter(d => d.regionId === region.id).map(dept => (
                      <div key={dept.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                        <div className="w-1 h-1 rounded-full bg-gray-300 ml-4 flex-shrink-0" />
                        <p style={{ fontSize: '0.8125rem', color: '#3C3C43', flex: 1 }}>{dept.name}</p>
                        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                          <Pencil size={11} className="text-gray-400" />
                        </button>
                      </div>
                    ))}
                    <div className="px-8 py-2.5">
                      <button className="flex items-center gap-1 text-[#007AFF]" style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                        <Plus size={13} /> Agregar municipio
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function MasterData() {
  const [activeTab, setActiveTab] = useState<TabKey>('brands');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C1C1E' }}>Datos Maestros</h1>
        <p style={{ color: '#8E8E93', marginTop: '4px', fontSize: '0.9375rem' }}>
          Administra las marcas, modelos, SKUs y geografía del sistema
        </p>
      </div>

      {/* Main card */}
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
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007AFF]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === 'brands' && <BrandsTab />}
        {activeTab === 'models' && <ModelsTab />}
        {activeTab === 'skus' && <SKUsTab />}
        {activeTab === 'geography' && <GeographyTab />}
      </div>
    </div>
  );
}