import { useState, useMemo } from 'react';
import { Plus, Search, Users as UsersIcon, Building2, User, MapPin, Phone, Mail, Edit, ChevronDown, ChevronRight } from 'lucide-react';
import {
  userProfiles,
  organizations,
  countries,
  umaRegions,
  states,
  municipalities,
  channels,
  channelCategories,
  ownStores,
  type UserProfile,
  type Organization,
} from '../data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';

export function Users() {
  const [search, setSearch] = useState('');
  const [filterUserType, setFilterUserType] = useState<'all' | 'individual' | 'company'>('all');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set());

  // Form state for new user
  const [formData, setFormData] = useState({
    userType: 'individual' as 'individual' | 'company',
    userName: '',
    email: '',
    whatsapp: '',
    countryId: 'country_colombia',
    organizationId: '',
    newOrgName: '',
    newOrgNit: '',
    internalStoreCode: '',
    externalStoreCode: '',
    storeId: '',
    geographyAccessLevel: 'national' as 'national' | 'uma_region' | 'department' | 'municipality' | 'store',
    geographyAccessIds: [] as string[],
    channelId: '',
  });

  // Helper functions
  const getOrganizationName = (orgId?: string) => organizations.find(o => o.id === orgId)?.companyName || '-';
  const getChannelName = (channelId: string) => channels.find(c => c.id === channelId)?.name || '-';
  const getStoreName = (storeId?: string) => ownStores.find(s => s.id === storeId)?.name || '-';

  const getGeographyDisplay = (level: string, ids: string[]) => {
    if (level === 'national') return 'Nacional';
    if (level === 'uma_region') {
      const regions = umaRegions.filter(r => ids.includes(r.id));
      return regions.map(r => r.name).join(', ') || '-';
    }
    if (level === 'department') {
      const depts = states.filter(d => ids.includes(d.id));
      return depts.map(d => d.name).join(', ') || '-';
    }
    if (level === 'municipality') {
      const munis = municipalities.filter(m => ids.includes(m.id));
      return munis.map(m => m.name).join(', ') || '-';
    }
    if (level === 'store') {
      const stores = ownStores.filter(s => ids.includes(s.id));
      return stores.map(s => s.name).join(', ') || '-';
    }
    return '-';
  };

  // Filter users
  const filteredUsers = useMemo(() => {
    return userProfiles.filter(user => {
      const matchesSearch = search === '' ||
        user.userName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.nomenclature.toLowerCase().includes(search.toLowerCase());

      const matchesType = filterUserType === 'all' || user.userType === filterUserType;
      const matchesChannel = filterChannel === 'all' || user.channelId === filterChannel;

      return matchesSearch && matchesType && matchesChannel;
    });
  }, [search, filterUserType, filterChannel]);

  // Group users by organization
  const groupedUsers = useMemo(() => {
    const grouped: { [key: string]: UserProfile[] } = {
      individual: [],
      organizations: []
    };

    filteredUsers.forEach(user => {
      if (user.userType === 'individual') {
        grouped.individual.push(user);
      } else if (!user.parentUserId) {
        // Parent company users
        grouped.organizations.push(user);
      }
    });

    return grouped;
  }, [filteredUsers]);

  // Get sub-users for a parent user
  const getSubUsers = (parentId: string) => {
    return filteredUsers.filter(u => u.parentUserId === parentId);
  };

  const toggleOrgExpanded = (orgId: string) => {
    const newExpanded = new Set(expandedOrgs);
    if (newExpanded.has(orgId)) {
      newExpanded.delete(orgId);
    } else {
      newExpanded.add(orgId);
    }
    setExpandedOrgs(newExpanded);
  };

  const handleCreateUser = () => {
    // Generate nomenclature
    const channelCode = channels.find(c => c.id === formData.channelId)?.code || 'USR';
    const userCount = userProfiles.length + 1;
    const nomenclature = `${channelCode}-${String(userCount).padStart(3, '0')}`;

    console.log('Creating user:', { ...formData, nomenclature });
    alert(`Usuario ${formData.userName} creado con nomenclatura: ${nomenclature}`);
    setCreateDialogOpen(false);
    // Reset form
    setFormData({
      userType: 'individual',
      userName: '',
      email: '',
      whatsapp: '',
      countryId: 'country_colombia',
      organizationId: '',
      newOrgName: '',
      newOrgNit: '',
      internalStoreCode: '',
      externalStoreCode: '',
      storeId: '',
      geographyAccessLevel: 'national',
      geographyAccessIds: [],
      channelId: '',
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C1C1E' }}>Gestión de Usuarios</h1>
        <p style={{ color: '#8E8E93', marginTop: '4px', fontSize: '0.9375rem' }}>
          Administra usuarios individuales y usuarios asociados a organizaciones
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o nomenclatura..."
            className="pl-9"
          />
        </div>

        <Select value={filterUserType} onValueChange={(v: any) => setFilterUserType(v)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tipo de usuario" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="individual">Individuales</SelectItem>
            <SelectItem value="company">Empresariales</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterChannel} onValueChange={setFilterChannel}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los canales</SelectItem>
            {channels.map(channel => (
              <SelectItem key={channel.id} value={channel.id}>
                {channel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="space-y-6">
        {/* Individual Users */}
        {groupedUsers.individual.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Usuarios Individuales
              </CardTitle>
              <CardDescription>
                Usuarios independientes no asociados a una organización
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nomenclatura</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Geografía</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedUsers.individual.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-sm">{user.nomenclature}</TableCell>
                      <TableCell className="font-medium">{user.userName}</TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Phone className="w-3 h-3" />
                            {user.whatsapp}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getChannelName(user.channelId)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {getGeographyDisplay(user.geographyAccessLevel, user.geographyAccessIds)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Company/Organization Users */}
        {groupedUsers.organizations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Usuarios Empresariales
              </CardTitle>
              <CardDescription>
                Usuarios asociados a organizaciones con posibilidad de sub-usuarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Nomenclatura</TableHead>
                    <TableHead>Usuario / Organización</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Tienda/Código</TableHead>
                    <TableHead>Geografía</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedUsers.organizations.map(user => {
                    const subUsers = getSubUsers(user.id);
                    const isExpanded = expandedOrgs.has(user.id);
                    const orgName = getOrganizationName(user.organizationId);

                    return (
                      <>
                        {/* Parent User Row */}
                        <TableRow key={user.id} className="bg-blue-50/50">
                          <TableCell>
                            {subUsers.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => toggleOrgExpanded(user.id)}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm font-medium">{user.nomenclature}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.userName}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {orgName}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Phone className="w-3 h-3" />
                                {user.whatsapp}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getChannelName(user.channelId)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {user.internalStoreCode && (
                                <div className="font-mono">{user.internalStoreCode}</div>
                              )}
                              {user.externalStoreCode && (
                                <div className="font-mono text-gray-500">{user.externalStoreCode}</div>
                              )}
                              {user.storeId && (
                                <div className="text-gray-600">{getStoreName(user.storeId)}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              {getGeographyDisplay(user.geographyAccessLevel, user.geographyAccessIds)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.isActive ? 'default' : 'secondary'}>
                              {user.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              {subUsers.length > 0 && (
                                <Badge variant="outline" className="ml-2">
                                  {subUsers.length} sub-usuario{subUsers.length > 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* Sub-users */}
                        {isExpanded && subUsers.map(subUser => (
                          <TableRow key={subUser.id} className="bg-gray-50/50">
                            <TableCell></TableCell>
                            <TableCell className="font-mono text-sm pl-8">{subUser.nomenclature}</TableCell>
                            <TableCell>
                              <div className="pl-6">
                                <div className="font-medium text-sm">{subUser.userName}</div>
                                <div className="text-xs text-gray-500">↳ Sub-usuario</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm space-y-1">
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Mail className="w-3 h-3" />
                                  {subUser.email}
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Phone className="w-3 h-3" />
                                  {subUser.whatsapp}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getChannelName(subUser.channelId)}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {subUser.internalStoreCode && (
                                  <div className="font-mono">{subUser.internalStoreCode}</div>
                                )}
                                {subUser.externalStoreCode && (
                                  <div className="font-mono text-gray-500">{subUser.externalStoreCode}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                {getGeographyDisplay(subUser.geographyAccessLevel, subUser.geographyAccessIds)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={subUser.isActive ? 'default' : 'secondary'}>
                                {subUser.isActive ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Completa la información del usuario. El sistema generará automáticamente la nomenclatura.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* User Type */}
            <div className="space-y-2">
              <Label>Tipo de Usuario</Label>
              <Select
                value={formData.userType}
                onValueChange={(v: 'individual' | 'company') => setFormData({ ...formData, userType: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="company">Empresarial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre Completo *</Label>
                <Input
                  value={formData.userName}
                  onChange={e => setFormData({ ...formData, userName: e.target.value })}
                  placeholder="Nombre del usuario"
                />
              </div>

              <div className="space-y-2">
                <Label>País *</Label>
                <Select
                  value={formData.countryId}
                  onValueChange={v => setFormData({ ...formData, countryId: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label>WhatsApp *</Label>
                <Input
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+57 300 1234567"
                />
              </div>
            </div>

            {/* Organization (if company user) */}
            {formData.userType === 'company' && (
              <div className="space-y-4 p-4 border rounded-lg bg-blue-50/50">
                <h4 className="font-medium text-sm">Información de la Organización</h4>

                <div className="space-y-2">
                  <Label>Organización Existente</Label>
                  <Select
                    value={formData.organizationId}
                    onValueChange={v => setFormData({ ...formData, organizationId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar organización existente..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nueva organización</SelectItem>
                      {organizations.map(org => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.companyName} - {org.nit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {!formData.organizationId && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre de la Empresa</Label>
                      <Input
                        value={formData.newOrgName}
                        onChange={e => setFormData({ ...formData, newOrgName: e.target.value })}
                        placeholder="Nombre de la empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>NIT</Label>
                      <Input
                        value={formData.newOrgNit}
                        onChange={e => setFormData({ ...formData, newOrgNit: e.target.value })}
                        placeholder="900123456-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Store/Retail Codes */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-medium text-sm">Códigos de Tienda (Opcional)</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Código Interno</Label>
                  <Input
                    value={formData.internalStoreCode}
                    onChange={e => setFormData({ ...formData, internalStoreCode: e.target.value })}
                    placeholder="TP-BOG-01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Código Externo</Label>
                  <Input
                    value={formData.externalStoreCode}
                    onChange={e => setFormData({ ...formData, externalStoreCode: e.target.value })}
                    placeholder="EXT-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tienda</Label>
                  <Select
                    value={formData.storeId}
                    onValueChange={v => setFormData({ ...formData, storeId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Ninguna</SelectItem>
                      {ownStores.map(store => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Geography Access */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-medium text-sm">Acceso Geográfico *</h4>
              <div className="space-y-2">
                <Label>Nivel de Acceso</Label>
                <Select
                  value={formData.geographyAccessLevel}
                  onValueChange={(v: any) => setFormData({ ...formData, geographyAccessLevel: v, geographyAccessIds: [] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="national">Nacional</SelectItem>
                    <SelectItem value="uma_region">Región UMA</SelectItem>
                    <SelectItem value="department">Departamento</SelectItem>
                    <SelectItem value="municipality">Municipio</SelectItem>
                    <SelectItem value="store">Tienda Específica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.geographyAccessLevel !== 'national' && (
                <div className="space-y-2">
                  <Label>Seleccionar {
                    formData.geographyAccessLevel === 'uma_region' ? 'Regiones UMA' :
                    formData.geographyAccessLevel === 'department' ? 'Departamentos' :
                    formData.geographyAccessLevel === 'municipality' ? 'Municipios' :
                    'Tiendas'
                  }</Label>
                  <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                    {formData.geographyAccessLevel === 'uma_region' && umaRegions.map(region => (
                      <label key={region.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.geographyAccessIds.includes(region.id)}
                          onChange={e => {
                            const ids = e.target.checked
                              ? [...formData.geographyAccessIds, region.id]
                              : formData.geographyAccessIds.filter(id => id !== region.id);
                            setFormData({ ...formData, geographyAccessIds: ids });
                          }}
                        />
                        {region.name}
                      </label>
                    ))}
                    {formData.geographyAccessLevel === 'department' && states.map(state => (
                      <label key={state.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.geographyAccessIds.includes(state.id)}
                          onChange={e => {
                            const ids = e.target.checked
                              ? [...formData.geographyAccessIds, state.id]
                              : formData.geographyAccessIds.filter(id => id !== state.id);
                            setFormData({ ...formData, geographyAccessIds: ids });
                          }}
                        />
                        {state.name}
                      </label>
                    ))}
                    {formData.geographyAccessLevel === 'municipality' && municipalities.map(muni => (
                      <label key={muni.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.geographyAccessIds.includes(muni.id)}
                          onChange={e => {
                            const ids = e.target.checked
                              ? [...formData.geographyAccessIds, muni.id]
                              : formData.geographyAccessIds.filter(id => id !== muni.id);
                            setFormData({ ...formData, geographyAccessIds: ids });
                          }}
                        />
                        {muni.name}
                      </label>
                    ))}
                    {formData.geographyAccessLevel === 'store' && ownStores.map(store => (
                      <label key={store.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.geographyAccessIds.includes(store.id)}
                          onChange={e => {
                            const ids = e.target.checked
                              ? [...formData.geographyAccessIds, store.id]
                              : formData.geographyAccessIds.filter(id => id !== store.id);
                            setFormData({ ...formData, geographyAccessIds: ids });
                          }}
                        />
                        {store.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Channel */}
            <div className="space-y-2">
              <Label>Canal *</Label>
              <Select
                value={formData.channelId}
                onValueChange={v => setFormData({ ...formData, channelId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar canal..." />
                </SelectTrigger>
                <SelectContent>
                  {channels.map(channel => (
                    <SelectItem key={channel.id} value={channel.id}>
                      {channel.name} ({channel.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateUser}>
              Crear Usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
