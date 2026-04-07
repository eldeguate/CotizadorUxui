import { useState } from 'react';
import { Plus, Search, Layers, Tag, Package, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
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

export function MasterDataNew() {
  const [search, setSearch] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null);

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

  // Filter data
  const filteredModels = models.filter(m =>
    search === '' || m.internalName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCategories = productCategories.filter(c =>
    search === '' || c.label.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSegments = segments.filter(s =>
    search === '' || s.label.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBrands = brands.filter(b =>
    search === '' || b.label.toLowerCase().includes(search.toLowerCase())
  );

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
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Modelo
                </Button>
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
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Segmento
                </Button>
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
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Marca
                </Button>
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
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Categoría
                </Button>
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
      </Tabs>
    </div>
  );
}
