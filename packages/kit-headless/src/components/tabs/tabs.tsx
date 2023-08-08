import {
  $,
  QwikIntrinsicElements,
  Signal,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
  useStore,
  useTask$,
  type ClassList,
  type FunctionComponent,
  type PropsOf
} from '@builder.io/qwik';
import { JSX } from '@builder.io/qwik/jsx-runtime';
import { KeyCode } from '../../utils/key-code.type';
import { Behavior } from './behavior.type';
import { TAB_ID_PREFIX, Tab } from './tab';
import { TabPanel } from './tab-panel';
import { tabsContextId } from './tabs-context-id';
import { TabsContext } from './tabs-context.type';
import { TabList } from './tabs-list';

/**
 * TABS TODOs

 *
* aria Tabs Pattern https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 * a11y lint plugin https://www.npmjs.com/package/eslint-plugin-jsx-a11y

* POST Alpha
  * Add a way to add a default tab class from the root (for styling all the tabs in one place)

* POST Beta
  * Add automated tests for preventDefault on end, home,  pageDown, pageUp
  * Add automated tests for SSR indexing behavior (and in general)


* POST V1:
 * - RTL
 *  NOTE: scrolling support? or multiple lines? (probably not for headless but for tailwind / material )
 * Add ability to close tabs with an ❌ icon (and keyboard support)

 *
 */

export type TabsProps = {
  behavior?: Behavior;
  selectedId?: string;
  selectedIndex?: number;
  vertical?: boolean;
  selectedClassName?: string;
  onSelectedIndexChange$?: (index: number) => void;
  'bind:selectedIndex'?: Signal<number>;
  /** @deprecated Internal use only */
  _tabsInfoList?: TabInfo[];
} & QwikIntrinsicElements['div'];

export interface TabInfo {
  tabId: string;
  index: number;
  disabled?: boolean;
}

// TODO: default classes
// TODO: Add tests
export const Tabs: FunctionComponent<
  Omit<PropsOf<typeof TabsImpl>, 'children' | '_tabsInfoList'> & {
    children: unknown | unknown[];
    tabClass?: ClassList;
    panelClass?: ClassList;
  }
> = ({ children, tabClass, panelClass, ...props }) => {
  children = Array.isArray(children) ? [...children] : [children];
  const typedChildren = children as JSX.Element[];
  let tabListElement: JSX.Element | undefined;
  const tabComponents: JSX.Element[] = [];
  const panelComponents: JSX.Element[] = [];
  const tabsInfoList: TabInfo[] = [];
  let tabIndex = 0;
  let panelIndex = 0;

  const tabIds: string[] = [];

  function getTabIdByIndex(index: number) {
    if (tabIds[index]) {
      return tabIds[index];
    }
    const newTabId = `${index}`; // Math.random().toString().split('.')[1];
    tabIds.push(newTabId);
    return newTabId;
  }

  for (let i = 0; i < typedChildren.length; i++) {
    const child = typedChildren[i];
    if (!child) {
      continue;
    }
    if (Array.isArray(child)) {
      typedChildren.splice(i + 1, 0, ...child);
      continue;
    }

    switch (child.type) {
      case TabList: {
        tabListElement = child;
        const tabListChildren = Array.isArray(child.props.children)
          ? child.props.children
          : [child.props.children];

        typedChildren.splice(i + 1, 0, ...tabListChildren);

        break;
      }
      case Tab: {
        const tabId = getTabIdByIndex(tabIndex);
        child.props.key ||= `${tabIndex}`;
        tabComponents.push(child);
        tabsInfoList.push({ tabId, index: tabIndex, disabled: false });
        tabIndex++;
        break;
      }
      case TabPanel: {
        const tabId = getTabIdByIndex(panelIndex);
        const { title, key = `${panelIndex}` } = child.props;

        child.props = {
          ...child.props,
          title: undefined,
          key,
          _tabId: tabId,
          _index: panelIndex,
          class: [panelClass, child.props.class]
        };
        if (title) {
          const tabKey = `tab${tabId}`;
          tabComponents.push(
            <Tab class={tabClass} key={tabKey} _tabId={tabId} _index={panelIndex}>
              {title}
            </Tab>
          );
          tabIndex++;
        }
        panelComponents.push(child);
        panelIndex++;

        break;
      }
      default: {
        console.error('unknown type', String(child.type));
        // throw new TypeError(`Tabs can't handle the given children`);
      }
    }
  }

  if (tabIndex !== panelIndex) {
    console.error(`mismatched number of tabs and panels: ${tabIndex} ${panelIndex}`);
  }

  for (let index = 0; index < tabComponents.length; index++) {
    const tabId = getTabIdByIndex(index);
    const tab = tabComponents[index];
    const key = panelComponents[index]?.props.key;
    tab.props = {
      ...tab.props,
      key,
      _index: index,
      _tabId: tabId,
      class: [tabClass, tab.props.class]
    };
  }

  tabListElement ||= <TabList />;
  tabListElement.children = tabComponents;

  console.log('tabsInfoList', tabsInfoList);
  console.log('tabListElement.children', tabListElement.children);
  console.log('panelComponents', panelComponents);
  console.log('==============');
  return (
    <TabsImpl _tabsInfoList={tabsInfoList} {...props}>
      {tabListElement}
      {panelComponents}
    </TabsImpl>
  );
};

