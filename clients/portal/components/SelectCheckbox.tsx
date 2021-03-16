import React from 'react';
import { Select, Icon, Tag, Checkbox, CheckboxGroup } from '@QCFE/lego-ui';

export const SelectCheckbox = () => {
  const options = [{ value: 'CentOS', label: '普通管理员' }];

  const arrowRenderer = ({
    onMouseDown,
  }: {
    onMouseDown: React.MouseEventHandler<HTMLSpanElement>;
  }) => (
    <span className="select-arrow" onMouseDown={onMouseDown}>
      <Icon name="chevron-down" size="small" clickable />
    </span>
  );

  const optionRenderer = () => (
    <span className="option-with-icon" style={{ display: 'flex', alignItems: 'center' }}>
      <CheckboxGroup
        name="states"
        defaultValue={[3]}
        // onChange={(value, name) => {
        //   console.log({ value, name });
        // }}
      >
        <Checkbox value={1}>Windows</Checkbox>
        <Checkbox value={2}>Linux</Checkbox>
        {/* <Checkbox value={3}>MacOS</Checkbox>
        <Checkbox value={4}>UNIX</Checkbox> */}
      </CheckboxGroup>
    </span>
  );

  const valueRenderer = () => (
    <span className="option-with-icon" style={{ display: 'flex', alignItems: 'center' }}>
      <Tag closable>Tag 2</Tag>
    </span>
  );

  return (
    <Select
      name="os"
      placeholder="请输入"
      // @ts-ignore
      arrowRenderer={arrowRenderer}
      optionRenderer={optionRenderer}
      valueRenderer={valueRenderer}
      // value={selectedValue}
      // onChange={this.handleChange}
      options={options}
    />
  );
};

export default SelectCheckbox;
