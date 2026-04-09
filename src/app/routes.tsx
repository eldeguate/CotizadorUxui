import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Campaigns } from './pages/Campaigns';
import { CampaignBuilder } from './pages/CampaignBuilder';
import { CampaignDetail } from './pages/CampaignDetail';
import { MasterDataNew } from './pages/MasterDataNew';
import { MasterDataGeography } from './pages/MasterDataGeography';
import { HierarchyConfig } from './pages/HierarchyConfig';
import { ModelExternalMappings } from './pages/ModelExternalMappings';
import { ExternalSystems } from './pages/ExternalSystems';
import { ExportEngine } from './pages/ExportEngine';
import { Settings } from './pages/Settings';
import { Users } from './pages/Users';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'campaigns', Component: Campaigns },
      { path: 'campaigns/new', Component: CampaignBuilder },
      { path: 'campaigns/:id', Component: CampaignDetail },
      { path: 'campaigns/:id/edit', Component: CampaignBuilder },
      { path: 'master-data/products', Component: MasterDataNew },
      { path: 'master-data/geography', Component: MasterDataGeography },
      { path: 'master-data/users', Component: Users },
      { path: 'hierarchy-config', Component: HierarchyConfig },
      { path: 'model-mappings', Component: ModelExternalMappings },
      { path: 'external-systems', Component: ExternalSystems },
      { path: 'export', Component: ExportEngine },
      { path: 'settings', Component: Settings },
      { path: '*', Component: NotFound },
    ],
  },
]);
