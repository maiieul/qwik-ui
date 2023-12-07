import { Slot, component$ } from '@builder.io/qwik';
import {
  Tabs,
  TabList,
  TabPanel,
  Tab,
  TabListProps,
  TabPanelProps,
  TabProps,
} from '@qwik-ui/headless';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MyTabs = (props: any) => {
  return <Tabs>{props.children}</Tabs>;
};

export const MyTabList = component$<TabListProps>(() => {
  return (
    <TabList>
      <Slot />
    </TabList>
  );
});

export const MyTabPanel = component$<TabPanelProps>(() => {
  return (
    <TabPanel>
      <Slot />
    </TabPanel>
  );
});

export const MyTab = component$<TabProps>(() => {
  return (
    <Tab>
      <Slot />
    </Tab>
  );
});
