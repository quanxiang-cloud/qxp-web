import React, { useEffect, useContext } from 'react';
import cs from 'classnames';
import { InternalFieldList as FieldList } from '@formily/antd';
import { IMutators } from '@formily/react-schema-renderer';

import Icon from '@c/icon';
import CanvasContext from '@c/form-builder/canvas-context';
import { isEmpty } from '@lib/utils';

import SubTableRow from './row';
import { useForeignFormula } from './use-foreign-formula';
import { Column } from './index';

type Props = {
  schema?: ISchema;
  value: Record<string, unknown>[];
  name?: string;
  mutators?: IMutators;
  className: string;
  rowPlaceHolder: Record<string, unknown>;
  componentColumns: Column[];
  isFromForeign: boolean;
  columns: any;
  rowLimit: string;
}

function SubTable({
  schema,
  value,
  name,
  mutators,
  className,
  rowPlaceHolder,
  componentColumns,
  isFromForeign,
  columns,
  rowLimit,
}: Props): JSX.Element {
  const { isInCanvas } = useContext(CanvasContext);
  const isPortal = window.SIDE === 'portal';
  const portalReadOnlyClassName = cs({ 'pointer-events-none': isPortal && isInCanvas });
  const isInitialValueEmpty = value?.every((v: Record<string, unknown>) => isEmpty(v));
  function onAddRow(mutators: IMutators): void {
    mutators.push(rowPlaceHolder);
  }
  useForeignFormula(isFromForeign, columns, name, schema);

  useEffect(() => {
    isPortal && isInCanvas && isInitialValueEmpty && mutators?.change([rowPlaceHolder]);
  }, [isPortal, isInCanvas, value]);

  useEffect(() => {
    isInitialValueEmpty && mutators?.change([rowPlaceHolder]);
  }, []);

  return (
    <FieldList name={name} initialValue={value}>
      {({ state, mutators, form }) => {
        return (
          <div className={cs('w-full flex flex-col border border-gray-300', className)}>
            <div className="overflow-scroll">
              {state.value.map((item: Record<string, FormDataValue>, index: number) => {
                return (
                  <SubTableRow
                    name={name}
                    componentColumns={componentColumns}
                    key={index}
                    index={index}
                    item={item}
                    form={form}
                    mutators={mutators}
                    portalReadOnlyClassName={portalReadOnlyClassName}
                  />
                );
              })}
            </div>
            <div className="border-t-1 border-gray-300 flex items-center">
              {rowLimit === 'multiple' && (
                <Icon
                  name="add"
                  size={24}
                  className={
                    cs('m-5 font-bold cursor-pointer', portalReadOnlyClassName)
                  }
                  onClick={() => onAddRow(mutators)}
                />
              )}
            </div>
          </div>
        );
      }}
    </FieldList>
  );
}

export default SubTable;
