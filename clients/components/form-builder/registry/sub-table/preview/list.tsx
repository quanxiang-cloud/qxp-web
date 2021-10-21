import React, { JSXElementConstructor } from 'react';
import { Rule } from 'rc-field-form/lib/interface';
import cs from 'classnames';
import { IMutators, InternalFieldList as FieldList, ValidatePatternRules } from '@formily/antd';

import Icon from '@c/icon';

import SubTableRow from './row';
import { useForeignFormula } from './use-foreign-formula';
import type { Layout } from '../convertor';

export type Rules = (ValidatePatternRules | ValidatePatternRules[]) & Rule[];
export type Column = {
  title: string;
  dataIndex: string;
  componentName: string;
  props: Record<string, any>;
  readOnly: boolean;
  rules: Rules;
  schema: ISchema;
  component: JSXElementConstructor<any>;
  dataSource?: any[];
  required?: boolean;
  render?: (value: unknown) => JSX.Element;
}

interface Props {
  name?: string;
  schema?: ISchema;
  value: any[];
  props: { className?: string; };
  componentColumns: Column[];
  layout: Layout;
  rowLimit: string;
  onAddRow: (mutators: IMutators) => void;
  isFromForeign: boolean;
  columns: string[];
}

export default function SubTableList({
  name, value, props: prps, componentColumns, layout, onAddRow, rowLimit, isFromForeign, columns, schema,
}: Props): JSX.Element {
  useForeignFormula(isFromForeign, columns, name, schema);

  return (
    <FieldList name={name} initialValue={value}>
      {({ state, mutators, form }) => {
        return (
          <div className={cs('w-full flex flex-col border border-gray-300', prps?.className)}>
            <div className="overflow-auto">
              {state.value.map((item: Record<string, FormDataValue>, index: number) => {
                return (
                  <SubTableRow
                    name={name}
                    componentColumns={componentColumns}
                    key={index}
                    index={index}
                    item={item}
                    form={form}
                    layout={layout}
                    mutators={mutators}
                  />
                );
              })}
            </div>
            {rowLimit === 'multiple' && (
              <div className="border-t-1 border-gray-300 flex items-center">
                <Icon
                  name="add"
                  size={24}
                  className='m-5 font-bold cursor-pointer'
                  onClick={() => onAddRow(mutators)}
                />
              </div>
            )}
          </div>
        );
      }}
    </FieldList>
  );
}
