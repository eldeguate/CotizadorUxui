// PromoUMA — Datos geográficos
// Jerarquía: País → Región UMA → Departamento → Municipio
// NOTA: Las regiones UMA son agrupaciones de negocio personalizadas, deben ser validadas con el equipo comercial
// Los municipios incluyen capitales + ciudades principales por departamento

export interface GeoCountry {
  id: string;
  name: string;
  code: string; // ISO alpha-2
  currency: string;
  flag: string;
}

export interface GeoRegion {
  id: string;
  countryId: string;
  name: string;
  description?: string;
  externalMappings?: RegionExternalMapping[];
}

export interface RegionExternalMapping {
  systemId: string;
  externalName: string;
  externalId: string;
}

export interface GeoDepartment {
  id: string;
  regionId: string;
  countryId: string;
  name: string;
  capital?: string;
}

export interface GeoMunicipio {
  id: string;
  departmentId: string;
  name: string;
  isCapital?: boolean;
}

// ─── PAÍSES ───────────────────────────────────────────────────────────────
export const geoCountries: GeoCountry[] = [
  { id: 'gt', name: 'Guatemala',   code: 'GT', currency: 'GTQ', flag: '🇬🇹' },
  { id: 'sv', name: 'El Salvador', code: 'SV', currency: 'USD', flag: '🇸🇻' },
  { id: 'hn', name: 'Honduras',    code: 'HN', currency: 'HNL', flag: '🇭🇳' },
  { id: 'ni', name: 'Nicaragua',   code: 'NI', currency: 'NIO', flag: '🇳🇮' },
  { id: 'cr', name: 'Costa Rica',  code: 'CR', currency: 'CRC', flag: '🇨🇷' },
  { id: 'co', name: 'Colombia',    code: 'CO', currency: 'COP', flag: '🇨🇴' },
  { id: 've', name: 'Venezuela',   code: 'VE', currency: 'VES', flag: '🇻🇪' },
  { id: 'es', name: 'España',      code: 'ES', currency: 'EUR', flag: '🇪🇸' },
  { id: 'pt', name: 'Portugal',    code: 'PT', currency: 'EUR', flag: '🇵🇹' },
];

// ─── REGIONES UMA (agrupación personalizada de negocio) ──────────────────
export const geoRegions: GeoRegion[] = [
  // Guatemala — basado en INE Guatemala 8 regiones
  { id: 'gt-r-metropolitana', countryId: 'gt', name: 'Metropolitana' },
  { id: 'gt-r-norte',         countryId: 'gt', name: 'Norte' },
  { id: 'gt-r-nororiente',    countryId: 'gt', name: 'Nororiente' },
  { id: 'gt-r-suroriente',    countryId: 'gt', name: 'Suroriente' },
  { id: 'gt-r-central',       countryId: 'gt', name: 'Central' },
  { id: 'gt-r-suroccidente',  countryId: 'gt', name: 'Suroccidente' },
  { id: 'gt-r-noroccidente',  countryId: 'gt', name: 'Noroccidente' },
  { id: 'gt-r-peten',         countryId: 'gt', name: 'Petén' },

  // El Salvador
  { id: 'sv-r-occidental', countryId: 'sv', name: 'Occidental' },
  { id: 'sv-r-central',    countryId: 'sv', name: 'Central' },
  { id: 'sv-r-oriental',   countryId: 'sv', name: 'Oriental' },

  // Honduras
  { id: 'hn-r-noroccidental', countryId: 'hn', name: 'Noroccidental' },
  { id: 'hn-r-norte',         countryId: 'hn', name: 'Norte' },
  { id: 'hn-r-nororiental',   countryId: 'hn', name: 'Nororiental' },
  { id: 'hn-r-central',       countryId: 'hn', name: 'Central' },
  { id: 'hn-r-sur',           countryId: 'hn', name: 'Sur' },
  { id: 'hn-r-oriental',      countryId: 'hn', name: 'Oriental' },
  { id: 'hn-r-insular',       countryId: 'hn', name: 'Insular' },

  // Nicaragua
  { id: 'ni-r-pacifico', countryId: 'ni', name: 'Pacífico' },
  { id: 'ni-r-central',  countryId: 'ni', name: 'Central' },
  { id: 'ni-r-caribe',   countryId: 'ni', name: 'Caribe' },

  // Costa Rica
  { id: 'cr-r-central',  countryId: 'cr', name: 'Central' },
  { id: 'cr-r-pacifico', countryId: 'cr', name: 'Pacífico' },
  { id: 'cr-r-caribe',   countryId: 'cr', name: 'Caribe' },

  // Colombia
  { id: 'co-r-andina',    countryId: 'co', name: 'Andina' },
  { id: 'co-r-caribe',    countryId: 'co', name: 'Caribe' },
  { id: 'co-r-pacifica',  countryId: 'co', name: 'Pacífica' },
  { id: 'co-r-orinoquia', countryId: 'co', name: 'Orinoquía' },
  { id: 'co-r-amazonia',  countryId: 'co', name: 'Amazonía' },

  // Venezuela
  { id: 've-r-capital',         countryId: 've', name: 'Capital' },
  { id: 've-r-central',         countryId: 've', name: 'Central' },
  { id: 've-r-llanos',          countryId: 've', name: 'Los Llanos' },
  { id: 've-r-centroccidental', countryId: 've', name: 'Centroccidental' },
  { id: 've-r-zuliana',         countryId: 've', name: 'Zuliana' },
  { id: 've-r-andes',           countryId: 've', name: 'Los Andes' },
  { id: 've-r-nororiental',     countryId: 've', name: 'Nororiental' },
  { id: 've-r-guayana',         countryId: 've', name: 'Guayana' },

  // España — 7 regiones UMA agrupando las 17 CCAA + Ceuta/Melilla
  { id: 'es-r-noroeste', countryId: 'es', name: 'Noroeste' },
  { id: 'es-r-norte',    countryId: 'es', name: 'Norte' },
  { id: 'es-r-nordeste', countryId: 'es', name: 'Nordeste' },
  { id: 'es-r-centro',   countryId: 'es', name: 'Centro' },
  { id: 'es-r-este',     countryId: 'es', name: 'Este' },
  { id: 'es-r-sur',      countryId: 'es', name: 'Sur' },
  { id: 'es-r-canarias', countryId: 'es', name: 'Canarias' },

  // Portugal — NUTS II
  { id: 'pt-r-norte',   countryId: 'pt', name: 'Norte' },
  { id: 'pt-r-centro',  countryId: 'pt', name: 'Centro' },
  { id: 'pt-r-lisboa',  countryId: 'pt', name: 'Área Metropolitana de Lisboa' },
  { id: 'pt-r-alentejo',countryId: 'pt', name: 'Alentejo' },
  { id: 'pt-r-algarve', countryId: 'pt', name: 'Algarve' },
  { id: 'pt-r-acores',  countryId: 'pt', name: 'Açores' },
  { id: 'pt-r-madeira', countryId: 'pt', name: 'Madeira' },
];

