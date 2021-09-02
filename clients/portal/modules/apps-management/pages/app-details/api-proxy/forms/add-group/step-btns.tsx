import React, { memo } from 'react';

import { FooterBtnProps } from '@c/modal';
import Button from '@c/button';

interface Props<T> {
  step: number;
  onPrev: (...args: any[])=> void;
  onNext: (...args: any[])=> void;
  onCancel: (...args: any[])=> void;
  onSubmit: (value: T)=> void;
}

function StepBtns({ step, onPrev, onNext, onCancel, onSubmit }: Props<any>) {
  const btns: FooterBtnProps[] = step === 0 ? [
    {
      text: '取消',
      key: 'cancel',
      iconName: 'close',
      onClick: onCancel,
    },
    {
      text: '下一步',
      key: 'next',
      iconName: 'arrow_forward',
      modifier: 'primary',
      onClick: onNext,
    },
  ] : [
    {
      text: '上一步',
      key: 'back',
      iconName: 'arrow_back',
      onClick: onPrev,
    },
    {
      text: '完成',
      key: 'confirm',
      iconName: 'check',
      modifier: 'primary',
      onClick: onSubmit,
    },
  ];

  return (
    <div className='flex justify-center mt-40 gap-x-20'>
      {btns.map(({
        className = '',
        text,
        key,
        onClick,
        ...rest
      }) => (
        <Button
          key={key}
          className={className}
          onClick={(e) => onClick(key, e)}
          {...rest}
        >
          {text}
        </Button>
      ))
      }
    </div>
  );
}

export default memo(StepBtns);
