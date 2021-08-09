import React from 'react';

import Modal from '@c/modal';
import CheckBoxGroup from '@c/checkbox/checkbox-group';

import store from '../store';

type Props = {
  onCancel: () => void;
}

function CustomPageModal({ onCancel }: Props): JSX.Element {
  const submit = async (): Promise<void> => {
    await store.updatePerCustom();
    onCancel();
  };

  return (
    <Modal
      title='自定义页面权限'
      onClose={onCancel}
      footerBtns={[
        {
          key: 'close',
          text: '取消',
          iconName: 'close',
          onClick: onCancel,
        },
        {
          key: 'ok',
          text: '保存',
          iconName: 'check',
          modifier: 'primary',
          onClick: submit,
        },
      ]}
    >
      <div className='m-20'>
        <CheckBoxGroup
          defaultValue={store.perCustomPage}
          onChange={(fields) => store.setPerCustomPage(fields)}
          options={store.perCustomList.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
        />
      </div>
    </Modal>
  );
}

export default CustomPageModal;
