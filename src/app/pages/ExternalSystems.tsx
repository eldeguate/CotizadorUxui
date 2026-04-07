import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Plus, Edit2, Trash2, Database } from 'lucide-react';
import { ExternalSystem } from '../data/mockData';

export function ExternalSystems() {
  const { externalSystems, addExternalSystem, updateExternalSystem, deleteExternalSystem, modelExternalMappings } = useAppContext();
  const [editingSystem, setEditingSystem] = useState<ExternalSystem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    color: '#3B82F6',
    isActive: true,
  });

  const getMappingCount = (systemId: string) => {
    return modelExternalMappings.filter(m => m.systemId === systemId).length;
  };

  const handleOpenDialog = (system?: ExternalSystem) => {
    if (system) {
      setEditingSystem(system);
      setFormData({
        code: system.code,
        name: system.name,
        description: system.description,
        color: system.color,
        isActive: system.isActive,
      });
    } else {
      setEditingSystem(null);
      setFormData({
        code: '',
        name: '',
        description: '',
        color: '#3B82F6',
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveSystem = () => {
    if (!formData.code || !formData.name) return;

    if (editingSystem) {
      updateExternalSystem(editingSystem.id, formData);
    } else {
      const newSystem: ExternalSystem = {
        id: `sys_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...formData,
        createdAt: new Date().toISOString(),
      };
      addExternalSystem(newSystem);
    }

    setIsDialogOpen(false);
    setFormData({
      code: '',
      name: '',
      description: '',
      color: '#3B82F6',
      isActive: true,
    });
    setEditingSystem(null);
  };

  const handleDeleteSystem = (id: string) => {
    const mappingCount = getMappingCount(id);
    if (mappingCount > 0) {
      alert(`Cannot delete system. There are ${mappingCount} model mappings using this system. Please remove those mappings first.`);
      return;
    }

    if (confirm('¿Está seguro de eliminar este sistema?')) {
      deleteExternalSystem(id);
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
            External Systems
          </h1>
          <p className="text-[var(--text-secondary)]">
            Manage external systems for data integration and export
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add System
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {externalSystems.map(system => {
          const mappingCount = getMappingCount(system.id);

          return (
            <Card key={system.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: system.color + '20' }}
                    >
                      <Database className="w-5 h-5" style={{ color: system.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{system.name}</CardTitle>
                        {system.isActive ? (
                          <Badge variant="default" className="text-xs">Active</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Inactive</Badge>
                        )}
                      </div>
                      <CardDescription>Code: {system.code}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(system)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteSystem(system.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] mb-1">Description</p>
                    <p className="text-sm">{system.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-sm text-[var(--text-secondary)]">Model Mappings</span>
                    <Badge variant="outline">{mappingCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">Created</span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {new Date(system.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {externalSystems.length === 0 && (
          <Card className="col-span-2">
            <CardContent className="py-12 text-center">
              <Database className="w-12 h-12 mx-auto mb-4 text-[var(--text-secondary)]" />
              <p className="text-[var(--text-secondary)] mb-4">No external systems configured</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First System
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSystem ? 'Edit System' : 'Add New System'}</DialogTitle>
            <DialogDescription>
              Configure an external system for data integration
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>System Code *</Label>
              <Input
                placeholder="e.g., SF, SAP, ERP"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                maxLength={10}
              />
              <p className="text-xs text-[var(--text-secondary)]">
                Short identifier (max 10 characters)
              </p>
            </div>

            <div className="space-y-2">
              <Label>System Name *</Label>
              <Input
                placeholder="e.g., Salesforce, SAP ERP, Microsoft Dynamics"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Brief description of the system"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Display Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Color used for visual identification in the UI
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSystem} disabled={!formData.code || !formData.name}>
              {editingSystem ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
