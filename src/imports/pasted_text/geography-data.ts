Got it — you want it in chat to paste into Figma Make. I'll output the data as a TypeScript snippet plus the Figma prompt. Single paste-ready block.

Note: **UMA regions are proposals** — they follow each country's standard geographic groupings. Validate with business. **Municipios** are capital + main cities per department (realistic sample for UI design, not the full catalog — full catalogs come from INE/DANE/etc into Supabase later).

---

## 1) Types (add to `mockData.ts`)

```ts
export interface Municipio {
  id: string;
  departmentId: string;
  name: string;
  isCapital?: boolean;
}
// Country → Region (UMA) → Department → Municipio
```

## 2) Geography data (`src/app/data/geographyData.ts`)

```ts
import type { Country, Region, Department, Municipio } from './mockData';

export const countries: Country[] = [
  { id: 'gt', name: 'Guatemala',   code: 'GT' },
  { id: 'sv', name: 'El Salvador', code: 'SV' },
  { id: 'hn', name: 'Honduras',    code: 'HN' },
  { id: 'cr', name: 'Costa Rica',  code: 'CR' },
  { id: 'ni', name: 'Nicaragua',   code: 'NI' },
  { id: 'co', name: 'Colombia',    code: 'CO' },
  { id: 've', name: 'Venezuela',   code: 'VE' },
  { id: 'es', name: 'España',      code: 'ES' },
  { id: 'pt', name: 'Portugal',    code: 'PT' },
];

/* ──────────────────────────────────────────────────────────────────
   UMA REGIONS (custom business grouping of departments)
   ────────────────────────────────────────────────────────────────── */
export const regions: Region[] = [
  // GUATEMALA (8)
  { id: 'gt-r-metro',     countryId: 'gt', name: 'Metropolitana' },
  { id: 'gt-r-norte',     countryId: 'gt', name: 'Norte' },
  { id: 'gt-r-nororiente',countryId: 'gt', name: 'Nororiente' },
  { id: 'gt-r-suroriente',countryId: 'gt', name: 'Suroriente' },
  { id: 'gt-r-central',   countryId: 'gt', name: 'Central' },
  { id: 'gt-r-suroccid',  countryId: 'gt', name: 'Suroccidente' },
  { id: 'gt-r-noroccid',  countryId: 'gt', name: 'Noroccidente' },
  { id: 'gt-r-peten',     countryId: 'gt', name: 'Petén' },

  // EL SALVADOR (3)
  { id: 'sv-r-occidental',countryId: 'sv', name: 'Occidental' },
  { id: 'sv-r-central',   countryId: 'sv', name: 'Central' },
  { id: 'sv-r-oriental',  countryId: 'sv', name: 'Oriental' },

  // HONDURAS (7)
  { id: 'hn-r-noroccid',  countryId: 'hn', name: 'Noroccidental' },
  { id: 'hn-r-norte',     countryId: 'hn', name: 'Norte' },
  { id: 'hn-r-nororiental',countryId:'hn', name: 'Nororiental' },
  { id: 'hn-r-central',   countryId: 'hn', name: 'Central' },
  { id: 'hn-r-sur',       countryId: 'hn', name: 'Sur' },
  { id: 'hn-r-oriental',  countryId: 'hn', name: 'Oriental' },
  { id: 'hn-r-insular',   countryId: 'hn', name: 'Insular' },

  // COSTA RICA (3)
  { id: 'cr-r-central',   countryId: 'cr', name: 'Central' },
  { id: 'cr-r-pacifico',  countryId: 'cr', name: 'Pacífico' },
  { id: 'cr-r-caribe',    countryId: 'cr', name: 'Caribe' },

  // NICARAGUA (3)
  { id: 'ni-r-pacifico',  countryId: 'ni', name: 'Pacífico' },
  { id: 'ni-r-central',   countryId: 'ni', name: 'Central' },
  { id: 'ni-r-caribe',    countryId: 'ni', name: 'Caribe' },

  // COLOMBIA (5)
  { id: 'co-r-andina',    countryId: 'co', name: 'Andina' },
  { id: 'co-r-caribe',    countryId: 'co', name: 'Caribe' },
  { id: 'co-r-pacifica',  countryId: 'co', name: 'Pacífica' },
  { id: 'co-r-orinoquia', countryId: 'co', name: 'Orinoquía' },
  { id: 'co-r-amazonia',  countryId: 'co', name: 'Amazonía' },

  // VENEZUELA (8)
  { id: 've-r-capital',   countryId: 've', name: 'Capital' },
  { id: 've-r-central',   countryId: 've', name: 'Central' },
  { id: 've-r-llanos',    countryId: 've', name: 'Los Llanos' },
  { id: 've-r-centroccid',countryId: 've', name: 'Centroccidental' },
  { id: 've-r-zuliana',   countryId: 've', name: 'Zuliana' },
  { id: 've-r-andes',     countryId: 've', name: 'Los Andes' },
  { id: 've-r-nororient', countryId: 've', name: 'Nororiental' },
  { id: 've-r-guayana',   countryId: 've', name: 'Guayana' },

  // ESPAÑA (7)
  { id: 'es-r-noroeste',  countryId: 'es', name: 'Noroeste' },
  { id: 'es-r-norte',     countryId: 'es', name: 'Norte' },
  { id: 'es-r-nordeste',  countryId: 'es', name: 'Nordeste' },
  { id: 'es-r-centro',    countryId: 'es', name: 'Centro' },
  { id: 'es-r-este',      countryId: 'es', name: 'Este' },
  { id: 'es-r-sur',       countryId: 'es', name: 'Sur' },
  { id: 'es-r-canarias',  countryId: 'es', name: 'Canarias' },

  // PORTUGAL (7 — NUTS II)
  { id: 'pt-r-norte',     countryId: 'pt', name: 'Norte' },
  { id: 'pt-r-centro',    countryId: 'pt', name: 'Centro' },
  { id: 'pt-r-lisboa',    countryId: 'pt', name: 'Área Metropolitana de Lisboa' },
  { id: 'pt-r-alentejo',  countryId: 'pt', name: 'Alentejo' },
  { id: 'pt-r-algarve',   countryId: 'pt', name: 'Algarve' },
  { id: 'pt-r-acores',    countryId: 'pt', name: 'Açores' },
  { id: 'pt-r-madeira',   countryId: 'pt', name: 'Madeira' },
];

/* ──────────────────────────────────────────────────────────────────
   DEPARTMENTS / PROVINCES / STATES
   ────────────────────────────────────────────────────────────────── */
export const departments: Department[] = [
  // GUATEMALA (22)
  { id: 'gt-d-guatemala',     regionId: 'gt-r-metro',     name: 'Guatemala' },
  { id: 'gt-d-alta-verapaz',  regionId: 'gt-r-norte',     name: 'Alta Verapaz' },
  { id: 'gt-d-baja-verapaz',  regionId: 'gt-r-norte',     name: 'Baja Verapaz' },
  { id: 'gt-d-el-progreso',   regionId: 'gt-r-nororiente',name: 'El Progreso' },
  { id: 'gt-d-izabal',        regionId: 'gt-r-nororiente',name: 'Izabal' },
  { id: 'gt-d-zacapa',        regionId: 'gt-r-nororiente',name: 'Zacapa' },
  { id: 'gt-d-chiquimula',    regionId: 'gt-r-nororiente',name: 'Chiquimula' },
  { id: 'gt-d-santa-rosa',    regionId: 'gt-r-suroriente',name: 'Santa Rosa' },
  { id: 'gt-d-jalapa',        regionId: 'gt-r-suroriente',name: 'Jalapa' },
  { id: 'gt-d-jutiapa',       regionId: 'gt-r-suroriente',name: 'Jutiapa' },
  { id: 'gt-d-sacatepequez',  regionId: 'gt-r-central',   name: 'Sacatepéquez' },
  { id: 'gt-d-chimaltenango', regionId: 'gt-r-central',   name: 'Chimaltenango' },
  { id: 'gt-d-escuintla',     regionId: 'gt-r-central',   name: 'Escuintla' },
  { id: 'gt-d-solola',        regionId: 'gt-r-suroccid',  name: 'Sololá' },
  { id: 'gt-d-totonicapan',   regionId: 'gt-r-suroccid',  name: 'Totonicapán' },
  { id: 'gt-d-quetzaltenango',regionId: 'gt-r-suroccid',  name: 'Quetzaltenango' },
  { id: 'gt-d-suchitepequez', regionId: 'gt-r-suroccid',  name: 'Suchitepéquez' },
  { id: 'gt-d-retalhuleu',    regionId: 'gt-r-suroccid',  name: 'Retalhuleu' },
  { id: 'gt-d-san-marcos',    regionId: 'gt-r-suroccid',  name: 'San Marcos' },
  { id: 'gt-d-huehuetenango', regionId: 'gt-r-noroccid',  name: 'Huehuetenango' },
  { id: 'gt-d-quiche',        regionId: 'gt-r-noroccid',  name: 'Quiché' },
  { id: 'gt-d-peten',         regionId: 'gt-r-peten',     name: 'Petén' },

  // EL SALVADOR (14)
  { id: 'sv-d-ahuachapan',   regionId: 'sv-r-occidental', name: 'Ahuachapán' },
  { id: 'sv-d-santa-ana',    regionId: 'sv-r-occidental', name: 'Santa Ana' },
  { id: 'sv-d-sonsonate',    regionId: 'sv-r-occidental', name: 'Sonsonate' },
  { id: 'sv-d-la-libertad',  regionId: 'sv-r-central',    name: 'La Libertad' },
  { id: 'sv-d-chalatenango', regionId: 'sv-r-central',    name: 'Chalatenango' },
  { id: 'sv-d-cuscatlan',    regionId: 'sv-r-central',    name: 'Cuscatlán' },
  { id: 'sv-d-san-salvador', regionId: 'sv-r-central',    name: 'San Salvador' },
  { id: 'sv-d-la-paz',       regionId: 'sv-r-central',    name: 'La Paz' },
  { id: 'sv-d-cabanas',      regionId: 'sv-r-central',    name: 'Cabañas' },
  { id: 'sv-d-san-vicente',  regionId: 'sv-r-central',    name: 'San Vicente' },
  { id: 'sv-d-usulutan',     regionId: 'sv-r-oriental',   name: 'Usulután' },
  { id: 'sv-d-san-miguel',   regionId: 'sv-r-oriental',   name: 'San Miguel' },
  { id: 'sv-d-morazan',      regionId: 'sv-r-oriental',   name: 'Morazán' },
  { id: 'sv-d-la-union',     regionId: 'sv-r-oriental',   name: 'La Unión' },

  // HONDURAS (18)
  { id: 'hn-d-cortes',        regionId: 'hn-r-noroccid',   name: 'Cortés' },
  { id: 'hn-d-santa-barbara', regionId: 'hn-r-noroccid',   name: 'Santa Bárbara' },
  { id: 'hn-d-copan',         regionId: 'hn-r-noroccid',   name: 'Copán' },
  { id: 'hn-d-ocotepeque',    regionId: 'hn-r-noroccid',   name: 'Ocotepeque' },
  { id: 'hn-d-lempira',       regionId: 'hn-r-noroccid',   name: 'Lempira' },
  { id: 'hn-d-intibuca',      regionId: 'hn-r-noroccid',   name: 'Intibucá' },
  { id: 'hn-d-atlantida',     regionId: 'hn-r-norte',      name: 'Atlántida' },
  { id: 'hn-d-yoro',          regionId: 'hn-r-norte',      name: 'Yoro' },
  { id: 'hn-d-colon',         regionId: 'hn-r-norte',      name: 'Colón' },
  { id: 'hn-d-olancho',       regionId: 'hn-r-nororiental',name: 'Olancho' },
  { id: 'hn-d-gracias-a-dios',regionId: 'hn-r-nororiental',name: 'Gracias a Dios' },
  { id: 'hn-d-fco-morazan',   regionId: 'hn-r-central',    name: 'Francisco Morazán' },
  { id: 'hn-d-comayagua',     regionId: 'hn-r-central',    name: 'Comayagua' },
  { id: 'hn-d-la-paz',        regionId: 'hn-r-central',    name: 'La Paz' },
  { id: 'hn-d-valle',         regionId: 'hn-r-sur',        name: 'Valle' },
  { id: 'hn-d-choluteca',     regionId: 'hn-r-sur',        name: 'Choluteca' },
  { id: 'hn-d-el-paraiso',    regionId: 'hn-r-oriental',   name: 'El Paraíso' },
  { id: 'hn-d-islas-bahia',   regionId: 'hn-r-insular',    name: 'Islas de la Bahía' },

  // COSTA RICA (7)
  { id: 'cr-d-san-jose',   regionId: 'cr-r-central',  name: 'San José' },
  { id: 'cr-d-alajuela',   regionId: 'cr-r-central',  name: 'Alajuela' },
  { id: 'cr-d-cartago',    regionId: 'cr-r-central',  name: 'Cartago' },
  { id: 'cr-d-heredia',    regionId: 'cr-r-central',  name: 'Heredia' },
  { id: 'cr-d-puntarenas', regionId: 'cr-r-pacifico', name: 'Puntarenas' },
  { id: 'cr-d-guanacaste', regionId: 'cr-r-pacifico', name: 'Guanacaste' },
  { id: 'cr-d-limon',      regionId: 'cr-r-caribe',   name: 'Limón' },

  // NICARAGUA (17)
  { id: 'ni-d-managua',      regionId: 'ni-r-pacifico', name: 'Managua' },
  { id: 'ni-d-leon',         regionId: 'ni-r-pacifico', name: 'León' },
  { id: 'ni-d-chinandega',   regionId: 'ni-r-pacifico', name: 'Chinandega' },
  { id: 'ni-d-masaya',       regionId: 'ni-r-pacifico', name: 'Masaya' },
  { id: 'ni-d-granada',      regionId: 'ni-r-pacifico', name: 'Granada' },
  { id: 'ni-d-carazo',       regionId: 'ni-r-pacifico', name: 'Carazo' },
  { id: 'ni-d-rivas',        regionId: 'ni-r-pacifico', name: 'Rivas' },
  { id: 'ni-d-esteli',       regionId: 'ni-r-central',  name: 'Estelí' },
  { id: 'ni-d-madriz',       regionId: 'ni-r-central',  name: 'Madriz' },
  { id: 'ni-d-nueva-segovia',regionId: 'ni-r-central',  name: 'Nueva Segovia' },
  { id: 'ni-d-boaco',        regionId: 'ni-r-central',  name: 'Boaco' },
  { id: 'ni-d-chontales',    regionId: 'ni-r-central',  name: 'Chontales' },
  { id: 'ni-d-matagalpa',    regionId: 'ni-r-central',  name: 'Matagalpa' },
  { id: 'ni-d-jinotega',     regionId: 'ni-r-central',  name: 'Jinotega' },
  { id: 'ni-d-raccn',        regionId: 'ni-r-caribe',   name: 'Región Autónoma Costa Caribe Norte' },
  { id: 'ni-d-raccs',        regionId: 'ni-r-caribe',   name: 'Región Autónoma Costa Caribe Sur' },
  { id: 'ni-d-rio-san-juan', regionId: 'ni-r-caribe',   name: 'Río San Juan' },

  // COLOMBIA (33)
  { id: 'co-d-antioquia',     regionId: 'co-r-andina',   name: 'Antioquia' },
  { id: 'co-d-boyaca',        regionId: 'co-r-andina',   name: 'Boyacá' },
  { id: 'co-d-caldas',        regionId: 'co-r-andina',   name: 'Caldas' },
  { id: 'co-d-cundinamarca',  regionId: 'co-r-andina',   name: 'Cundinamarca' },
  { id: 'co-d-bogota',        regionId: 'co-r-andina',   name: 'Bogotá D.C.' },
  { id: 'co-d-huila',         regionId: 'co-r-andina',   name: 'Huila' },
  { id: 'co-d-n-santander',   regionId: 'co-r-andina',   name: 'Norte de Santander' },
  { id: 'co-d-quindio',       regionId: 'co-r-andina',   name: 'Quindío' },
  { id: 'co-d-risaralda',     regionId: 'co-r-andina',   name: 'Risaralda' },
  { id: 'co-d-santander',     regionId: 'co-r-andina',   name: 'Santander' },
  { id: 'co-d-tolima',        regionId: 'co-r-andina',   name: 'Tolima' },
  { id: 'co-d-atlantico',     regionId: 'co-r-caribe',   name: 'Atlántico' },
  { id: 'co-d-bolivar',       regionId: 'co-r-caribe',   name: 'Bolívar' },
  { id: 'co-d-cesar',         regionId: 'co-r-caribe',   name: 'Cesar' },
  { id: 'co-d-cordoba',       regionId: 'co-r-caribe',   name: 'Córdoba' },
  { id: 'co-d-la-guajira',    regionId: 'co-r-caribe',   name: 'La Guajira' },
  { id: 'co-d-magdalena',     regionId: 'co-r-caribe',   name: 'Magdalena' },
  { id: 'co-d-sucre',         regionId: 'co-r-caribe',   name: 'Sucre' },
  { id: 'co-d-san-andres',    regionId: 'co-r-caribe',   name: 'San Andrés y Providencia' },
  { id: 'co-d-cauca',         regionId: 'co-r-pacifica', name: 'Cauca' },
  { id: 'co-d-choco',         regionId: 'co-r-pacifica', name: 'Chocó' },
  { id: 'co-d-narino',        regionId: 'co-r-pacifica', name: 'Nariño' },
  { id: 'co-d-valle-cauca',   regionId: 'co-r-pacifica', name: 'Valle del Cauca' },
  { id: 'co-d-arauca',        regionId: 'co-r-orinoquia',name: 'Arauca' },
  { id: 'co-d-casanare',      regionId: 'co-r-orinoquia',name: 'Casanare' },
  { id: 'co-d-meta',          regionId: 'co-r-orinoquia',name: 'Meta' },
  { id: 'co-d-vichada',       regionId: 'co-r-orinoquia',name: 'Vichada' },
  { id: 'co-d-amazonas',      regionId: 'co-r-amazonia', name: 'Amazonas' },
  { id: 'co-d-caqueta',       regionId: 'co-r-amazonia', name: 'Caquetá' },
  { id: 'co-d-guainia',       regionId: 'co-r-amazonia', name: 'Guainía' },
  { id: 'co-d-guaviare',      regionId: 'co-r-amazonia', name: 'Guaviare' },
  { id: 'co-d-putumayo',      regionId: 'co-r-amazonia', name: 'Putumayo' },
  { id: 'co-d-vaupes',        regionId: 'co-r-amazonia', name: 'Vaupés' },

  // VENEZUELA (25)
  { id: 've-d-distrito-capital',regionId:'ve-r-capital',  name: 'Distrito Capital' },
  { id: 've-d-miranda',         regionId:'ve-r-capital',  name: 'Miranda' },
  { id: 've-d-la-guaira',       regionId:'ve-r-capital',  name: 'La Guaira' },
  { id: 've-d-aragua',          regionId:'ve-r-central',  name: 'Aragua' },
  { id: