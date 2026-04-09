// ─── Types ───────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'commercial' | 'manager' | 'viewer';
export type CampaignStatus = 'draft' | 'review' | 'active' | 'exported' | 'archived';
export type DiscountType = 'fixed' | 'percentage';
export type GeographyScope = 'national' | 'regional' | 'departmental';
export type ExportDestination = 'salesforce' | 'sap';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
  color: string;
}

// ─── User Profile Types ──────────────────────────────────────────────────────

export type UserType = 'individual' | 'company';
export type GeographyAccessLevel = 'national' | 'uma_region' | 'department' | 'municipality' | 'store';

export interface Organization {
  id: string;
  companyName: string;
  nit: string;
  countryId: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string; // Reference to User
  userType: UserType;
  nomenclature: string; // channel code + userID
  userName: string;
  email: string;
  whatsapp: string;
  countryId: string;

  // Organization (for company users)
  organizationId?: string;
  parentUserId?: string; // For sub-users within a company

  // Store/Retail codes (optional)
  internalStoreCode?: string;
  externalStoreCode?: string;
  storeId?: string; // Reference to Store

  // Geography access
  geographyAccessLevel: GeographyAccessLevel;
  geographyAccessIds: string[]; // IDs of UMA regions, departments, municipalities, or stores

  // Channel
  channelId: string;

