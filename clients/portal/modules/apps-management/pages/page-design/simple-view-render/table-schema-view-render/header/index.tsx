import React from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';

import store from '../store';

import './index.scss';

type Props = {
  onCancel?: () => void;
}

function DetailsHeader({ onCancel }: Props): JSX.Element {
  const { operationType } = store;

  return (
    <div className="app-global-header app-details-header">
      <div className='flex items-center'>
        {operationType ? (
          <>
            <div onClick={onCancel} className='corner-8-8-8-2 cursor-pointer hover:bg-gray-100'>
              <Icon
                clickable
                changeable
                size={20}
                className='text-gray-400'
                name='keyboard_backspace'
              />
              <span className="ml-6 text-gray-400 text-12">{store.tableName}</span>
            </div>
            <div className='mx-8 text-12 text-gray-600'>/</div>
            <div className="font-semibold text-gray-900 text-12">{store.operationType}</div>
          </>) : (
          <>
            <span className="font-semibold text-gray-900 text-12">{store.tableName}</span>
          </>)}
        <div>
        </div>
      </div>

    </div>
  );
}

export default observer(DetailsHeader);
