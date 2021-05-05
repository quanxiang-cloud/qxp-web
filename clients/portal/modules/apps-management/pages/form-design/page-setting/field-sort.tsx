import React, { useMemo } from 'react';
import { Sortable } from '@QCFE/lego-ui';

import Checkbox from '@c/checkbox';
import Icon from '@c/icon';

import './index.scss';

type Props = {
  fieldList: PageField[];
  sortChange: (keys: string[]) => void;
  showOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FieldSort({ showOnChange, fieldList, sortChange }: Props) {
  const fieldSortList = useMemo(() => {
    const sortTmp = [...fieldList].sort((a, b) => a.sort - b.sort);
    return sortTmp;
  }, [fieldList]);

  const renderList = (lists: PageField[]) => lists.map((field: PageField) => {
    return (
      <div className="page-field-sort-item" key={field.id} data-id={field.id}>
        {field.label}
        <div className='page-field-sort-action'>
          <Checkbox
            value={field.id}
            checked={field.visible}
            onChange={showOnChange}
          />
          <Icon className='page-field-drag ml-22' clickable changeable name="drag_indicator" />
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
          draggable: '.page-field-sort-item',
          animation: 150,
        }}
        onChange={sortChange}
      >
        {renderList(fieldSortList)}
      </Sortable>
    </div>
  );
}

export default FieldSort;
