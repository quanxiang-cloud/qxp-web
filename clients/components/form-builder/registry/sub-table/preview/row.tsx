import React from 'react';
import cs from 'classnames';
import { isArray } from 'lodash';
import { FormItem, IForm, IMutators } from '@formily/antd';
import { set, lensPath } from 'ramda';

import Icon from '@c/icon';

import type { Column } from './index';
import type { Layout } from '../convertor';
import ColumnLayout from './column-layout';

interface Props {
  index: number;
  componentColumns: Column[];
  item: Record<string, FormDataValue>;
  form: IForm;
  mutators: IMutators;
  layout: Layout;
  name?: string;
}

export default function SubTableRow({
  index, item, componentColumns, name, form, mutators, layout,
}: Props): JSX.Element {
  function onRemoveRow(mutators: IMutators, index: number): void {
    mutators.remove(index);
  }

  function onChange(path: string, form: IForm) {
    return (value: unknown): void => {
      form.setFieldValue(path, value);
    };
  }

  const blackList = ['userpicker', 'organizationpicker', 'datepicker'];

  if (layout && layout !== 'default') {
    return (
      <ColumnLayout
        layout={layout}
        componentColumns={componentColumns}
        name={name}
        item={item}
        onChange={onChange}
        form={form}
        blackList={blackList}
      />
    );
  }

  return (
    <div>
      {index === 0 && (
        <div className="flex items-start justify-between whitespace-nowrap">
          <div
            className="flex-1 grid"
            style={{
              gridTemplateColumns: `repeat(${componentColumns.length}, minmax(120px, 1fr))`,
            }}
          >
            {componentColumns.map(({ title, required }, idx) => (
              <div key={idx} className={cs('text-center', {
                'border-r-1 border-gray-300': idx < componentColumns.length,
              })}>
                {required ? (
                  <span className="mr-5" style={{ color: '#a87366' }}>*</span>
                ) : ''}
                {title}
              </div>
            ))}
          </div>
          <div className="px-22 text-center">
            操作
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div
          className="flex-1 grid border-gray-300 border-t-1"
          style={{
            gridTemplateColumns: `repeat(${componentColumns.length}, minmax(120px, 1fr))`,
          }}
        >
          {componentColumns.map(({
            dataIndex, component, props: prs, dataSource, required, rules, schema, readOnly, render, componentName,
          }, idx) => {
            const path = `${name}.${index}.${dataIndex}`;
            let value = item?.[dataIndex];
            if (schema.type === 'array') {
              value = isArray(value) ? value : [value].filter(Boolean) as FormDataValue;
            }
            prs['x-internal'] = { ...prs['x-internal'], fieldPath: path };
            Object.assign(schema, { fieldPath: path });
            const sc = set(lensPath(['x-internal', 'fieldPath']), path, JSON.parse(JSON.stringify(schema)));

            return (
              <div
                key={dataIndex}
                style={{ minHeight: 32 }}
                className={cs(
                  {
                    'border-r-1 border-gray-300': idx < componentColumns.length,
                  }, 'flex items-center justify-center subtable-column-default-item',
                )}
              >
                <FormItem
                  {...prs}
                  props={{ ...prs, props: prs }}
                  schema={sc}
                  className="mx-8 my-8 w-full"
                  name={path}
                  path={path}
                  readOnly={readOnly}
                  form={form}
                  mutators={{ change: onChange(path, form) }}
                  rules={rules}
                  dataSource={dataSource}
                  required={required}
                  value={value}
                  component={
                    readOnly && !blackList.includes(componentName) ?
                      ({ value }) => render?.(value) || null : component
                  }
                />
              </div>
            );
          })}
        </div>
        <div
          className="px-22 border-gray-300 border-t-1 self-stretch flex items-center"
        >
          <Icon
            name="delete"
            size={29}
            clickable
            onClick={() => onRemoveRow(mutators, index)}
          />
        </div>
      </div>
    </div>
  );
}
