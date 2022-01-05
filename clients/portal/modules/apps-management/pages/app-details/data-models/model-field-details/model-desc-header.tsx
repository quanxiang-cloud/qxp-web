import React from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';

import store from '../store';

function ModelDescHeader(): JSX.Element {
  const { curDataModel } = store;

  return (
    <div className="model-info-header py-4 px-16 flex items-center">
      <Icon name="models" type="light" size={32} />
      <div className="flex-1 desc">
        <span className="font-semibold">{curDataModel?.title}</span>
        <span className="truncate text-12">
          {curDataModel?.description || (
            curDataModel?.source === 1 ? `此数据模型根据表单 ${curDataModel.title} 自动生成` : '-'
          )}
        </span>
      </div>
    </div>
  );
}

export default observer(ModelDescHeader);
