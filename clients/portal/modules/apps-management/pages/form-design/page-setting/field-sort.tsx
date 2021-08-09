import React, { useMemo } from 'react';
import cs from 'classnames';
import { Sortable } from '@QCFE/lego-ui';

import Checkbox from '@c/checkbox';
import Icon from '@c/icon';

import './index.scss';

type Props = {
  fieldList: PageField[];
  selectKeys: string[];
  sortChange: (keys: string[]) => void;
  showOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FieldSort({ showOnChange, fieldList, sortChange, selectKeys }: Props) {
  const [selectFields, noSelectFields] = useMemo(() => {
    const selectFieldsTmp: PageField[] = [];
    const noSelectFieldsTmp: PageField[] = fieldList.filter((field) => {
      return !selectKeys.includes(field.id);
    });
    selectKeys.forEach((key) => {
      const field = fieldList.find(({ id }) => id === key);
      if (field) {
        selectFieldsTmp.push(field);
      }
    });

    return [selectFieldsTmp, noSelectFieldsTmp];
  }, [fieldList, selectKeys]);

  const renderList = (lists: PageField[], selected: boolean) => lists.map((field: PageField) => {
    return (
      <div
        className={cs('page-field-sort-item bg-white', { 'field-sort': selected })}
        key={field.id}
        data-id={field.id}
      >
        {field.label}
        <div className='page-field-sort-action'>
          <Checkbox
            value={field.id}
            checked={selected}
            onChange={showOnChange}
          />
          {selected && <Icon className='page-field-drag ml-22' clickable changeable name="drag_indicator" />}
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className='page-field-sort-title'>
        <span>字段</span>
        <span>显示</span>
      </div>
      <Sortable
        tag="div"
        options={{
          handle: '.page-field-drag',
          draggable: '.field-sort',
          animation: 150,
        }}
        onChange={sortChange}
      >
        {renderList(selectFields, true)}
        {renderList(noSelectFields, false)}
      </Sortable>
    </div>
  );
}

export default FieldSort;
