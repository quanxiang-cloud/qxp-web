import React from 'react';
import { observer } from 'mobx-react';

import UserPicker from '@m/components/user-picker';
import { TextArea } from '@m/qxp-ui-mobile/input';

import store from './store';

type Props = {
    approvalTitle: string;
    title: string;
    actionName?: string;
    single?: boolean;
}

function ActionItem({ approvalTitle, title, actionName, single }: Props): JSX.Element {
  return (
    <>
      <div className='mb-8'>{title}</div>
      <UserPicker
        title={approvalTitle}
        single={single}
        onChange={(val) => store.handleUserIds = val}
      />
      {!store.isValidate && (
        <p className='caption text-red-600 mt-4'>
          {`请选择${actionName}人`}
        </p>
      )}
      <div className='mt-16 mb-8'>原因</div>
      <TextArea
        placeholder={`请输入${actionName}原因（选填）`}
        defaultValue={store.remark}
        onChange={(val) => store.remark = val}
      />
    </>
  );
}

export default observer(ActionItem);
