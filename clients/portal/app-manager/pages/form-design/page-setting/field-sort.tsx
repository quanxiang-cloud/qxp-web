import React from 'react';
import { Sortable } from '@QCFE/lego-ui';

import Checkbox from '@c/checkbox';
import Icon from '@c/icon';

import './index.scss';

const listItems = [
  'Apple',
  'Banana',
  'Cherry',
  'Grape',
  'Guava',
  'Kiwi',
  'Lemon',
  'Melon',
  'Orange',
  'Peach',
  'Pear',
  'Strawberry',
];

function FieldSort() {
  const renderList = (lists) => lists.map((item) => (
    <div className="page-field-sort-item" key={item} data-id={item}>
      {item}
      <div className='page-field-sort-action'>
        <Checkbox />
        <Icon className='page-field-drag ml-22' clickable changeable name="drag_indicator" />
      </div>
    </div>
  ));

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
        onChange={(items) => {
          console.log('items: ', items);
        }}
      >
        {renderList(listItems)}
      </Sortable>
    </div>
  );
}

export default FieldSort;
