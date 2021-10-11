import React, { useRef, useState } from 'react';

import DataFilter, { RefProps } from '@c/data-filter';
import Icon from '@c/icon';
import Button from '@c/button';
import ControlPopper from '@c/control-popper';

type Props = {
  fields: SchemaFieldItem[];
  search: (params: { tag: FilterTag, condition: Condition[] }) => void;
  tag?: FilterTag;
}

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  },
];

function AdvancedQuery({ fields, search, tag }: Props): JSX.Element {
  const [conditionCount, setConditionCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const popperRef = useRef<any>();
  const reference = useRef<any>();
  const dataFilterRef = useRef<RefProps>(null);

  const handleEmpty = () => {
    dataFilterRef.current?.empty();
    search({ tag: 'must', condition: [] });
    setConditionCount(0);
    setVisible(false);
  };

  const handleSearch = () => {
    if (!dataFilterRef.current) {
      return;
    }

    const { condition, tag } = dataFilterRef.current.getDataValues();
    if (condition.length || conditionCount !== 0) {
      search({ tag, condition });
      setVisible(false);
    }
    setConditionCount(condition.length);
  };

  return (
    <>
      <Icon
        clickable
        onClick={() => setVisible(!visible)}
        type={conditionCount ? 'primary' : 'dark'}
        ref={reference}
        size={30}
        name='filter_alt'
      />
      <ControlPopper
        visible={visible}
        ref={popperRef}
        reference={reference}
        placement="auto-start"
        modifiers={modifiers}
        onClose={() => setVisible(false)}
      >
        <div className='advanced-query-container'>
          <DataFilter
            initTag={tag}
            ref={dataFilterRef}
            fields={fields}
          />
          <div className='mt-20 flex justify-end gap-x-16'>
            <Button onClick={handleEmpty} iconName='clear'>清空</Button>
            <Button onClick={handleSearch} iconName='search' modifier='primary'>筛选</Button>
          </div>
        </div>
      </ControlPopper>
    </>
  );
}

export default AdvancedQuery;
