import React, { useEffect, useState, useMemo } from 'react';
import { observer } from 'mobx-react';

import Search from '@c/search';
import TwoLevelMenu, { NodeItem } from '@c/two-level-menu';

import store from './store';

function DocumentNav(): JSX.Element {
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
      child: [],
    };

    const dataModel: NodeItem<DataModel> = {
      id: 'data_model_group',
      title: '数据模型API',
      type: 'group',
      child: [],
    };

    store.dataModels.forEach((model) => {
      if (model.source === 1) {
        form.child?.push({
          id: model.tableID,
          title: model.title,
          type: 'leaf',
          source: model,
          parentID: 'form_group',
        });
      } else {
        dataModel.child?.push({
          id: model.tableID,
          title: model.title,
          type: 'leaf',
          source: model,
          parentID: 'data_model_group',
        });
      }
    });

    return [form, dataModel];
  }, [store.dataModels]);

  return (
    <div className='api-doc-details-nav rounded-tl-12 flex flex-col'>
      <div className='h-62 text-gray-400 text-14 font-semibold py-20 pl-16'>文档目录</div>
      <Search
        className="mx-8 mb-8"
        placeholder="输入目录名称..."
        onChange={store.changeKeyword}
      />
      {!loading && store.dataModels.length !== 0 && (
        <TwoLevelMenu<DataModel>
          menus={menus}
          onSelect={(dataModel) => {
            store.currentDataModel = dataModel.source as DataModel;
            store.tableID = dataModel.source?.tableID || '';
          }}
        />
      )}
    </div>
  );
}

export default observer(DocumentNav);
