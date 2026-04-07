import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Plus, Edit2, Trash2, Search, Database } from 'lucide-react';
import { ModelExternalMapping } from '../data/mockData';

export function ModelExternalMappings() {
  const { models, brands, segments, modelExternalMappings, externalSystems, addModelExternalMapping, updateModelExternalMapping, deleteModelExternalMapping } = useAppContext();
  const [search, setSearch] = useState('');
  const [systemFilter, setSystemFilter] = useState<string>('all');
  const [editingMapping, setEditingMapping] = useState<ModelExternalMapping | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');

  const [formData, setFormData] = useState({
    modelId: '',
    systemId: '',
    externalName: '',
    externalId: '',
    isActive: true,
  });

  const getBrandName = (brandId: string) => brands.find(b => b.id === brandId)?.label || '-';
  const getSegmentName = (segmentId: string) => segments.find(s => s.id === segmentId)?.label || '-';

  const getModelMappings = (modelId: string) => {
    return modelExternalMappings.filter(m => m.modelId === modelId);
  };

  const filteredModels = models.filter(m => {
    const matchesSearch = m.internalName.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (systemFilter === 'all') return true;

    const mappings = getModelMappings(m.id);
    return mappings.some(mapping => mapping.systemId === systemFilter);
  });

  const handleOpenDialog = (modelId?: string) => {
    if (modelId) {
      setSelectedModel(modelId);
      setFormData({
        modelId,
        systemId: externalSystems[0]?.id || '',
        externalName: '',
        externalId: '',
        isActive: true,
      });
    }
    setEditingMapping(null);
    setIsDialogOpen(true);
  };

  const handleEditMapping = (mapping: ModelExternalMapping) => {
    setEditingMapping(mapping);
    setFormData({
      modelId: mapping.modelId,
      systemId: mapping.systemId,
      externalName: mapping.externalName,
      externalId: mapping.externalId,
      isActive: mapping.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSaveMapping = () => {
    if (!formData.modelId || !formData.systemId || !formData.externalName || !formData.externalId) return;

    if (editingMapping) {
      updateModelExternalMapping(editingMapping.id, formData);
    } else {
      const newMapping: ModelExternalMapping = {
        id: `mmap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...formData,
      };
      addModelExternalMapping(newMapping);
    }

    setIsDialogOpen(false);
    setFormData({
      modelId: '',
      systemId: externalSystems[0]?.id || '',
      externalName: '',
      externalId: '',
      isActive: true,
    });
    setEditingMapping(null);
  };

  const handleDeleteMapping = (id: string) => {
    if (confirm('¿Está seguro de eliminar este mapeo?')) {
      deleteModelExternalMapping(id);
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
          Model External System Mappings
        </h1>
        <p className="text-[var(--text-secondary)]">
          Configure external system IDs and names for each model to ensure proper export integration
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <Input
                placeholder="Search models..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={systemFilter} onValueChange={(v: string) => setSystemFilter(v)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Systems</SelectItem>
                {externalSystems.map(sys => (
                  <SelectItem key={sys.id} value={sys.id}>{sys.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredModels.map(model => {
          const brand = brands.find(b => b.id === model.brandId);
          const segment = segments.find(s => s.id === model.segmentId);
          const mappings = getModelMappings(model.id);

          return (
            <Card key={model.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{model.internalName}</CardTitle>
                    <CardDescription>
                      {brand?.label} - {segment?.label}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(model.id)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Mapping
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {externalSystems.map(system => {
                    const mapping = mappings.find(m => m.systemId === system.id);

                    return (
                      <div key={system.id} className="border rounded-lg p-4 bg-[var(--bg-secondary)]">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4" style={{ color: system.color }} />
                            <span className="font-medium text-sm">{system.name}</span>
                            {mapping && mapping.isActive && (
                              <Badge variant="default" className="text-xs">Active</Badge>
                            )}
                            {mapping && !mapping.isActive && (
                              <Badge variant="secondary" className="text-xs">Inactive</Badge>
                            )}
                            {!mapping && (
                              <Badge variant="outline" className="text-xs">Not Mapped</Badge>
                            )}
                          </div>
                          {mapping && (
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditMapping(mapping)}>
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteMapping(mapping.id)}>
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </Button>
                            </div>
                          )}
                        </div>
                        {mapping ? (
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="text-[var(--text-secondary)]">External Name:</span>{' '}
                              <span className="font-medium">{mapping.externalName}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-[var(--text-secondary)]">External ID:</span>{' '}
                              <span className="font-mono text-xs">{mapping.externalId}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-[var(--text-secondary)]">No {system.name} mapping configured</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredModels.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-[var(--text-secondary)]">No models found matching your search criteria</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMapping ? 'Edit Mapping' : 'Add New Mapping'}</DialogTitle>
            <DialogDescription>
              Configure external system name and ID for this model
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!editingMapping && (
              <div className="space-y-2">
                <Label>Model</Label>
                <Select value={formData.modelId} onValueChange={(v) => setFormData({ ...formData, modelId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.internalName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>External System</Label>
              <Select value={formData.systemId} onValueChange={(v) => setFormData({ ...formData, systemId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select system" />
                </SelectTrigger>
                <SelectContent>
                  {externalSystems.filter(s => s.isActive).map(sys => (
                    <SelectItem key={sys.id} value={sys.id}>
                      {sys.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>External Name</Label>
              <Input
                placeholder="e.g., PULSAR NS 200"
                value={formData.externalName}
                onChange={(e) => setFormData({ ...formData, externalName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>External ID</Label>
              <Input
                placeholder="e.g., PRD-NS200-SF or MAT-001-NS200"
                value={formData.externalId}
                onChange={(e) => setFormData({ ...formData, externalId: e.target.value })}
              />
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
            <Button onClick={handleSaveMapping}>
              {editingMapping ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
