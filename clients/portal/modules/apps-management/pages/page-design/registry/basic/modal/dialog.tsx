import React, { ForwardedRef, forwardRef } from 'react';
import { noop } from 'lodash';

import { Modal } from '@one-for-all/ui';

import { Props as ConfigProps } from './config-form';

function Dialog(props: ConfigProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element | null {
  const { children, hideFooter, okIconName, okText, cancelIconName, cancelText, ...rest } = props;

  return (
    <Modal
      {...rest}
      controlled
      wrapStyle={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
      footerBtns={hideFooter ? [] : [
        {
          key: 'close',
          iconName: cancelIconName,
          onClick: rest.onCancel || noop,
          text: cancelText,
        },
        {
          key: 'check',
          iconName: okIconName,
          modifier: 'primary',
          onClick: rest.onConfirm || noop,
          text: okText,
        },
      ]}
      ref={ref}
    >
      {children}
    </Modal>
  );
}

export default forwardRef(Dialog);
