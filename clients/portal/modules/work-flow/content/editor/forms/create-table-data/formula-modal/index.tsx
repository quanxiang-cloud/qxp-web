import React, { useState, useEffect } from 'react';

import Modal from '@c/modal';

import ConfigForm from './config-form';

import './style.scss';

interface Props {
  value: string;
  onClose: () => void;
  onSubmit: (val: string) => void;
}

function FormulaModal({ onClose, onSubmit, value }: Props): JSX.Element {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  function handleSubmit(): void {
    onSubmit(localValue);
  }

  function handleChange(val: string): void {
    setLocalValue(val);
  }

  return (
    <Modal
      className='webhook-formula-modal-wrapper'
      title="配置公式"
      onClose={onClose}
      footerBtns={[
        { key: 'cancel', text: '取消', onClick: onClose },
        { key: 'submit', text: '确定', onClick: handleSubmit, modifier: 'primary' },
      ]}
    >
      <ConfigForm value={localValue} onChange={handleChange} />
    </Modal>
  );
}

export default FormulaModal;
