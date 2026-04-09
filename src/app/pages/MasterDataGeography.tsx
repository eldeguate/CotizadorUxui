import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Plus, Edit2, ChevronRight, ChevronDown, MapPin, Trash2 } from 'lucide-react';
import { EditRegionWithMappingsDialog } from '../components/EditRegionWithMappingsDialog';
import { AddRegionDialog } from '../components/AddRegionDialog';
import { DeleteRegionDialog } from '../components/DeleteRegionDialog';
import { GeoRegion } from '../data/geographyData';
import { externalSystems } from '../data/mockData';

export function MasterDataGeography() {
  const {
    geoCountries,
    geoRegions,
    geoDepartments,
    geoMunicipios,
    addGeoRegion,
    updateGeoRegion,
    deleteGeoRegion,
    updateGeoDepartment,
  } = useAppContext();

  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set(['gt', 'co']));
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());

  const [editingRegion, setEditingRegion] = useState<GeoRegion | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [addingRegionCountryId, setAddingRegionCountryId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [deletingRegion, setDeletingRegion] = useState<{ region: GeoRegion; deptCount: number } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const toggleCountry = (id: string) => {
    const newSet = new Set(expandedCountries);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedCountries(newSet);
  };

  const toggleRegion = (id: string) => {
    const newSet = new Set(expandedRegions);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedRegions(newSet);
  };

  const toggleDepartment = (id: string) => {
    const newSet = new Set(expandedDepartments);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedDepartments(newSet);
  };

  const handleEditRegion = (region: GeoRegion) => {
    setEditingRegion(region);
    setEditDialogOpen(true);
  };

  const handleAddRegion = (countryId: string) => {
    setAddingRegionCountryId(countryId);
    setAddDialogOpen(true);
  };

  const handleDeleteRegion = (region: GeoRegion) => {
    const deptCount = geoDepartments.filter(d => d.regionId === region.id).length;
    setDeletingRegion({ region, deptCount });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingRegion) {
      deleteGeoRegion(deletingRegion.region.id);
      setDeletingRegion(null);
    }
  };

  const handleSaveRegion = (regionId: string, updates: Partial<GeoRegion>, departmentIds: string[]) => {
    // Actualizar la región
    updateGeoRegion(regionId, updates);

    // Actualizar los departamentos para que apunten a esta región
    geoDepartments.forEach(dept => {
      if (departmentIds.includes(dept.id)) {
        // Si el departamento está seleccionado, asignarlo a esta región
        if (dept.regionId !== regionId) {
          updateGeoDepartment(dept.id, { regionId });
        }
      } else {
        // Si el departamento no está seleccionado pero estaba en esta región, removerlo
        if (dept.regionId === regionId) {
          updateGeoDepartment(dept.id, { regionId: '' });
        }
      }
    });
  };

  const handleCreateRegion = (newRegion: Omit<GeoRegion, 'id'>, departmentIds: string[]) => {
    addGeoRegion(newRegion, departmentIds);
  };

  const onDeleteRegionFromEditDialog = (regionId: string) => {
    // Elimina la región desde el diálogo de edición
    deleteGeoRegion(regionId);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C1C1E', lineHeight: 1.2 }}>
          Geografías y Canales
        </h1>
        <p style={{ color: '#8E8E93', marginTop: '4px', fontSize: '0.9375rem' }}>
          Gestiona la jerarquía geográfica y estructura de canales de distribución
        </p>
      </div>

      <Tabs defaultValue="geography" className="space-y-6">
        <TabsList>
          <TabsTrigger value="geography">Geografías</TabsTrigger>
          <TabsTrigger value="channels">Canales</TabsTrigger>
        </TabsList>

        <TabsContent value="geography" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Jerarquía Geográfica</CardTitle>
                  <CardDescription>
                    País → Región UMA → Departamento → Municipio
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {geoCountries.length} países · {geoRegions.length} regiones · {geoDepartments.length} departamentos
                </Badge>
              </div>
            </CardHeader>
<CardContent>
              <div className="space-y-4">
                {geoCountries.map((country) => {
                  const countryRegions = geoRegions.filter(r => r.countryId === country.id);
                  const unassignedDepartments = geoDepartments.filter(
                    d => d.countryId === country.id && (!d.regionId || d.regionId === '')
                  );
                  const isCountryExpanded = expandedCountries.has(country.id);

                  return (
                    <div key={country.id} className="space-y-2">
                      {/* PAÍS */}
                      <div className="flex items-center gap-3 p-4 bg-[#007AFF]/5 rounded-xl border border-[#007AFF]/10">
                        <button
                          onClick={() => toggleCountry(country.id)}
                          className="p-1 hover:bg-white/50 rounded transition-colors"
                        >
                          {isCountryExpanded ? (
                            <ChevronDown size={18} className="text-[#007AFF]" />
                          ) : (
                            <ChevronRight size={18} className="text-[#007AFF]" />
                          )}
                        </button>
                        <span style={{ fontSize: '1.5rem' }}>{country.flag}</span>
                        <div className="flex-1">
                          <p style={{ fontWeight: 600, color: '#1C1C1E', fontSize: '0.9375rem' }}>
                            {country.name}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#8E8E93' }}>
                            {country.code} · {country.currency}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {countryRegions.length} regiones
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddRegion(country.id);
                          }}
                          className="h-8"
                        >
                          <Plus size={14} className="mr-1" />
                          Agregar Región
                        </Button>
                      </div>

                      {/* REGIONES */}
                      {isCountryExpanded && countryRegions.map((region) => {
                        const regionDepartments = geoDepartments.filter(d => d.regionId === region.id);
                        const isRegionExpanded = expandedRegions.has(region.id);

                        return (
                          <div key={region.id} className="ml-12 space-y-2">
                            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                              <button
                                onClick={() => toggleRegion(region.id)}
                                className="p-1 hover:bg-purple-200 rounded"
                              >
                                {isRegionExpanded ? (
                                  <ChevronDown size={16} className="text-purple-600" />
                                ) : (
                                  <ChevronRight size={16} className="text-purple-600" />
                                )}
                              </button>
                              <div className="w-2 h-2 rounded-full bg-purple-500" />
                              <div className="flex-1">
                                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1C1C1E' }}>
                                  {region.name}
                                </p>
                                {region.description && (
                                  <p style={{ fontSize: '0.75rem', color: '#8E8E93' }}>
                                    {region.description}
                                  </p>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {regionDepartments.length} depts
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditRegion(region)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit2 size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteRegion(region);
                                }}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>

                            {/* DEPARTAMENTOS */}
                            {isRegionExpanded && regionDepartments.map((dept) => {
                              const deptMunicipios = geoMunicipios.filter(m => m.departmentId === dept.id);
                              const isDeptExpanded = expandedDepartments.has(dept.id);

                              return (
                                <div key={dept.id} className="ml-12 space-y-2">
                                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                    <button
                                      onClick={() => toggleDepartment(dept.id)}
                                      className="p-1 hover:bg-green-200 rounded"
                                    >
                                      {isDeptExpanded ? (
                                        <ChevronDown size={14} className="text-green-600" />
                                      ) : (
                                        <ChevronRight size={14} className="text-green-600" />
                                      )}
                                    </button>
                                    <MapPin size={14} className="text-green-600" />
                                    <div className="flex-1">
                                      <p style={{ fontWeight: 500, fontSize: '0.8125rem', color: '#1C1C1E' }}>
                                        {dept.name}
                                      </p>
                                      {dept.capital && (
                                        <p style={{ fontSize: '0.6875rem', color: '#8E8E93' }}>
                                          Capital: {dept.capital}
                                        </p>
                                      )}
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {deptMunicipios.length} municipios
                                    </Badge>
                                  </div>

                                  {/* MUNICIPIOS */}
                                  {isDeptExpanded && deptMunicipios.map((mun) => (
                                    <div
                                      key={mun.id}
                                      className="ml-12 flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                      <p style={{ fontSize: '0.8125rem', color: '#1C1C1E' }}>
                                        {mun.name}
                                      </p>
                                      {mun.isCapital && (
                                        <Badge variant="secondary" className="text-xs">
                                          Capital
                                        </Badge>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}

                      {/* DEPARTAMENTOS POR ASIGNAR */}
                      {isCountryExpanded && unassignedDepartments.length > 0 && (
                        <div className="ml-12 space-y-2">
                          <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg border border-gray-200">
                            <div className="w-2 h-2 rounded-full bg-gray-400" />
                            <div className="flex-1">
                              <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#6B7280' }}>
                                Departamentos por asignar
                              </p>
                              <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                Sin región asignada
                              </p>
                            </div>
                            <Badge variant="secondary" className="text-xs bg-gray-200">
                              {unassignedDepartments.length} sin asignar
                            </Badge>
                          </div>

                          {/* Lista de departamentos sin asignar */}
                          <div className="ml-8 space-y-1">
                            {unassignedDepartments.map((dept) => {
                              const deptMunicipios = geoMunicipios.filter(m => m.departmentId === dept.id);
                              const isDeptExpanded = expandedDepartments.has(dept.id);

                              return (
                                <div key={dept.id} className="space-y-2">
                                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                                    <button
                                      onClick={() => toggleDepartment(dept.id)}
                                      className="p-1 hover:bg-gray-200 rounded"
                                    >
                                      {isDeptExpanded ? (
                                        <ChevronDown size={14} className="text-gray-500" />
                                      ) : (
                                        <ChevronRight size={14} className="text-gray-500" />
                                      )}
                                    </button>
                                    <MapPin size={14} className="text-gray-400" />
                                    <div className="flex-1">
                                      <p style={{ fontWeight: 500, fontSize: '0.8125rem', color: '#6B7280' }}>
                                        {dept.name}
                                      </p>
                                      {dept.capital && (
                                        <p style={{ fontSize: '0.6875rem', color: '#9CA3AF' }}>
                                          Capital: {dept.capital}
                                        </p>
                                      )}
                                    </div>
                                    <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">
                                      {deptMunicipios.length} municipios
                                    </Badge>
                                  </div>

                                  {/* MUNICIPIOS del departamento sin asignar */}
                                  {isDeptExpanded && deptMunicipios.map((mun) => (
                                    <div
                                      key={mun.id}
                                      className="ml-12 flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                      <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                                        {mun.name}
                                      </p>
                                      {mun.isCapital && (
                                        <Badge variant="secondary" className="text-xs">
                                          Capital
                                        </Badge>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels">
          <Card>
            <CardHeader>
              <CardTitle>Canales de Distribución</CardTitle>
              <CardDescription>
                Estructura de canales, tiendas propias y distribuidores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ color: '#8E8E93', textAlign: 'center', padding: '2rem' }}>
                Vista de canales próximamente...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Edición */}
      <EditRegionWithMappingsDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        region={editingRegion}
        departments={geoDepartments}
        externalSystems={externalSystems}
        onSave={handleSaveRegion}
        onDelete={onDeleteRegionFromEditDialog}
      />

      {/* Dialog de Agregar Región */}
      {addingRegionCountryId && (
        <AddRegionDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          countryId={addingRegionCountryId}
          countryName={geoCountries.find(c => c.id === addingRegionCountryId)?.name || ''}
          allDepartments={geoDepartments}
          onSave={handleCreateRegion}
        />
      )}

      {/* Dialog de Confirmación de Eliminación */}
      {deletingRegion && (
        <DeleteRegionDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          regionName={deletingRegion.region.name}
          departmentCount={deletingRegion.deptCount}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
