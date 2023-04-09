import React from 'react';
import { Helmet } from 'react-helmet';
import { AppLayout, SimplePageLayout, Text } from '@deliveroo/tools-component-library';

import ConnectedDropDown from '../DropDown';
import VaryingText from "../VaryingText";

const sidebarNavigation = [
  {
    badgeCount: 0,
    href: '/',
    icon: 'home',
    label: 'Home',
  },
];

const App: React.FC = () => (
  <AppLayout
    appName="Project Title"
    userName="It's a me, Mario!"
    appType="internal"
    navigationLinks={sidebarNavigation}
    onLogoutIntent={() => {}}
  >
    <Helmet>
      <title>Project Title</title>
    </Helmet>
    <SimplePageLayout title="Project Title" width="max">
      <Text>
        This content is part of your app! There is so much you can do. You have TCL installed, which
        will help you build your brand new app!
      </Text>
      <ConnectedDropDown />
      <VaryingText/>
      <br />
      <Text>
        <a href="https://tools-component-library.deliveroo.net/">
          Tools Component Library (TCL) Docs
        </a>
      </Text>
      <br />
    </SimplePageLayout>
  </AppLayout>
);

export default App;
