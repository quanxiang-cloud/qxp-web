import React, { useEffect } from 'react';
import { useSetState } from 'react-use';

import Divider from '@m/qxp-ui-mobile/divider';
import TabsPage, { TabsPageProps, TabTitle } from '@m/components/tabs-page';
import { useURLSearch } from '@m/lib/hooks/use-url-search';
import { NumberString } from '@m/qxp-ui-mobile';

import { allTabs, allMessages, MessageTabKeys } from './constant';
import MessageTab from './tab';

const title = '全部消息';
export default function Messages(): JSX.Element {
  const [state, setState] = useSetState<TabsPageProps>({
    tabs: allMessages,
    active: 0,
    title,
  });

  useEffect(() => {
    document.title = title;
    const active = search.get('active') ?? '';
    initSearch(active);
  }, []);

  const [search, setSearch] = useURLSearch('replace');

  function onActiveChange(active: NumberString): void {
    const _active = active as number;
    const key = state.tabs[_active].key;
    setSearch({ active: key });
    setState({ active: _active });
  }

  function initSearch(active?: string): void {
    let index = state.tabs.findIndex((tab) => tab.key === active);
    if (index < 0) index = 0;
    onActiveChange(index);
  }

  function renderTab(tab: TabTitle): JSX.Element | null {
    const messageTab = allTabs[tab.key as MessageTabKeys];
    if (!messageTab) return null;
    return (
      <MessageTab {...messageTab} />
    );
  }

  return (
    <TabsPage
      tabs={state.tabs}
      active={state.active}
      title={state.title}
      renderTab={renderTab}
      onChange={onActiveChange}
      navBottom={<Divider color='var(--gray-200)'/>}
    />
  );
}
