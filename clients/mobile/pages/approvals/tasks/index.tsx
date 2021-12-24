import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useSetState } from 'react-use';
import cs from 'classnames';

import {
  allList, allTabs, allTags, ApplyStatus,
  CCStatus, emptyFilter, HandleTypes,
  TitleOptions,
} from '../utils';
import { useURLSearch } from '@m/lib/hooks/use-url-search';
import TabsPage, { TabTitle } from '@m/components/tabs-page';
import Divider from '@m/qxp-ui-mobile/divider';
import DropdownMenu, { DropdownMenuInstance } from '@m/qxp-ui-mobile/dropdown-menu';
import Icon from '@m/qxp-ui-mobile/icon';
import { NumberString } from '@m/qxp-ui-mobile';
import { FlowType, ApprovalSearch, ApprovalTab, ApprovalFilter } from '../types';

import ApprovalsTab from './tab';

function getFilterType(isApply: boolean, index: number): FlowType {
  if (isApply) {
    switch (index) {
    case 0:
      return 'APPLY_PAGE';
    case 2:
      return 'CC_PAGE';
    }
  }
  return 'WAIT_HANDLE_PAGE';
}

const filterMenuHeight = 'calc(0.44rem + 0.42rem + 1px + 0.6rem)';
const titleMenuHeight = '0.44rem';
const popupStyle = { borderRadius: '0 0 .12rem .12rem', paddingBottom: '.12rem' };

export default function Approvals(): JSX.Element {
  const [search, setSearch] = useURLSearch('replace');

  const [filter, setFilter] = useSetState<Record<FlowType, ApprovalFilter>>({
    WAIT_HANDLE_PAGE: HandleTypes[0],
    APPLY_PAGE: ApplyStatus[0],
    CC_PAGE: CCStatus[0],
    HANDLED_PAGE: emptyFilter,
    ALL_PAGE: emptyFilter,
  });

  const [state, setState] = useSetState<ApprovalTab>({
    tabs: allTags,
    active: 0,
    isApply: true,
    title: '',
    type: 'APPLY_PAGE',
  });

  const [show, setShow] = useState(false);
  const [titleShow, setTitleShow] = useState(false);

  const titleDropdown = useRef<DropdownMenuInstance>() as MutableRefObject<DropdownMenuInstance>;
  const filterDropdown = useRef<DropdownMenuInstance>() as MutableRefObject<DropdownMenuInstance>;

  function onFilterClick(): void {
    filterDropdown?.current?.toggle();
  }

  function onTitleClick(): void {
    titleDropdown?.current?.toggle();
  }

  const filters = useMemo(() => {
    switch (state.type) {
    case 'WAIT_HANDLE_PAGE':
      return HandleTypes;
    case 'APPLY_PAGE':
      return ApplyStatus;
    case 'CC_PAGE':
      return CCStatus;
    }
    return [];
  }, [state.type]);

  useEffect(() => {
    const listType = search.get('list');
    const tagType = search.get('tagType');
    initSearch({ listType, tagType });
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

  function initSearch(search: ApprovalSearch): void {
    const { listType, tagType } = updateSearch(search);
    let index = allList.findIndex((itm) => itm.key === listType);
    let tabs = allList;

    const isApply = index > -1;
    if (!isApply) {
      index = allTags.findIndex((itm) => itm.key === tagType);
      tabs = allTags;
    }

    const title = TitleOptions[isApply ? 1 : 0].label;
    const type = getFilterType(isApply, index);
    setState({
      active: index,
      isApply,
      tabs,
      title,
      type,
    });
    document.title = title;
  }

  function onActiveChange(active: NumberString): void {
    const _active = active as number;
    const key = state.tabs[_active].key;
    updateSearch(state.isApply ? { listType: key } : { tagType: key });
    setState({ active: _active, type: getFilterType(state.isApply, _active) });
  }

  function onTitleChange(titleValue: NumberString): void {
    const isApply = TitleOptions[1].value === titleValue;
    initSearch(isApply ? { listType: 'my_applies' } : {});
  }

  function renderTab(tab: TabTitle): JSX.Element | null {
    const approvalsTab = allTabs[tab.key];
    if (!approvalsTab) return null;
    return (
      <ApprovalsTab
        {...approvalsTab}
        filter={filter[approvalsTab.type]}
        onFilterClick={onFilterClick}
        filterShow={show}
      />
    );
  }

  function renderTitle(): JSX.Element {
    return (
      <div onClick={onTitleClick} className='flex justify-center items-center'>
        <div className={cs('truncate', { 'text-highlight': titleShow })}>
          {state.title}
        </div>
        <Icon name='keyboard_arrow_down' size='.2rem'/>
      </div>
    );
  }

  return (
    <>
      <TabsPage
        tabs={state.tabs}
        active={state.active}
        title={renderTitle()}
        renderTab={renderTab}
        onChange={onActiveChange}
        navBottom={<Divider color='var(--gray-200)'/>}
      />
      {(show || titleShow) && (
        <div className='dropdown-top'
          style={{ height: show ? filterMenuHeight : titleMenuHeight }}
          onClick={show ? onFilterClick : onTitleClick}/>
      )}
      <DropdownMenu
        options={TitleOptions}
        value={TitleOptions[state.isApply ? 1 : 0].value}
        showPopup={titleShow}
        ref={titleDropdown}
        offset={titleMenuHeight}
        onOpen={() => setTitleShow(true)}
        onClose={() => setTitleShow(false)}
        popupStyle={popupStyle}
        onChange={
          (label, value) => onTitleChange(value)
        }/>

      <DropdownMenu
        options={filters}
        value={filter[state.type].value}
        showPopup={show}
        ref={filterDropdown}
        offset={filterMenuHeight}
        onOpen={() => setShow(true)}
        onClose={() => setShow(false)}
        popupStyle={popupStyle}
        onChange={
          (label, value) => setFilter({ [state.type]: { label, value } })
        }/>
    </>
  );
}
