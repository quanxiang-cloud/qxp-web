import React, { useEffect } from 'react';
import { useSetState } from 'react-use';
import { useParams } from 'react-router';

import Divider from '@m/qxp-ui-mobile/divider';
import TabsPage, { TabTitle } from '@m/components/tabs-page';
import NavPage from '@m/components/nav-page';
import Loading from '@m/qxp-ui-mobile/loading';
import { Empty } from '@m/qxp-ui-mobile/empty';
import { ApprovalDetailParams, ApprovalDetailTab } from '@m/pages/approvals/types';
import { NumberString } from '@m/qxp-ui-mobile';

import ApprovalsDetailTab from './tab';
import ApprovalsTopicTab from './topic';
import ApprovalsStatusTab from './status';
import store from './store';
import statusStore from './status/store';
import topicStore from './topic/store';

export default function ApprovalDetail(): JSX.Element {
  const { processInstanceID, taskID, type, taskType } = useParams<ApprovalDetailParams>();

  const [state, setState] = useSetState<ApprovalDetailTab>({
    tabs: [],
    loading: false,
    error: false,
    active: '',
  });

  useEffect(() => {
    init();
    return () => {
      store.clear();
      statusStore.clear();
      topicStore.clear();
    };
  }, []);

  useEffect(() => {
    const tabs: TabTitle[] = [];

    if (store.taskDetails?.length) {
      const titles = store.taskDetails.map((task, index) => ({
        key: (task.taskId ?? '') + index,
        label: task.taskName,
      }));
      tabs.push(...titles);
    }
    if (store.canViewStatusAndMsg) {
      tabs.push({ key: 'status', label: '动态' });
    }
    if (store.canMsg) {
      tabs.push({ key: 'topic', label: '讨论' });
    }
    setState({ tabs });
  }, [store.taskDetails, store.canViewStatusAndMsg, store.canMsg]);

  function init(): void {
    setState({ loading: true, error: false });
    store.initForm(0, processInstanceID, type, taskID, taskType).then((res) => {
      setState({ loading: false, error: !res });
    });
  }

  function onActiveChange(active: NumberString): void {
    const _active = active as string;
    setState({ active: _active });
  }

  function renderTab(tab: TabTitle, index: number): JSX.Element | null {
    if (!state.tabs.length) return null;
    const height = `calc(100vh - 0.44rem ${state.tabs.length > 1 ? '- 0.42rem - 1px ' : ''})`;
    const active = state.active ? state.active === tab.key : index === 0;
    switch (tab.key) {
    case 'status':
      return <ApprovalsStatusTab height={height} active={active}/>;
    case 'topic':
      return <ApprovalsTopicTab height={height} active={active}/>;
    }
    return <ApprovalsDetailTab height={height} index={index} active={active} />;
  }

  return (
    <>
      {(state.loading || state.error) && (
        <NavPage title={store.title || '流程详情'} absolute className='flex flex-col'>
          {state.loading && <Loading className='pt-16 pb-16'>加载中...</Loading>}
          {!state.loading && state.error && (
            <Empty
              onClick={init}
              title='加载失败'
              content='请点击此处重新加载'
              image='/dist/images/no-approval-task.svg'/>
          )}
        </NavPage>
      )}

      {!state.loading && !state.error && (
        <>
          {state.tabs.length > 1 && (
            <TabsPage
              absolute
              useTabName
              tabs={state.tabs}
              active={state.active}
              className='w-full'
              title={store.title || '流程详情'}
              renderTab={renderTab}
              onChange={onActiveChange}
              navBottom={<Divider color='var(--gray-200)'/>}
            />
          )}
          {
            state.tabs.length === 1 && (
              <NavPage title={store.title || '流程详情'} absolute className='flex flex-col'>
                {renderTab(state.tabs[0], 0)}
              </NavPage>
            )
          }
          {
            state.tabs.length < 1 && (
              <NavPage title={store.title || '流程详情'} absolute className='flex flex-col'>
                <Empty
                  onClick={init}
                  title='无流程详情'
                  content='暂无流程详情'
                  image='/dist/images/no-approval-task.svg'
                />
              </NavPage>
            )
          }
        </>
      )}
    </>
  );
}
