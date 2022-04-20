import React, { useEffect } from 'react';

import Modal from '@c/modal';
import Tab from '@c/tab';

import DataRange from './data-range';
import OutPutRange from './output-range';
import InPutRange from './input-range';
import store from '../store';
import Loading from '@c/loading';
import { Schema } from '@lib/api-adapter/swagger-schema-official';
import { TreeNode } from '@c/headless-tree/types';

export function fieldsTreeToParams(
  // _condition: keyof Schema &{acceptable?: boolean},
  rootNode?: TreeNode<Schema &{acceptable?: boolean}>,
): { [propertyName: string]: Schema; } {
  if (!rootNode) {
    return {};
  }

  const _params: { [propertyName: string]: Schema; } = {};
  rootNode.children?.forEach((child) => {
    const { data, id } = child;
    const condition = data?.acceptable || false;
    if (condition) {
      if (data.type !== 'object') {
        _params[id] = { type: data.type };
        return;
      }
      _params[id] = {
        type: data.type,
        properties: fieldsTreeToParams(child),
      };
    }
  });
  return _params;
}

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
      id: 'outputFields',
      name: '出参范围',
      content: <OutPutRange/>,
    },
    {
      id: 'inputFields',
      name: '入参范围',
      content: <InPutRange/>,
    },
  ];

  if (store.isLoadingAuthDetails) {
    return <Loading/>;
  }

  function onSubmit(): void {
    // console.log(toJS(store.outputTreeStore?.rootNode));
    const output = fieldsTreeToParams(store.outputTreeStore?.rootNode);
    const input = fieldsTreeToParams(store.inputTreeStore?.rootNode);
    console.log(output);
    console.log(input);
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
        // navsClassName="overflow-auto"
        navTitleClassName="text-12"
        className="auth-details p-24"
        // contentClassName="control-content"
        items={items}
      />
    </Modal>
  );
}

export default AuthDetailModal;
