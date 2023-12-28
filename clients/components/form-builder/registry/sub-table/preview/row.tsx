/* eslint-disable max-len */
import React from 'react';
import cs from 'classnames';
import { isArray } from 'lodash';
import { FormItem, IForm, IMutators } from '@formily/antd';
import { MegaLayout } from '@formily/antd-components';
import { set, lensPath } from 'ramda';

import Icon from '@c/icon';

import type { Column } from './index';
import type { Layout } from '../convertor';
import ColumnLayout from './column-layout';
import { omitParentFromSchema } from './utils';
import { FormDataSubTableValueRenderer } from '@c/form-data-value-renderer';

interface Props {
  index: number;
  componentColumns: Column[];
  item: Record<string, FormDataValue>;
  form: IForm;
  mutators: IMutators;
  layout: Layout;
  name?: string;
  removeAble?: boolean;
  linkSubTableComponentProps?: any;
  subOptionsSchema?: any;
  subTableList?: any;
  onRemove?: any;
}

export default function SubTableRow({
  index, item, componentColumns, name, form, mutators, layout, removeAble = true,
  linkSubTableComponentProps, subOptionsSchema, subTableList, onRemove,
}: Props): JSX.Element {
  function onRemoveRow(mutators: IMutators, index: number): void {
    onRemove && onRemove(item, index);
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
        componentProps={componentProps}
        name={name}
        item={item}
        onChange={onChange}
        form={form}
        blackList={blackList}
      />
    );
  }

  const { subAssociatedFields = [], subOptionsChecked = {}, subSchemaOptions = [] } = linkSubTableComponentProps || {};
  const shouLinkSubColumnsLen = (()=>{
    let num = 0;
    for (const key in subOptionsChecked) {
      if (subOptionsChecked[key]) {
        num = num + 1;
      }
    }
    return num;
  })();

  const totalColLen = componentColumns.length + shouLinkSubColumnsLen;

  const getSubTableValue = ({ linkedSubTableSelectedID, itm }: any)=>{
    const res = subTableList?.find((item: any)=>(item?._id === linkedSubTableSelectedID)) || {};
    return (
      <FormDataSubTableValueRenderer
        value={res?.[itm?.value]}
        schema={subOptionsSchema?.[itm?.value]}/>
    );
  };

  return (
    <div>
      {index === 0 && (
        <div className="flex items-start justify-between whitespace-nowrap">
          <div
            className="flex-1 grid"
            style={{
              gridTemplateColumns: `repeat(${totalColLen}, minmax(120px, 1fr))`,
            }}
          >
            {!!subAssociatedFields?.length && subSchemaOptions?.map((item: any, idx: any) => {
              return subOptionsChecked[item?.value] && (
                <div key={idx} className={cs('text-center', {
                  'border-r-1 border-gray-300': (idx + componentColumns.length) < totalColLen,
                })}>
                  {item?.label}
                </div>
              );
            })}
            {componentColumns.map(({ title, required }, idx) => (
              <div key={idx} className={cs('text-center', {
                'border-r-1 border-gray-300': idx < totalColLen,
              })}>
                {required ? (
                  <span className="mr-5" style={{ color: '#a87366' }}>*</span>
                ) : ''}
                {title}
              </div>
            ))}
          </div>
          <div className="px-22 text-center w-72">
            操作
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div
          className="flex-1 grid border-gray-300 border-t-1"
          style={{
            gridTemplateColumns: `repeat(${totalColLen}, minmax(120px, 1fr))`,
          }}
        >
          {!!subAssociatedFields?.length && subSchemaOptions?.map((itm: any, idx: any) => {
            const { linkedSubTableSelectedID } = item || {};
            return subOptionsChecked[itm?.value] && (
              <div
                key={idx}
                style={{ minHeight: 32 }}
                className={cs(
                  {
                    'border-r-1 border-gray-300': (idx + componentColumns.length) < totalColLen,
                  }, 'flex items-center justify-center subtable-column-default-item',
                )}
              >
                <MegaLayout wrapperCol={24}>
                  <span className='whitespace-nowrap' key={itm?.value}>
                    {getSubTableValue({ itm, linkedSubTableSelectedID })}
                  </span>
                </MegaLayout>
              </div>
            );
          })}
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
            const sc = set(
              lensPath(['x-internal', 'fieldPath']),
              path,
              omitParentFromSchema(schema),
            );

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
                <MegaLayout wrapperCol={24}>
                  <FormItem
                    {...prs}
                    props={{ ...prs, props: prs }}
                    schema={sc}
                    className="mx-8 my-8 w-full"
                    name={path}
                    path={path}
                    readOnly={readOnly}
                    form={form}
                    isSubTableComponent ={true}
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
                </MegaLayout>
              </div>
            );
          })}
        </div>
        <div
          className="px-22 border-gray-300 border-t-1 self-stretch flex items-center"
        >
          {removeAble ? (
            <Icon
              name="delete"
              className="w-72"
              size={28}
              clickable
              onClick={() => onRemoveRow(mutators, index)}
            />
          ) : <span className="w-28">-</span>}
        </div>
      </div>
    </div>
  );
}
