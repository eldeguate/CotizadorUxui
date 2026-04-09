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
import { GeoRegion, GeoDepartment } from '../data/geographyData';

interface AddRegionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countryId: string;
  countryName: string;
  onSave: (region: Omit<GeoRegion, 'id'>, departmentIds: string[]) => void;
  allDepartments: GeoDepartment[];
}

export function AddRegionDialog({
  open,
  onOpenChange,
  countryId,
  countryName,
  onSave,
  allDepartments,
}: AddRegionDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      setName('');
      setDescription('');
      setSelectedDepartments(new Set());
    }
  }, [open]);

  const countryDepartments = allDepartments.filter(d => d.countryId === countryId);

  // Available departments (no region assigned or empty string)
  const availableDepartments = countryDepartments.filter(d => !d.regionId || d.regionId === '');

  // Departments already assigned to other regions
  const assignedDepartments = countryDepartments.filter(d => d.regionId && d.regionId !== '');

  const handleToggleDepartment = (deptId: string) => {
    const newSet = new Set(selectedDepartments);
    if (newSet.has(deptId)) {
      newSet.delete(deptId);
    } else {
      newSet.add(deptId);
    }
    setSelectedDepartments(newSet);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const newRegion: Omit<GeoRegion, 'id'> = {
      countryId,
      name: name.trim(),
      description: description.trim() || undefined,
    };

    onSave(newRegion, Array.from(selectedDepartments));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Región UMA - {countryName}</DialogTitle>
          <DialogDescription>
            Crea una nueva región y asigna los departamentos que formarán parte de ella
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="region-name">Nombre de la Región *</Label>
            <Input
              id="region-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Centro, Norte, Pacífico..."
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="region-description">Descripción (opcional)</Label>
            <Textarea
              id="region-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción de la región..."
              rows={2}
            />
          </div>

          {/* Departamentos */}
          <div className="space-y-3">
            <Label>Departamentos</Label>

            {/* Disponibles */}
            {availableDepartments.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium mb-2">DISPONIBLES</p>
                <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-100 rounded-lg p-3">
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
            {assignedDepartments.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium mb-2">
                  ASIGNADOS A OTRAS REGIONES
                </p>
                <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                  {assignedDepartments.map((dept) => (
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

            {availableDepartments.length === 0 && assignedDepartments.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                No hay departamentos en este país
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-[#007AFF] hover:bg-[#0071E3]"
          >
            Crear Región
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