// ─── DEPARTAMENTOS / PROVINCIAS / ESTADOS ─────────────────────────────────
export const geoDepartments: GeoDepartment[] = [
  // ── GUATEMALA (22 departamentos) ──
  { id: 'gt-d-guatemala',       countryId: 'gt', regionId: 'gt-r-metropolitana', name: 'Guatemala',      capital: 'Ciudad de Guatemala' },
  { id: 'gt-d-alta-verapaz',    countryId: 'gt', regionId: 'gt-r-norte',         name: 'Alta Verapaz',   capital: 'Cobán' },
  { id: 'gt-d-baja-verapaz',    countryId: 'gt', regionId: 'gt-r-norte',         name: 'Baja Verapaz',   capital: 'Salamá' },
  { id: 'gt-d-el-progreso',     countryId: 'gt', regionId: 'gt-r-nororiente',    name: 'El Progreso',    capital: 'Guastatoya' },
  { id: 'gt-d-izabal',          countryId: 'gt', regionId: 'gt-r-nororiente',    name: 'Izabal',         capital: 'Puerto Barrios' },
  { id: 'gt-d-zacapa',          countryId: 'gt', regionId: 'gt-r-nororiente',    name: 'Zacapa',         capital: 'Zacapa' },
  { id: 'gt-d-chiquimula',      countryId: 'gt', regionId: 'gt-r-nororiente',    name: 'Chiquimula',     capital: 'Chiquimula' },
  { id: 'gt-d-santa-rosa',      countryId: 'gt', regionId: 'gt-r-suroriente',    name: 'Santa Rosa',     capital: 'Cuilapa' },
  { id: 'gt-d-jalapa',          countryId: 'gt', regionId: 'gt-r-suroriente',    name: 'Jalapa',         capital: 'Jalapa' },
  { id: 'gt-d-jutiapa',         countryId: 'gt', regionId: 'gt-r-suroriente',    name: 'Jutiapa',        capital: 'Jutiapa' },
  { id: 'gt-d-sacatepequez',    countryId: 'gt', regionId: 'gt-r-central',       name: 'Sacatepéquez',   capital: 'Antigua Guatemala' },
  { id: 'gt-d-chimaltenango',   countryId: 'gt', regionId: 'gt-r-central',       name: 'Chimaltenango',  capital: 'Chimaltenango' },
  { id: 'gt-d-escuintla',       countryId: 'gt', regionId: 'gt-r-central',       name: 'Escuintla',      capital: 'Escuintla' },
  { id: 'gt-d-solola',          countryId: 'gt', regionId: 'gt-r-suroccidente',  name: 'Sololá',         capital: 'Sololá' },
  { id: 'gt-d-totonicapan',     countryId: 'gt', regionId: 'gt-r-suroccidente',  name: 'Totonicapán',    capital: 'Totonicapán' },
  { id: 'gt-d-quetzaltenango',  countryId: 'gt', regionId: 'gt-r-suroccidente',  name: 'Quetzaltenango', capital: 'Quetzaltenango' },
  { id: 'gt-d-suchitepequez',   countryId: 'gt', regionId: 'gt-r-suroccidente',  name: 'Suchitepéquez',  capital: 'Mazatenango' },
  { id: 'gt-d-retalhuleu',      countryId: 'gt', regionId: 'gt-r-suroccidente',  name: 'Retalhuleu',     capital: 'Retalhuleu' },
  { id: 'gt-d-san-marcos',      countryId: 'gt', regionId: 'gt-r-suroccidente',  name: 'San Marcos',     capital: 'San Marcos' },
  { id: 'gt-d-huehuetenango',   countryId: 'gt', regionId: 'gt-r-noroccidente',  name: 'Huehuetenango',  capital: 'Huehuetenango' },
  { id: 'gt-d-quiche',          countryId: 'gt', regionId: 'gt-r-noroccidente',  name: 'Quiché',         capital: 'Santa Cruz del Quiché' },
  { id: 'gt-d-peten',           countryId: 'gt', regionId: 'gt-r-peten',         name: 'Petén',          capital: 'Flores' },

  // ── EL SALVADOR (14 departamentos) ──
  { id: 'sv-d-ahuachapan',   countryId: 'sv', regionId: 'sv-r-occidental', name: 'Ahuachapán',   capital: 'Ahuachapán' },
  { id: 'sv-d-santa-ana',    countryId: 'sv', regionId: 'sv-r-occidental', name: 'Santa Ana',    capital: 'Santa Ana' },
  { id: 'sv-d-sonsonate',    countryId: 'sv', regionId: 'sv-r-occidental', name: 'Sonsonate',    capital: 'Sonsonate' },
  { id: 'sv-d-la-libertad',  countryId: 'sv', regionId: 'sv-r-central',    name: 'La Libertad',  capital: 'Santa Tecla' },
  { id: 'sv-d-chalatenango', countryId: 'sv', regionId: 'sv-r-central',    name: 'Chalatenango', capital: 'Chalatenango' },
  { id: 'sv-d-cuscatlan',    countryId: 'sv', regionId: 'sv-r-central',    name: 'Cuscatlán',    capital: 'Cojutepeque' },
  { id: 'sv-d-san-salvador', countryId: 'sv', regionId: 'sv-r-central',    name: 'San Salvador', capital: 'San Salvador' },
  { id: 'sv-d-la-paz',       countryId: 'sv', regionId: 'sv-r-central',    name: 'La Paz',       capital: 'Zacatecoluca' },
  { id: 'sv-d-cabanas',      countryId: 'sv', regionId: 'sv-r-central',    name: 'Cabañas',      capital: 'Sensuntepeque' },
  { id: 'sv-d-san-vicente',  countryId: 'sv', regionId: 'sv-r-central',    name: 'San Vicente',  capital: 'San Vicente' },
  { id: 'sv-d-usulutan',     countryId: 'sv', regionId: 'sv-r-oriental',   name: 'Usulután',     capital: 'Usulután' },
  { id: 'sv-d-san-miguel',   countryId: 'sv', regionId: 'sv-r-oriental',   name: 'San Miguel',   capital: 'San Miguel' },
  { id: 'sv-d-morazan',      countryId: 'sv', regionId: 'sv-r-oriental',   name: 'Morazán',      capital: 'San Francisco Gotera' },
  { id: 'sv-d-la-union',     countryId: 'sv', regionId: 'sv-r-oriental',   name: 'La Unión',     capital: 'La Unión' },

  // ── HONDURAS (18 departamentos) ──
  { id: 'hn-d-cortes',            countryId: 'hn', regionId: 'hn-r-noroccidental', name: 'Cortés',            capital: 'San Pedro Sula' },
  { id: 'hn-d-santa-barbara',     countryId: 'hn', regionId: 'hn-r-noroccidental', name: 'Santa Bárbara',     capital: 'Santa Bárbara' },
  { id: 'hn-d-copan',             countryId: 'hn', regionId: 'hn-r-noroccidental', name: 'Copán',             capital: 'Santa Rosa de Copán' },
  { id: 'hn-d-ocotepeque',        countryId: 'hn', regionId: 'hn-r-noroccidental', name: 'Ocotepeque',        capital: 'Ocotepeque' },
  { id: 'hn-d-lempira',           countryId: 'hn', regionId: 'hn-r-noroccidental', name: 'Lempira',           capital: 'Gracias' },
  { id: 'hn-d-intibuca',          countryId: 'hn', regionId: 'hn-r-noroccidental', name: 'Intibucá',          capital: 'La Esperanza' },
  { id: 'hn-d-atlantida',         countryId: 'hn', regionId: 'hn-r-norte',         name: 'Atlántida',         capital: 'La Ceiba' },
  { id: 'hn-d-yoro',              countryId: 'hn', regionId: 'hn-r-norte',         name: 'Yoro',              capital: 'Yoro' },
  { id: 'hn-d-colon',             countryId: 'hn', regionId: 'hn-r-norte',         name: 'Colón',             capital: 'Trujillo' },
  { id: 'hn-d-olancho',           countryId: 'hn', regionId: 'hn-r-nororiental',   name: 'Olancho',           capital: 'Juticalpa' },
  { id: 'hn-d-gracias-a-dios',    countryId: 'hn', regionId: 'hn-r-nororiental',   name: 'Gracias a Dios',    capital: 'Puerto Lempira' },
  { id: 'hn-d-francisco-morazan', countryId: 'hn', regionId: 'hn-r-central',       name: 'Francisco Morazán', capital: 'Tegucigalpa' },
  { id: 'hn-d-comayagua',         countryId: 'hn', regionId: 'hn-r-central',       name: 'Comayagua',         capital: 'Comayagua' },
  { id: 'hn-d-la-paz',            countryId: 'hn', regionId: 'hn-r-central',       name: 'La Paz',            capital: 'La Paz' },
  { id: 'hn-d-valle',             countryId: 'hn', regionId: 'hn-r-sur',           name: 'Valle',             capital: 'Nacaome' },
  { id: 'hn-d-choluteca',         countryId: 'hn', regionId: 'hn-r-sur',           name: 'Choluteca',         capital: 'Choluteca' },
  { id: 'hn-d-el-paraiso',        countryId: 'hn', regionId: 'hn-r-oriental',      name: 'El Paraíso',        capital: 'Yuscarán' },
  { id: 'hn-d-islas-bahia',       countryId: 'hn', regionId: 'hn-r-insular',       name: 'Islas de la Bahía', capital: 'Roatán' },

  // ── NICARAGUA (17 departamentos) ──
  { id: 'ni-d-managua',        countryId: 'ni', regionId: 'ni-r-pacifico', name: 'Managua',        capital: 'Managua' },
  { id: 'ni-d-leon',           countryId: 'ni', regionId: 'ni-r-pacifico', name: 'León',           capital: 'León' },
  { id: 'ni-d-chinandega',     countryId: 'ni', regionId: 'ni-r-pacifico', name: 'Chinandega',     capital: 'Chinandega' },
  { id: 'ni-d-masaya',         countryId: 'ni', regionId: 'ni-r-pacifico', name: 'Masaya',         capital: 'Masaya' },
  { id: 'ni-d-granada',        countryId: 'ni', regionId: 'ni-r-pacifico', name: 'Granada',        capital: 'Granada' },
  { id: 'ni-d-carazo',         countryId: 'ni', regionId: 'ni-r-pacifico', name: 'Carazo',         capital: 'Jinotepe' },
  { id: 'ni-d-rivas',          countryId: 'ni', regionId: 'ni-r-pacifico', name: 'Rivas',          capital: 'Rivas' },
  { id: 'ni-d-esteli',         countryId: 'ni', regionId: 'ni-r-central',  name: 'Estelí',         capital: 'Estelí' },
  { id: 'ni-d-madriz',         countryId: 'ni', regionId: 'ni-r-central',  name: 'Madriz',         capital: 'Somoto' },
  { id: 'ni-d-nueva-segovia',  countryId: 'ni', regionId: 'ni-r-central',  name: 'Nueva Segovia',  capital: 'Ocotal' },
  { id: 'ni-d-boaco',          countryId: 'ni', regionId: 'ni-r-central',  name: 'Boaco',          capital: 'Boaco' },
  { id: 'ni-d-chontales',      countryId: 'ni', regionId: 'ni-r-central',  name: 'Chontales',      capital: 'Juigalpa' },
  { id: 'ni-d-matagalpa',      countryId: 'ni', regionId: 'ni-r-central',  name: 'Matagalpa',      capital: 'Matagalpa' },
  { id: 'ni-d-jinotega',       countryId: 'ni', regionId: 'ni-r-central',  name: 'Jinotega',       capital: 'Jinotega' },
  { id: 'ni-d-raccn',          countryId: 'ni', regionId: 'ni-r-caribe',   name: 'RACCN',          capital: 'Bilwi' },
  { id: 'ni-d-raccs',          countryId: 'ni', regionId: 'ni-r-caribe',   name: 'RACCS',          capital: 'Bluefields' },
  { id: 'ni-d-rio-san-juan',   countryId: 'ni', regionId: 'ni-r-caribe',   name: 'Río San Juan',   capital: 'San Carlos' },

  // ── COSTA RICA (7 provincias) ──
  { id: 'cr-d-san-jose',   countryId: 'cr', regionId: 'cr-r-central',  name: 'San José',   capital: 'San José' },
  { id: 'cr-d-alajuela',   countryId: 'cr', regionId: 'cr-r-central',  name: 'Alajuela',   capital: 'Alajuela' },
  { id: 'cr-d-cartago',    countryId: 'cr', regionId: 'cr-r-central',  name: 'Cartago',    capital: 'Cartago' },
  { id: 'cr-d-heredia',    countryId: 'cr', regionId: 'cr-r-central',  name: 'Heredia',    capital: 'Heredia' },
  { id: 'cr-d-puntarenas', countryId: 'cr', regionId: 'cr-r-pacifico', name: 'Puntarenas', capital: 'Puntarenas' },
  { id: 'cr-d-guanacaste', countryId: 'cr', regionId: 'cr-r-pacifico', name: 'Guanacaste', capital: 'Liberia' },
  { id: 'cr-d-limon',      countryId: 'cr', regionId: 'cr-r-caribe',   name: 'Limón',      capital: 'Limón' },

  // ── COLOMBIA (33 departamentos) ──
  { id: 'co-d-antioquia',          countryId: 'co', regionId: 'co-r-andina',    name: 'Antioquia',                  capital: 'Medellín' },
  { id: 'co-d-boyaca',             countryId: 'co', regionId: 'co-r-andina',    name: 'Boyacá',                     capital: 'Tunja' },
  { id: 'co-d-caldas',             countryId: 'co', regionId: 'co-r-andina',    name: 'Caldas',                     capital: 'Manizales' },
  { id: 'co-d-cundinamarca',       countryId: 'co', regionId: 'co-r-andina',    name: 'Cundinamarca',               capital: 'Bogotá' },
  { id: 'co-d-bogota',             countryId: 'co', regionId: 'co-r-andina',    name: 'Bogotá D.C.',                capital: 'Bogotá' },
  { id: 'co-d-huila',              countryId: 'co', regionId: 'co-r-andina',    name: 'Huila',                      capital: 'Neiva' },
  { id: 'co-d-norte-santander',    countryId: 'co', regionId: 'co-r-andina',    name: 'Norte de Santander',         capital: 'Cúcuta' },
  { id: 'co-d-quindio',            countryId: 'co', regionId: 'co-r-andina',    name: 'Quindío',                    capital: 'Armenia' },
  { id: 'co-d-risaralda',          countryId: 'co', regionId: 'co-r-andina',    name: 'Risaralda',                  capital: 'Pereira' },
  { id: 'co-d-santander',          countryId: 'co', regionId: 'co-r-andina',    name: 'Santander',                  capital: 'Bucaramanga' },
  { id: 'co-d-tolima',             countryId: 'co', regionId: 'co-r-andina',    name: 'Tolima',                     capital: 'Ibagué' },
  { id: 'co-d-atlantico',          countryId: 'co', regionId: 'co-r-caribe',    name: 'Atlántico',                  capital: 'Barranquilla' },
  { id: 'co-d-bolivar',            countryId: 'co', regionId: 'co-r-caribe',    name: 'Bolívar',                    capital: 'Cartagena' },
  { id: 'co-d-cesar',              countryId: 'co', regionId: 'co-r-caribe',    name: 'Cesar',                      capital: 'Valledupar' },
  { id: 'co-d-cordoba',            countryId: 'co', regionId: 'co-r-caribe',    name: 'Córdoba',                    capital: 'Montería' },
  { id: 'co-d-la-guajira',         countryId: 'co', regionId: 'co-r-caribe',    name: 'La Guajira',                 capital: 'Riohacha' },
  { id: 'co-d-magdalena',          countryId: 'co', regionId: 'co-r-caribe',    name: 'Magdalena',                  capital: 'Santa Marta' },
  { id: 'co-d-sucre',              countryId: 'co', regionId: 'co-r-caribe',    name: 'Sucre',                      capital: 'Sincelejo' },
  { id: 'co-d-san-andres',         countryId: 'co', regionId: 'co-r-caribe',    name: 'San Andrés y Providencia',  capital: 'San Andrés' },
  { id: 'co-d-cauca',              countryId: 'co', regionId: 'co-r-pacifica',  name: 'Cauca',                      capital: 'Popayán' },
  { id: 'co-d-choco',              countryId: 'co', regionId: 'co-r-pacifica',  name: 'Chocó',                      capital: 'Quibdó' },
  { id: 'co-d-narino',             countryId: 'co', regionId: 'co-r-pacifica',  name: 'Nariño',                     capital: 'Pasto' },
  { id: 'co-d-valle-del-cauca',    countryId: 'co', regionId: 'co-r-pacifica',  name: 'Valle del Cauca',            capital: 'Cali' },
  { id: 'co-d-arauca',             countryId: 'co', regionId: 'co-r-orinoquia', name: 'Arauca',                     capital: 'Arauca' },
  { id: 'co-d-casanare',           countryId: 'co', regionId: 'co-r-orinoquia', name: 'Casanare',                   capital: 'Yopal' },
  { id: 'co-d-meta',               countryId: 'co', regionId: 'co-r-orinoquia', name: 'Meta',                       capital: 'Villavicencio' },
  { id: 'co-d-vichada',            countryId: 'co', regionId: 'co-r-orinoquia', name: 'Vichada',                    capital: 'Puerto Carreño' },
  { id: 'co-d-amazonas',           countryId: 'co', regionId: 'co-r-amazonia',  name: 'Amazonas',                   capital: 'Leticia' },
  { id: 'co-d-caqueta',            countryId: 'co', regionId: 'co-r-amazonia',  name: 'Caquetá',                    capital: 'Florencia' },
  { id: 'co-d-guainia',            countryId: 'co', regionId: 'co-r-amazonia',  name: 'Guainía',                    capital: 'Inírida' },
  { id: 'co-d-guaviare',           countryId: 'co', regionId: 'co-r-amazonia',  name: 'Guaviare',                   capital: 'San José del Guaviare' },
  { id: 'co-d-putumayo',           countryId: 'co', regionId: 'co-r-amazonia',  name: 'Putumayo',                   capital: 'Mocoa' },
  { id: 'co-d-vaupes',             countryId: 'co', regionId: 'co-r-amazonia',  name: 'Vaupés',                     capital: 'Mitú' },

  // ── VENEZUELA (25 estados) ──
  { id: 've-d-distrito-capital', countryId: 've', regionId: 've-r-capital',         name: 'Distrito Capital',     capital: 'Caracas' },
  { id: 've-d-miranda',          countryId: 've', regionId: 've-r-capital',         name: 'Miranda',              capital: 'Los Teques' },
  { id: 've-d-la-guaira',        countryId: 've', regionId: 've-r-capital',         name: 'La Guaira',            capital: 'La Guaira' },
  { id: 've-d-aragua',           countryId: 've', regionId: 've-r-central',         name: 'Aragua',               capital: 'Maracay' },
  { id: 've-d-carabobo',         countryId: 've', regionId: 've-r-central',         name: 'Carabobo',             capital: 'Valencia' },
  { id: 've-d-apure',            countryId: 've', regionId: 've-r-llanos',          name: 'Apure',                capital: 'San Fernando de Apure' },
  { id: 've-d-barinas',          countryId: 've', regionId: 've-r-llanos',          name: 'Barinas',              capital: 'Barinas' },
  { id: 've-d-cojedes',          countryId: 've', regionId: 've-r-llanos',          name: 'Cojedes',              capital: 'San Carlos' },
  { id: 've-d-guarico',          countryId: 've', regionId: 've-r-llanos',          name: 'Guárico',              capital: 'San Juan de los Morros' },
  { id: 've-d-portuguesa',       countryId: 've', regionId: 've-r-centroccidental', name: 'Portuguesa',           capital: 'Guanare' },
  { id: 've-d-yaracuy',          countryId: 've', regionId: 've-r-centroccidental', name: 'Yaracuy',              capital: 'San Felipe' },
  { id: 've-d-lara',             countryId: 've', regionId: 've-r-centroccidental', name: 'Lara',                 capital: 'Barquisimeto' },
  { id: 've-d-zulia',            countryId: 've', regionId: 've-r-zuliana',         name: 'Zulia',                capital: 'Maracaibo' },
  { id: 've-d-falcon',           countryId: 've', regionId: 've-r-zuliana',         name: 'Falcón',               capital: 'Coro' },
  { id: 've-d-merida',           countryId: 've', regionId: 've-r-andes',           name: 'Mérida',               capital: 'Mérida' },
  { id: 've-d-tachira',          countryId: 've', regionId: 've-r-andes',           name: 'Táchira',              capital: 'San Cristóbal' },
  { id: 've-d-trujillo',         countryId: 've', regionId: 've-r-andes',           name: 'Trujillo',             capital: 'Trujillo' },
  { id: 've-d-anzoategui',       countryId: 've', regionId: 've-r-nororiental',     name: 'Anzoátegui',           capital: 'Barcelona' },
  { id: 've-d-monagas',          countryId: 've', regionId: 've-r-nororiental',     name: 'Monagas',              capital: 'Maturín' },
  { id: 've-d-sucre',            countryId: 've', regionId: 've-r-nororiental',     name: 'Sucre',                capital: 'Cumaná' },
  { id: 've-d-nueva-esparta',    countryId: 've', regionId: 've-r-nororiental',     name: 'Nueva Esparta',        capital: 'La Asunción' },
  { id: 've-d-bolivar',          countryId: 've', regionId: 've-r-guayana',         name: 'Bolívar',              capital: 'Ciudad Bolívar' },
  { id: 've-d-amazonas',         countryId: 've', regionId: 've-r-guayana',         name: 'Amazonas',             capital: 'Puerto Ayacucho' },
  { id: 've-d-delta-amacuro',    countryId: 've', regionId: 've-r-guayana',         name: 'Delta Amacuro',        capital: 'Tucupita' },
  { id: 've-d-dependencias',     countryId: 've', regionId: 've-r-nororiental',     name: 'Dependencias Federales', capital: 'Los Roques' },

  // ── ESPAÑA (19 comunidades autónomas + 2 ciudades autónomas) ──
  { id: 'es-d-galicia',        countryId: 'es', regionId: 'es-r-noroeste', name: 'Galicia',              capital: 'Santiago de Compostela' },
  { id: 'es-d-asturias',       countryId: 'es', regionId: 'es-r-norte',    name: 'Asturias',             capital: 'Oviedo' },
  { id: 'es-d-cantabria',      countryId: 'es', regionId: 'es-r-norte',    name: 'Cantabria',            capital: 'Santander' },
  { id: 'es-d-pais-vasco',     countryId: 'es', regionId: 'es-r-norte',    name: 'País Vasco',           capital: 'Vitoria-Gasteiz' },
  { id: 'es-d-navarra',        countryId: 'es', regionId: 'es-r-norte',    name: 'Navarra',              capital: 'Pamplona' },
  { id: 'es-d-la-rioja',       countryId: 'es', regionId: 'es-r-norte',    name: 'La Rioja',             capital: 'Logroño' },
  { id: 'es-d-aragon',         countryId: 'es', regionId: 'es-r-nordeste', name: 'Aragón',               capital: 'Zaragoza' },
  { id: 'es-d-cataluna',       countryId: 'es', regionId: 'es-r-nordeste', name: 'Cataluña',             capital: 'Barcelona' },
  { id: 'es-d-madrid',         countryId: 'es', regionId: 'es-r-centro',   name: 'Madrid',               capital: 'Madrid' },
  { id: 'es-d-castilla-leon',  countryId: 'es', regionId: 'es-r-centro',   name: 'Castilla y León',      capital: 'Valladolid' },
  { id: 'es-d-castilla-mancha',countryId: 'es', regionId: 'es-r-centro',   name: 'Castilla-La Mancha',   capital: 'Toledo' },
  { id: 'es-d-extremadura',    countryId: 'es', regionId: 'es-r-centro',   name: 'Extremadura',          capital: 'Mérida' },
  { id: 'es-d-valencia',       countryId: 'es', regionId: 'es-r-este',     name: 'Comunidad Valenciana', capital: 'Valencia' },
  { id: 'es-d-murcia',         countryId: 'es', regionId: 'es-r-este',     name: 'Murcia',               capital: 'Murcia' },
  { id: 'es-d-baleares',       countryId: 'es', regionId: 'es-r-este',     name: 'Baleares',             capital: 'Palma de Mallorca' },
  { id: 'es-d-andalucia',      countryId: 'es', regionId: 'es-r-sur',      name: 'Andalucía',            capital: 'Sevilla' },
  { id: 'es-d-ceuta',          countryId: 'es', regionId: 'es-r-sur',      name: 'Ceuta',                capital: 'Ceuta' },
  { id: 'es-d-melilla',        countryId: 'es', regionId: 'es-r-sur',      name: 'Melilla',              capital: 'Melilla' },
  { id: 'es-d-canarias',       countryId: 'es', regionId: 'es-r-canarias', name: 'Canarias',             capital: 'Santa Cruz / Las Palmas' },

  // ── PORTUGAL (18 distritos + 2 regiones autónomas) ──
  { id: 'pt-d-viana-castelo', countryId: 'pt', regionId: 'pt-r-norte',   name: 'Viana do Castelo', capital: 'Viana do Castelo' },
  { id: 'pt-d-braga',         countryId: 'pt', regionId: 'pt-r-norte',   name: 'Braga',            capital: 'Braga' },
  { id: 'pt-d-porto',         countryId: 'pt', regionId: 'pt-r-norte',   name: 'Porto',            capital: 'Porto' },
  { id: 'pt-d-vila-real',     countryId: 'pt', regionId: 'pt-r-norte',   name: 'Vila Real',        capital: 'Vila Real' },
  { id: 'pt-d-braganca',      countryId: 'pt', regionId: 'pt-r-norte',   name: 'Bragança',         capital: 'Bragança' },
  { id: 'pt-d-aveiro',        countryId: 'pt', regionId: 'pt-r-centro',  name: 'Aveiro',           capital: 'Aveiro' },
  { id: 'pt-d-viseu',         countryId: 'pt', regionId: 'pt-r-centro',  name: 'Viseu',            capital: 'Viseu' },
  { id: 'pt-d-guarda',        countryId: 'pt', regionId: 'pt-r-centro',  name: 'Guarda',           capital: 'Guarda' },
  { id: 'pt-d-coimbra',       countryId: 'pt', regionId: 'pt-r-centro',  name: 'Coimbra',          capital: 'Coimbra' },
  { id: 'pt-d-castelo-branco',countryId: 'pt', regionId: 'pt-r-centro',  name: 'Castelo Branco',   capital: 'Castelo Branco' },
  { id: 'pt-d-leiria',        countryId: 'pt', regionId: 'pt-r-centro',  name: 'Leiria',           capital: 'Leiria' },
  { id: 'pt-d-lisboa',        countryId: 'pt', regionId: 'pt-r-lisboa',  name: 'Lisboa',           capital: 'Lisboa' },
  { id: 'pt-d-santarem',      countryId: 'pt', regionId: 'pt-r-lisboa',  name: 'Santarém',         capital: 'Santarém' },
  { id: 'pt-d-setubal',       countryId: 'pt', regionId: 'pt-r-lisboa',  name: 'Setúbal',          capital: 'Setúbal' },
  { id: 'pt-d-portalegre',    countryId: 'pt', regionId: 'pt-r-alentejo',name: 'Portalegre',       capital: 'Portalegre' },
  { id: 'pt-d-evora',         countryId: 'pt', regionId: 'pt-r-alentejo',name: 'Évora',            capital: 'Évora' },
  { id: 'pt-d-beja',          countryId: 'pt', regionId: 'pt-r-alentejo',name: 'Beja',             capital: 'Beja' },
  { id: 'pt-d-faro',          countryId: 'pt', regionId: 'pt-r-algarve', name: 'Faro',             capital: 'Faro' },
  { id: 'pt-d-acores',        countryId: 'pt', regionId: 'pt-r-acores',  name: 'Açores',           capital: 'Ponta Delgada' },
  { id: 'pt-d-madeira',       countryId: 'pt', regionId: 'pt-r-madeira', name: 'Madeira',          capital: 'Funchal' },
];

