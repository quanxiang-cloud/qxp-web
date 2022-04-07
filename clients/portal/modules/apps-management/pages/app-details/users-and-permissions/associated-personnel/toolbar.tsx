import React from 'react';
import { observer } from 'mobx-react';

import Button from '@c/button';
import RadioButtonGroup from '@c/radio/radio-button-group';

import store from './store';

function AssociatedToolbar(): JSX.Element {
  return (
    <div className='flex items-center justify-between mb-8 access-btn'>
      <div className="flex items-center">
        <Button
          modifier="primary"
          className="ml-2"
          iconName="link"
          onClick={()=> store.setShowPickerModal(true)}
        >
          关联员工与部门
        </Button>
        {!!store.selectUser.length && (
          <Button
            modifier="primary"
            className="ml-16"
            iconName="delete"
            onClick={() => store.deletePerGroupUser(store.selectUser)}
          >
            批量移除
          </Button>
        )}
      </div>
      <RadioButtonGroup
        currentValue={1}
        radioBtnClass="bg-white text-12"
        onChange={(value) => {
          store.setScopeType(value as number);
        }}
        listData={[{
          label: '员工',
          value: 1,
        }, {
          label: '部门',
          value: 2,
        }] as any}
      />
    </div>
  );
}

export default observer(AssociatedToolbar);
