/* eslint-disable max-len */
import React, { useRef, useState } from 'react';
import { Popover } from 'antd';

import DataFilter, { RefProps } from '@c/data-filter';
import Icon from '@c/icon';
import Button from '@c/button';
import { Params } from './store';

type Props = {
  fields: SchemaFieldItem[];
  search: (params: Params) => void;
  tag?: FilterTag;
}

function AdvancedQuery({ fields, search, tag }: Props): JSX.Element {
  const [conditionCount, setConditionCount] = useState(0);
  const reference = useRef<any>();
  const dataFilterRef = useRef<RefProps>(null);

  const handleEmpty = () => {
    dataFilterRef.current?.empty();
    search({ tag: 'must', condition: [] });
    setConditionCount(0);
  };

  const handleSearch = () => {
    if (!dataFilterRef.current) {
      return;
    }

    const { condition, tag } = dataFilterRef.current.getDataValues();
    if (condition.length || conditionCount !== 0) {
      search({ tag, condition, page: 1 });
    }
    setConditionCount(condition.length);
  };

  return (
    <Popover placement="topLeft" trigger="click" content={(
      <div className={`advanced-query-container ${window?.isMobile ? 'advanced-query-container-is-mobile' : ''}`}>
        <DataFilter
          initTag={tag}
          ref={dataFilterRef}
          fields={fields}
          isAdvancedQuery = {true}
        />
        <div className='mt-20 flex justify-end gap-x-16'>
          <Button onClick={handleEmpty} iconName='clear'>清空</Button>
          <Button onClick={handleSearch} iconName='search' modifier='primary'>筛选</Button>
        </div>
      </div>
    )} >
      <Icon
        clickable
        type={conditionCount ? 'primary' : 'dark'}
        ref={reference}
        size={30}
        name='filter_alt'
      />
    </Popover>
  );
}

export default AdvancedQuery;
