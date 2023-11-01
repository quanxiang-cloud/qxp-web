import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useSearchParam, useSetState } from 'react-use';
import { useParams } from 'react-router';

import NavPage from '@m/components/nav-page';
import store from '@m/pages/new-approvals/detail/status/store';
import { Empty } from '@m/qxp-ui-mobile/empty';
import Icon from '@m/qxp-ui-mobile/icon';
import DetailStatusRow from '@m/components/flow/detail-status-row';
import { ApprovalDetailParams } from '@m/pages/new-approvals/types';
import Loading from '@m/qxp-ui-mobile/loading';

import { mapStatusDetail, StatusDetailData } from './utils';

function StatusDetail(): JSX.Element {
  const { processInstanceID } = useParams<ApprovalDetailParams>();
  const statusID = useSearchParam('id');
  const [state, setState] = useSetState<StatusDetailData>({
    title: '流程动态详情',
  });

  useEffect(() => store.setHistory, []);

  useEffect(() => {
    init();
  }, [store.history]);

  function init(): void {
    if (store.history) {
      setState(mapStatusDetail(store.history));
    } else {
      store.initHistory(processInstanceID, statusID);
    }
  }

  return (
    <NavPage title={state.title} absolute className='pb-12 pl-16 pr-12 bg-app'>
      {store.loading && <Loading className='pt-16 pb-16'>加载中...</Loading>}
      {!store.loading && store.error && (
        <Empty
          onClick={init}
          title='加载失败'
          content='请点击此处重新加载'
          image='/dist/images/no-approval-task.svg'/>
      )}

      {!store.loading && !store.error && !store.history && (
        <Empty
          onClick={init}
          title='暂无动态'
          content='暂无流程动态详情'
          image='/dist/images/no-approval-task.svg'/>
      )}

      {!store.loading && !store.error && !!store.history && (
        <>
          {!!state.warning && (
            <div className='mt-16 flex flex-nowrap text-yellow-600'>
              <Icon name='info' size='.26rem' style={{ padding: '.03rem' }} />
              <div className='flex-1 title3 ml-4'>{state.warning}</div>
            </div>
          )}

          {!!state.title1 && <div className='body2 text-secondary mt-16'>{state.title1}</div>}

          {!!state.list1?.length && state.list1.map((item, index) => {
            return (
              <DetailStatusRow
                key={item.id || index}
                {...item}
                className={(item.styleName === 'white' && index !== 0) ? 'mt-8' : 'mt-16'}
              />
            );
          })}

          {!!state.title2 && <div className='body2 text-secondary mt-16'>{state.title2}</div>}

          {!!state.list2?.length && state.list2.map((item, index) => {
            return (
              <DetailStatusRow
                key={item.id || index}
                {...item}
                className={(item.styleName === 'white' && index !== 0) ? 'mt-8' : 'mt-16'}
              />
            );
          })}
        </>
      )}
    </NavPage>
  );
}

export default observer(StatusDetail);
