import React from 'react';
import { observer } from 'mobx-react';

import Button from '@c/button';
import RadioButtonGroup from '@c/radio/radio-button-group';

import store from '../store';
import { SCOPE } from '../../constants';

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
        currentValue={store.scopeType}
        radioBtnClass="bg-white text-12"
        onChange={(value) => {
          store.setScopeType(value as number);
        }}
        listData={[{
          label: '员工',
          value: SCOPE.STAFF,
        }, {
          label: '部门',
          value: SCOPE.DEP,
        }] as any}
      />
    </div>
  );
}

export default observer(AssociatedToolbar);
