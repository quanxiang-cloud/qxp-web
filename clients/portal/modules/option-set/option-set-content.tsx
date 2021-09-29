import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Loading from '@c/loading';
import Icon from '@c/icon';

import ListContent from './list-content';
import TreeContent from './tree-content';

import store from './store';

interface Props {
  className?: string;
}

function OptionSetContent({ className }: Props): JSX.Element {
  useEffect(() => {
    store.fetchOptionSet(store.activeId);
  }, [store.activeId]);

  return (
    <div className={cs('flex flex-1 flex-col overflow-auto', className)}>
      <div className='flex min-h-52 m-16 rounded-8 datasetHeader'>
        <span className='items-center ml-20 mt-10'>
          <Icon
            name={store.activeOptionSet?.name === '职位' ? 'folder_shared_white' : 'dataset_white'}
            size={30}
            type='light'
          />
        </span>
        <div className='datasetHeader-right flex-col'>
          {store.activeOptionSet && (
            <>
              <div className='pt-5 ml-10 text-white font-semibold'>
                {store.activeOptionSet?.name}
              </div><div className='ml-10 text-white text-12 truncate'>
                {store.activeOptionSet?.tag || (store.activeOptionSet && '-')}
              </div>
            </>
          )}
          {!store.activeOptionSet && !store.loadingOptionSet && !!store.search && (
            <div className='flex items-center text-white text-null justify-center'>无数据</div>
          )}
        </div>
      </div>
      {store.loadingOptionSet && <Loading />}
      {!store.loadingOptionSet && store.activeOptionSet?.type === 1 && <ListContent />}
      {!store.loadingOptionSet && store.activeOptionSet?.type === 2 && <TreeContent />}
    </div>
  );
}

export default observer(OptionSetContent);
