import React, { useEffect } from 'react';

import Modal from '@c/modal';
import Tab from '@c/tab';
import Loading from '@c/loading';

import DataRange from './data-range';
import OutputRange from './output-range';
import InPutRange from './input-range';
import store from '../store';
import { fieldsTreeToParams } from '../../utils';

function AuthDetailModal(): JSX.Element {
  useEffect(() => {
    store.getAPIDocWithAuth();
  }, []);

  const items = [
    {
      id: 'viewableData',
      name: '数据过滤',
      content: <DataRange />,
    },
    {
      id: 'inputFields',
      name: '入参字段范围',
      content: <InPutRange/>,
    },
    {
      id: 'outputFields',
      name: '出参字段范围',
      content: <OutputRange/>,
    },
  ];

  if (store.isLoadingAuthDetails) {
    return <Loading/>;
  }

  function onSubmit(): void {
    const output = fieldsTreeToParams(store.outputTreeStore?.rootNode);
    const input = fieldsTreeToParams(store.inputTreeStore?.rootNode);
    const _curAuth = { ...store?.curAuth, response: output, params: input };
    store.updateAPIAuth(_curAuth);
  }

  return (
    <Modal
      width={1234}
      height={804}
      title={`设置访问权限：${store?.curAPI?.title || ''}`}
      onClose={() => store.showRoleDetailsModal = false}
      className="auth-detail-modal"
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
        className="auth-details p-24"
        items={items}
        onChange={store.setCurAuthDetailTabKey }
      />
    </Modal>
  );
}

export default AuthDetailModal;
