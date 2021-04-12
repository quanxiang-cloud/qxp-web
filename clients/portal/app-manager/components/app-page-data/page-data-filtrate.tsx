import React, { useRef } from 'react';
import { observer } from 'mobx-react';

import Button from '@c/button';
import Icon from '@c/icon';

import store from './store';

import FiltrateForm from './filtrate-form';

function PageDataFiltrate() {
  const filterDom = useRef();
  const { showMoreFiltrate, setShowMoreFiltrate } = store;

  const search = () => {
    console.log(filterDom.current.getValues());
  };

  const reset = () => {
    filterDom.current.reset();
  };

  return (
    <div className='app-page-data-container app-page-data-filtrate'>
      <FiltrateForm ref={filterDom} fieldList={store.fieldList} />
      <div>
        {showMoreFiltrate ? (
          <span onClick={() => setShowMoreFiltrate(false)} className='app-page-data-filtrate-more'>
            收起全部
            <Icon size={16} className='ml-4 app-icon-color-inherit' name='expand_less' />
          </span>
        ) : (
          <span onClick={() => setShowMoreFiltrate(true)} className='app-page-data-filtrate-more'>
              展开全部
            <Icon size={16} className='ml-4 app-icon-color-inherit' name='expand_more' />
          </span>
        )}
        <Button onClick={search} className='mr-16' modifier='primary'>查询</Button>
        <Button onClick={reset}>重置</Button>
      </div>
    </div>
  );
}

export default observer(PageDataFiltrate);
