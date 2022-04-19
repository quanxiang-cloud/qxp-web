import React from 'react';
import cs from 'classnames';
import { Modal } from '@one-for-all/ui';
import { CreateViewParams, View } from '../types.d';
import ViewTypeSelector from './view-type-selector';

export type Props = {
  onCancel: () => void;
  onSubmit: (viewInfo: CreateViewParams<View>) => void;

}

function CreateViewModal({ onCancel, onSubmit }: Props): JSX.Element {
  return (
    <div className={cs()}>
      <Modal
        title="选择页面类型"
        footerBtns={[{
          key: 'close',
          iconName: 'close',
          onClick: onCancel,
          text: '取消',
        }, {
          key: 'check',
          iconName: 'check',
          modifier: 'primary',
          onClick: onCancel,
          text: '确定',
        }]}
      >
        <ViewTypeSelector onSelect={console.log} />
      </Modal>
    </div>
  );
}

export default CreateViewModal;
