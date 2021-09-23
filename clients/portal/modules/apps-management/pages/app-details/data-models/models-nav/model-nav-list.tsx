import React from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import cs from 'classnames';

import store from '../store';
import ModelMoreMenu from './model-more-menu';

function ModelNavList(): JSX.Element {
  const { curDataModel, setCurDataModal, dataModelList } = store;

  return (
    <div className='flex-1 overflow-auto'>
      {dataModelList.map((model) => (
        <div
          key={model.id}
          onClick={() => setCurDataModal(model)}
          className={cs('group nav-item px-16', {
            'text-blue-600 font-semibold': model.id === curDataModel?.id,
          })}
        >
          <Icon
            size={20}
            className='text-current flex-shrink-0 mr-4'
            name={model.id === curDataModel?.id ? 'database_active' : 'database_unactive'}
          />
          <span className="truncate">{model.title}</span>
          {model.id === curDataModel?.id && <ModelMoreMenu model={model} />}
        </div>
      ))}
    </div>
  );
}

export default observer(ModelNavList);
