import React, { useRef, useState, useContext } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';

import Button from '@c/button';
import Icon from '@c/icon';

import FiltrateForm from './filtrate-form';
import { StoreContext } from './context';

function PageDataFiltrate() {
  const [showMoreFiltrate, setShowMoreFiltrate] = useState(false);
  const store = useContext(StoreContext);
  const filtrateKeys = Object.keys(store.filtrateMaps);

  const filterDom = useRef<any>();

  const search = () => {
    if (!store.allowRequestData) {
      return;
    }

    const condition: Condition[] = [];
    const values = filterDom.current.getValues();
    Object.keys(values).forEach((key) => {
      const curFiltrate = store.fields.find(({ id }) => id === key);
      if (!values[key] || (Array.isArray(values[key]) && values[key].length === 0) || !curFiltrate) {
        return;
      }

      const _condition: Condition = { key, op: store.filtrateMaps[curFiltrate.id].compareSymbol };
      switch (curFiltrate?.type) {
      case 'datetime':
        const [start, end] = values[key];
        _condition.value = [moment(start).format(), moment(end).format()];
        break;
      case 'number':
        _condition.value = [Number(values[key])];
        break;
      default:
        if (Array.isArray(values[key])) {
          _condition.value = values[key];
        } else {
          _condition.value = [values[key]];
        }
        break;
      }

      condition.push(_condition);
    });

    store.setParams({ condition });
  };

  const reset = () => {
    const resObj: Record<string, ''> = {};
    filtrateKeys.map((id) => {
      resObj[id] = '';
    });
    filterDom.current.reset(resObj);
  };

  const noFilter = filtrateKeys.length === 0;

  if (noFilter) {
    return null;
  }

  return (
    <div className='form-app-data-table-container form-app-data-table-filtrate'>
      <FiltrateForm ref={filterDom} showMoreFiltrate={showMoreFiltrate} />
      <div>
        {filtrateKeys.length > 3 ? (
          <span
            onClick={() => setShowMoreFiltrate(!showMoreFiltrate)}
            className='form-app-data-table-filtrate-more'
          >
            {showMoreFiltrate ? '收起' : '展开'}全部
            <Icon
              size={16}
              className='ml-4 app-icon-color-inherit'
              name={showMoreFiltrate ? 'expand_less' : 'expand_more'}
            />
          </span>
        ) : null}
        <Button onClick={search} className='mr-16' modifier='primary'>
          查询
        </Button>
        <Button onClick={reset}>重置</Button>
      </div>
    </div>
  );
}

export default observer(PageDataFiltrate);
