import React, { useEffect } from 'react';
import { allList, allTabs, allTags, ApprovalSearch, ApprovalTab } from '@m/pages/approvals/constant';
import { useSetState } from 'react-use';
import { useURLSearch } from '@m/lib/hooks/use-url-search';
import TabsPage, { TabTitle } from '@m/components/tabs-page';
import ApprovalsTab from '@m/pages/approvals/tab';
import Divider from '@m/qxp-ui-mobile/divider';

export default function Approvals(): JSX.Element {
  const [search, setSearch] = useURLSearch('replace');

  const [state, setState] = useSetState<ApprovalTab>({
    tabs: allList,
    active: 0,
    isApply: true,
    title: '',
  });

  useEffect(() => {
    const listType = search.get('list');
    const tagType = search.get('tagType');
    onSearchChange({ listType, tagType });
  }, []);

  function updateSearch(search: ApprovalSearch): ApprovalSearch {
    const { listType = '', tagType = '' } = search;
    const list = listType === 'all' ? 'my_applies' : listType;
    if (list) {
      setSearch({ list });
    } else if (tagType) {
      setSearch({ tagType });
    } else {
      setSearch({});
    }
    return { listType: list, tagType };
  }

  function onSearchChange(search: ApprovalSearch): void {
    const { listType, tagType } = updateSearch(search);
    let index = allList.findIndex((itm) => itm.key === listType);
    let title = '待办任务';
    let tabs = allList;
    const isApply = index > -1;
    if (isApply) {
      title = '我的申请';
    } else {
      index = allTags.findIndex((itm) => itm.key === tagType);
      tabs = allTags;
    }
    setState({
      active: index,
      isApply,
      tabs,
      title,
    });
    document.title = title;
  }

  function onActiveChange(active: number): void {
    const key = state.tabs[active].key;
    updateSearch(state.isApply ? { listType: key } : { tagType: key });
    setState({ active });
  }

  function renderTab(tab: TabTitle): JSX.Element | null {
    const approvalsTab = allTabs[tab.key];
    if (!approvalsTab) return null;
    return (
      <ApprovalsTab {...approvalsTab}/>
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
