import React, { useRef, useState } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';

import Button from '@c/button';
import Icon from '@c/icon';

import FiltrateForm from './filtrate-form';
import store from './store';

function PageDataFiltrate() {
  const [showMoreFiltrate, setShowMoreFiltrate] = useState(false);
  const { filtrates } = store;
  const filterDom = useRef<any>();

  const search = () => {
    if (!store.allowRequestData) {
      return;
    }

    const condition: any = [];
    const values = filterDom.current.getValues();
    Object.keys(values).map((key) => {
      const curFiltrate = store.filtrates.find(({ id }) => id === key);
      if (values[key]) {
        if (curFiltrate?.type === 'date_range') {
          const { start, end } = values[key];
          values[key] = [moment(start).format(), moment(end).format()];
        } else if (curFiltrate?.type === 'date') {
          values[key] = [moment(values[key]).format()];
        } else {
          values[key] = [values[key]];
        }
      } else {
        values[key] = [];
      }
      condition.push({ key, op: 'like', value: values[key] });
    });
    store.setParams({ condition });
  };

  const reset = () => {
    const resObj: any = {};
    filtrates.map(({ id })=> {
      resObj[id] = '';
    });
    filterDom.current.reset(resObj);
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
