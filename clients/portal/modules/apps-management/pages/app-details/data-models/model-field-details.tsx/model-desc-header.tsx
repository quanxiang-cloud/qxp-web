import React from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';

import store from '../store';

function ModelDescHeader(): JSX.Element {
  const { curDataModel } = store;

  return (
    <div className="model-info-header py-4 px-16 flex items-center">
      <Icon name="base" type="light" size={33} />
      <div className="flex-1 desc">
        <span className="font-semibold">{curDataModel?.title}</span>
        <span className="truncate">{curDataModel?.description || '-' }</span>
      </div>
    </div>
  );
}

export default observer(ModelDescHeader);
