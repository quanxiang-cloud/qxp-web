import React, { useRef, useState } from 'react';

import DataFilter, { RefProps } from '@c/data-filter';
import Icon from '@c/icon';
import Button from '@c/button';
import ControlPopper from '@c/control-popper';

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  },
];

function AdvancedQuery({ fields, search }: any) {
  const [visible, setVisible] = useState(false);
  const [condition, setCondition] = useState<Condition[]>([]);
  const popperRef = useRef<any>();
  const reference = useRef<any>();
  const dataFilterRef = useRef<RefProps>();

  const handleEmpty = () => {
    dataFilterRef.current?.empty();
    setCondition([]);
    search({ tag: 'and', condition: [] });
    setVisible(false);
  };

  const handleSearch = () => {
    if (!dataFilterRef.current) {
      return;
    }

    const { arr, tag } = dataFilterRef.current.getDataValues();
    if (arr.length) {
      setCondition(arr);
      search({ tag, condition: arr });
      setVisible(false);
    }
  };

  return (
    <>
      <Icon
        clickable
        onClick={() => setVisible(!visible)}
        type={condition.length ? 'primary' : 'dark'}
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
          <DataFilter ref={dataFilterRef} fields={fields} />
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
