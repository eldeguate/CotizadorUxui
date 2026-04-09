import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { GeoRegion, GeoDepartment } from '../data/geographyData';
import { ScrollArea } from './ui/scroll-area';

interface EditRegionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  region: GeoRegion | null;
  departments: GeoDepartment[];
  onSave: (regionId: string, updates: Partial<GeoRegion>, departmentIds: string[]) => void;
}

export function EditRegionDialog({
  open,
  onOpenChange,
  region,
  departments,
  onSave,
}: EditRegionDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (region) {
      setName(region.name);
      setDescription(region.description || '');
      // Seleccionar departamentos actuales de esta región
      const currentDepts = departments
        .filter(d => d.regionId === region.id)
        .map(d => d.id);
      setSelectedDepartments(new Set(currentDepts));
    }
  }, [region, departments]);

  const handleSave = () => {
    if (!region) return;

    onSave(
      region.id,
      { name, description },
      Array.from(selectedDepartments)
    );

    onOpenChange(false);
  };

  const toggleDepartment = (deptId: string) => {
    setSelectedDepartments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deptId)) {
        newSet.delete(deptId);
      } else {
        newSet.add(deptId);
      }
      return newSet;
    });
  };

  if (!region) return null;

  // Filtrar departamentos del mismo país
  const countryDepartments = departments.filter(d => d.countryId === region.countryId);

  // Clasificar departamentos
  const myDepartments = countryDepartments.filter(d => d.regionId === region.id);
  const availableDepartments = countryDepartments.filter(d => !d.regionId || d.regionId === '');
  const otherRegionDepartments = countryDepartments.filter(
    d => d.regionId && d.regionId !== '' && d.regionId !== region.id
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Región UMA</DialogTitle>
          <DialogDescription>
            Modifica el nombre, descripción y asigna departamentos a esta región
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Región</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Región Andina"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción de la región..."
            />
          </div>

          {/* Selector de Departamentos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Departamentos</Label>
              <Badge variant="secondary">
                {selectedDepartments.size} seleccionado{selectedDepartments.size !== 1 ? 's' : ''}
              </Badge>
            </div>

            <ScrollArea className="h-[300px] border rounded-lg p-4">
              <div className="space-y-4">
                {/* Asignados a esta región */}
                {myDepartments.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      Asignados a esta región
                    </p>
                    <div className="space-y-2">
                      {myDepartments.map((dept) => (
                        <div
                          key={dept.id}
                          className="flex items-center space-x-3 p-2 rounded bg-purple-50 border border-purple-100"
                        >
                          <Checkbox
                            id={dept.id}
                            checked={selectedDepartments.has(dept.id)}
                            onCheckedChange={() => toggleDepartment(dept.id)}
                          />
                          <label
                            htmlFor={dept.id}
                            className="flex-1 cursor-pointer text-sm"
                          >
                            <div>
                              <p style={{ fontWeight: 500, color: '#1C1C1E' }}>{dept.name}</p>
                              {dept.capital && (
                                <p style={{ fontSize: '0.75rem', color: '#8E8E93' }}>
                                  Capital: {dept.capital}
                                </p>
                              )}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disponibles */}
                {availableDepartments.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      Disponibles
                    </p>
                    <div className="space-y-2">
                      {availableDepartments.map((dept) => (
                        <div
                          key={dept.id}
                          className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 transition-colors"
                        >
                          <Checkbox
                            id={dept.id}
                            checked={selectedDepartments.has(dept.id)}
                            onCheckedChange={() => toggleDepartment(dept.id)}
                          />
                          <label
                            htmlFor={dept.id}
                            className="flex-1 cursor-pointer text-sm"
                          >
                            <div>
                              <p style={{ fontWeight: 500, color: '#1C1C1E' }}>{dept.name}</p>
                              {dept.capital && (
                                <p style={{ fontSize: '0.75rem', color: '#8E8E93' }}>
                                  Capital: {dept.capital}
                                </p>
                              )}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* En otras regiones (no seleccionables) */}
                {otherRegionDepartments.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      Asignados a otras regiones
                    </p>
                    <div className="space-y-2">
                      {otherRegionDepartments.map((dept) => {
                        const assignedRegion = departments.find(d => d.regionId === dept.regionId)?.regionId;
                        const regionName = assignedRegion ?
                          (typeof assignedRegion === 'string' ? assignedRegion.split('-').pop() : assignedRegion) :
                          'Otra región';

                        return (
                          <div
                            key={dept.id}
                            className="flex items-center space-x-3 p-2 rounded bg-gray-100 opacity-60"
                          >
                            <Checkbox
                              id={dept.id}
                              checked={false}
                              disabled={true}
                            />
                            <div className="flex-1 text-sm">
                              <div>
                                <p style={{ fontWeight: 500, color: '#8E8E93' }}>{dept.name}</p>
                                <p style={{ fontSize: '0.75rem', color: '#FF9500' }}>
                                  Ya asignado a otra región
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Si no hay departamentos disponibles */}
                {myDepartments.length === 0 && availableDepartments.length === 0 && otherRegionDepartments.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#8E8E93', padding: '2rem' }}>
                    No hay departamentos disponibles para este país
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
