import React, { useState } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Icon from '@c/icon';

import store from './store';

function DocumentNav(): JSX.Element {
  const [openApi, setOpenApi] = useState(true);

  return (
    <div className='api-doc-details-nav pt-20 rounded-tl-12'>
      <div
        className='h-40 flex items-center px-18 hover:bg-gray-100'
        onClick={() => setOpenApi(!openApi)}
      >
        <Icon
          className='mr-8 text-current flex-shrink-0'
          name={openApi ? 'arrow_drop_up' : 'arrow_drop_down' }
          size={24}
        />
        数据模型API
      </div>
      <ul className={openApi ? 'show' : 'hidden'}>
        {(store.dataModels).map((item: DataModel) => (
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
      </ul>
    </div>
  );
}

export default observer(DocumentNav);