export const TabsImpl = component$((props: TabsProps) => {
  const behavior = props.behavior ?? 'manual';

  const ref = useSignal<HTMLElement | undefined>();

  const initialSelectedIndexSig = useSignal(0);
  // TODO: Add tests for bind
  const selectedIndexSig = props['bind:selectedIndex'] || initialSelectedIndexSig;

  const lastSelectedTabSig = useSignal<TabInfo | undefined>();

  const tabsPrefix = useId();

  const tabsInfoListStore = useStore<TabInfo[]>([]);
  useTask$(function syncTabsInfoListTask({ track }) {
    const tabsInfoList = track(() => props._tabsInfoList);
    console.log('SYNC INFO LIST');
    if (tabsInfoList) {
      tabsInfoListStore.splice(0, tabsInfoListStore.length, ...tabsInfoList);
    }
  });

  const enabledTabsSig = useComputed$(() => {
    return tabsInfoListStore.filter((tab) => !tab.disabled);
  });

  useTask$(function syncPropSelectedIndexTask({ track }) {
    selectedIndexSig.value = track(() => props.selectedIndex) || 0;
  });

  useTask$(function selectFirstEnabledTabTask({ track }) {
    console.log('UPDATE SELECTED INDEX TASK', selectedIndexSig.value);
    track(() => selectedIndexSig.value);
    if (selectedIndexSig.value === -1) {
      console.log('MINUS 1');
      return;
    }
    if (selectedIndexSig.value >= tabsInfoListStore.length) {
      selectedIndexSig.value = tabsInfoListStore.length - 1;
      console.log('MORE THAN LENGTH');
      return;
    }

    if (tabsInfoListStore[selectedIndexSig.value].disabled) {
      let enabledTabIndex = findNextEnabledTab(tabsInfoListStore, selectedIndexSig.value);
      if (enabledTabIndex === -1) {
        enabledTabIndex = findPreviousEnabledTab(
          tabsInfoListStore,
          selectedIndexSig.value
        );
      }
      if (enabledTabIndex === -1) {
        console.warn('no enabled tabs to select');
      }
      console.log('FINAL UPDATED INDEX: ', enabledTabIndex);
      selectedIndexSig.value = enabledTabIndex;
    }

    function findNextEnabledTab(tabsStore: TabInfo[], index: number) {
      for (let i = index; i < tabsStore.length; i++) {
        if (!tabsStore[i].disabled) {
          return i;
        }
      }
      return -1;
    }

    function findPreviousEnabledTab(tabsStore: TabInfo[], index: number) {
      for (let i = index; i >= 0; i--) {
        if (!tabsStore[i].disabled) {
          return i;
        }
      }
      return -1;
    }
  });

  useTask$(function callOnSelectedChangeTask({ track }) {
    if (props.onSelectedIndexChange$) {
      props.onSelectedIndexChange$(track(() => selectedIndexSig.value));
    }
  });

  useTask$(function syncLastSelectedTab({ track }) {
    console.log('COMPUTED tabsInfoListStore', tabsInfoListStore);
    console.log('COMPUTED selectedIndexSig.value', selectedIndexSig.value);
    track(() => selectedIndexSig.value);
    lastSelectedTabSig.value = tabsInfoListStore[selectedIndexSig.value];
  });

  useTask$(async function updateSelectedIndexAfterTabListChangeTask({ track }) {
    track(() => tabsInfoListStore.length);
    console.log('tabsInfoListStore.length', tabsInfoListStore.length);
    if (!lastSelectedTabSig.value) {
      return;
    }
    const lastSelectedTabId = lastSelectedTabSig.value.tabId;
    const lastSelectedTabIndex = lastSelectedTabSig.value.index;
    console.log(
      '*** lastSelectedTabId + index',
      lastSelectedTabId,
      lastSelectedTabIndex,
      tabsInfoListStore
    );
    const foundUpdatedSelectedTabIndex = tabsInfoListStore.findIndex(
      (tab) => tab.tabId === lastSelectedTabId
    );
    if (foundUpdatedSelectedTabIndex === -1) {
      selectedIndexSig.value = lastSelectedTabIndex + 1;
      console.log('UPDATED selectedIndexSig.value', selectedIndexSig.value);
      return;
    }
    console.log('foundUpdatedSelectedTabIndex', foundUpdatedSelectedTabIndex);
    selectedIndexSig.value = foundUpdatedSelectedTabIndex;
  });

  const selectTab$ = $((tabId: string) => {
    const foundTab = enabledTabsSig.value.find((tab) => tab.tabId === tabId);

    if (!foundTab) {
      return;
    }
    selectedIndexSig.value = foundTab.index;
  });

  const selectIfAutomatic$ = $((tabId: string) => {
    if (behavior === 'automatic') {
      selectTab$(tabId);
    }
  });

  const disableTab$ = $((tabId: string) => {
    const foundTabIndex = tabsInfoListStore.findIndex((tab) => tab.tabId === tabId);
    tabsInfoListStore[foundTabIndex].disabled = true;
    selectedIndexSig.value++;
  });

  const onTabKeyDown$ = $((key: KeyCode, currentTabId: string) => {
    const tabsRootElement = ref.value;

    const enabledTabs = enabledTabsSig.value;
    const currentFocusedTabIndex = enabledTabs.findIndex(
      (tabData) => tabData.tabId === currentTabId
    );

    if (
      (!props.vertical && key === KeyCode.ArrowRight) ||
      (props.vertical && key === KeyCode.ArrowDown)
    ) {
      let nextTabId = enabledTabs[0].tabId;

      if (currentFocusedTabIndex < enabledTabs.length - 1) {
        nextTabId = enabledTabs[currentFocusedTabIndex + 1].tabId;
      }
      focusOnTab(nextTabId);
    }

    if (
      (!props.vertical && key === KeyCode.ArrowLeft) ||
      (props.vertical && key === KeyCode.ArrowUp)
    ) {
      let previousTabId = enabledTabs[enabledTabs.length - 1].tabId;

      if (currentFocusedTabIndex !== 0) {
        previousTabId = enabledTabs[currentFocusedTabIndex - 1].tabId;
      }
      focusOnTab(previousTabId);
    }

    if (key === KeyCode.Home || key === KeyCode.PageUp) {
      const firstTabId = enabledTabs[0].tabId;
      focusOnTab(firstTabId);
    }

    if (key === KeyCode.End || key === KeyCode.PageDown) {
      const lastTabId = enabledTabs[enabledTabs.length - 1].tabId;
      focusOnTab(lastTabId);
    }

    function focusOnTab(tabId: string) {
      const fullTabElementId = tabsPrefix + TAB_ID_PREFIX + tabId;
      tabsRootElement
        ?.querySelector<HTMLElement>(`[data-tab-id='${fullTabElementId}']`)
        ?.focus();
    }
  });

  const contextService: TabsContext = {
    selectTab$,
    tabsPrefix,
    disableTab$,
    onTabKeyDown$,
    selectIfAutomatic$,
    selectedIndexSig,
    selectedClassName: props.selectedClassName
  };

  useContextProvider(tabsContextId, contextService);

  return (
    <div ref={ref} {...props}>
      <Slot />
    </div>
  );
});
