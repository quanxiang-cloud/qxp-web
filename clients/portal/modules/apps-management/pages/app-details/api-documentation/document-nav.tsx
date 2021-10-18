import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Collapse } from 'antd';
import cs from 'classnames';

import Search from '@c/search';

import store from './store';

function DocumentNav(): JSX.Element {
  const { Panel } = Collapse;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    setTimeout(() => {
      setLoading(true);
    }, 100);
  }, [store.defaultActiveKey]);

  return (
    <div className='api-doc-details-nav rounded-tl-12 flex flex-col'>
      <div className='h-62 text-gray-400 text-14 font-semibold py-20 pl-16'>文档目录</div>
      <Search
        className="mx-8"
        placeholder="输入目录名称..."
        onChange={store.changeKeyword}
      />
      {loading && (
        <Collapse defaultActiveKey={store.defaultActiveKey} ghost className='model-menu flex-1'>
          <Panel header="页面表单API" key="pageForm">
            {(store.dataModels).filter((dataModel) => dataModel.source === 1).map((item: DataModel) => (
              <div
                key={item.id}
                className={cs('nav-item pl-50', {
                  'bg-gray-100 text-blue-600': item.tableID === store.tableID,
                })}
                onClick={() => {
                  store.currentDataModel = item;
                  store.tableID = item.tableID;
                }}
              >
                {item.title}
              </div>
            ))}
          </Panel>
          <Panel header="数据模型API" key="dataModel">
            {(store.dataModels).filter((dataModel) => dataModel.source === 2).map((item: DataModel) => (
              <li
                key={item.id}
                className={cs('nav-item pl-50', {
                  'bg-gray-100 text-blue-600': item.tableID === store.tableID,
                })}
                onClick={() => {
                  store.currentDataModel = item;
                  store.tableID = item.tableID;
                }}
              >
                {item.title}
              </li>
            ))}
          </Panel>
        </Collapse>
      )}
    </div>
  );
}

export default observer(DocumentNav);
