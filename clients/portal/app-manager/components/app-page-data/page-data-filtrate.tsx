import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react';

import Button from '@c/button';
import Icon from '@c/icon';

import FiltrateForm from './filtrate-form';

type Props = {
  filtrates: PageField[];
}

function PageDataFiltrate({ filtrates }: Props) {
  const [showMoreFiltrate, setShowMoreFiltrate] = useState(false);
  const filterDom = useRef<any>();

  const search = () => {
    console.log(filterDom.current.getValues());
  };

  const reset = () => {
    filterDom.current.reset();
  };

  const noFilter = filtrates.length === 0;

  return (
    <div className='app-page-data-container app-page-data-filtrate'>
      <FiltrateForm ref={filterDom} filtrates={filtrates} showMoreFiltrate={showMoreFiltrate} />
      <div>
        {filtrates.length > 3 ? (
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