  // Status
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface Brand {
  id: string;
  code: string;
  label: string;
  categoryIds: string[]; // Categories this brand operates in
  isActive: boolean;
  logoColor: string;
}

export interface ProductCategory {
  id: string;
  code: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Segment {
  id: string;
  code: string;
  label: string;
  categoryId: string;
  brandIds: string[]; // Brands that use this segment
  sortOrder: number;
  isActive: boolean;
}

export interface ModelItem {
  id: string;
  internalName: string;
  brandId: string;
  segmentId: string;
  isActive: boolean;
  sortOrder: number;
}

export interface ModelVariant {
  id: string;
  modelId: string;
  variantName: string;
  modelYear: number;
  isDefault: boolean;
  isActive: boolean;
  basePVP: number;
  colors: string[];
}

export interface ExternalSystem {
  id: string;
  code: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  createdAt: string;
}

export interface ExternalMapping {
  id: string;
  variantId: string;
  systemId: string;
  externalName: string;
  externalId: string;
}

export interface ModelExternalMapping {
  id: string;
  modelId: string;
  systemId: string;
  externalName: string;
  externalId: string;
  isActive: boolean;
}

// ─── Geography Types ─────────────────────────────────────────────────────────

export interface Country {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface UMARegion {
  id: string;
  countryId: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface State {
  id: string;
  umaRegionId: string;
  code: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Municipality {
  id: string;
  stateId: string;
  code: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
}

// ─── Channel Types ───────────────────────────────────────────────────────────

export interface ChannelCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Channel {
  id: string;
  categoryId: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  allowedProductIds: string[]; // Model IDs
  allowedMunicipalityIds: string[]; // Municipality IDs
}

export interface OwnStore {
  id: string;
  channelId: string;
  code: string;
  name: string;
  address: string;
  municipalityId: string;
  contactPhone?: string;
  contactEmail?: string;
  isActive: boolean;
}

export interface Distributor {
  id: string;
  channelId: string;
  code: string;
  name: string;
  legalName: string;
  taxId: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
}

export interface DistributorStore {
  id: string;
  distributorId: string;
  code: string;
  name: string;
  address: string;
  municipalityId: string;
  contactPhone?: string;
  isActive: boolean;
}

export interface SKU {
  id: string;
  modelId: string;
  modelName: string;
  name: string;
  code: string;
  color: string;
  modelYear: number;
  basePVP: number;
  active: boolean;
}

// Removed duplicate Country interface - using the one at line 94

export interface Region {
  id: string;
  countryId: string;
  name: string;
}

export interface Department {
  id: string;
  regionId: string;
  name: string;
}

export interface CampaignLine {
  id: string;
  skuId: string;
  skuCode: string;
  skuName: string;
  modelName: string;
  modelYear: number;
  color: string;
  geography: string;
  basePVP: number;
  discountType: DiscountType;
  discountValue: number;
  finalPrice: number;
  financier?: string;
  brand: string;
  region?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  version: number;
  brandId: string;
  brandName: string;
  startDate: string;
  endDate: string;
  currency: string;
  countryId: string;
  countryName: string;
  geographyScope: GeographyScope;
  regions?: string[];
  departments?: string[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  lines: CampaignLine[];
  notes?: string;
  observations?: string;
  discountType: DiscountType;
  discountValue: number;
}

export interface FieldMapping {
  id: string;
  internalKey: string;
  internalLabel: string;
  exportColumn: string;
  defaultValue?: string;
  required: boolean;
}

export interface ExportProfile {
  id: string;
  name: string;
  destination: ExportDestination;
  description: string;
  format: 'csv' | 'xlsx';
  fieldMappings: FieldMapping[];
  active: boolean;
}

export interface ExportRecord {
  id: string;
  campaignId: string;
  campaignName: string;
  profileId: string;
  profileName: string;
  exportedBy: string;
  exportedAt: string;
  lineCount: number;
  status: 'success' | 'partial' | 'failed';
  version: number;
}

export interface AuditEvent {
  id: string;
  entityType: 'campaign' | 'master_data' | 'export' | 'settings';
  entityId: string;
  entityName: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: string;
  details?: string;
}

export interface LabelConfig {
  key: string;
  defaultLabel: string;
  customLabel: string;
  category: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const currentUser: User = {
  id: 'u2',
  name: 'María Torres',
  email: 'mtorres@grupouma.com',
  role: 'commercial',
  initials: 'MT',
  color: '#007AFF',
};

export const users: User[] = [
  { id: 'u1', name: 'Carlos Ramírez', email: 'cramirez@grupouma.com', role: 'admin', initials: 'CR', color: '#AF52DE' },
  { id: 'u2', name: 'María Torres', email: 'mtorres@grupouma.com', role: 'commercial', initials: 'MT', color: '#007AFF' },
  { id: 'u3', name: 'Diego Morales', email: 'dmorales@grupouma.com', role: 'manager', initials: 'DM', color: '#34C759' },
  { id: 'u4', name: 'Ana López', email: 'alopez@grupouma.com', role: 'viewer', initials: 'AL', color: '#FF9500' },
];

export const externalSystems: ExternalSystem[] = [
  { id: 'sys_sf', code: 'SF', name: 'Salesforce', description: 'CRM and sales management platform', color: '#00A1E0', isActive: true, createdAt: '2025-01-15T10:00:00Z' },
  { id: 'sys_sap', code: 'SAP', name: 'SAP ERP', description: 'Enterprise resource planning system', color: '#FF7A00', isActive: true, createdAt: '2025-01-15T10:00:00Z' },
];

export const brands: Brand[] = [
  { id: 'b1', code: 'BAJ', label: 'Bajaj', categoryIds: ['cat_2w', 'cat_3w'], isActive: true, logoColor: '#003087' },
  { id: 'b2', code: 'HON', label: 'Honda', categoryIds: ['cat_2w'], isActive: true, logoColor: '#CC0000' },
  { id: 'b3', code: 'YAM', label: 'Yamaha', categoryIds: ['cat_2w'], isActive: true, logoColor: '#003087' },
];

export const productCategories: ProductCategory[] = [
  { id: 'cat_2w', code: '2W', label: 'Motocicletas', sortOrder: 1, isActive: true },
  { id: 'cat_3w', code: '3W', label: 'Motocarros', sortOrder: 2, isActive: true },
];

export const segments: Segment[] = [
  { id: 'seg_com_entry', code: 'commuter_entry', label: 'Commuter Entry', categoryId: 'cat_2w', brandIds: ['b1'], sortOrder: 1, isActive: true },
  { id: 'seg_com_deluxe', code: 'commuter_deluxe', label: 'Commuter Deluxe', categoryId: 'cat_2w', brandIds: ['b1'], sortOrder: 2, isActive: true },
  { id: 'seg_entry_sport', code: 'entry_sport', label: 'Entry Sport', categoryId: 'cat_2w', brandIds: ['b1'], sortOrder: 3, isActive: true },
  { id: 'seg_sport', code: 'sport', label: 'Sport', categoryId: 'cat_2w', brandIds: ['b1'], sortOrder: 4, isActive: true },
  { id: 'seg_premium', code: 'premium', label: 'Premium', categoryId: 'cat_2w', brandIds: ['b1'], sortOrder: 5, isActive: true },
  { id: 'seg_3w', code: '3w', label: '3W', categoryId: 'cat_3w', brandIds: ['b1'], sortOrder: 1, isActive: true },
];

export const modelVariants: ModelVariant[] = [
  // PULSAR NS 200
  { id: 'var_ns200_2025_std', modelId: 'm_pulsar_ns200', variantName: 'Standard', modelYear: 2025, isDefault: true, isActive: true, basePVP: 12500000, colors: ['Negro', 'Rojo', 'Azul'] },
  { id: 'var_ns200_2026_std', modelId: 'm_pulsar_ns200', variantName: 'Standard', modelYear: 2026, isDefault: false, isActive: true, basePVP: 13000000, colors: ['Negro', 'Rojo'] },
  // PULSAR N250
  { id: 'var_n250_2025_std', modelId: 'm_pulsar_n250', variantName: 'Standard', modelYear: 2025, isDefault: true, isActive: true, basePVP: 14200000, colors: ['Azul', 'Gris', 'Negro'] },
  { id: 'var_n250_2026_std', modelId: 'm_pulsar_n250', variantName: 'Standard', modelYear: 2026, isDefault: false, isActive: true, basePVP: 14800000, colors: ['Azul', 'Gris'] },
  // PULSAR NS 160
  { id: 'var_ns160_2025_std', modelId: 'm_pulsar_ns160', variantName: 'Standard', modelYear: 2025, isDefault: true, isActive: true, basePVP: 9800000, colors: ['Negro', 'Verde', 'Blanco'] },
  { id: 'var_ns160_2026_std', modelId: 'm_pulsar_ns160', variantName: 'Standard', modelYear: 2026, isDefault: false, isActive: true, basePVP: 10200000, colors: ['Negro', 'Verde'] },
  // PULSAR N160 DC
  { id: 'var_n160dc_2025_std', modelId: 'm_pulsar_n160_dc', variantName: 'Dual Channel ABS', modelYear: 2025, isDefault: true, isActive: true, basePVP: 10500000, colors: ['Negro', 'Azul'] },
  { id: 'var_n160dc_2026_std', modelId: 'm_pulsar_n160_dc', variantName: 'Dual Channel ABS', modelYear: 2026, isDefault: false, isActive: true, basePVP: 10900000, colors: ['Negro', 'Azul'] },
  // DISCOVER 125 ST-R
  { id: 'var_d125_2025_std', modelId: 'm_discover_125_str', variantName: 'Standard', modelYear: 2025, isDefault: true, isActive: true, basePVP: 6800000, colors: ['Negro', 'Rojo', 'Azul'] },
  { id: 'var_d125_2026_std', modelId: 'm_discover_125_str', variantName: 'Standard', modelYear: 2026, isDefault: false, isActive: true, basePVP: 7100000, colors: ['Negro', 'Rojo'] },
  // BOXER CT 100 KS
  { id: 'var_ct100ks_2025_std', modelId: 'm_boxer_ct100_ks', variantName: 'Kick Start', modelYear: 2025, isDefault: true, isActive: true, basePVP: 4200000, colors: ['Negro', 'Azul', 'Rojo'] },
  { id: 'var_ct100ks_2026_std', modelId: 'm_boxer_ct100_ks', variantName: 'Kick Start', modelYear: 2026, isDefault: false, isActive: true, basePVP: 4400000, colors: ['Negro', 'Azul'] },
  // DOMINAR 400
  { id: 'var_dom400_2025_std', modelId: 'm_dominar_400', variantName: 'Standard', modelYear: 2025, isDefault: true, isActive: true, basePVP: 18500000, colors: ['Negro', 'Blanco'] },
  { id: 'var_dom400_2026_std', modelId: 'm_dominar_400', variantName: 'Standard', modelYear: 2026, isDefault: false, isActive: true, basePVP: 19200000, colors: ['Negro', 'Blanco', 'Verde'] },
];

export const externalMappings: ExternalMapping[] = [
  // Salesforce mappings
  { id: 'map_ns200_2025_sf', variantId: 'var_ns200_2025_std', systemId: 'sys_sf', externalName: 'PULSAR NS200 MY2025', externalId: 'a0FPP000005i0Fy2AI' },
  { id: 'map_n250_2025_sf', variantId: 'var_n250_2025_std', systemId: 'sys_sf', externalName: 'PULSAR N250 MY2025', externalId: 'a0FPP000005i0Fz2AI' },
  { id: 'map_ns160_2025_sf', variantId: 'var_ns160_2025_std', systemId: 'sys_sf', externalName: 'PULSAR NS160 MY2025', externalId: 'a0FPP000005i0G02AI' },
  { id: 'map_d125_2025_sf', variantId: 'var_d125_2025_std', systemId: 'sys_sf', externalName: 'DISCOVER 125 ST-R MY2025', externalId: 'a0FPP000005i0G12AI' },
  { id: 'map_ct100ks_2025_sf', variantId: 'var_ct100ks_2025_std', systemId: 'sys_sf', externalName: 'BOXER CT100 KS MY2025', externalId: 'a0FPP000005i0G22AI' },
  { id: 'map_dom400_2025_sf', variantId: 'var_dom400_2025_std', systemId: 'sys_sf', externalName: 'DOMINAR 400 MY2025', externalId: 'a0FPP000005i0G32AI' },
  // SAP mappings
  { id: 'map_ns200_2025_sap', variantId: 'var_ns200_2025_std', systemId: 'sys_sap', externalName: 'PULSAR_NS200_2025', externalId: 'MAT-NS200-2025' },
  { id: 'map_n250_2025_sap', variantId: 'var_n250_2025_std', systemId: 'sys_sap', externalName: 'PULSAR_N250_2025', externalId: 'MAT-N250-2025' },
];

export const modelExternalMappings: ModelExternalMapping[] = [
  // Salesforce model mappings
  { id: 'mmap_ns200_sf', modelId: 'm_pulsar_ns200', systemId: 'sys_sf', externalName: 'PULSAR NS 200', externalId: 'PRD-NS200-SF', isActive: true },
  { id: 'mmap_n250_sf', modelId: 'm_pulsar_n250', systemId: 'sys_sf', externalName: 'PULSAR N 250', externalId: 'PRD-N250-SF', isActive: true },
  { id: 'mmap_ns160_sf', modelId: 'm_pulsar_ns160', systemId: 'sys_sf', externalName: 'PULSAR NS 160', externalId: 'PRD-NS160-SF', isActive: true },
  { id: 'mmap_n160dc_sf', modelId: 'm_pulsar_n160_dc', systemId: 'sys_sf', externalName: 'PULSAR N 160 DC', externalId: 'PRD-N160DC-SF', isActive: true },
  { id: 'mmap_d125_sf', modelId: 'm_discover_125_str', systemId: 'sys_sf', externalName: 'DISCOVER 125 ST-R', externalId: 'PRD-D125-SF', isActive: true },
  { id: 'mmap_ct100ks_sf', modelId: 'm_boxer_ct100_ks', systemId: 'sys_sf', externalName: 'BOXER CT 100 KS', externalId: 'PRD-CT100KS-SF', isActive: true },
  { id: 'mmap_dom400_sf', modelId: 'm_dominar_400', systemId: 'sys_sf', externalName: 'DOMINAR 400', externalId: 'PRD-DOM400-SF', isActive: true },

  // SAP model mappings
  { id: 'mmap_ns200_sap', modelId: 'm_pulsar_ns200', systemId: 'sys_sap', externalName: 'BAJ_PULSAR_NS200', externalId: 'MAT-001-NS200', isActive: true },
  { id: 'mmap_n250_sap', modelId: 'm_pulsar_n250', systemId: 'sys_sap', externalName: 'BAJ_PULSAR_N250', externalId: 'MAT-001-N250', isActive: true },
  { id: 'mmap_ns160_sap', modelId: 'm_pulsar_ns160', systemId: 'sys_sap', externalName: 'BAJ_PULSAR_NS160', externalId: 'MAT-001-NS160', isActive: true },
  { id: 'mmap_n160dc_sap', modelId: 'm_pulsar_n160_dc', systemId: 'sys_sap', externalName: 'BAJ_PULSAR_N160DC', externalId: 'MAT-001-N160DC', isActive: true },
  { id: 'mmap_d125_sap', modelId: 'm_discover_125_str', systemId: 'sys_sap', externalName: 'BAJ_DISCOVER_125', externalId: 'MAT-001-D125', isActive: true },
  { id: 'mmap_ct100ks_sap', modelId: 'm_boxer_ct100_ks', systemId: 'sys_sap', externalName: 'BAJ_BOXER_CT100', externalId: 'MAT-001-CT100', isActive: true },
  { id: 'mmap_dom400_sap', modelId: 'm_dominar_400', systemId: 'sys_sap', externalName: 'BAJ_DOMINAR_400', externalId: 'MAT-001-DOM400', isActive: true },
];

// Legacy categories for backward compatibility
export const categories = [
  { id: 'c1', brandId: 'b1', name: 'Sport', code: 'SPT' },
  { id: 'c2', brandId: 'b1', name: 'Commuter', code: 'COM' },
  { id: 'c3', brandId: 'b1', name: 'Adventure', code: 'ADV' },
  { id: 'c4', brandId: 'b2', name: 'Sport', code: 'SPT' },
  { id: 'c5', brandId: 'b2', name: 'Scooter', code: 'SCO' },
];


export const models: ModelItem[] = [
  // Commuter Entry
  { id: 'm_boxer_ct100_ks', internalName: 'BOXER CT 100 KS', brandId: 'b1', segmentId: 'seg_com_entry', isActive: true, sortOrder: 1 },
  { id: 'm_boxer_ct100_es', internalName: 'BOXER CT 100 ES', brandId: 'b1', segmentId: 'seg_com_entry', isActive: true, sortOrder: 2 },
  { id: 'm_boxer_ct125', internalName: 'BOXER CT 125', brandId: 'b1', segmentId: 'seg_com_entry', isActive: true, sortOrder: 3 },
  // Commuter Deluxe
  { id: 'm_boxer_150x', internalName: 'BOXER 150 X', brandId: 'b1', segmentId: 'seg_com_deluxe', isActive: true, sortOrder: 1 },
  { id: 'm_discover_125_str', internalName: 'DISCOVER 125 ST-R', brandId: 'b1', segmentId: 'seg_com_deluxe', isActive: true, sortOrder: 2 },
  { id: 'm_pulsar_ns125_ug', internalName: 'PULSAR NS 125 UG', brandId: 'b1', segmentId: 'seg_com_deluxe', isActive: true, sortOrder: 3 },
  { id: 'm_pulsar_n125_fi', internalName: 'PULSAR N125 FI', brandId: 'b1', segmentId: 'seg_com_deluxe', isActive: true, sortOrder: 4 },
  // Entry Sport
  { id: 'm_pulsar_ns160', internalName: 'PULSAR NS 160', brandId: 'b1', segmentId: 'seg_entry_sport', isActive: true, sortOrder: 1 },
  { id: 'm_pulsar_n160_dc', internalName: 'PULSAR N160 DC', brandId: 'b1', segmentId: 'seg_entry_sport', isActive: true, sortOrder: 2 },
  { id: 'm_pulsar_n160_pro', internalName: 'PULSAR N160 PRO', brandId: 'b1', segmentId: 'seg_entry_sport', isActive: true, sortOrder: 3 },
  { id: 'm_pulsar_p150_fi_abs', internalName: 'PULSAR P150 FI ABS', brandId: 'b1', segmentId: 'seg_entry_sport', isActive: true, sortOrder: 4 },
  // Sport
  { id: 'm_pulsar_ns200', internalName: 'PULSAR NS 200', brandId: 'b1', segmentId: 'seg_sport', isActive: true, sortOrder: 1 },
  { id: 'm_pulsar_rs200', internalName: 'PULSAR RS 200', brandId: 'b1', segmentId: 'seg_sport', isActive: true, sortOrder: 2 },
  { id: 'm_pulsar_n250', internalName: 'PULSAR N250', brandId: 'b1', segmentId: 'seg_sport', isActive: true, sortOrder: 3 },
  // Premium
  { id: 'm_pulsar_ns400z', internalName: 'PULSAR NS400Z', brandId: 'b1', segmentId: 'seg_premium', isActive: true, sortOrder: 1 },
  { id: 'm_dominar_400', internalName: 'DOMINAR 400', brandId: 'b1', segmentId: 'seg_premium', isActive: true, sortOrder: 2 },
  { id: 'm_dominar_400_volcano', internalName: 'DOMINAR 400 Volcano', brandId: 'b1', segmentId: 'seg_premium', isActive: true, sortOrder: 3 },
  // 3W
  { id: 'm_re_torito_basico', internalName: 'RE TORITO BÁSICO', brandId: 'b1', segmentId: 'seg_3w', isActive: true, sortOrder: 1 },
  { id: 'm_re_torito_carpa', internalName: 'RE TORITO CARPA DE LUJO', brandId: 'b1', segmentId: 'seg_3w', isActive: true, sortOrder: 2 },
  { id: 'm_re_torito_cherokee', internalName: 'RE TORITO CHEROKEE', brandId: 'b1', segmentId: 'seg_3w', isActive: true, sortOrder: 3 },
  { id: 'm_maxima_cargo', internalName: 'MAXIMA CARGO', brandId: 'b1', segmentId: 'seg_3w', isActive: true, sortOrder: 4 },
];

export const skus: SKU[] = [
  { id: 's1', modelId: 'm_pulsar_ns200', modelName: 'Pulsar NS200', name: 'Pulsar NS200 2025 Negro', code: 'PNS200-BLK-25', color: 'Negro', modelYear: 2025, basePVP: 12500000, active: true },
  { id: 's2', modelId: 'm_pulsar_ns200', modelName: 'Pulsar NS200', name: 'Pulsar NS200 2025 Rojo', code: 'PNS200-RED-25', color: 'Rojo', modelYear: 2025, basePVP: 12500000, active: true },
  { id: 's3', modelId: 'm_pulsar_ns200', modelName: 'Pulsar NS200', name: 'Pulsar NS200 2024 Negro', code: 'PNS200-BLK-24', color: 'Negro', modelYear: 2024, basePVP: 11800000, active: true },
  { id: 's4', modelId: 'm_pulsar_n250', modelName: 'Pulsar N250', name: 'Pulsar N250 2025 Azul', code: 'PN250-BLU-25', color: 'Azul', modelYear: 2025, basePVP: 14200000, active: true },
  { id: 's5', modelId: 'm_pulsar_n250', modelName: 'Pulsar N250', name: 'Pulsar N250 2025 Gris', code: 'PN250-GRY-25', color: 'Gris', modelYear: 2025, basePVP: 14200000, active: true },
  { id: 's6', modelId: 'm_pulsar_ns160', modelName: 'Pulsar NS160', name: 'Pulsar NS160 2025 Negro', code: 'PNS160-BLK-25', color: 'Negro', modelYear: 2025, basePVP: 9800000, active: true },
  { id: 's7', modelId: 'm_pulsar_ns160', modelName: 'Pulsar NS160', name: 'Pulsar NS160 2025 Verde', code: 'PNS160-GRN-25', color: 'Verde', modelYear: 2025, basePVP: 9800000, active: true },
  { id: 's8', modelId: 'm_discover_125_str', modelName: 'Discover 125', name: 'Discover 125 2025 Negro', code: 'D125-BLK-25', color: 'Negro', modelYear: 2025, basePVP: 6800000, active: true },
  { id: 's9', modelId: 'm_discover_125_str', modelName: 'Discover 125', name: 'Discover 125 2025 Rojo', code: 'D125-RED-25', color: 'Rojo', modelYear: 2025, basePVP: 6800000, active: true },
  { id: 's10', modelId: 'm_boxer_ct100_ks', modelName: 'CT100', name: 'CT100 2025 Negro', code: 'CT100-BLK-25', color: 'Negro', modelYear: 2025, basePVP: 4200000, active: true },
  { id: 's11', modelId: 'm_boxer_ct100_ks', modelName: 'CT100', name: 'CT100 2025 Azul', code: 'CT100-BLU-25', color: 'Azul', modelYear: 2025, basePVP: 4200000, active: true },
  { id: 's12', modelId: 'm_boxer_ct100_ks', modelName: 'Platina 110', name: 'Platina 110 2025 Negro', code: 'PLT110-BLK-25', color: 'Negro', modelYear: 2025, basePVP: 5100000, active: true },
  { id: 's13', modelId: 'm_dominar_400', modelName: 'Dominar 400', name: 'Dominar 400 2025 Negro', code: 'DOM400-BLK-25', color: 'Negro', modelYear: 2025, basePVP: 18500000, active: true },
  { id: 's14', modelId: 'm_dominar_400', modelName: 'Avenger Street 160', name: 'Avenger Street 160 2025 Negro', code: 'AVS160-BLK-25', color: 'Negro', modelYear: 2025, basePVP: 10200000, active: true },
];

// Old geography data removed - now using comprehensive geography hierarchy below
// (countries, umaRegions, states, municipalities)

export const campaigns: Campaign[] = [
  {
    id: 'camp1',
    name: 'Pulsar Verano 2025',
    description: 'Campaña de verano para línea Pulsar, descuento especial en toda la gama',
    status: 'active',
    version: 2,
    brandId: 'b1',
    brandName: 'Bajaj',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    currency: 'COP',
    countryId: 'co1',
    countryName: 'Colombia',
    geographyScope: 'national',
    createdBy: 'u2',
    createdByName: 'María Torres',
    createdAt: '2025-04-10T09:00:00Z',
    updatedAt: '2025-04-15T14:30:00Z',
    discountType: 'fixed',
    discountValue: 500000,
    notes: 'Aplica para stock disponible en concesionarios',
    observations: 'Coordinar con equipo de marketing para material POP',
    lines: [
      { id: 'l1', skuId: 's1', skuCode: 'PNS200-BLK-25', skuName: 'Pulsar NS200 2025 Negro', modelName: 'Pulsar NS200', modelYear: 2025, color: 'Negro', geography: 'Nacional', basePVP: 12500000, discountType: 'fixed', discountValue: 500000, finalPrice: 12000000, brand: 'Bajaj' },
      { id: 'l2', skuId: 's2', skuCode: 'PNS200-RED-25', skuName: 'Pulsar NS200 2025 Rojo', modelName: 'Pulsar NS200', modelYear: 2025, color: 'Rojo', geography: 'Nacional', basePVP: 12500000, discountType: 'fixed', discountValue: 500000, finalPrice: 12000000, brand: 'Bajaj' },
      { id: 'l3', skuId: 's4', skuCode: 'PN250-BLU-25', skuName: 'Pulsar N250 2025 Azul', modelName: 'Pulsar N250', modelYear: 2025, color: 'Azul', geography: 'Nacional', basePVP: 14200000, discountType: 'fixed', discountValue: 500000, finalPrice: 13700000, brand: 'Bajaj' },
      { id: 'l4', skuId: 's5', skuCode: 'PN250-GRY-25', skuName: 'Pulsar N250 2025 Gris', modelName: 'Pulsar N250', modelYear: 2025, color: 'Gris', geography: 'Nacional', basePVP: 14200000, discountType: 'fixed', discountValue: 500000, finalPrice: 13700000, brand: 'Bajaj' },
      { id: 'l5', skuId: 's6', skuCode: 'PNS160-BLK-25', skuName: 'Pulsar NS160 2025 Negro', modelName: 'Pulsar NS160', modelYear: 2025, color: 'Negro', geography: 'Nacional', basePVP: 9800000, discountType: 'fixed', discountValue: 500000, finalPrice: 9300000, brand: 'Bajaj' },
    ],
  },
  {
    id: 'camp2',
    name: 'Discover Semana Santa 2025',
    description: 'Promoción regional Antioquia para línea Discover',
    status: 'draft',
    version: 1,
    brandId: 'b1',
    brandName: 'Bajaj',
    startDate: '2025-04-14',
    endDate: '2025-04-20',
    currency: 'COP',
    countryId: 'co1',
    countryName: 'Colombia',
    geographyScope: 'regional',
    regions: ['Antioquia'],
    createdBy: 'u2',
    createdByName: 'María Torres',
    createdAt: '2025-03-25T10:15:00Z',
    updatedAt: '2025-03-28T16:00:00Z',
    discountType: 'fixed',
    discountValue: 300000,
    lines: [
      { id: 'l6', skuId: 's8', skuCode: 'D125-BLK-25', skuName: 'Discover 125 2025 Negro', modelName: 'Discover 125', modelYear: 2025, color: 'Negro', geography: 'Antioquia', basePVP: 6800000, discountType: 'fixed', discountValue: 300000, finalPrice: 6500000, brand: 'Bajaj' },
      { id: 'l7', skuId: 's9', skuCode: 'D125-RED-25', skuName: 'Discover 125 2025 Rojo', modelName: 'Discover 125', modelYear: 2025, color: 'Rojo', geography: 'Antioquia', basePVP: 6800000, discountType: 'fixed', discountValue: 300000, finalPrice: 6500000, brand: 'Bajaj' },
    ],
  },
  {
    id: 'camp3',
    name: 'CT100 Lanzamiento Nacional',
    description: 'Campaña de lanzamiento CT100 modelo 2025 a nivel nacional',
    status: 'exported',
    version: 3,
    brandId: 'b1',
    brandName: 'Bajaj',
    startDate: '2025-01-15',
    endDate: '2025-03-31',
    currency: 'COP',
    countryId: 'co1',
    countryName: 'Colombia',
    geographyScope: 'national',
    createdBy: 'u3',
    createdByName: 'Diego Morales',
    createdAt: '2025-01-05T08:00:00Z',
    updatedAt: '2025-01-12T11:20:00Z',
    discountType: 'fixed',
    discountValue: 200000,
    observations: 'Exportado a Salesforce el 12/01/2025',
    lines: [
      { id: 'l8', skuId: 's10', skuCode: 'CT100-BLK-25', skuName: 'CT100 2025 Negro', modelName: 'CT100', modelYear: 2025, color: 'Negro', geography: 'Nacional', basePVP: 4200000, discountType: 'fixed', discountValue: 200000, finalPrice: 4000000, brand: 'Bajaj' },
      { id: 'l9', skuId: 's11', skuCode: 'CT100-BLU-25', skuName: 'CT100 2025 Azul', modelName: 'CT100', modelYear: 2025, color: 'Azul', geography: 'Nacional', basePVP: 4200000, discountType: 'fixed', discountValue: 200000, finalPrice: 4000000, brand: 'Bajaj' },
    ],
  },
  {
    id: 'camp4',
    name: 'Dominar Feria de Cali 2024',
    description: 'Promoción especial Feria de Cali para Dominar 400',
    status: 'archived',
    version: 2,
    brandId: 'b1',
    brandName: 'Bajaj',
    startDate: '2024-12-20',
    endDate: '2024-12-30',
    currency: 'COP',
    countryId: 'co1',
    countryName: 'Colombia',
    geographyScope: 'departmental',
    departments: ['Cali', 'Palmira'],
    createdBy: 'u2',
    createdByName: 'María Torres',
    createdAt: '2024-12-10T09:30:00Z',
    updatedAt: '2024-12-18T15:00:00Z',
    discountType: 'fixed',
    discountValue: 1000000,
    lines: [
      { id: 'l10', skuId: 's13', skuCode: 'DOM400-BLK-25', skuName: 'Dominar 400 2025 Negro', modelName: 'Dominar 400', modelYear: 2025, color: 'Negro', geography: 'Cali / Palmira', basePVP: 18500000, discountType: 'fixed', discountValue: 1000000, finalPrice: 17500000, brand: 'Bajaj' },
    ],
  },
  {
    id: 'camp5',
    name: 'Platina Universitarios Q2',
    description: 'Descuento especial para segmento universitario en línea Platina',
    status: 'review',
    version: 1,
    brandId: 'b1',
    brandName: 'Bajaj',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    currency: 'COP',
    countryId: 'co1',
    countryName: 'Colombia',
    geographyScope: 'national',
    createdBy: 'u2',
    createdByName: 'María Torres',
    createdAt: '2025-03-15T11:00:00Z',
    updatedAt: '2025-03-30T09:45:00Z',
    discountType: 'fixed',
    discountValue: 250000,
    notes: 'Requiere validación del gerente comercial',
    lines: [
      { id: 'l11', skuId: 's12', skuCode: 'PLT110-BLK-25', skuName: 'Platina 110 2025 Negro', modelName: 'Platina 110', modelYear: 2025, color: 'Negro', geography: 'Nacional', basePVP: 5100000, discountType: 'fixed', discountValue: 250000, finalPrice: 4850000, brand: 'Bajaj' },
    ],
  },
  {
    id: 'camp6',
    name: 'Avenger Black Weekend',
    description: 'Campaña Black Weekend para Avenger Street y Cruise',
    status: 'draft',
    version: 1,
    brandId: 'b1',
    brandName: 'Bajaj',
    startDate: '2025-11-28',
    endDate: '2025-12-01',
    currency: 'COP',
    countryId: 'co1',
    countryName: 'Colombia',
    geographyScope: 'national',
    createdBy: 'u2',
    createdByName: 'María Torres',
    createdAt: '2025-04-01T14:00:00Z',
    updatedAt: '2025-04-01T14:00:00Z',
    discountType: 'fixed',
    discountValue: 800000,
    lines: [
      { id: 'l12', skuId: 's14', skuCode: 'AVS160-BLK-25', skuName: 'Avenger Street 160 2025 Negro', modelName: 'Avenger Street 160', modelYear: 2025, color: 'Negro', geography: 'Nacional', basePVP: 10200000, discountType: 'fixed', discountValue: 800000, finalPrice: 9400000, brand: 'Bajaj' },
    ],
  },
];

export const exportProfiles: ExportProfile[] = [
  {
    id: 'ep1',
    name: 'Salesforce - Promociones por Valor',
    destination: 'salesforce',
    description: 'Exportación para Salesforce CRM, formato CSV con campos estándar del objeto Promoción',
    format: 'csv',
    active: true,
    fieldMappings: [
      { id: 'fm1', internalKey: 'name', internalLabel: 'Nombre Campaña', exportColumn: 'Name', required: true },
      { id: 'fm2', internalKey: 'discountValue', internalLabel: 'Valor Descuento', exportColumn: 'Descuento_numerico__c', required: true },
      { id: 'fm3', internalKey: 'startDate', internalLabel: 'Fecha Inicio', exportColumn: 'Fecha_Inicio__c', required: true },
      { id: 'fm4', internalKey: 'endDate', internalLabel: 'Fecha Fin', exportColumn: 'Fecha_Fin__c', required: true },
      { id: 'fm5', internalKey: 'currency', internalLabel: 'Moneda', exportColumn: 'CurrencyIsoCode', required: true },
      { id: 'fm6', internalKey: 'countryName', internalLabel: 'País', exportColumn: 'Pais__c', required: true },
      { id: 'fm7', internalKey: 'brandName', internalLabel: 'Marca', exportColumn: 'Marca__c', required: true },
      { id: 'fm8', internalKey: 'modelName', internalLabel: 'Modelo', exportColumn: 'Modelo__c', required: true },
      { id: 'fm9', internalKey: 'skuCode', internalLabel: 'Código SKU', exportColumn: 'SKU__c', required: true },
      { id: 'fm10', internalKey: 'modelYear', internalLabel: 'Año Modelo', exportColumn: 'Anio_Modelo__c', required: false },
      { id: 'fm11', internalKey: 'geography', internalLabel: 'Geografía', exportColumn: 'Region__c', required: false },
      { id: 'fm12', internalKey: 'finalPrice', internalLabel: 'Precio Final', exportColumn: 'Precio_Promocional__c', required: false },
    ],
  },
  {
    id: 'ep2',
    name: 'SAP - Material/Promoción',
    destination: 'sap',
    description: 'Exportación para SAP, formato XLSX con códigos de material y condiciones de precio',
    format: 'xlsx',
    active: true,
    fieldMappings: [
      { id: 'fm13', internalKey: 'skuCode', internalLabel: 'Código SKU', exportColumn: 'MATNR', required: true },
      { id: 'fm14', internalKey: 'discountValue', internalLabel: 'Valor Descuento', exportColumn: 'KBETR', required: true },
      { id: 'fm15', internalKey: 'startDate', internalLabel: 'Fecha Inicio', exportColumn: 'DATAB', required: true },
      { id: 'fm16', internalKey: 'endDate', internalLabel: 'Fecha Fin', exportColumn: 'DATBI', required: true },
      { id: 'fm17', internalKey: 'currency', internalLabel: 'Moneda', exportColumn: 'WAERS', required: true },
      { id: 'fm18', internalKey: 'countryName', internalLabel: 'País', exportColumn: 'LAND1', required: false },
      { id: 'fm19', internalKey: 'finalPrice', internalLabel: 'Precio Final', exportColumn: 'PREIS', required: false },
    ],
  },
];

export const exportRecords: ExportRecord[] = [
  { id: 'ex1', campaignId: 'camp3', campaignName: 'CT100 Lanzamiento Nacional', profileId: 'ep1', profileName: 'Salesforce - Promociones por Valor', exportedBy: 'Diego Morales', exportedAt: '2025-01-12T11:20:00Z', lineCount: 2, status: 'success', version: 3 },
  { id: 'ex2', campaignId: 'camp3', campaignName: 'CT100 Lanzamiento Nacional', profileId: 'ep1', profileName: 'Salesforce - Promociones por Valor', exportedBy: 'Diego Morales', exportedAt: '2025-01-10T09:00:00Z', lineCount: 2, status: 'success', version: 2 },
  { id: 'ex3', campaignId: 'camp1', campaignName: 'Pulsar Verano 2025', profileId: 'ep1', profileName: 'Salesforce - Promociones por Valor', exportedBy: 'María Torres', exportedAt: '2025-04-15T14:30:00Z', lineCount: 5, status: 'success', version: 2 },
  { id: 'ex4', campaignId: 'camp4', campaignName: 'Dominar Feria de Cali 2024', profileId: 'ep2', profileName: 'SAP - Material/Promoción', exportedBy: 'Carlos Ramírez', exportedAt: '2024-12-18T16:00:00Z', lineCount: 1, status: 'success', version: 2 },
];

export const auditEvents: AuditEvent[] = [
  { id: 'ae1', entityType: 'campaign', entityId: 'camp1', entityName: 'Pulsar Verano 2025', action: 'Exportado a Salesforce', userId: 'u2', userName: 'María Torres', timestamp: '2025-04-15T14:30:00Z', details: 'Versión 2, 5 líneas exportadas' },
  { id: 'ae2', entityType: 'campaign', entityId: 'camp1', entityName: 'Pulsar Verano 2025', action: 'Estado cambiado a Activo', userId: 'u3', userName: 'Diego Morales', timestamp: '2025-04-14T10:00:00Z', details: 'Aprobado por gerente comercial' },
  { id: 'ae3', entityType: 'campaign', entityId: 'camp5', entityName: 'Platina Universitarios Q2', action: 'Enviado a revisión', userId: 'u2', userName: 'María Torres', timestamp: '2025-03-30T09:45:00Z' },
  { id: 'ae4', entityType: 'campaign', entityId: 'camp2', entityName: 'Discover Semana Santa 2025', action: 'Campaña creada', userId: 'u2', userName: 'María Torres', timestamp: '2025-03-25T10:15:00Z', details: 'Borrador inicial, 2 líneas' },
  { id: 'ae5', entityType: 'campaign', entityId: 'camp3', entityName: 'CT100 Lanzamiento Nacional', action: 'Exportado a Salesforce', userId: 'u3', userName: 'Diego Morales', timestamp: '2025-01-12T11:20:00Z', details: 'Versión 3, 2 líneas exportadas' },
  { id: 'ae6', entityType: 'master_data', entityId: 's1', entityName: 'Pulsar NS200 2025 Negro', action: 'SKU actualizado', userId: 'u1', userName: 'Carlos Ramírez', timestamp: '2025-03-01T08:30:00Z', details: 'PVP actualizado de $12.200.000 a $12.500.000' },
];

export const labelConfigs: LabelConfig[] = [
  { key: 'brand', defaultLabel: 'Brand', customLabel: 'Marca', category: 'Productos' },
  { key: 'category', defaultLabel: 'Category', customLabel: 'Categoría', category: 'Productos' },
  { key: 'model', defaultLabel: 'Model', customLabel: 'Modelo', category: 'Productos' },
  { key: 'sku', defaultLabel: 'SKU', customLabel: 'SKU', category: 'Productos' },
  { key: 'modelYear', defaultLabel: 'Model Year', customLabel: 'Año Modelo', category: 'Productos' },
  { key: 'country', defaultLabel: 'Country', customLabel: 'País', category: 'Geografía' },
  { key: 'region', defaultLabel: 'Region', customLabel: 'Departamento', category: 'Geografía' },
  { key: 'department', defaultLabel: 'Department', customLabel: 'Municipio', category: 'Geografía' },
  { key: 'discountValue', defaultLabel: 'Discount Value', customLabel: 'Descuento Numérico', category: 'Promoción' },
  { key: 'startDate', defaultLabel: 'Start Date', customLabel: 'Fecha Inicio', category: 'Promoción' },
  { key: 'endDate', defaultLabel: 'End Date', customLabel: 'Fecha Fin', category: 'Promoción' },
  { key: 'financier', defaultLabel: 'Financier', customLabel: 'Financiera', category: 'Promoción' },
];

// Monthly campaign stats for charts
export const monthlyCampaignStats = [
  { id: 'oct', month: 'Oct', campaigns: 2, lines: 18, exported: 1 },
  { id: 'nov', month: 'Nov', campaigns: 3, lines: 24, exported: 2 },
  { id: 'dic', month: 'Dic', campaigns: 4, lines: 52, exported: 3 },
  { id: 'ene', month: 'Ene', campaigns: 3, lines: 38, exported: 2 },
  { id: 'feb', month: 'Feb', campaigns: 5, lines: 62, exported: 4 },
  { id: 'mar', month: 'Mar', campaigns: 4, lines: 44, exported: 2 },
  { id: 'abr', month: 'Abr', campaigns: 6, lines: 75, exported: 3 },
];

// ─── Geography Data ──────────────────────────────────────────────────────────

export const countries: Country[] = [
  { id: 'co1', code: 'CO', name: 'Colombia', isActive: true },
];

export const umaRegions: UMARegion[] = [
  { id: 'uma_andina', countryId: 'co1', code: 'ANDINA', name: 'Región Andina', description: 'Zona montañosa central', isActive: true, sortOrder: 1 },
  { id: 'uma_caribe', countryId: 'co1', code: 'CARIBE', name: 'Región Caribe', description: 'Costa norte', isActive: true, sortOrder: 2 },
  { id: 'uma_pacifica', countryId: 'co1', code: 'PACIFICA', name: 'Región Pacífica', description: 'Costa oeste', isActive: true, sortOrder: 3 },
  { id: 'uma_orinoquia', countryId: 'co1', code: 'ORINOQ', name: 'Región Orinoquía', description: 'Llanos orientales', isActive: true, sortOrder: 4 },
  { id: 'uma_amazonia', countryId: 'co1', code: 'AMAZON', name: 'Región Amazonía', description: 'Sur amazónico', isActive: true, sortOrder: 5 },
];

export const states: State[] = [
  // Región Andina
  { id: 'state_cundinamarca', umaRegionId: 'uma_andina', code: 'CUN', name: 'Cundinamarca', isActive: true, sortOrder: 1 },
  { id: 'state_antioquia', umaRegionId: 'uma_andina', code: 'ANT', name: 'Antioquia', isActive: true, sortOrder: 2 },
  { id: 'state_boyaca', umaRegionId: 'uma_andina', code: 'BOY', name: 'Boyacá', isActive: true, sortOrder: 3 },
  { id: 'state_santander', umaRegionId: 'uma_andina', code: 'SAN', name: 'Santander', isActive: true, sortOrder: 4 },
  { id: 'state_valle', umaRegionId: 'uma_andina', code: 'VAC', name: 'Valle del Cauca', isActive: true, sortOrder: 5 },

  // Región Caribe
  { id: 'state_atlantico', umaRegionId: 'uma_caribe', code: 'ATL', name: 'Atlántico', isActive: true, sortOrder: 1 },
  { id: 'state_bolivar', umaRegionId: 'uma_caribe', code: 'BOL', name: 'Bolívar', isActive: true, sortOrder: 2 },
  { id: 'state_magdalena', umaRegionId: 'uma_caribe', code: 'MAG', name: 'Magdalena', isActive: true, sortOrder: 3 },

  // Región Pacífica
  { id: 'state_choco', umaRegionId: 'uma_pacifica', code: 'CHO', name: 'Chocó', isActive: true, sortOrder: 1 },
  { id: 'state_cauca', umaRegionId: 'uma_pacifica', code: 'CAU', name: 'Cauca', isActive: true, sortOrder: 2 },
];

export const municipalities: Municipality[] = [
  // Cundinamarca
  { id: 'mun_bogota', stateId: 'state_cundinamarca', code: 'BOG', name: 'Bogotá D.C.', isActive: true, sortOrder: 1 },
  { id: 'mun_soacha', stateId: 'state_cundinamarca', code: 'SOA', name: 'Soacha', isActive: true, sortOrder: 2 },
  { id: 'mun_funza', stateId: 'state_cundinamarca', code: 'FUN', name: 'Funza', isActive: true, sortOrder: 3 },
  { id: 'mun_chia', stateId: 'state_cundinamarca', code: 'CHI', name: 'Chía', isActive: true, sortOrder: 4 },

  // Antioquia
  { id: 'mun_medellin', stateId: 'state_antioquia', code: 'MED', name: 'Medellín', isActive: true, sortOrder: 1 },
  { id: 'mun_envigado', stateId: 'state_antioquia', code: 'ENV', name: 'Envigado', isActive: true, sortOrder: 2 },
  { id: 'mun_itagui', stateId: 'state_antioquia', code: 'ITA', name: 'Itagüí', isActive: true, sortOrder: 3 },
  { id: 'mun_bello', stateId: 'state_antioquia', code: 'BEL', name: 'Bello', isActive: true, sortOrder: 4 },

  // Valle del Cauca
  { id: 'mun_cali', stateId: 'state_valle', code: 'CAL', name: 'Cali', isActive: true, sortOrder: 1 },
  { id: 'mun_palmira', stateId: 'state_valle', code: 'PAL', name: 'Palmira', isActive: true, sortOrder: 2 },
  { id: 'mun_buenaventura', stateId: 'state_valle', code: 'BVE', name: 'Buenaventura', isActive: true, sortOrder: 3 },

  // Atlántico
  { id: 'mun_barranquilla', stateId: 'state_atlantico', code: 'BAQ', name: 'Barranquilla', isActive: true, sortOrder: 1 },
  { id: 'mun_soledad', stateId: 'state_atlantico', code: 'SOL', name: 'Soledad', isActive: true, sortOrder: 2 },

  // Bolívar
  { id: 'mun_cartagena', stateId: 'state_bolivar', code: 'CTG', name: 'Cartagena', isActive: true, sortOrder: 1 },
];

// ─── Channel Data ────────────────────────────────────────────────────────────

export const channelCategories: ChannelCategory[] = [
  { id: 'ch_b2b', code: 'B2B', name: 'Business to Business (Corporativo UMA)', description: 'Ventas corporativas directas', color: '#007AFF', isActive: true, sortOrder: 1 },
  { id: 'ch_retail', code: 'RETAIL', name: 'Retail (Grandes Superficies)', description: 'Cadenas de retail y grandes superficies', color: '#34C759', isActive: true, sortOrder: 2 },
  { id: 'ch_alianzas', code: 'ALIANZAS', name: 'Alianzas', description: 'Alianzas estratégicas y partners', color: '#FF9500', isActive: true, sortOrder: 3 },
  { id: 'ch_propias', code: 'PROPIAS', name: 'Tiendas Propias', description: 'Red de tiendas propias de UMA', color: '#AF52DE', isActive: true, sortOrder: 4 },
  { id: 'ch_distribuidores', code: 'DISTRIB', name: 'Distribuidores Exclusivos', description: 'Red de distribuidores autorizados', color: '#FF2D55', isActive: true, sortOrder: 5 },
  { id: 'ch_agentes', code: 'AGENTES', name: 'Agentes Independientes', description: 'Red de agentes comerciales independientes', color: '#5AC8FA', isActive: true, sortOrder: 6 },
];

export const channels: Channel[] = [
  { id: 'chan_corp_national', categoryId: 'ch_b2b', code: 'CORP-NAC', name: 'Corporativo Nacional', description: 'Grandes cuentas corporativas a nivel nacional', isActive: true, allowedProductIds: [], allowedMunicipalityIds: [] },
  { id: 'chan_alkosto', categoryId: 'ch_retail', code: 'ALK', name: 'Alkosto', description: 'Cadena Alkosto', isActive: true, allowedProductIds: [], allowedMunicipalityIds: [] },
  { id: 'chan_exito', categoryId: 'ch_retail', code: 'EXITO', name: 'Éxito', description: 'Cadena Éxito', isActive: true, allowedProductIds: [], allowedMunicipalityIds: [] },
  { id: 'chan_financieras', categoryId: 'ch_alianzas', code: 'FINA', name: 'Alianzas Financieras', description: 'Bancos y entidades financieras', isActive: true, allowedProductIds: [], allowedMunicipalityIds: [] },
  { id: 'chan_tiendas_bogota', categoryId: 'ch_propias', code: 'TP-BOG', name: 'Tiendas Propias Bogotá', isActive: true, allowedProductIds: [], allowedMunicipalityIds: ['mun_bogota', 'mun_soacha', 'mun_chia'] },
  { id: 'chan_tiendas_medellin', categoryId: 'ch_propias', code: 'TP-MED', name: 'Tiendas Propias Medellín', isActive: true, allowedProductIds: [], allowedMunicipalityIds: ['mun_medellin', 'mun_envigado', 'mun_itagui'] },
];

export const ownStores: OwnStore[] = [
  { id: 'store_bog_norte', channelId: 'chan_tiendas_bogota', code: 'TP-BOG-01', name: 'UMA Bogotá Norte', address: 'Calle 140 # 15-20', municipalityId: 'mun_bogota', contactPhone: '+57 601 1234567', contactEmail: 'norte@uma.com', isActive: true },
  { id: 'store_bog_sur', channelId: 'chan_tiendas_bogota', code: 'TP-BOG-02', name: 'UMA Bogotá Sur', address: 'Av. Boyacá # 45-30', municipalityId: 'mun_bogota', contactPhone: '+57 601 7654321', contactEmail: 'sur@uma.com', isActive: true },
  { id: 'store_soacha', channelId: 'chan_tiendas_bogota', code: 'TP-BOG-03', name: 'UMA Soacha', address: 'Av. Indumil # 30-15', municipalityId: 'mun_soacha', contactPhone: '+57 601 9876543', contactEmail: 'soacha@uma.com', isActive: true },
  { id: 'store_med_centro', channelId: 'chan_tiendas_medellin', code: 'TP-MED-01', name: 'UMA Medellín Centro', address: 'Carrera 50 # 30-20', municipalityId: 'mun_medellin', contactPhone: '+57 604 1112233', contactEmail: 'medcentro@uma.com', isActive: true },
  { id: 'store_envigado', channelId: 'chan_tiendas_medellin', code: 'TP-MED-02', name: 'UMA Envigado', address: 'Calle 34 Sur # 25-40', municipalityId: 'mun_envigado', contactPhone: '+57 604 3344556', contactEmail: 'envigado@uma.com', isActive: true },
];

export const distributors: Distributor[] = [
  { id: 'dist_andes', channelId: 'ch_distribuidores', code: 'DIST-AND', name: 'Distribuidora Andes', legalName: 'Distribuidora Andes S.A.S.', taxId: '900123456-1', contactPerson: 'Carlos Rodríguez', contactEmail: 'carlos@distandes.com', contactPhone: '+57 310 1234567', isActive: true },
  { id: 'dist_caribe', channelId: 'ch_distribuidores', code: 'DIST-CAR', name: 'Distribuidora Caribe', legalName: 'Distribuidora Caribe Ltda.', taxId: '900234567-2', contactPerson: 'Ana Martínez', contactEmail: 'ana@distcaribe.com', contactPhone: '+57 315 2345678', isActive: true },
];

export const distributorStores: DistributorStore[] = [
  { id: 'dstore_andes_cali', distributorId: 'dist_andes', code: 'DAND-CAL-01', name: 'Andes Cali Centro', address: 'Calle 10 # 5-30', municipalityId: 'mun_cali', contactPhone: '+57 602 1234567', isActive: true },
  { id: 'dstore_andes_palmira', distributorId: 'dist_andes', code: 'DAND-PAL-01', name: 'Andes Palmira', address: 'Carrera 30 # 20-15', municipalityId: 'mun_palmira', contactPhone: '+57 602 7654321', isActive: true },
  { id: 'dstore_caribe_barranquilla', distributorId: 'dist_caribe', code: 'DCAR-BAQ-01', name: 'Caribe Barranquilla Norte', address: 'Calle 85 # 52-10', municipalityId: 'mun_barranquilla', contactPhone: '+57 605 3334444', isActive: true },
  { id: 'dstore_caribe_cartagena', distributorId: 'dist_caribe', code: 'DCAR-CTG-01', name: 'Caribe Cartagena', address: 'Avenida Pedro de Heredia # 30-40', municipalityId: 'mun_cartagena', contactPhone: '+57 605 5556666', isActive: true },
];

export const regions: Region[] = [
  { id: 'region_andina', countryId: 'country_colombia', name: 'Región Andina' },
  { id: 'region_caribe', countryId: 'country_colombia', name: 'Región Caribe' },
  { id: 'region_pacifica', countryId: 'country_colombia', name: 'Región Pacífica' },
  { id: 'region_orinoquia', countryId: 'country_colombia', name: 'Región Orinoquía' },
  { id: 'region_amazonia', countryId: 'country_colombia', name: 'Región Amazonía' },
];

export const departments: Department[] = [
  { id: 'dept_cundinamarca', regionId: 'region_andina', name: 'Cundinamarca' },
  { id: 'dept_antioquia', regionId: 'region_andina', name: 'Antioquia' },
  { id: 'dept_valle', regionId: 'region_pacifica', name: 'Valle del Cauca' },
  { id: 'dept_atlantico', regionId: 'region_caribe', name: 'Atlántico' },
  { id: 'dept_bolivar', regionId: 'region_caribe', name: 'Bolívar' },
  { id: 'dept_meta', regionId: 'region_orinoquia', name: 'Meta' },
];

// ─── Organizations & User Profiles ───────────────────────────────────────────

export const organizations: Organization[] = [
  { id: 'org_1', companyName: 'Distribuidora El Sol', nit: '900123456-1', countryId: 'country_colombia', isActive: true, createdAt: '2024-01-15' },
  { id: 'org_2', companyName: 'Grupo Comercial Andino', nit: '900234567-2', countryId: 'country_colombia', isActive: true, createdAt: '2024-02-10' },
  { id: 'org_3', companyName: 'Motocenter S.A.S.', nit: '900345678-3', countryId: 'country_colombia', isActive: true, createdAt: '2024-03-05' },
];

export const userProfiles: UserProfile[] = [
  // Individual user - National access
  {
    id: 'up_1',
    userId: 'user_1',
    userType: 'individual',
    nomenclature: 'B2B-001',
    userName: 'Carlos Mendoza',
    email: 'carlos.mendoza@email.com',
    whatsapp: '+57 310 1234567',
    countryId: 'country_colombia',
    geographyAccessLevel: 'national',
    geographyAccessIds: ['country_colombia'],
    channelId: 'chan_corp_national',
    isActive: true,
    createdAt: '2024-01-10',
    createdBy: 'admin'
  },
  // Company user with multiple sub-users - Organization parent
  {
    id: 'up_2',
    userId: 'user_2',
    userType: 'company',
    nomenclature: 'PROPIAS-002',
    userName: 'Ana García',
    email: 'ana.garcia@uma.com',
    whatsapp: '+57 315 2345678',
    countryId: 'country_colombia',
    organizationId: 'org_1',
    internalStoreCode: 'TP-BOG-01',
    storeId: 'store_bog_norte',
    geographyAccessLevel: 'uma_region',
    geographyAccessIds: ['uma_andina'],
    channelId: 'chan_tiendas_bogota',
    isActive: true,
    createdAt: '2024-01-15',
    createdBy: 'admin'
  },
  // Sub-user within organization
  {
    id: 'up_3',
    userId: 'user_3',
    userType: 'company',
    nomenclature: 'PROPIAS-003',
    userName: 'Luis Rodríguez',
    email: 'luis.rodriguez@uma.com',
    whatsapp: '+57 320 3456789',
    countryId: 'country_colombia',
    organizationId: 'org_1',
    parentUserId: 'up_2',
    internalStoreCode: 'TP-BOG-02',
    storeId: 'store_bog_sur',
    geographyAccessLevel: 'store',
    geographyAccessIds: ['store_bog_sur'],
    channelId: 'chan_tiendas_bogota',
    isActive: true,
    createdAt: '2024-02-01',
    createdBy: 'up_2'
  },
  // Individual user - Department level access
  {
    id: 'up_4',
    userId: 'user_4',
    userType: 'individual',
    nomenclature: 'RETAIL-004',
    userName: 'María López',
    email: 'maria.lopez@alkosto.com',
    whatsapp: '+57 318 4567890',
    countryId: 'country_colombia',
    geographyAccessLevel: 'department',
    geographyAccessIds: ['state_antioquia'],
    channelId: 'chan_alkosto',
    isActive: true,
    createdAt: '2024-03-01',
    createdBy: 'admin'
  },
  // Company user - Municipality level
  {
    id: 'up_5',
    userId: 'user_5',
    userType: 'company',
    nomenclature: 'DISTRIB-005',
    userName: 'Pedro Sánchez',
    email: 'pedro.sanchez@distandes.com',
    whatsapp: '+57 312 5678901',
    countryId: 'country_colombia',
    organizationId: 'org_2',
    externalStoreCode: 'DAND-CAL-01',
    geographyAccessLevel: 'municipality',
    geographyAccessIds: ['mun_cali', 'mun_palmira'],
    channelId: 'ch_distribuidores',
    isActive: true,
    createdAt: '2024-03-10',
    createdBy: 'admin'
  },
  // Sub-user in dealer group
  {
    id: 'up_6',
    userId: 'user_6',
    userType: 'company',
    nomenclature: 'DISTRIB-006',
    userName: 'Sofia Ramírez',
    email: 'sofia.ramirez@distandes.com',
    whatsapp: '+57 314 6789012',
    countryId: 'country_colombia',
    organizationId: 'org_2',
    parentUserId: 'up_5',
    externalStoreCode: 'DAND-PAL-01',
    geographyAccessLevel: 'municipality',
    geographyAccessIds: ['mun_palmira'],
    channelId: 'ch_distribuidores',
    isActive: true,
    createdAt: '2024-03-15',
    createdBy: 'up_5'
  },
];
