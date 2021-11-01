import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Loading from '@c/loading';
import Icon from '@c/icon';

import ListContent from './list-content';
import TreeContent from './tree-content';
import NoDataContent from './no-data-content';

import store from './store';

interface Props {
  className?: string;
}

function OptionSetContent({ className }: Props): JSX.Element {
  const {
    loadingOptionSet,
    activeOptionSet,
    showNoData,
    queryType,
    fetchOptionSet,
    activeId,
  } = store;

  useEffect(() => {
    fetchOptionSet(activeId);
  }, [activeId]);

  return (
    <div className={cs('flex flex-1 flex-col overflow-auto', className)}>
      {!loadingOptionSet && activeOptionSet?.type && (
        <div className='flex min-h-52 m-16 rounded-8 datasetHeader'>
          <span className='items-center ml-20 mt-10'>
            <Icon
              size={30}
              color="white"
              name={activeOptionSet?.name === '职位' ? 'folder_shared_qxp' : 'database'}
            />
          </span>
          <div className='datasetHeader-right flex-col'>
            <div className='pt-5 ml-10 text-white font-semibold'>
              {activeOptionSet?.name || '-'}
            </div>
            <div className='ml-10 text-white text-12 truncate'>
              {activeOptionSet?.tag || (activeOptionSet && '-')}
            </div>
          </div>
        </div>
      )}
      {loadingOptionSet && <Loading />}
      {!loadingOptionSet && activeOptionSet?.type === 1 && <ListContent />}
      {!loadingOptionSet && activeOptionSet?.type === 2 && <TreeContent />}
      {!loadingOptionSet && !activeOptionSet && showNoData && <NoDataContent type={queryType} />}
    </div>
  );
}

export default observer(OptionSetContent);
