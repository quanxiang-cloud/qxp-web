import React, { useEffect, useMemo } from 'react';

import Modal from '@c/modal';
import Tab from '@c/tab';
import ErrorTips from '@c/error-tips';
import Loading from '@c/loading';

import DataRange from './data-range';
import store from '../store';
import { useQueryFetchAPiAuth } from '../../utils';

function AuthDetailModal(): JSX.Element {
  const {
    data: apiAuth,
    isLoading: isFetchAPIDetailLoading,
    error: fetchAPIDetailError,
  } = useQueryFetchAPiAuth(
    store.appID,
    {
      roleID: store.currentRoleID,
      path: store.curAPI?.accessPath || '',
      uri: store.curAPI?.uri || '' }
    , {
      enabled: !!store.appID || !!store.currentRoleID,
      refetchOnMount: 'always',
    },
  );

  useEffect(() => {
    apiAuth && store.setCurAuth(apiAuth);
  }, [apiAuth]);

  const viewableData = useMemo(() => {
    return <DataRange condition={apiAuth?.condition || {}}/>;
  }, [apiAuth]);

  const items = [
    {
      id: 'viewableData',
      name: '数据过滤',
      content: viewableData,
    },
  ];

  if (isFetchAPIDetailLoading) {
    return <Loading/>;
  }

  if (fetchAPIDetailError) {
    return <ErrorTips desc='获取数据失败' />;
  }

  function onSubmit(): void {
    store.updateAPIAuth(store?.curAuth as APIAuth);
    store.showRoleDetailsModal = false;
  }

  return (
    <Modal
      title={`设置访问权限：${store?.curAPI?.title || ''}`}
      onClose={() => store.showRoleDetailsModal = false}
      className="static-modal"
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: () => store.showRoleDetailsModal = false,
        },
        {
          text: '确定',
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: onSubmit,
        },
      ]}
    >
      <Tab
        stretchNav={false}
        separator={false}
        navsClassName="overflow-auto"
        navTitleClassName="text-12"
        className="m-24"
        contentClassName="control-content"
        items={items}
      />
    </Modal>
  );
}

export default AuthDetailModal;
