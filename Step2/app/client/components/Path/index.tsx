import React from 'react';
import { Helmet } from 'react-helmet';
import { AppLayout, SimplePageLayout, Text } from '@deliveroo/tools-component-library';

const sidebarNavigation = [
  {
    badgeCount: 0,
    href: '/',
    icon: 'home',
    label: 'Home',
  },
];

const Path: React.FC = () => (
  <AppLayout
    appName="Site Path"
    userName="It's a me, Mario!"
    appType="internal"
    navigationLinks={sidebarNavigation}
    onLogoutIntent={() => {}}
  >
    <Helmet>
      <title>Site Path</title>
    </Helmet>
    <SimplePageLayout title="Site Path" width="max">
      <Text>{`SitePaths`}</Text>
    </SimplePageLayout>
  </AppLayout>
);

export default Path;
