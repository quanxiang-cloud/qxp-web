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

function AdvancedQuery({ fields }:any) {
  const [visible, setVisible] = useState(false);
  const popperRef = useRef<any>();
  const reference = useRef<any>();
  const dataFilterRef = useRef<RefProps>();

  const optionsVisibilityChange = (visible: boolean) => {
    console.log('visible: ', visible);
  };

  const handleEmpty = () => {
    dataFilterRef.current?.empty();
  };

  const handleSearch = () => {
    dataFilterRef.current?.getDataPer().then((data)=>{
      console.log('data: ', data);
    });
  };

  return (
    <>
      <Icon
        clickable
        changeable
        onClick={() => setVisible(!visible)}
        ref={reference}
        size={30}
        name='filter_alt'
      />
      <ControlPopper
        visible={visible}
        ref={popperRef}
        reference={reference}
        placement="bottom-start"
        modifiers={modifiers}
        onVisibilityChange={optionsVisibilityChange}
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
