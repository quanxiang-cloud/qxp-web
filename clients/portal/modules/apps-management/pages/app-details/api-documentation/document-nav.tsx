import React, { useEffect, useState, useMemo } from 'react';
import { observer } from 'mobx-react';
import { isObject } from 'lodash';
import cs from 'classnames';

import Search from '@c/search';
import TwoLevelMenu, { NodeItem } from '@c/two-level-menu';

import store, { mapNsToNodeItem } from './store';

interface Props {
  className?: string;
  hideTitle?: boolean;
  onSelectNode?: (node: NodeItem<any>) => void;
}

function DocumentNav(props: Props): JSX.Element {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, [store.defaultActiveKey]);

  const menus = useMemo(() => {
    const form: NodeItem<DataModel> = {
      id: 'form_group',
      title: '页面表单API',
      type: 'group',
      children: [],
      root: true,
      disableSelect: true,
    };

    const dataModel: NodeItem<DataModel> = {
      id: 'data_model_group',
      title: '数据模型API',
      type: 'group',
      children: [],
      root: true,
      disableSelect: true,
    };

    store.dataModels.forEach((model) => {
      if (model.source === 1) {
        form.children?.push({
          id: model.tableID,
          title: model.title,
          type: 'leaf',
          source: model,
          parentID: 'form_group',
        });
      } else {
        dataModel.children?.push({
          id: model.tableID,
          title: model.title,
          type: 'leaf',
          source: model,
          parentID: 'data_model_group',
        });
      }
    });

    const proxyApis: NodeItem<PolyAPI.Namespace> = {
      id: 'proxy_api',
      title: '第三方代理API',
      type: 'group',
      children: [],
      root: true,
      disableSelect: true,
    };
    store.apiNsList.forEach((item) => {
      proxyApis.children?.push(mapNsToNodeItem(item));
    });

    return [form, dataModel, proxyApis];
  }, [store.dataModels, store.apiNsList]);

  return (
    <div className={cs('api-doc-details-nav rounded-tl-12 flex flex-col', props.className)}>
      {!props.hideTitle && <div className='h-44 text-gray-400 text-14 font-semibold flex items-center pl-16'>API文档</div>}
      <Search
        className="mx-8 mb-8 text-12"
        placeholder="输入目录名称..."
        onChange={store.changeKeyword}
      />
      {!loading && (
        <TwoLevelMenu<any>
          menus={menus}
          style={{
            height: 'calc(100% - 76px)',
          }}
          onSelect={(node) => {
            if (!node.disableSelect) {
              store.currentDataModel = node.source;
              if (node.source?.tableID) {
                store.tableID = node.source?.tableID || '';
              }
            }
            if (isObject(node.source) && ('parent' in node.source) && ('subCount' in node.source)) {
              if (node.hasChild && !node.childResolved) {
                store.fetchSubNamespaces(node);
              }
              // leaf ns node, fetch its apis
              if (!node.hasChild && !node.apisResolved && node.type === 'group') {
                store.fetchNsApis(node);
              }
            }

            if (node.type === 'leaf') {
              props.onSelectNode && props.onSelectNode(node);
            }
          }}
        />
      )}
    </div>
  );
}

export default observer(DocumentNav);
