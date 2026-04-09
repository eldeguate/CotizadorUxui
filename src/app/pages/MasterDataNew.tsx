import { useState, useMemo } from 'react';
import { Plus, Search, Layers, Tag, Package, CheckCircle, XCircle, ExternalLink, Calendar, Upload, FileDown } from 'lucide-react';
import {
  productCategories,
  segments,
  brands,
  models,
  modelVariants,
  externalMappings,
  type ProductCategory,
  type Segment,
  type Brand,
  type ModelItem,
  type ModelVariant,
  type ExternalMapping
} from '../data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';

export function MasterDataNew() {
  const [search, setSearch] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState<'models' | 'segments' | 'brands' | 'categories' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Helper functions
  const getBrandName = (brandId: string) => brands.find(b => b.id === brandId)?.label || '-';
  const getSegmentName = (segmentId: string) => segments.find(s => s.id === segmentId)?.label || '-';
  const getCategoryName = (categoryId: string) => productCategories.find(c => c.id === categoryId)?.label || '-';
  const getModelName = (modelId: string) => models.find(m => m.id === modelId)?.internalName || '-';

  const getVariantMappingStatus = (variantId: string) => {
    const sfMapping = externalMappings.find(m => m.variantId === variantId && m.system === 'salesforce');
    const sapMapping = externalMappings.find(m => m.variantId === variantId && m.system === 'sap');
    return { sf: !!sfMapping, sap: !!sapMapping };
  };

  // Get available years from model variants
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    modelVariants.forEach(v => years.add(v.modelYear));
    return Array.from(years).sort((a, b) => b - a); // Sort descending (newest first)
  }, []);

  // Filter data
  const filteredModels = useMemo(() => {
    return models.filter(m => {
      // Search filter
      const matchesSearch = search === '' || m.internalName.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      // Year filter
      if (selectedYear !== 'all') {
        const modelVars = modelVariants.filter(v => v.modelId === m.id);
        const hasVariantInYear = modelVars.some(v => v.modelYear === parseInt(selectedYear));
        return hasVariantInYear;
      }

      return true;
    });
  }, [search, selectedYear]);

  const filteredCategories = productCategories.filter(c =>
    search === '' || c.label.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSegments = segments.filter(s =>
    search === '' || s.label.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBrands = brands.filter(b =>
    search === '' || b.label.toLowerCase().includes(search.toLowerCase())
  );

  // File handling functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Here you would implement the actual file parsing and data import logic
      console.log('File uploaded:', file.name);
      // Simulate upload
      setTimeout(() => {
        alert(`Archivo "${file.name}" cargado exitosamente. ${uploadDialogOpen === 'models' ? 'Los modelos y variantes' : uploadDialogOpen} serán procesados.`);
        setUploadDialogOpen(null);
        setUploadedFile(null);
      }, 1000);
    }
  };

  const handleDownloadSample = () => {
    // Generate sample CSV/Excel structure based on the type
    let csvContent = '';
    let filename = '';

    switch (uploadDialogOpen) {
      case 'models':
        csvContent = 'internalName,brandId,segmentId,isActive,variantName,modelYear,basePVP,colors,isDefault\nPulsar NS200,brand-1,seg-1,true,STD,2024,12500000,"Rojo;Negro;Azul",true\n';
        filename = 'sample_modelos.csv';
        break;
      case 'segments':
        csvContent = 'code,label,categoryId,sortOrder,isActive\nSPORT,Sport,cat-1,1,true\n';
        filename = 'sample_segmentos.csv';
        break;
      case 'brands':
        csvContent = 'code,label,isActive\nBAJAJ,Bajaj,true\n';
        filename = 'sample_marcas.csv';
        break;
      case 'categories':
        csvContent = 'code,label,sortOrder,isActive\n2W,Motocicletas,1,true\n';
        filename = 'sample_categorias.csv';
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getUploadDialogContent = () => {
    const contents: Record<string, { title: string; description: string; fields: string }> = {
      models: {
        title: 'Importar Modelos y Variantes',
        description: 'Carga masiva de modelos con sus variantes, incluyendo todos los campos necesarios',
        fields: 'Nombre interno, Marca ID, Segmento ID, Estado, Nombre de variante, Año, Precio base, Colores, Variante por defecto'
      },
      segments: {
        title: 'Importar Segmentos',
        description: 'Carga masiva de segmentos de mercado',
        fields: 'Código, Nombre, Categoría ID, Orden, Estado'
      },
      brands: {
        title: 'Importar Marcas',
        description: 'Carga masiva de marcas de fabricantes',
        fields: 'Código, Nombre, Estado'
      },
      categories: {
        title: 'Importar Categorías',
        description: 'Carga masiva de categorías de productos',
        fields: 'Código, Nombre, Orden, Estado'
      }
    };

    return contents[uploadDialogOpen || 'models'];
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C1C1E' }}>Datos Maestros</h1>
        <p style={{ color: '#8E8E93', marginTop: '4px', fontSize: '0.9375rem' }}>
          Gestión del catálogo de productos: categorías, segmentos, marcas, modelos y variantes
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar en catálogo..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="models" className="space-y-6">
        <TabsList>
          <TabsTrigger value="models">
            <Package className="w-4 h-4 mr-2" />
            Modelos
          </TabsTrigger>
          <TabsTrigger value="segments">
            <Layers className="w-4 h-4 mr-2" />
            Segmentos
          </TabsTrigger>
          <TabsTrigger value="brands">
            <Tag className="w-4 h-4 mr-2" />
            Marcas
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Layers className="w-4 h-4 mr-2" />
            Categorías
          </TabsTrigger>
        </TabsList>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Modelos</CardTitle>
                  <CardDescription>
                    Gestiona los modelos de productos y sus variantes por año
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-1.5">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 font-medium">Año:</span>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-[120px] border-0 shadow-none">
                        <SelectValue placeholder="Filtrar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {availableYears.map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" onClick={() => setUploadDialogOpen('models')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Modelo
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Segmento</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Variantes</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModels.map(model => {
                    const modelVars = modelVariants.filter(v => v.modelId === model.id);
                    const segment = segments.find(s => s.id === model.segmentId);
                    const category = segment ? productCategories.find(c => c.id === segment.categoryId) : null;

                    return (
                      <TableRow key={model.id}>
                        <TableCell className="font-medium">{model.internalName}</TableCell>
                        <TableCell>{getBrandName(model.brandId)}</TableCell>
                        <TableCell>{getSegmentName(model.segmentId)}</TableCell>
                        <TableCell>{category?.label || '-'}</TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{modelVars.length} variante(s)</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={model.isActive ? 'default' : 'secondary'}>
                            {model.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedModel(model)}
                          >
                            Ver Variantes
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Model Variants Detail */}
          {selectedModel && (
            <Card>
              <CardHeader>
                <CardTitle>Variantes de {selectedModel.internalName}</CardTitle>
                <CardDescription>
                  Gestiona las variantes por año y mapeos a sistemas externos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Variante</TableHead>
                      <TableHead>Año</TableHead>
                      <TableHead>PVP Base</TableHead>
                      <TableHead>Colores</TableHead>
                      <TableHead>SF Mapeado</TableHead>
                      <TableHead>SAP Mapeado</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modelVariants
                      .filter(v => v.modelId === selectedModel.id)
                      .map(variant => {
                        const mappingStatus = getVariantMappingStatus(variant.id);

                        return (
                          <TableRow key={variant.id}>
                            <TableCell className="font-medium">
                              {variant.variantName}
                              {variant.isDefault && (
                                <Badge variant="outline" className="ml-2">Por defecto</Badge>
                              )}
                            </TableCell>
                            <TableCell>{variant.modelYear}</TableCell>
                            <TableCell>${variant.basePVP.toLocaleString('es-CO')}</TableCell>
                            <TableCell>
                              <div className="flex gap-1 flex-wrap">
                                {variant.colors.map(color => (
                                  <Badge key={color} variant="secondary" className="text-xs">
                                    {color}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              {mappingStatus.sf ? (
                                <Badge variant="default" className="bg-green-500">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Mapeado
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Sin Mapear
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {mappingStatus.sap ? (
                                <Badge variant="default" className="bg-green-500">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Mapeado
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Sin Mapear
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={variant.isActive ? 'default' : 'secondary'}>
                                {variant.isActive ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Segments Tab */}
        <TabsContent value="segments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Segmentos</CardTitle>
                  <CardDescription>
                    Gestiona los segmentos de mercado (Commuter, Sport, Premium, etc.)
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => setUploadDialogOpen('segments')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Segmento
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Orden</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSegments.map(segment => (
                    <TableRow key={segment.id}>
                      <TableCell className="font-mono text-sm">{segment.code}</TableCell>
                      <TableCell className="font-medium">{segment.label}</TableCell>
                      <TableCell>{getCategoryName(segment.categoryId)}</TableCell>
                      <TableCell>{segment.sortOrder}</TableCell>
                      <TableCell>
                        <Badge variant={segment.isActive ? 'default' : 'secondary'}>
                          {segment.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Editar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Brands Tab */}
        <TabsContent value="brands">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Marcas</CardTitle>
                  <CardDescription>
                    Gestiona las marcas de fabricantes (Bajaj, Honda, Yamaha, etc.)
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => setUploadDialogOpen('brands')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Marca
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBrands.map(brand => (
                    <TableRow key={brand.id}>
                      <TableCell className="font-mono text-sm">{brand.code}</TableCell>
                      <TableCell className="font-medium">{brand.label}</TableCell>
                      <TableCell>
                        <Badge variant={brand.isActive ? 'default' : 'secondary'}>
                          {brand.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Editar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Categorías</CardTitle>
                  <CardDescription>
                    Gestiona las categorías de productos (2W - Motocicletas, 3W - Motocarros)
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => setUploadDialogOpen('categories')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Categoría
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Orden</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map(category => (
                    <TableRow key={category.id}>
                      <TableCell className="font-mono text-sm">{category.code}</TableCell>
                      <TableCell className="font-medium">{category.label}</TableCell>
                      <TableCell>{category.sortOrder}</TableCell>
                      <TableCell>
                        <Badge variant={category.isActive ? 'default' : 'secondary'}>
                          {category.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Editar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Import Dialog */}
        <Dialog open={uploadDialogOpen !== null} onOpenChange={() => setUploadDialogOpen(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{uploadDialogOpen && getUploadDialogContent().title}</DialogTitle>
              <DialogDescription>
                {uploadDialogOpen && getUploadDialogContent().description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Sample File Download Section */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <FileDown className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-1">Paso 1: Descarga el archivo de ejemplo</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Descarga la plantilla con el formato correcto y los campos necesarios.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadSample}
                      className="bg-white hover:bg-blue-50 border-blue-300 text-blue-700"
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      Descargar Plantilla CSV
                    </Button>
                  </div>
                </div>

                {/* Fields info */}
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-xs text-blue-700">
                    <strong>Campos incluidos:</strong> {uploadDialogOpen && getUploadDialogContent().fields}
                  </p>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <Upload className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">Paso 2: Carga tu archivo</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Sube el archivo CSV o Excel con los datos a importar.
                    </p>
                    <div className="space-y-3">
                      <Input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="cursor-pointer bg-white"
                      />
                      {uploadedFile && (
                        <div className="text-sm text-green-600 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Archivo seleccionado: {uploadedFile.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Note */}
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border border-gray-200">
                <strong>Nota:</strong> Asegúrate de que el archivo siga el formato de la plantilla. Los datos se validarán antes de la importación.
                {uploadDialogOpen === 'models' && ' Para los modelos, cada fila puede incluir información de variantes usando el formato especificado.'}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Tabs>
    </div>
  );
}
