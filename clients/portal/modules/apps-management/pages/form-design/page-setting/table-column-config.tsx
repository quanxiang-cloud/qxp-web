import React, { useMemo, useRef } from 'react';
import cs from 'classnames';
import { Slider } from 'antd';

import Popover from '@c/popover';
import ToolTip from '@c/tooltip';
import Checkbox from '@c/checkbox';
import Sortable from '@c/sortable';
import Icon from '@c/icon';
import { TableColumnConfig } from '@c/form-app-data-table/type';

import './index.scss';

type ColumnConfigView = { label: string } & TableColumnConfig;

type Props = {
  fieldList: PageField[];
  selectFields: TableColumnConfig[];
  sortChange: (keys: string[]) => void;
  onChange: (value: TableColumnConfig, type: TableColumnAction) => void;
}

type FieldItemProps = {
  field: ColumnConfigView;
  onChange: (value: TableColumnConfig, type: TableColumnAction) => void;
  selected?: boolean;
}

function FieldItem({ field, selected, onChange }: FieldItemProps): JSX.Element {
  const ref = useRef(null);
  return (
    <div
      className={cs('page-field-sort-item bg-white', { 'field-sort': selected })}
      data-id={field.id}
    >
      {field.label}
      <div className='page-field-sort-action'>
        <Checkbox
          value={field.id}
          checked={selected}
          onChange={({ target }) => onChange({
            id: target.value,
            width: 150,
          }, target.checked ? 'add' : 'del')}
        />
        {selected && (
          <>
            <Popover
              placement='auto'
              content={(
                <div
                  className='bg-white p-5 w-172 h-44 border-black-50 border rounded-4 flex gap-x-5'
                >
                  <Slider
                    tooltipVisible
                    className='flex-1'
                    onChange={(width) => onChange({ id: field.id, width: width * 3 }, 'edit')}
                    tipFormatter={(value) => (value as number) * 3}
                    min={20}
                    defaultValue={field.width ? (field.width / 3) : 50}
                  />
                </div>
              )}
            >
              <div>
                <ToolTip
                  position="top"
                  labelClassName='whitespace-nowrap'
                  label="设置列宽"
                >
                  <Icon
                    clickable
                    ref={ref}
                    changeable
                    className='rotate-90 transform mx-5'
                    size={20}
                    name='expand'
                  />
                </ToolTip>
              </div>
            </Popover>
            <Icon clickable changeable className='page-field-drag' name="drag_indicator" />
          </>
        )}
      </div>
    </div>
  );
}

function TableColumnConfig({ onChange, fieldList, sortChange, selectFields }: Props): JSX.Element {
  const _selectFields = useMemo(() => {
    const noSelectFieldsTmp: ColumnConfigView[] = [];
    const selectFieldsTmp: ColumnConfigView[] = selectFields.map((field) => {
      const selected = fieldList.find(({ id }) => id === field.id);
      return { ...field, label: selected?.label || '' };
    });

    fieldList.forEach((field) => {
      const index = selectFieldsTmp.findIndex(({ id }) => id === field.id);
      if (index === -1) {
        noSelectFieldsTmp.push({ id: field.id, label: field.label });
      }
    });

    return [...selectFieldsTmp, ...noSelectFieldsTmp].map((field, index) => {
      const _selected = index <= selectFieldsTmp.length - 1;
      return {
        id: field.id,
        forbidden: !_selected,
        render: () => (
          <FieldItem
            selected={_selected}
            key={field.id}
            field={field}
            onChange={onChange}
          />
        ),
      };
    });
  }, [selectFields, fieldList]);

  return (
    <div>
      <div className='page-field-sort-title'>
        <span>字段</span>
        <span>显示</span>
      </div>
      <Sortable
        onChange={sortChange}
        list={_selectFields}
      />
    </div>
  );
}

export default TableColumnConfig;
