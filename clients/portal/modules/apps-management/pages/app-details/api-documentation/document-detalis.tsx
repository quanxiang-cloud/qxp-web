import React, { useEffect } from 'react';

import Tab, { TabItem } from '@c/tab';
import EmptyTips from '@c/empty-tips';
import TextHeader from '@c/text-header';
import { DirectoryChild, PathType } from '@lib/api-collection';
import { NodeItem } from '@c/two-level-menu';
import { isApi } from '@lib/api-collection/utils';

import ApiDetails from './api-details';
import ModelFields from './model-fields';

import '../prism.css';

type Props = {
  appID: string;
  node?: NodeItem<DirectoryChild>;
  onGetApiList: (directoryPath: string, pathType?: PathType ) => void;
};

function ApiDocumentDetails({ node, appID, onGetApiList }: Props): JSX.Element {
  useEffect(() => {
    if (!node || !node.source || isApi(node.source) || node.type !== 'leaf') return;

    const { parent, name, children, pathType } = node.source;
    if (!children || !children.length) {
      onGetApiList(`${parent}/${name}`, pathType);
    }
  }, [node]);

  const getApiFullPath = (action: string): string => {
    if (!node?.source || isApi(node.source) || !node.source.children) return '';

    const selectedApi = node.source.children.find((directoryChild) => {
      if (!isApi(directoryChild)) return false;
      return directoryChild.url.endsWith(action);
    });

    if (!selectedApi || !isApi(selectedApi)) return '';
    return selectedApi.fullPath;
  };

  const getContentOfTabItem = (id: string): JSX.Element => {
    if (id !== 'fields') return <ApiDetails apiPath={getApiFullPath(id)} />;
    if (!node?.tableID || node.type !== 'leaf') return <></>;
    return <ModelFields appID={appID} tableID={node.tableID} />;
  };

  const getTabItems = (): TabItem[] => {
    const items = [{ id: 'fields', name: '全部字段' },
      { id: 'create', name: '新增' },
      { id: 'delete', name: '删除' },
      { id: 'update', name: '更新' },
      { id: 'get', name: '查询单条' },
      { id: 'search', name: '查询多条' }];

    return items.map((item) => ({
      ...item,
      content: getContentOfTabItem(item.id),
    }));
  };

  function renderMain(): JSX.Element {
    if (node?.type !== 'leaf') {
      return (
        <div className='px-20 py-20 text-14'>选择 namespace 下的 API 来查看接口文档</div>
      );
    }
    if (node?.source && isApi(node.source)) {
      return (
        <div className='px-20'>
          <ApiDetails apiPath={node.source.fullPath} />
        </div>
      );
    }

    return (
      <Tab
        items={getTabItems()}
        className='w-full h-full api-tab'
      />
    );
  }

  if (!node) {
    return <EmptyTips text='暂无数据模型' className="pt-40 m-auto" />;
  }

  return (
    <div
      className='relative flex-1 overflow-hidden bg-white rounded-tr-12 w-1 flex flex-col'
    >
      <TextHeader
        title={node?.title || '------'}
        itemTitleClassName="text-12 font-semibold"
        className="bg-gray-1000 p-16 header-background-image h-44 shadow-header rounded-t-12"
      />
      <div className='relative flex-1 overflow-auto'>
        {renderMain()}
      </div>
    </div>
  );
}

export default ApiDocumentDetails;
