You are a senior full-stack product engineer, systems architect, and pragmatic internal-tools designer.

I need you to help me design and build a production-ready internal web app for Grupo UMA.

Important: this is NOT a generic customer quotation app and it is NOT just a standard Salesforce Quote workflow.

This system is an internal PROMOTION MANAGEMENT, PRICING, VERSIONING, AND EXPORT platform used by the commercial/sales team to create promotions for motorcycle SKUs and export them into destination-specific files for Salesforce first, and SAP next.

## Business context

Today the team works in Excel and then manually creates promotions in Salesforce one by one.

The current Salesforce promotion flow is a “Promociones por Valor” style process where users define promotion records with fields such as:
- promotion name
- numeric discount
- start date
- end date
- currency
- country
- department
- municipality
- region
- brand
- model
- model year
- financier
- observations

One campaign can turn into many promotion rows because promotions are often created per SKU/model/year/geography combination.

The business wants a web app that:
- replaces the Excel workflow
- reduces typing errors
- reduces broken formulas and version confusion
- allows duplication of previous campaigns
- saves proper versions/history
- generates CSV/XLSX files quickly
- supports upload to Salesforce and SAP via files initially
- can later integrate via APIs

## Initial product scope

Initial use case:
- promotions for Bajaj motorcycles

But the architecture must support:
- multiple brands
- multiple models
- colors
- variants
- SKUs
- model years
- future product families beyond the initial setup

The app is internal only.

## Non-negotiable architecture principles

1. Do not hardcode Bajaj, Salesforce, SAP, categories, subcategories, or labels into the system.
2. Build a canonical internal data model first.
3. Build a UI label layer so admins can rename what fields/categories/subcategories are called in the app.
4. Build an export mapping layer so the same internal data can export to different file templates with different column names.
5. Keep business rules configurable.
6. Build exports first, APIs later.
7. Design for duplication, auditability, and versioning from day one.

## Core concept

The system should let a user define a promotion once, then expand it into promotion lines based on:
- selected products/SKUs
- selected model years
- selected geography
- selected discount logic
- selected effective dates

Then preview, validate, save, version, duplicate, and export.

## Required modules

### 1. Authentication and roles
Support:
- secure login
- session handling
- role-based permissions

Roles:
- Admin
- Commercial/Sales User
- Manager/Approver
- Viewer

### 2. Master data management
Admin-managed master data must include:
- Brand
- Category
- Subcategory
- Model
- Variant
- Color
- SKU
- Model year
- Geography hierarchy:
  - Country
  - Region
  - Department
  - Municipality

These must be extendable and editable from the admin side.

### 3. Canonical taxonomy + label system
The app must separate:
- internal field keys
- UI labels
- export labels

Example:
- internal key: `model`
- UI label: “Modelo”
- Salesforce export column: `Modelo__c`
- SAP export column: custom future field

Subcategories and category labels must be renamable without changing the underlying schema.

### 4. External mapping engine
The app must support mapping internal entities to external system values.

Examples:
- internal model -> Salesforce model ID
- internal country -> Salesforce country lookup ID
- internal department -> Salesforce department lookup ID
- internal SKU -> SAP material code
- internal field -> destination export column name

This must be admin-managed, not hardcoded in code.

### 5. Promotion campaign builder
Users must be able to create:
- campaign header
- start date
- end date
- currency
- notes
- observations
- terms/conditions if needed
- active/inactive or draft/final state

### 6. Promotion scope builder
Users must be able to define scope by:
- brand
- category
- subcategory
- model
- variant
- color
- SKU
- model year
- geography

The tool must support:
- national promotions
- region-based promotions
- department-based promotions
- municipality-based promotions later if needed

### 7. Promotion logic engine
Support:
- fixed discount amount per line
- percentage discount later
- bulk expansion logic
- same promotion applied to many combinations
- future support for more advanced business rules

The logic must generate promotion lines from the selected scope.

### 8. Pricing and business analysis layer
Design the system so it can support the current Excel-style commercial analysis, including:
- base PVP
- channel prices
- projected volume
- units without promo
- units with promo
- incremental volume
- contribution without promo
- facturation/revenue with promo
- margin incremental
- promo cost UMA
- promo cost dealer/red
- return/ROI
- support from brand (for example Bajaj support)
- support from UMA

This can be phased if needed, but the schema and module boundaries must support it cleanly.

### 9. Versioning and duplication
Users must be able to:
- save draft promotions
- duplicate a previous campaign
- create a new version from an existing campaign
- compare versions
- keep change history

### 10. Validation layer
Before export, validate:
- required fields
- valid dates
- valid geography
- valid product mappings
- missing external IDs
- duplicate promotion lines
- empty discounts
- invalid destination-specific values

### 11. Export engine
This is a critical part of the system.

Build a flexible export engine with:
- export profiles
- field-to-column mappings
- transforms/formatters
- constants/default values
- destination-specific validation

Initial export destinations:
- Salesforce CSV/XLSX
- SAP CSV/XLSX

The export engine must support different column names for different destinations without changing the internal data model.

### 12. Import engine
Admin should be able to import:
- models
- SKUs
- mappings
- reference data
- optionally existing campaign data from Excel

### 13. Audit log
Track:
- who created a campaign
- who changed it
- who exported it
- which export profile was used
- what version was exported
- when it was duplicated

## Data model expectations

Design and propose a clean relational schema for:
- users
- roles
- brands
- categories
- subcategories
- models
- variants
- colors
- skus
- model_years
- countries
- regions
- departments
- municipalities
- promotion_campaigns
- promotion_rules
- promotion_lines
- export_profiles
- export_field_mappings
- external_value_mappings
- imports
- exports
- version_snapshots
- audit_events

Also propose where JSON configuration is appropriate versus normalized tables.

## Technical expectations

Default preference unless you strongly recommend otherwise:
- Frontend: Next.js + TypeScript
- Backend: Next.js server actions / API routes or a clean service layer
- Database: PostgreSQL
- ORM: Prisma
- Auth: Supabase Auth or equivalent
- Storage: Supabase Storage or S3-compatible
- Excel/CSV: robust import/export support
- UI: clean internal admin tool, not flashy marketing UI

But first recommend the best stack and explain why.

## UX expectations

The app should feel like a serious internal commercial tool:
- clean
- fast
- table-heavy where needed
- good bulk editing
- strong preview before export
- clear version history
- obvious validation errors
- easy duplication of old campaigns

## Important implementation rules

- Do not start by hardcoding data.
- Do not start with random UI pages.
- First define the architecture, schema, workflows, and export design.
- Do not confuse this with the standard Salesforce Quote object.
- Treat this as a promotion authoring and export system.
- Keep the code modular and production-oriented.
- Make destination exports configurable.
- Make labels configurable.
- Make master data admin-editable.
- Make external mappings admin-editable.

## Output format

Respond in this order:
1. Restate the product clearly
2. Identify assumptions
3. Propose architecture
4. Propose data model
5. Propose key workflows
6. Propose export engine design
7. Propose label/mapping architecture
8. Propose implementation phases
9. Then start coding phase 1

## Initial assumptions to use unless I override them

- Internal app for Grupo UMA commercial/sales team
- Initial brand focus: Bajaj
- Product scope must later support more brands
- Promotions are usually strategic pricing by SKU/model/year/geography
- Exports first, APIs later
- Need duplication and version history
- Need admin-controlled mappings for Salesforce and SAP
- Need CSV/XLSX output
- Need configurable taxonomy and labels
- Need strong validation before export

Start by giving me:
1. the recommended architecture
2. the full relational schema
3. the export engine design
4. the label/mapping system design
5. the phase-by-phase build plan