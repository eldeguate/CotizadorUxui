import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, ArrowRight, Check, AlertCircle, CheckCircle2, CalendarIcon, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { useAppContext } from '../context/AppContext';
import { skus, regions, departments, countries } from '../data/mockData';
import type { Campaign, CampaignLine, DiscountType, GeographyScope, SKU } from '../data/mockData';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Select as UISelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  name: string;
  description: string;
  brandId: string;
  startDate: string;
  endDate: string;
  currency: string;
  countryId: string;
  notes: string;
  observations: string;
  selectedSKUs: string[];
  geographyScope: GeographyScope;
  selectedRegions: string[];
  selectedDepartments: string[];
  discountType: DiscountType;
  discountValue: number;
  financier: string;
}

const stepLabels = ['Encabezado', 'Productos', 'Geografía', 'Descuento', 'Previsualización'];

function DatePickerWithInput({ value, onChange, open, onOpenChange }: {
  value: string;
  onChange: (date: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [month, setMonth] = useState<Date>(() => {
    if (value) {
      const parsed = parse(value, 'yyyy-MM-dd', new Date());
      return isValid(parsed) ? parsed : new Date();
    }
    return new Date();
  });
  const [inputValue, setInputValue] = useState('');

  const displayValue = value
    ? format(parse(value, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
    : '';

  const handleInputChange = (input: string) => {
    setInputValue(input);
    const cleanInput = input.replace(/[^\d/]/g, '');

    if (cleanInput.length === 10) {
      const parsed = parse(cleanInput, 'dd/MM/yyyy', new Date());
      if (isValid(parsed)) {
        onChange(format(parsed, 'yyyy-MM-dd'));
        setInputValue('');
      }
    }
  };

  const handleInputBlur = () => {
    setInputValue('');
  };

  const currentYear = month.getFullYear();
  const currentMonth = month.getMonth();

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div className="relative">
          <input
            type="text"
            value={inputValue || displayValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleInputBlur}
            onClick={() => onOpenChange(true)}
            placeholder="DD/MM/AAAA"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/15 transition-all pr-10"
            style={{ fontSize: '0.9375rem', color: '#1C1C1E' }}
          />
          <CalendarIcon size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b border-gray-100 flex items-center justify-between gap-2">
          <button
            onClick={() => setMonth(new Date(currentYear, currentMonth - 1, 1))}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-2">
            <UISelect
              value={currentMonth.toString()}
              onValueChange={(v) => setMonth(new Date(currentYear, parseInt(v), 1))}
            >
              <SelectTrigger className="h-8 text-xs w-[110px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((m, i) => (
                  <SelectItem key={i} value={i.toString()}>{m}</SelectItem>
                ))}
              </SelectContent>
            </UISelect>
            <UISelect
              value={currentYear.toString()}
              onValueChange={(v) => setMonth(new Date(parseInt(v), currentMonth, 1))}
            >
              <SelectTrigger className="h-8 text-xs w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 20 }, (_, i) => currentYear - 5 + i).map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </UISelect>
          </div>
          <button
            onClick={() => setMonth(new Date(currentYear, currentMonth + 1, 1))}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <Calendar
          mode="single"
          selected={value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined}
          onSelect={(date) => {
            if (date) {
              onChange(format(date, 'yyyy-MM-dd'));
              onOpenChange(false);
            }
          }}
          month={month}
          onMonthChange={setMonth}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-0">
      {stepLabels.map((label, i) => {
        const step = (i + 1) as Step;
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  done ? 'bg-[#34C759]' :
                  active ? 'bg-[#007AFF] shadow-[0_2px_8px_rgba(0,122,255,0.4)]' :
                  'bg-gray-100'
                }`}
              >
                {done ? (
                  <Check size={14} className="text-white" strokeWidth={3} />
                ) : (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: active ? 'white' : '#8E8E93' }}>
                    {step}
                  </span>
                )}
              </div>
              <span style={{
                fontSize: '0.6875rem',
                fontWeight: active ? 600 : 400,
                color: active ? '#007AFF' : done ? '#34C759' : '#8E8E93',
                marginTop: '4px',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            </div>
            {i < stepLabels.length - 1 && (
              <div
                className="w-16 h-0.5 mx-2 mb-5 rounded-full transition-colors"
                style={{ backgroundColor: done ? '#34C759' : '#E5E5EA' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FormField({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3C3C43', display: 'block', marginBottom: '6px' }}>
        {label} {required && <span style={{ color: '#FF3B30' }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize: '0.75rem', color: '#8E8E93', marginTop: '4px' }}>{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/15 transition-all"
      style={{ fontSize: '0.9375rem', color: '#1C1C1E' }}
    />
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/15 transition-all cursor-pointer pr-10"
        style={{ fontSize: '0.9375rem', color: '#1C1C1E' }}
      >
        {children}
      </select>
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1L6 6L11 1" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

export function CampaignBuilder() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { campaigns, addCampaign, updateCampaign, brands, models } = useAppContext();
  const isEdit = !!id && id !== 'new';
  const existing = isEdit ? campaigns.find(c => c.id === id) : undefined;

  const [step, setStep] = useState<Step>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const todayFormatted = format(new Date(), 'yyyy-MM-dd');

  const [form, setForm] = useState<FormData>({
    name: existing?.name || '',
    description: existing?.description || '',
    brandId: existing?.brandId || 'b1',
    startDate: existing?.startDate || todayFormatted,
    endDate: existing?.endDate || todayFormatted,
    currency: existing?.currency || 'COP',
    countryId: existing?.countryId || 'co1',
    notes: existing?.notes || '',
    observations: existing?.observations || '',
    selectedSKUs: existing?.lines.map(l => l.skuId) || [],
    geographyScope: existing?.geographyScope || 'national',
    selectedRegions: existing?.regions || [],
    selectedDepartments: existing?.departments || [],
    discountType: existing?.discountType || 'fixed',
    discountValue: existing?.discountValue || 0,
    financier: '',
  });

  const update = (key: keyof FormData, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const handleDateInput = (key: 'startDate' | 'endDate', input: string) => {
    // Allow typing DD/MM/YYYY format
    const cleanInput = input.replace(/[^\d/]/g, '');

    // Try to parse DD/MM/YYYY
    if (cleanInput.length === 10) {
      const parsed = parse(cleanInput, 'dd/MM/yyyy', new Date());
      if (isValid(parsed)) {
        update(key, format(parsed, 'yyyy-MM-dd'));
        return;
      }
    }

    // If not valid yet, store as-is for display
    setForm(prev => ({ ...prev, [key]: input }));
  };

  const toggleSKU = (skuId: string) => {
    setForm(prev => ({
      ...prev,
      selectedSKUs: prev.selectedSKUs.includes(skuId)
        ? prev.selectedSKUs.filter(s => s !== skuId)
        : [...prev.selectedSKUs, skuId],
    }));
  };

  const toggleRegion = (name: string) => {
    setForm(prev => ({
      ...prev,
      selectedRegions: prev.selectedRegions.includes(name)
        ? prev.selectedRegions.filter(r => r !== name)
        : [...prev.selectedRegions, name],
    }));
  };

  const toggleDept = (name: string) => {
    setForm(prev => ({
      ...prev,
      selectedDepartments: prev.selectedDepartments.includes(name)
        ? prev.selectedDepartments.filter(d => d !== name)
        : [...prev.selectedDepartments, name],
    }));
  };

  const brandModels = models.filter(m => m.brandId === form.brandId);
  const brandSKUs = skus.filter(s => brandModels.some(m => m.id === s.modelId));
  const selectedSKUObjects = skus.filter(s => form.selectedSKUs.includes(s.id));

  // Generate lines from selection
  const generateLines = (): CampaignLine[] => {
    return selectedSKUObjects.map((sku, i) => {
      const geo = form.geographyScope === 'national'
        ? 'Nacional'
        : form.geographyScope === 'regional'
        ? form.selectedRegions.join(' / ')
        : form.selectedDepartments.join(' / ');

      const discV = form.discountValue;
      return {
        id: `new_l${i}`,
        skuId: sku.id,
        skuCode: sku.code,
        skuName: sku.name,
        modelName: sku.modelName,
        modelYear: sku.modelYear,
        color: sku.color,
        geography: geo,
        basePVP: sku.basePVP,
        discountType: form.discountType,
        discountValue: discV,
        finalPrice: form.discountType === 'fixed'
          ? sku.basePVP - discV
          : sku.basePVP * (1 - discV / 100),
        brand: brands.find(b => b.id === form.brandId)?.name || 'Bajaj',
      };
    });
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!form.name.trim()) newErrors.name = 'El nombre es requerido';
      if (!form.startDate) newErrors.startDate = 'La fecha de inicio es requerida';
      if (!form.endDate) newErrors.endDate = 'La fecha de fin es requerida';
      if (form.startDate && form.endDate && form.startDate >= form.endDate) {
        newErrors.endDate = 'La fecha de fin debe ser posterior al inicio';
      }
    }
    if (step === 2) {
      if (form.selectedSKUs.length === 0) newErrors.skus = 'Selecciona al menos un SKU';
    }
    if (step === 3) {
      if (form.geographyScope === 'regional' && form.selectedRegions.length === 0) {
        newErrors.regions = 'Selecciona al menos una región';
      }
      if (form.geographyScope === 'departmental' && form.selectedDepartments.length === 0) {
        newErrors.departments = 'Selecciona al menos un departamento';
      }
    }
    if (step === 4) {
      if (form.discountValue <= 0) newErrors.discountValue = 'El descuento debe ser mayor a 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < 5) setStep(s => (s + 1) as Step);
  };

  const prev = () => {
    if (step > 1) setStep(s => (s - 1) as Step);
  };

  const handleSave = (status: 'draft' | 'active') => {
    const lines = generateLines();
    const brand = brands.find(b => b.id === form.brandId);
    const country = countries.find(c => c.id === form.countryId);

    const campaign: Campaign = {
      id: isEdit ? id! : `camp_${Date.now()}`,
      name: form.name,
      description: form.description,
      status,
      version: existing ? existing.version + 1 : 1,
      brandId: form.brandId,
      brandName: brand?.name || 'Bajaj',
      startDate: form.startDate,
      endDate: form.endDate,
      currency: form.currency,
      countryId: form.countryId,
      countryName: country?.name || 'Colombia',
      geographyScope: form.geographyScope,
      regions: form.geographyScope === 'regional' ? form.selectedRegions : undefined,
      departments: form.geographyScope === 'departmental' ? form.selectedDepartments : undefined,
      createdBy: 'u2',
      createdByName: 'María Torres',
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      discountType: form.discountType,
      discountValue: form.discountValue,
      notes: form.notes,
      observations: form.observations,
      lines,
    };

    if (isEdit) {
      updateCampaign(id!, campaign);
    } else {
      addCampaign(campaign);
    }
    setSaved(true);
    setTimeout(() => navigate(`/campaigns/${campaign.id}`), 800);
  };

  if (saved) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#34C759]/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-[#34C759]" />
          </div>
          <h2 style={{ fontWeight: 700, color: '#1C1C1E' }}>¡Campaña guardada!</h2>
          <p style={{ color: '#8E8E93', marginTop: '4px', fontSize: '0.9375rem' }}>Redirigiendo al detalle...</p>
        </div>
      </div>
    );
  }

  const lines = generateLines();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate('/campaigns')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-8"
        style={{ fontSize: '0.875rem', fontWeight: 500 }}
      >
        <ArrowLeft size={16} />
        Campañas
      </button>

      {/* Title */}
      <div className="mb-8">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C1C1E' }}>
          {isEdit ? 'Editar Campaña' : 'Nueva Campaña'}
        </h1>
        <p style={{ color: '#8E8E93', marginTop: '4px', fontSize: '0.9375rem' }}>
          {isEdit ? `Editando: ${existing?.name}` : 'Completa los pasos para crear una nueva campaña de promoción'}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex justify-center mb-8">
        <StepIndicator current={step} />
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden">
        {/* Step header */}
        <div className="px-8 py-5 border-b border-gray-50">
          <h2 style={{ fontWeight: 700, color: '#1C1C1E' }}>
            {step === 1 && 'Encabezado de Campaña'}
            {step === 2 && 'Selección de Productos / SKUs'}
            {step === 3 && 'Alcance Geográfico'}
            {step === 4 && 'Lógica de Descuento'}
            {step === 5 && 'Previsualización y Confirmación'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#8E8E93', marginTop: '2px' }}>
            {step === 1 && 'Define el nombre, fechas y datos generales de la campaña'}
            {step === 2 && 'Selecciona los SKUs a los que aplica esta promoción'}
            {step === 3 && 'Define si la campaña aplica a nivel nacional, regional o departamental'}
            {step === 4 && 'Configura el tipo y valor del descuento'}
            {step === 5 && 'Revisa las líneas de promoción antes de guardar'}
          </p>
        </div>

        {/* Step content */}
        <div className="p-8">
          {/* Step 1: Campaign Header */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <FormField label="Nombre de la Campaña" required>
                    <Input value={form.name} onChange={v => update('name', v)} placeholder="ej. Pulsar Verano 2025" />
                    {errors.name && <p style={{ fontSize: '0.75rem', color: '#FF3B30', marginTop: '4px' }}>{errors.name}</p>}
                  </FormField>
                </div>
                <div className="col-span-2">
                  <FormField label="Descripción">
                    <textarea
                      value={form.description}
                      onChange={e => update('description', e.target.value)}
                      placeholder="Descripción breve de la campaña y su objetivo comercial..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/15 transition-all resize-none"
                      style={{ fontSize: '0.9375rem', color: '#1C1C1E' }}
                    />
                  </FormField>
                </div>
                <FormField label="Marca" required>
                  <Select value={form.brandId} onChange={v => update('brandId', v)}>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </Select>
                </FormField>
                <FormField label="Moneda" required>
                  <Select value={form.currency} onChange={v => update('currency', v)}>
                    <option value="COP">COP – Peso Colombiano</option>
                    <option value="USD">USD – Dólar Americano</option>
                    <option value="EUR">EUR – Euro</option>
                  </Select>
                </FormField>
                <FormField label="Fecha de Inicio" required>
                  <DatePickerWithInput
                    value={form.startDate}
                    onChange={(v) => update('startDate', v)}
                    open={startDateOpen}
                    onOpenChange={setStartDateOpen}
                  />
                  {errors.startDate && <p style={{ fontSize: '0.75rem', color: '#FF3B30', marginTop: '4px' }}>{errors.startDate}</p>}
                </FormField>
                <FormField label="Fecha de Fin" required>
                  <DatePickerWithInput
                    value={form.endDate}
                    onChange={(v) => update('endDate', v)}
                    open={endDateOpen}
                    onOpenChange={setEndDateOpen}
                  />
                  {errors.endDate && <p style={{ fontSize: '0.75rem', color: '#FF3B30', marginTop: '4px' }}>{errors.endDate}</p>}
                </FormField>
                <FormField label="País">
                  <Select value={form.countryId} onChange={v => update('countryId', v)}>
                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Select>
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-2 border-t border-gray-50">
                <FormField label="Notas internas">
                  <textarea
                    value={form.notes}
                    onChange={e => update('notes', e.target.value)}
                    placeholder="Notas para el equipo..."
                    rows={2}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/15 transition-all resize-none"
                    style={{ fontSize: '0.875rem', color: '#1C1C1E' }}
                  />
                </FormField>
                <FormField label="Observaciones">
                  <textarea
                    value={form.observations}
                    onChange={e => update('observations', e.target.value)}
                    placeholder="Observaciones o condiciones especiales..."
                    rows={2}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/15 transition-all resize-none"
                    style={{ fontSize: '0.875rem', color: '#1C1C1E' }}
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* Step 2: SKU selection */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p style={{ fontSize: '0.875rem', color: '#8E8E93' }}>
                  {form.selectedSKUs.length} SKUs seleccionados · {brandSKUs.length} disponibles para {brands.find(b => b.id === form.brandId)?.name}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setForm(p => ({ ...p, selectedSKUs: brandSKUs.map(s => s.id) }))}
                    style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#007AFF' }}
                  >
                    Seleccionar todos
                  </button>
                  <span style={{ color: '#D2D2D7' }}>·</span>
                  <button
                    onClick={() => setForm(p => ({ ...p, selectedSKUs: [] }))}
                    style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#8E8E93' }}
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              {errors.skus && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 mb-4">
                  <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
                  <p style={{ fontSize: '0.875rem', color: '#FF3B30' }}>{errors.skus}</p>
                </div>
              )}

              {/* Group by model */}
              {brandModels.map(model => {
                const modelSKUs = brandSKUs.filter(s => s.modelId === model.id);
                if (modelSKUs.length === 0) return null;
                const allSelected = modelSKUs.every(s => form.selectedSKUs.includes(s.id));
                const someSelected = modelSKUs.some(s => form.selectedSKUs.includes(s.id));

                return (
                  <div key={model.id} className="mb-4 border border-gray-100 rounded-xl overflow-hidden">
                    <div
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        if (allSelected) {
                          setForm(p => ({ ...p, selectedSKUs: p.selectedSKUs.filter(id => !modelSKUs.some(s => s.id === id)) }));
                        } else {
                          setForm(p => ({ ...p, selectedSKUs: [...new Set([...p.selectedSKUs, ...modelSKUs.map(s => s.id)])] }));
                        }
                      }}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        allSelected ? 'bg-[#007AFF] border-[#007AFF]' :
                        someSelected ? 'bg-[#007AFF]/20 border-[#007AFF]' :
                        'border-gray-300'
                      }`}>
                        {(allSelected || someSelected) && <Check size={11} className="text-white" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1C1C1E' }}>{model.name}</span>
                      <span style={{ fontSize: '0.8125rem', color: '#8E8E93', marginLeft: 'auto' }}>{modelSKUs.length} SKUs</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {modelSKUs.map(sku => (
                        <div
                          key={sku.id}
                          className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors hover:bg-blue-50/30 ${
                            form.selectedSKUs.includes(sku.id) ? 'bg-blue-50/20' : ''
                          }`}
                          onClick={() => toggleSKU(sku.id)}
                        >
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            form.selectedSKUs.includes(sku.id) ? 'bg-[#007AFF] border-[#007AFF]' : 'border-gray-300'
                          }`}>
                            {form.selectedSKUs.includes(sku.id) && <Check size={11} className="text-white" strokeWidth={3} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1C1C1E' }}>{sku.name}</p>
                            <p style={{ fontSize: '0.75rem', color: '#8E8E93' }}>{sku.code} · {sku.color} · {sku.modelYear}</p>
                          </div>
                          <div className="text-right">
                            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C1C1E' }}>
                              ${sku.basePVP.toLocaleString('es-CO')}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#8E8E93' }}>PVP base</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 3: Geography */}
          {step === 3 && (
            <div className="space-y-6">
              <FormField label="Tipo de Alcance" required>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: 'national', label: '🌍 Nacional', desc: 'Aplica en todo el país' },
                    { value: 'regional', label: '📍 Regional', desc: 'Por departamentos seleccionados' },
                    { value: 'departmental', label: '📌 Municipal', desc: 'Por municipios específicos' },
                  ] as { value: GeographyScope; label: string; desc: string }[]).map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => update('geographyScope', opt.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        form.geographyScope === opt.value
                          ? 'border-[#007AFF] bg-[#007AFF]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p style={{ fontSize: '1rem', marginBottom: '4px' }}>{opt.label.split(' ')[0]}</p>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C1C1E' }}>{opt.label.split(' ').slice(1).join(' ')}</p>
                      <p style={{ fontSize: '0.75rem', color: '#8E8E93', marginTop: '2px' }}>{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </FormField>

              {form.geographyScope === 'regional' && (
                <FormField label="Selecciona Departamentos" required>
                  {errors.regions && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 mb-3">
                      <AlertCircle size={15} className="text-red-500" />
                      <p style={{ fontSize: '0.875rem', color: '#FF3B30' }}>{errors.regions}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2">
                    {regions.map(region => (
                      <button
                        key={region.id}
                        onClick={() => toggleRegion(region.name)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all text-left ${
                          form.selectedRegions.includes(region.name)
                            ? 'border-[#007AFF] bg-[#007AFF]/5 text-[#007AFF]'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                        style={{ fontSize: '0.875rem', fontWeight: form.selectedRegions.includes(region.name) ? 600 : 400 }}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${
                          form.selectedRegions.includes(region.name) ? 'bg-[#007AFF] border-[#007AFF]' : 'border-gray-300'
                        }`}>
                          {form.selectedRegions.includes(region.name) && <Check size={10} className="text-white" strokeWidth={3} />}
                        </div>
                        {region.name}
                      </button>
                    ))}
                  </div>
                </FormField>
              )}

              {form.geographyScope === 'departmental' && (
                <FormField label="Selecciona Municipios" required>
                  {errors.departments && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 mb-3">
                      <AlertCircle size={15} className="text-red-500" />
                      <p style={{ fontSize: '0.875rem', color: '#FF3B30' }}>{errors.departments}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-4 gap-2">
                    {departments.map(dept => (
                      <button
                        key={dept.id}
                        onClick={() => toggleDept(dept.name)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all text-left ${
                          form.selectedDepartments.includes(dept.name)
                            ? 'border-[#007AFF] bg-[#007AFF]/5 text-[#007AFF]'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                        style={{ fontSize: '0.8125rem', fontWeight: form.selectedDepartments.includes(dept.name) ? 600 : 400 }}
                      >
                        <div className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center ${
                          form.selectedDepartments.includes(dept.name) ? 'bg-[#007AFF] border-[#007AFF]' : 'border-gray-300'
                        }`}>
                          {form.selectedDepartments.includes(dept.name) && <Check size={10} className="text-white" strokeWidth={3} />}
                        </div>
                        {dept.name}
                      </button>
                    ))}
                  </div>
                </FormField>
              )}

              {form.geographyScope === 'national' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
                  <CheckCircle2 size={18} className="text-[#34C759] flex-shrink-0" />
                  <p style={{ fontSize: '0.875rem', color: '#1C1C1E' }}>
                    La campaña aplicará a <strong>todo el territorio nacional</strong> sin restricción geográfica.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Discount */}
          {step === 4 && (
            <div className="space-y-6">
              <FormField label="Tipo de Descuento" required>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { value: 'fixed', label: 'Monto Fijo', desc: 'Descuento en valor absoluto (ej. $500.000)', icon: '$' },
                    { value: 'percentage', label: 'Porcentaje', desc: 'Descuento porcentual sobre el PVP base', icon: '%' },
                  ] as { value: DiscountType; label: string; desc: string; icon: string }[]).map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => update('discountType', opt.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        form.discountType === opt.value
                          ? 'border-[#007AFF] bg-[#007AFF]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                        style={{ backgroundColor: form.discountType === opt.value ? '#007AFF' : '#F5F5F7' }}
                      >
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: form.discountType === opt.value ? 'white' : '#8E8E93' }}>
                          {opt.icon}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1C1C1E' }}>{opt.label}</p>
                      <p style={{ fontSize: '0.8125rem', color: '#8E8E93', marginTop: '2px' }}>{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </FormField>

              <FormField
                label={form.discountType === 'fixed' ? `Valor del Descuento (${form.currency})` : 'Porcentaje de Descuento'}
                required
              >
                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ fontSize: '1rem', fontWeight: 600, color: '#8E8E93' }}
                  >
                    {form.discountType === 'fixed' ? '$' : '%'}
                  </span>
                  <input
                    type="number"
                    value={form.discountValue || ''}
                    onChange={e => update('discountValue', Number(e.target.value))}
                    placeholder={form.discountType === 'fixed' ? '500000' : '5'}
                    min={0}
                    max={form.discountType === 'percentage' ? 100 : undefined}
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/15 transition-all"
                    style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1C1C1E' }}
                  />
                </div>
                {errors.discountValue && <p style={{ fontSize: '0.75rem', color: '#FF3B30', marginTop: '4px' }}>{errors.discountValue}</p>}
              </FormField>

              <FormField label="Financiera (opcional)" hint="Ej. Banco Davivienda, Financorp, efectivo">
                <Input value={form.financier} onChange={v => update('financier', v)} placeholder="Nombre de la financiera" />
              </FormField>

              {/* Preview summary */}
              {form.discountValue > 0 && form.selectedSKUs.length > 0 && (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Vista Previa
                  </p>
                  <div className="space-y-2">
                    {selectedSKUObjects.slice(0, 3).map(sku => (
                      <div key={sku.id} className="flex items-center justify-between">
                        <span style={{ fontSize: '0.875rem', color: '#3C3C43' }}>{sku.name}</span>
                        <div className="flex items-center gap-3">
                          <span style={{ fontSize: '0.8125rem', color: '#8E8E93', textDecoration: 'line-through' }}>
                            ${sku.basePVP.toLocaleString('es-CO')}
                          </span>
                          <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#34C759' }}>
                            ${(form.discountType === 'fixed'
                              ? sku.basePVP - form.discountValue
                              : sku.basePVP * (1 - form.discountValue / 100)
                            ).toLocaleString('es-CO')}
                          </span>
                        </div>
                      </div>
                    ))}
                    {selectedSKUObjects.length > 3 && (
                      <p style={{ fontSize: '0.8125rem', color: '#8E8E93' }}>+ {selectedSKUObjects.length - 3} más...</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Preview */}
          {step === 5 && (
            <div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-100 mb-6">
                <CheckCircle2 size={18} className="text-[#34C759] flex-shrink-0" />
                <p style={{ fontSize: '0.875rem', color: '#1C1C1E' }}>
                  Todo listo. Se generarán <strong>{lines.length} líneas de promoción</strong> para la campaña <strong>"{form.name}"</strong>.
                </p>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'SKUs', value: `${form.selectedSKUs.length}` },
                  { label: 'Geografía', value: form.geographyScope === 'national' ? 'Nacional' : form.geographyScope === 'regional' ? `${form.selectedRegions.length} regiones` : `${form.selectedDepartments.length} municipios` },
                  { label: 'Descuento', value: form.discountType === 'fixed' ? `$${form.discountValue.toLocaleString('es-CO')}` : `${form.discountValue}%` },
                ].map(item => (
                  <div key={item.label} className="text-center p-4 bg-gray-50 rounded-xl">
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C1C1E' }}>{item.value}</p>
                    <p style={{ fontSize: '0.8125rem', color: '#8E8E93', marginTop: '2px' }}>{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Lines table */}
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#3C3C43' }}>Líneas Generadas</p>
                  <span className="px-2 py-0.5 rounded-full bg-[#007AFF]/10 text-[#007AFF]" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    {lines.length}
                  </span>
                </div>
                <div className="overflow-x-auto max-h-64">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white">
                      <tr style={{ borderBottom: '1px solid #F5F5F7' }}>
                        {['SKU', 'Modelo', 'Año', 'Geografía', 'PVP Base', 'Descuento', 'Precio Final'].map(h => (
                          <th key={h} className="py-2 px-3 text-left" style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #F9F9F9' }}>
                          <td className="py-2.5 px-3"><span className="font-mono text-gray-600" style={{ fontSize: '0.75rem' }}>{line.skuCode}</span></td>
                          <td className="py-2.5 px-3" style={{ fontSize: '0.8125rem', color: '#1C1C1E' }}>{line.modelName}</td>
                          <td className="py-2.5 px-3" style={{ fontSize: '0.8125rem', color: '#3C3C43' }}>{line.modelYear}</td>
                          <td className="py-2.5 px-3" style={{ fontSize: '0.8125rem', color: '#3C3C43' }}>{line.geography}</td>
                          <td className="py-2.5 px-3" style={{ fontSize: '0.8125rem', color: '#3C3C43' }}>${line.basePVP.toLocaleString('es-CO')}</td>
                          <td className="py-2.5 px-3" style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#FF3B30' }}>-${line.discountValue.toLocaleString('es-CO')}</td>
                          <td className="py-2.5 px-3" style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#34C759' }}>${line.finalPrice.toLocaleString('es-CO')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="px-8 py-5 border-t border-gray-50 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ fontSize: '0.875rem', fontWeight: 500, color: '#3C3C43' }}
          >
            <ArrowLeft size={15} />
            Anterior
          </button>

          <div className="flex gap-3">
            {step === 5 ? (
              <>
                <button
                  onClick={() => handleSave('draft')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                  style={{ fontSize: '0.875rem', fontWeight: 500, color: '#3C3C43' }}
                >
                  Guardar como Borrador
                </button>
                <button
                  onClick={() => handleSave('active')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#34C759] text-white hover:bg-green-600 transition-all shadow-[0_2px_8px_rgba(52,199,89,0.3)]"
                  style={{ fontSize: '0.875rem', fontWeight: 600 }}
                >
                  <CheckCircle2 size={15} />
                  Activar Campaña
                </button>
              </>
            ) : (
              <button
                onClick={next}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#007AFF] text-white hover:bg-[#0071E3] transition-all shadow-[0_2px_8px_rgba(0,122,255,0.3)]"
                style={{ fontSize: '0.875rem', fontWeight: 600 }}
              >
                Siguiente
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}