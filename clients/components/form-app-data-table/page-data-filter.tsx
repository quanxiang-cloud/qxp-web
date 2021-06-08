import React, { useRef, useState, useContext } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';

import Button from '@c/button';
import Icon from '@c/icon';

import FilterForm from './filter-form';
import { StoreContext } from './context';

function PageDataFilter() {
  const [showMoreFilter, setShowMoreFilter] = useState(false);
  const store = useContext(StoreContext);
  const filterKeys = Object.keys(store.filters);

  const filterDom = useRef<any>();

  const search = () => {
    if (!store.allowRequestData) {
      return;
    }

    const condition: Condition[] = [];
    const values = filterDom.current.getValues();
    Object.keys(values).forEach((key) => {
      const curFilter = store.fields.find(({ id }) => id === key);
      if (!values[key] || (Array.isArray(values[key]) && values[key].length === 0) || !curFilter) {
        return;
      }

      const _condition: Condition = { key };
      switch (curFilter?.type) {
      case 'datetime':
        const [start, end] = values[key];
        _condition.value = [moment(start).format(), moment(end).format()];
        _condition.op = 'range';
        break;
      case 'number':
        _condition.value = [Number(values[key])];
        _condition.op = 'eq';
        break;
      default:
        if (Array.isArray(values[key])) {
          _condition.value = values[key];
          _condition.op = 'in';
        } else {
          _condition.value = [values[key]];
          _condition.op = 'like';
        }
        break;
      }

      condition.push(_condition);
    });
    store.filterData = values;
    store.setParams({ condition });
  };

  const reset = () => {
    const resObj: Record<string, ''> = {};
    filterKeys.map((id) => {
      resObj[id] = '';
    });
    filterDom.current.reset(resObj);
  };

  const noFilter = filterKeys.length === 0;

  if (noFilter) {
    return null;
  }

  return (
    <div className='form-app-data-table-container form-app-data-table-filter'>
      <FilterForm ref={filterDom} showMoreFilter={showMoreFilter} />
      <div>
        {filterKeys.length > 3 ? (
          <span
            onClick={() => setShowMoreFilter(!showMoreFilter)}
            className='form-app-data-table-filter-more'
          >
            {showMoreFilter ? '收起' : '展开'}全部
            <Icon
              size={16}
              className='ml-4 app-icon-color-inherit'
              name={showMoreFilter ? 'expand_less' : 'expand_more'}
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

export default observer(PageDataFilter);
