import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { GeoRegion, GeoDepartment, RegionExternalMapping } from '../data/geographyData';
import { ExternalSystem } from '../data/mockData';
import { Plus, Trash2 } from 'lucide-react';

interface EditRegionWithMappingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  region: GeoRegion | null;
  departments: GeoDepartment[];
  externalSystems: ExternalSystem[];
  onSave: (regionId: string, updates: Partial<GeoRegion>, departmentIds: string[]) => void;
  onDelete?: (regionId: string) => void;
}

export function EditRegionWithMappingsDialog({
  open,
  onOpenChange,
  region,
  departments,
  externalSystems,
  onSave,
  onDelete,
}: EditRegionWithMappingsDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set());
  const [mappings, setMappings] = useState<RegionExternalMapping[]>([]);

  useEffect(() => {
    if (region) {
      setName(region.name);
      setDescription(region.description || '');

      const regionDepts = departments
        .filter(d => d.regionId === region.id)
        .map(d => d.id);
      setSelectedDepartments(new Set(regionDepts));

      setMappings(region.externalMappings || []);
    }
  }, [region, departments]);

  if (!region) return null;

  const countryDepartments = departments.filter(d => d.countryId === region.countryId);

  // Categorize departments
  const myDepartments = countryDepartments.filter(d => d.regionId === region.id);
  const availableDepartments = countryDepartments.filter(d => !d.regionId || d.regionId === '');
  const otherRegionDepartments = countryDepartments.filter(
    d => d.regionId && d.regionId !== '' && d.regionId !== region.id
  );

  const handleToggleDepartment = (deptId: string) => {
    const newSet = new Set(selectedDepartments);
    if (newSet.has(deptId)) {
      newSet.delete(deptId);
    } else {
      newSet.add(deptId);
    }
    setSelectedDepartments(newSet);
  };

  const handleAddMapping = () => {
    setMappings([...mappings, { systemId: '', externalName: '', externalId: '' }]);
  };

  const handleUpdateMapping = (index: number, field: keyof RegionExternalMapping, value: string) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setMappings(newMappings);
  };

  const handleDeleteMapping = (index: number) => {
    setMappings(mappings.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const updates: Partial<GeoRegion> = {
      name,
      description: description || undefined,
      externalMappings: mappings.filter(m => m.systemId && m.externalName),
    };

    onSave(region.id, updates, Array.from(selectedDepartments));
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!onDelete) return;

    if (confirm(`¿Estás seguro de eliminar la región "${region.name}"? Los departamentos asignados quedarán sin región.`)) {
      onDelete(region.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Modificar Región: {region.name}</DialogTitle>
          <DialogDescription>
            Modifica los datos de la región y asigna departamentos
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="mappings">Equivalencias</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="flex-1 overflow-y-auto space-y-6 py-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="edit-region-name">Nombre de la Región *</Label>
              <Input
                id="edit-region-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre de la región"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-region-description">Descripción</Label>
              <Textarea
                id="edit-region-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción opcional..."
                rows={2}
              />
            </div>

            {/* Departamentos */}
            <div className="space-y-3">
              <Label>Departamentos Asignados</Label>

              {/* Asignados a esta región */}
              {myDepartments.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-purple-600 font-medium mb-2">
                    ASIGNADOS A ESTA REGIÓN
                  </p>
                  <div className="space-y-1 max-h-40 overflow-y-auto border border-purple-100 rounded-lg p-3 bg-purple-50/50">
                    {myDepartments.map((dept) => (
                      <label
                        key={dept.id}
                        className="flex items-center gap-3 p-2 rounded hover:bg-purple-100 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDepartments.has(dept.id)}
                          onChange={() => handleToggleDepartment(dept.id)}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500/20"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                          {dept.capital && (
                            <p className="text-xs text-gray-500">Capital: {dept.capital}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Disponibles */}
              {availableDepartments.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium mb-2">DISPONIBLES</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-100 rounded-lg p-3">
                    {availableDepartments.map((dept) => (
                      <label
                        key={dept.id}
                        className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDepartments.has(dept.id)}
                          onChange={() => handleToggleDepartment(dept.id)}
                          className="w-4 h-4 text-[#007AFF] rounded focus:ring-2 focus:ring-[#007AFF]/20"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                          {dept.capital && (
                            <p className="text-xs text-gray-500">Capital: {dept.capital}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Asignados a otras regiones */}
              {otherRegionDepartments.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium mb-2">
                    ASIGNADOS A OTRAS REGIONES
                  </p>
                  <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                    {otherRegionDepartments.map((dept) => (
                      <div
                        key={dept.id}
                        className="flex items-center gap-3 p-2 rounded opacity-60"
                      >
                        <input
                          type="checkbox"
                          disabled
                          className="w-4 h-4 rounded cursor-not-allowed"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">{dept.name}</p>
                          <p className="text-xs text-gray-400">Ya asignado a otra región</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="mappings" className="flex-1 overflow-y-auto space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Equivalencias en Sistemas Externos</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddMapping}
                  className="h-8"
                >
                  <Plus size={14} className="mr-1" />
                  Agregar
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Configura cómo se llama esta región en otros sistemas (Salesforce, SAP, etc.)
              </p>
            </div>

            {mappings.length === 0 && (
              <div className="border border-dashed border-gray-200 rounded-lg p-8 text-center">
                <p className="text-sm text-gray-500">
                  No hay equivalencias configuradas
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddMapping}
                  className="mt-3"
                >
                  <Plus size={14} className="mr-1" />
                  Agregar primera equivalencia
                </Button>
              </div>
            )}

            <div className="space-y-3">
              {mappings.map((mapping, index) => {
                const system = externalSystems.find(s => s.id === mapping.systemId);
                return (
                  <div
                    key={index}
                    className="flex gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50/50"
                  >
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Sistema</Label>
                          <select
                            value={mapping.systemId}
                            onChange={(e) => handleUpdateMapping(index, 'systemId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                          >
                            <option value="">Seleccionar...</option>
                            {externalSystems.map((sys) => (
                              <option key={sys.id} value={sys.id}>
                                {sys.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Nombre en {system?.name || 'Sistema'}</Label>
                          <Input
                            value={mapping.externalName}
                            onChange={(e) => handleUpdateMapping(index, 'externalName', e.target.value)}
                            placeholder="Nombre externo"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">ID Externo (opcional)</Label>
                          <Input
                            value={mapping.externalId}
                            onChange={(e) => handleUpdateMapping(index, 'externalId', e.target.value)}
                            placeholder="ID externo"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMapping(index)}
                      className="h-8 w-8 p-0 self-start mt-5"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!onDelete}
          >
            <Trash2 size={14} className="mr-2" />
            Eliminar Región
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim()}
              className="bg-[#007AFF] hover:bg-[#0071E3]"
            >
              Guardar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
