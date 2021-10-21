import React from 'react';
import cs from 'classnames';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { Radio } from 'antd';

import Icon from '@c/icon';
import Checkbox from '@c/checkbox';

import './index.scss';

type FieldItemProps = {
  mode: 'multiple' | 'single';
  field: any;
  onChange: (columnID: string, column: Record<string, string | boolean>) => any;
  deleteItem: (idx: number) => void;
  selected?: boolean;
}

function FieldItem({ mode = 'single', field, onChange, deleteItem, selected }: FieldItemProps): JSX.Element {
  return (
    <div
      className={cs('options-item bg-white', { 'field-sort': selected })}
      data-id={field.id}
    >
      {field.label}
      <div className='option-actions ml-16'>
        {mode === 'multiple' ? (
          <Checkbox
            className="mb-4"
            value={field.id}
            checked={selected}
            onChange={({ target }) => {
              onChange(field.id, {
                label: field.label,
                isDefault: target.checked,
              });
            }}
          />
        ) : (
          <Radio
            className="mb-4"
            value={field.id}
            checked={selected}
            onChange={() => {
              onChange(field.id, {
                label: field.label,
                isDefault: true,
              });
            }}
          />
        )}
        <Icon
          clickable
          changeable
          name="delete"
          size={20}
          className="ml-4"
          onClick={() => deleteItem(field.id)}
        />
      </div>
    </div>
  );
}

function OptionsConfig({ props, mutators, value }: ISchemaFieldComponentProps): JSX.Element {
  const { mode } = props['x-component-props'];

  function editOption(columnID: string, column: Record<string, string | boolean>): any {
    mutators.change(value.map(({ label }: any, index: number) => {
      if (index === Number(columnID)) {
        return column;
      }

      return { label: label, isDefault: false };
    }));
  }

  function editOptions(columnID: string, column: Record<string, string | boolean>): any {
    mutators.change(value.map((opt: any, index: number) => {
      if (index === Number(columnID)) {
        return column;
      }

      return opt;
    }));
  }

  function deleteOption(idx: number): void {
    mutators?.change(value.filter((op: any, index: number) => {
      return index !== idx;
    }));
  }

  return (
    <div className="w-full">
      <div className='options-config-title'>
        <span>选项</span>
        <span>默认值</span>
      </div>
      {!value.length && (
        <div className='app-no-data mt-20 text-12'>
          <img src='/dist/images/new_tips.svg' />
          暂无数据，请先编辑选项，进行添加
        </div>
      )}
      {value?.map(({ label, isDefault }: any, index: number) => {
        return (
          <FieldItem
            mode={mode}
            selected={isDefault}
            key={index}
            field={{ id: index, label: label }}
            onChange={mode === 'multiple' ? editOptions : editOption}
            deleteItem={deleteOption}
          />
        );
      })}
    </div>
  );
}

OptionsConfig.isFieldComponent = true;

export default OptionsConfig;
