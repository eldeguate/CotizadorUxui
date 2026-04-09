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
  channelCategories as initialChannelCategories,
  channels as initialChannels,
  ownStores as initialOwnStores,
  distributors as initialDistributors,
  distributorStores as initialDistributorStores,
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
  ChannelCategory,
  Channel,
  OwnStore,
  Distributor,
  DistributorStore,
} from '../data/mockData';
import {
  geoCountries as initialGeoCountries,
  geoRegions as initialGeoRegions,
  geoDepartments as initialGeoDepartments,
  geoMunicipios as initialGeoMunicipios,
  GeoCountry,
  GeoRegion,
  GeoDepartment,
  GeoMunicipio,
} from '../data/geographyData';

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

  // Geography (nuevo sistema)
  geoCountries: GeoCountry[];
  geoRegions: GeoRegion[];
  geoDepartments: GeoDepartment[];
  geoMunicipios: GeoMunicipio[];
  addGeoRegion: (r: Omit<GeoRegion, 'id'>, departmentIds?: string[]) => void;
  updateGeoRegion: (id: string, updates: Partial<GeoRegion>) => void;
  deleteGeoRegion: (id: string) => void;
  updateGeoDepartment: (id: string, updates: Partial<GeoDepartment>) => void;
  addGeoMunicipio: (m: GeoMunicipio) => void;
  updateGeoMunicipio: (id: string, updates: Partial<GeoMunicipio>) => void;
  deleteGeoMunicipio: (id: string) => void;

  // Channels
  channelCategories: ChannelCategory[];
  channels: Channel[];
  ownStores: OwnStore[];
  distributors: Distributor[];
  distributorStores: DistributorStore[];
  addChannel: (c: Channel) => void;
  updateChannel: (id: string, updates: Partial<Channel>) => void;
  deleteChannel: (id: string) => void;
  addOwnStore: (s: OwnStore) => void;
  updateOwnStore: (id: string, updates: Partial<OwnStore>) => void;
  deleteOwnStore: (id: string) => void;
  addDistributor: (d: Distributor) => void;
  updateDistributor: (id: string, updates: Partial<Distributor>) => void;
  deleteDistributor: (id: string) => void;
  addDistributorStore: (s: DistributorStore) => void;
  updateDistributorStore: (id: string, updates: Partial<DistributorStore>) => void;
  deleteDistributorStore: (id: string) => void;
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

  // Geography state (nuevo sistema)
  const [geoCountries] = useState<GeoCountry[]>(initialGeoCountries);
  const [geoRegions, setGeoRegions] = useState<GeoRegion[]>(initialGeoRegions);
  const [geoDepartments, setGeoDepartments] = useState<GeoDepartment[]>(initialGeoDepartments);
  const [geoMunicipios, setGeoMunicipios] = useState<GeoMunicipio[]>(initialGeoMunicipios);

  // Channels state
  const [channelCategories] = useState<ChannelCategory[]>(initialChannelCategories);
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [ownStores, setOwnStores] = useState<OwnStore[]>(initialOwnStores);
  const [distributors, setDistributors] = useState<Distributor[]>(initialDistributors);
  const [distributorStores, setDistributorStores] = useState<DistributorStore[]>(initialDistributorStores);

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

  // Geography CRUD (nuevo sistema)
  const addGeoRegion = useCallback((r: Omit<GeoRegion, 'id'>, departmentIds?: string[]) => {
    const newRegion: GeoRegion = {
      ...r,
      id: `${r.countryId}-r-${Date.now()}`,
    };
    setGeoRegions(prev => [...prev, newRegion]);

    // Assign departments to this new region
    if (departmentIds && departmentIds.length > 0) {
      setGeoDepartments(prev =>
        prev.map(d =>
          departmentIds.includes(d.id) ? { ...d, regionId: newRegion.id } : d
        )
      );
    }
  }, []);

  const updateGeoRegion = useCallback((id: string, updates: Partial<GeoRegion>) => {
    setGeoRegions(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const deleteGeoRegion = useCallback((id: string) => {
    setGeoRegions(prev => prev.filter(r => r.id !== id));
    // Unassign departments from this region
    setGeoDepartments(prev =>
      prev.map(d => (d.regionId === id ? { ...d, regionId: '' } : d))
    );
  }, []);

  const updateGeoDepartment = useCallback((id: string, updates: Partial<GeoDepartment>) => {
    setGeoDepartments(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)));
  }, []);

  const addGeoMunicipio = useCallback((m: GeoMunicipio) => {
    setGeoMunicipios(prev => [...prev, m]);
  }, []);

  const updateGeoMunicipio = useCallback((id: string, updates: Partial<GeoMunicipio>) => {
    setGeoMunicipios(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  }, []);

  const deleteGeoMunicipio = useCallback((id: string) => {
    setGeoMunicipios(prev => prev.filter(m => m.id !== id));
  }, []);

  // Channels CRUD
  const addChannel = useCallback((c: Channel) => {
    setChannels(prev => [...prev, c]);
  }, []);

  const updateChannel = useCallback((id: string, updates: Partial<Channel>) => {
    setChannels(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteChannel = useCallback((id: string) => {
    setChannels(prev => prev.filter(c => c.id !== id));
  }, []);

  const addOwnStore = useCallback((s: OwnStore) => {
    setOwnStores(prev => [...prev, s]);
  }, []);

  const updateOwnStore = useCallback((id: string, updates: Partial<OwnStore>) => {
    setOwnStores(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  }, []);

  const deleteOwnStore = useCallback((id: string) => {
    setOwnStores(prev => prev.filter(s => s.id !== id));
  }, []);

  const addDistributor = useCallback((d: Distributor) => {
    setDistributors(prev => [...prev, d]);
  }, []);

  const updateDistributor = useCallback((id: string, updates: Partial<Distributor>) => {
    setDistributors(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)));
  }, []);

  const deleteDistributor = useCallback((id: string) => {
    setDistributors(prev => prev.filter(d => d.id !== id));
  }, []);

  const addDistributorStore = useCallback((s: DistributorStore) => {
    setDistributorStores(prev => [...prev, s]);
  }, []);

  const updateDistributorStore = useCallback((id: string, updates: Partial<DistributorStore>) => {
    setDistributorStores(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  }, []);

  const deleteDistributorStore = useCallback((id: string) => {
    setDistributorStores(prev => prev.filter(s => s.id !== id));
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
        geoCountries,
        geoRegions,
        geoDepartments,
        geoMunicipios,
        addGeoRegion,
        updateGeoRegion,
        deleteGeoRegion,
        updateGeoDepartment,
        addGeoMunicipio,
        updateGeoMunicipio,
        deleteGeoMunicipio,
        channelCategories,
        channels,
        ownStores,
        distributors,
        distributorStores,
        addChannel,
        updateChannel,
        deleteChannel,
        addOwnStore,
        updateOwnStore,
        deleteOwnStore,
        addDistributor,
        updateDistributor,
        deleteDistributor,
        addDistributorStore,
        updateDistributorStore,
        deleteDistributorStore,
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
