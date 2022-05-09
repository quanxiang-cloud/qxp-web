import React, { useState, useRef } from 'react';
import Popper from '@c/popper';
import { UseFiltersColumnProps } from 'react-table';

import Icon from '@c/icon';
import Button from '@c/button';
import { Radio, CheckboxOptionType, RadioChangeEvent } from 'antd';

const RadioGroup = Radio.Group;

type Props<T extends object> = {
  column: UseFiltersColumnProps<T>;
  options: CheckboxOptionType[];
};

function CheckboxFilter<T extends object>({ column, options }: Props<T>): JSX.Element {
  const popperRef = useRef<Popper>(null);
  const reference = useRef<any>(null);

  const { filterValue, setFilter } = column;

  const [selectedValue, setSelectedValue] = useState<number | undefined>(filterValue);

  function handleChange(e: RadioChangeEvent): void {
    setSelectedValue(e.target.value);
  }

  function handleReset(): void {
    setFilter('');
    setSelectedValue(undefined);
  }

  function handleConfirm(): void {
    popperRef.current?.close();
    setFilter(selectedValue);
  }

  const btnStyle = { height: 28, padding: '0 10px' };

  return (
    <>
      <Icon
        ref={reference}
        size={16}
        name='filter_alt'
      />
      <Popper
        ref={popperRef}
        reference={reference}
        placement="bottom"
        trigger="click"
      >
        <div
          className="p-16"
          style={{
            display: 'inline-block',
            boxShadow: '0px 8px 24px 4px rgb(148 163 184 / 25%)',
            borderRadius: '12px',
          }}>
          <RadioGroup
            className="flex flex-col"
            value={selectedValue}
            options={options}
            onChange={handleChange}
          />
          <div className="pt-10 flex justify-center">
            <Button
              className="mr-10"
              style={btnStyle}
              onClick={handleReset}
            >重置</Button>
            <Button
              onClick={handleConfirm}
              style={btnStyle}
            >确定</Button>
          </div>
        </div>
      </Popper>
    </>
  );
}

export default CheckboxFilter;
