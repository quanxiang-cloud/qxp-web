import React, { useRef } from 'react';
import { observer } from 'mobx-react';

import Button from '@c/button';
import Icon from '@c/icon';

import store from './store';

import FiltrateForm from './filtrate-form';

function PageDataFiltrate() {
  const filterDom = useRef<any>();
  const { showMoreFiltrate, setShowMoreFiltrate } = store;

  const search = () => {
    console.log(filterDom.current.getValues());
  };

  const reset = () => {
    filterDom.current.reset();
  };

  const noFilter = store.filterList.length === 0;

  return (
    <div className='app-page-data-container app-page-data-filtrate'>
      <FiltrateForm ref={filterDom} filterList={store.filterList} />
      <div>
        {store.filterList.length > 3 ? (
          <span
            onClick={() => setShowMoreFiltrate(!showMoreFiltrate)}
            className='app-page-data-filtrate-more'
          >
            {showMoreFiltrate ? '收起' : '展开'}全部
            <Icon
              size={16}
              className='ml-4 app-icon-color-inherit'
              name={showMoreFiltrate ? 'expand_less' : 'expand_more'}
            />
          </span>
        ) : null}
        <Button forbidden={noFilter} onClick={search} className='mr-16' modifier='primary'>
          查询
        </Button>
        <Button forbidden={noFilter} onClick={reset}>重置</Button>
      </div>
    </div>
  );
}

export default observer(PageDataFiltrate);
