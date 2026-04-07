import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Edit2, ChevronDown, ChevronRight } from 'lucide-react';

export function HierarchyConfig() {
  const { productCategories, segments, brands, models, modelVariants } = useAppContext();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
  const [expandedSegments, setExpandedSegments] = useState<Set<string>>(new Set());
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());

  const toggleCategory = (id: string) => {
    const newSet = new Set(expandedCategories);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedCategories(newSet);
  };

  const toggleBrand = (id: string) => {
    const newSet = new Set(expandedBrands);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedBrands(newSet);
  };

  const toggleSegment = (id: string) => {
    const newSet = new Set(expandedSegments);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedSegments(newSet);
  };

  const toggleModel = (id: string) => {
    const newSet = new Set(expandedModels);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedModels(newSet);
  };

  // Get brands for a category
  const getBrandsForCategory = (categoryId: string) => {
    return brands.filter(b => b.categoryIds && b.categoryIds.includes(categoryId));
  };

  // Get segments for a brand and category
  const getSegmentsForBrand = (brandId: string, categoryId: string) => {
    return segments.filter(s => s.brandIds && s.brandIds.includes(brandId) && s.categoryId === categoryId);
  };

  // Get models for a segment and brand
  const getModelsForSegment = (segmentId: string, brandId: string) => {
    return models.filter(m => m.segmentId === segmentId && m.brandId === brandId);
  };

  // Get variants for a model
  const getVariantsForModel = (modelId: string) => {
    return modelVariants.filter(v => v.modelId === modelId);
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
          Product Hierarchy Configuration
        </h1>
        <p className="text-[var(--text-secondary)]">
          Configure the relationships between categories, brands, segments, models, and variants
        </p>
      </div>

      <Tabs defaultValue="hierarchy" className="w-full">
        <TabsList>
          <TabsTrigger value="hierarchy">Full Hierarchy</TabsTrigger>
          <TabsTrigger value="relationships">Manage Relationships</TabsTrigger>
        </TabsList>

        <TabsContent value="hierarchy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Hierarchy Tree</CardTitle>
              <CardDescription>
                Category → Brand → Segment → Model → Variant (with Colors)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {productCategories.map(category => {
                  const categoryBrands = getBrandsForCategory(category.id);
                  const isExpanded = expandedCategories.has(category.id);

                  return (
                    <div key={category.id} className="border rounded-lg">
                      {/* Category Level */}
                      <div
                        className="flex items-center justify-between p-4 hover:bg-[var(--bg-secondary)] cursor-pointer"
                        onClick={() => toggleCategory(category.id)}
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          <div>
                            <div className="font-medium text-[var(--text-primary)]">{category.label}</div>
                            <div className="text-sm text-[var(--text-secondary)]">Code: {category.code}</div>
                          </div>
                        </div>
                        <Badge variant="secondary">{categoryBrands.length} brands</Badge>
                      </div>

                      {/* Brands under Category */}
                      {isExpanded && (
                        <div className="pl-8 pb-2">
                          {categoryBrands.map(brand => {
                            const brandSegments = getSegmentsForBrand(brand.id, category.id);
                            const isBrandExpanded = expandedBrands.has(`${category.id}-${brand.id}`);

                            return (
                              <div key={brand.id} className="border-l-2 pl-4 mt-2">
                                <div
                                  className="flex items-center justify-between p-3 hover:bg-[var(--bg-secondary)] cursor-pointer rounded"
                                  onClick={() => toggleBrand(`${category.id}-${brand.id}`)}
                                >
                                  <div className="flex items-center gap-3">
                                    {isBrandExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    <div>
                                      <div className="font-medium text-[var(--text-primary)]">{brand.label}</div>
                                      <div className="text-sm text-[var(--text-secondary)]">Code: {brand.code}</div>
                                    </div>
                                  </div>
                                  <Badge variant="secondary">{brandSegments.length} segments</Badge>
                                </div>

                                {/* Segments under Brand */}
                                {isBrandExpanded && (
                                  <div className="pl-6 mt-2">
                                    {brandSegments.map(segment => {
                                      const segmentModels = getModelsForSegment(segment.id, brand.id);
                                      const isSegmentExpanded = expandedSegments.has(`${brand.id}-${segment.id}`);

                                      return (
                                        <div key={segment.id} className="border-l-2 pl-4 mt-2">
                                          <div
                                            className="flex items-center justify-between p-3 hover:bg-[var(--bg-secondary)] cursor-pointer rounded"
                                            onClick={() => toggleSegment(`${brand.id}-${segment.id}`)}
                                          >
                                            <div className="flex items-center gap-3">
                                              {isSegmentExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                              <div>
                                                <div className="font-medium text-[var(--text-primary)]">{segment.label}</div>
                                                <div className="text-sm text-[var(--text-secondary)]">Code: {segment.code}</div>
                                              </div>
                                            </div>
                                            <Badge variant="secondary">{segmentModels.length} models</Badge>
                                          </div>

                                          {/* Models under Segment */}
                                          {isSegmentExpanded && (
                                            <div className="pl-6 mt-2">
                                              {segmentModels.map(model => {
                                                const variants = getVariantsForModel(model.id);
                                                const isModelExpanded = expandedModels.has(model.id);

                                                return (
                                                  <div key={model.id} className="border-l-2 pl-4 mt-2">
                                                    <div
                                                      className="flex items-center justify-between p-3 hover:bg-[var(--bg-secondary)] cursor-pointer rounded"
                                                      onClick={() => toggleModel(model.id)}
                                                    >
                                                      <div className="flex items-center gap-3">
                                                        {isModelExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                        <div className="font-medium text-[var(--text-primary)]">{model.internalName}</div>
                                                      </div>
                                                      <Badge variant="secondary">{variants.length} variants</Badge>
                                                    </div>

                                                    {/* Variants under Model */}
                                                    {isModelExpanded && (
                                                      <div className="pl-6 mt-2 space-y-2">
                                                        {variants.map(variant => (
                                                          <div key={variant.id} className="border rounded p-3 bg-[var(--bg-secondary)]">
                                                            <div className="flex items-center justify-between mb-2">
                                                              <div>
                                                                <div className="font-medium text-[var(--text-primary)]">
                                                                  {variant.variantName} - MY{variant.modelYear}
                                                                </div>
                                                                <div className="text-sm text-[var(--text-secondary)]">
                                                                  PVP: ${variant.basePVP.toLocaleString()}
                                                                </div>
                                                              </div>
                                                              {variant.isDefault && (
                                                                <Badge variant="default">Default</Badge>
                                                              )}
                                                            </div>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                              <span className="text-sm text-[var(--text-secondary)]">Colors:</span>
                                                              {variant.colors.map((color, idx) => (
                                                                <Badge key={idx} variant="outline" className="text-xs">
                                                                  {color}
                                                                </Badge>
                                                              ))}
                                                            </div>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Category → Brand Relationships</CardTitle>
              <CardDescription>
                Configure which brands operate in which product categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productCategories.map(category => {
                  const categoryBrands = getBrandsForCategory(category.id);
                  const availableBrands = brands.filter(b => b.categoryIds && !b.categoryIds.includes(category.id));

                  return (
                    <div key={category.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">{category.label}</div>
                          <div className="text-sm text-[var(--text-secondary)]">Code: {category.code}</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Add Brand
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categoryBrands.map(brand => (
                          <Badge key={brand.id} variant="default" className="px-3 py-1">
                            {brand.label}
                          </Badge>
                        ))}
                        {categoryBrands.length === 0 && (
                          <span className="text-sm text-[var(--text-secondary)]">No brands assigned</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Brand → Segment Relationships</CardTitle>
              <CardDescription>
                Configure which segments each brand uses within categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {brands.map(brand => (
                  <div key={brand.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">{brand.label}</div>
                        <div className="text-sm text-[var(--text-secondary)]">Code: {brand.code}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Segment
                      </Button>
                    </div>

                    {brand.categoryIds && brand.categoryIds.map(catId => {
                      const category = productCategories.find(c => c.id === catId);
                      const brandSegments = segments.filter(s => s.brandIds && s.brandIds.includes(brand.id) && s.categoryId === catId);

                      return (
                        <div key={catId} className="mb-3 last:mb-0">
                          <div className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                            {category?.label}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {brandSegments.map(segment => (
                              <Badge key={segment.id} variant="secondary" className="px-3 py-1">
                                {segment.label}
                              </Badge>
                            ))}
                            {brandSegments.length === 0 && (
                              <span className="text-sm text-[var(--text-secondary)]">No segments assigned</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Segment → Model Relationships</CardTitle>
              <CardDescription>
                Configure which models belong to each segment (by brand)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {segments.map(segment => {
                  const category = productCategories.find(c => c.id === segment.categoryId);

                  return (
                    <div key={segment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">{segment.label}</div>
                          <div className="text-sm text-[var(--text-secondary)]">
                            {category?.label} - Code: {segment.code}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Add Model
                        </Button>
                      </div>

                      {segment.brandIds && segment.brandIds.map(brandId => {
                        const brand = brands.find(b => b.id === brandId);
                        const segmentModels = getModelsForSegment(segment.id, brandId);

                        return (
                          <div key={brandId} className="mb-3 last:mb-0">
                            <div className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                              {brand?.label}
                            </div>
                            <div className="space-y-1">
                              {segmentModels.map(model => (
                                <div key={model.id} className="flex items-center justify-between p-2 border rounded hover:bg-[var(--bg-secondary)]">
                                  <span className="text-sm">{model.internalName}</span>
                                  <Button variant="ghost" size="sm">
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                              {segmentModels.length === 0 && (
                                <span className="text-sm text-[var(--text-secondary)]">No models assigned</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Model → Variant Relationships</CardTitle>
              <CardDescription>
                Configure variants and colors for each model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {models.slice(0, 5).map(model => {
                  const brand = brands.find(b => b.id === model.brandId);
                  const segment = segments.find(s => s.id === model.segmentId);
                  const variants = getVariantsForModel(model.id);

                  return (
                    <div key={model.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">{model.internalName}</div>
                          <div className="text-sm text-[var(--text-secondary)]">
                            {brand?.label} - {segment?.label}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Add Variant
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {variants.map(variant => (
                          <div key={variant.id} className="border rounded p-3 bg-[var(--bg-secondary)]">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-medium text-[var(--text-primary)] text-sm">
                                  {variant.variantName} - MY{variant.modelYear}
                                </div>
                                <div className="text-xs text-[var(--text-secondary)]">
                                  PVP: ${variant.basePVP.toLocaleString()}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {variant.isDefault && <Badge variant="default" className="text-xs">Default</Badge>}
                                <Button variant="ghost" size="sm">
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-[var(--text-secondary)]">Colors:</span>
                              {variant.colors.map((color, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {color}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {models.length > 5 && (
                  <div className="text-center text-sm text-[var(--text-secondary)]">
                    Showing 5 of {models.length} models
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