// ─── MUNICIPIOS (sample de capitales + ciudades principales) ──────────────
// NOTA: Esto es una muestra para diseño UI. Los catálogos completos vendrán
// de fuentes oficiales (INE, DANE, etc.) y se importarán a Supabase.
export const geoMunicipios: GeoMunicipio[] = [
  // GUATEMALA - Solo capitales por ahora
  { id: 'gt-m-ciudad-guatemala', departmentId: 'gt-d-guatemala', name: 'Ciudad de Guatemala', isCapital: true },
  { id: 'gt-m-coban', departmentId: 'gt-d-alta-verapaz', name: 'Cobán', isCapital: true },
  { id: 'gt-m-salama', departmentId: 'gt-d-baja-verapaz', name: 'Salamá', isCapital: true },
  { id: 'gt-m-antigua', departmentId: 'gt-d-sacatepequez', name: 'Antigua Guatemala', isCapital: true },
  { id: 'gt-m-quetzaltenango', departmentId: 'gt-d-quetzaltenango', name: 'Quetzaltenango', isCapital: true },

  // COLOMBIA - Principales ciudades
  { id: 'co-m-bogota', departmentId: 'co-d-bogota', name: 'Bogotá', isCapital: true },
  { id: 'co-m-medellin', departmentId: 'co-d-antioquia', name: 'Medellín', isCapital: true },
  { id: 'co-m-cali', departmentId: 'co-d-valle-del-cauca', name: 'Cali', isCapital: true },
  { id: 'co-m-barranquilla', departmentId: 'co-d-atlantico', name: 'Barranquilla', isCapital: true },
  { id: 'co-m-cartagena', departmentId: 'co-d-bolivar', name: 'Cartagena', isCapital: true },
  { id: 'co-m-bucaramanga', departmentId: 'co-d-santander', name: 'Bucaramanga', isCapital: true },
  { id: 'co-m-pereira', departmentId: 'co-d-risaralda', name: 'Pereira', isCapital: true },
  { id: 'co-m-manizales', departmentId: 'co-d-caldas', name: 'Manizales', isCapital: true },
  { id: 'co-m-armenia', departmentId: 'co-d-quindio', name: 'Armenia', isCapital: true },

  // Agregar más municipios según sea necesario...
];

// ─── FUNCIONES HELPER ─────────────────────────────────────────────────────
export function getRegionsByCountry(countryId: string): GeoRegion[] {
  return geoRegions.filter(r => r.countryId === countryId);
}

export function getDepartmentsByRegion(regionId: string): GeoDepartment[] {
  return geoDepartments.filter(d => d.regionId === regionId);
}

export function getDepartmentsByCountry(countryId: string): GeoDepartment[] {
  return geoDepartments.filter(d => d.countryId === countryId);
}

export function getMunicipiosByDepartment(departmentId: string): GeoMunicipio[] {
  return geoMunicipios.filter(m => m.departmentId === departmentId);
}

export function getCountryById(id: string): GeoCountry | undefined {
  return geoCountries.find(c => c.id === id);
}

export function getRegionById(id: string): GeoRegion | undefined {
  return geoRegions.find(r => r.id === id);
}

export function getDepartmentById(id: string): GeoDepartment | undefined {
  return geoDepartments.find(d => d.id === id);
}

export function getMunicipioById(id: string): GeoMunicipio | undefined {
  return geoMunicipios.find(m => m.id === id);
}
