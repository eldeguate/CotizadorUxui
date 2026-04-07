import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  campaigns as initialCampaigns,
  brands as initialBrands,
  models as initialModels,
  skus as initialSKUs,
  productCategories as initialProductCategories,
  segments as initialSegments,
  modelVariants as initialModelVariants,
  externalMappings as initialExternalMappings,
  modelExternalMappings as initialModelExternalMappings,
  externalSystems as initialExternalSystems,
  exportRecords as initialExportRecords,
  auditEvents as initialAuditEvents,
  labelConfigs as initialLabelConfigs,
  exportProfiles as initialExportProfiles,
  Campaign,
  Brand,
  ModelItem,
  SKU,
  ProductCategory,
  Segment,
  ModelVariant,
  ExternalMapping,
  ModelExternalMapping,
  ExternalSystem,
  ExportRecord,
  AuditEvent,
  LabelConfig,
  ExportProfile,
} from '../data/mockData';

interface AppContextType {
  campaigns: Campaign[];
  addCampaign: (c: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  duplicateCampaign: (id: string) => Campaign | null;

  brands: Brand[];
  models: ModelItem[];
  skus: SKU[];
  productCategories: ProductCategory[];
  segments: Segment[];
  modelVariants: ModelVariant[];
  externalMappings: ExternalMapping[];
  modelExternalMappings: ModelExternalMapping[];
  addModelExternalMapping: (m: ModelExternalMapping) => void;
  updateModelExternalMapping: (id: string, updates: Partial<ModelExternalMapping>) => void;
  deleteModelExternalMapping: (id: string) => void;

  externalSystems: ExternalSystem[];
  addExternalSystem: (s: ExternalSystem) => void;
  updateExternalSystem: (id: string, updates: Partial<ExternalSystem>) => void;
  deleteExternalSystem: (id: string) => void;

  exportProfiles: ExportProfile[];
  exportRecords: ExportRecord[];
  addExportRecord: (r: ExportRecord) => void;

  auditEvents: AuditEvent[];
  addAuditEvent: (e: AuditEvent) => void;

  labelConfigs: LabelConfig[];
  updateLabelConfig: (key: string, customLabel: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [brands] = useState<Brand[]>(initialBrands);
  const [models] = useState<ModelItem[]>(initialModels);
  const [skus] = useState<SKU[]>(initialSKUs);
  const [productCategories] = useState<ProductCategory[]>(initialProductCategories);
  const [segments] = useState<Segment[]>(initialSegments);
  const [modelVariants] = useState<ModelVariant[]>(initialModelVariants);
  const [externalMappings] = useState<ExternalMapping[]>(initialExternalMappings);
  const [modelExternalMappings, setModelExternalMappings] = useState<ModelExternalMapping[]>(initialModelExternalMappings);
  const [externalSystems, setExternalSystems] = useState<ExternalSystem[]>(initialExternalSystems);
  const [exportProfiles] = useState<ExportProfile[]>(initialExportProfiles);
  const [exportRecords, setExportRecords] = useState<ExportRecord[]>(initialExportRecords);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(initialAuditEvents);
  const [labelConfigs, setLabelConfigs] = useState<LabelConfig[]>(initialLabelConfigs);

  const addCampaign = useCallback((c: Campaign) => {
    setCampaigns(prev => [c, ...prev]);
  }, []);

  const updateCampaign = useCallback((id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
  }, []);

  const deleteCampaign = useCallback((id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  }, []);

  const duplicateCampaign = useCallback((id: string): Campaign | null => {
    const original = campaigns.find(c => c.id === id);
    if (!original) return null;
    const newCampaign: Campaign = {
      ...original,
      id: `camp_${Date.now()}`,
      name: `${original.name} (Copia)`,
      status: 'draft',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'u2',
      createdByName: 'María Torres',
      lines: original.lines.map(l => ({ ...l, id: `l_${Date.now()}_${Math.random()}` })),
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    return newCampaign;
  }, [campaigns]);

  const addExportRecord = useCallback((r: ExportRecord) => {
    setExportRecords(prev => [r, ...prev]);
  }, []);

  const addAuditEvent = useCallback((e: AuditEvent) => {
    setAuditEvents(prev => [e, ...prev]);
  }, []);

  const updateLabelConfig = useCallback((key: string, customLabel: string) => {
    setLabelConfigs(prev =>
      prev.map(l => (l.key === key ? { ...l, customLabel } : l))
    );
  }, []);

  const addModelExternalMapping = useCallback((m: ModelExternalMapping) => {
    setModelExternalMappings(prev => [...prev, m]);
  }, []);

  const updateModelExternalMapping = useCallback((id: string, updates: Partial<ModelExternalMapping>) => {
    setModelExternalMappings(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const deleteModelExternalMapping = useCallback((id: string) => {
    setModelExternalMappings(prev => prev.filter(m => m.id !== id));
  }, []);

  const addExternalSystem = useCallback((s: ExternalSystem) => {
    setExternalSystems(prev => [...prev, s]);
  }, []);

  const updateExternalSystem = useCallback((id: string, updates: Partial<ExternalSystem>) => {
    setExternalSystems(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteExternalSystem = useCallback((id: string) => {
    setExternalSystems(prev => prev.filter(s => s.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        campaigns,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        duplicateCampaign,
        brands,
        models,
        skus,
        productCategories,
        segments,
        modelVariants,
        externalMappings,
        modelExternalMappings,
        addModelExternalMapping,
        updateModelExternalMapping,
        deleteModelExternalMapping,
        externalSystems,
        addExternalSystem,
        updateExternalSystem,
        deleteExternalSystem,
        exportProfiles,
        exportRecords,
        addExportRecord,
        auditEvents,
        addAuditEvent,
        labelConfigs,
        updateLabelConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
