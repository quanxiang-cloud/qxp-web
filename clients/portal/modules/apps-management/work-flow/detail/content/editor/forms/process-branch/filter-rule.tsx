import React, { ChangeEvent } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import { Input } from 'antd';

import Icon from '@c/icon';

function FilterRule({ mutators, value }: ISchemaFieldComponentProps): JSX.Element {
  const currentValue: string[] = value ? JSON.parse(value) : [];

  function onValueChange(index: number) {
    return function(e: ChangeEvent<HTMLTextAreaElement>): void {
      const value = e.target.value;
      const newValue = currentValue.map((val: string, idx: number) => {
        if (index !== idx) {
          return val || '';
        }
        return value;
      });
      mutators.change(JSON.stringify(newValue || []));
    };
  }

  function onAddRule(): void {
    const newValue = [...currentValue];
    newValue.push('');
    mutators.change(JSON.stringify(newValue || []));
  }

  function onRemoveRule(val: string, index: number): void {
    let newValue = [...currentValue];
    newValue = newValue.filter((v: string, idx: number) => index !== idx || val !== v);
    mutators.change(JSON.stringify(newValue || []));
  }

  return (
    <>
      <div className="border-b mb-20 flex justify-between items-center pb-10">
        <Icon
          name="add"
          size={24}
          className="mt-12 mb-3 font-bold cursor-pointer"
          onClick={() => onAddRule()}
        />
        <span>新增条件</span>
      </div>
      <div className="flex flex-col">
        {
          currentValue.map((item: string, index: number) => {
            return (
              <div key={index} className="w-full flex justify-between mb-20">
                <div className="flex">
                  <span className="mr-20">表达式</span>
                  <Input.TextArea
                    value={item || ''}
                    onChange={onValueChange(index)}
                  />
                </div>
                <Icon
                  className="mx-22 cursor-pointer"
                  name="delete"
                  size={20}
                  onClick={() => onRemoveRule(item, index)}
                />
              </div>
            );
          })
        }
      </div>
    </>
  );
}

FilterRule.isFieldComponent = true;

export default FilterRule;
