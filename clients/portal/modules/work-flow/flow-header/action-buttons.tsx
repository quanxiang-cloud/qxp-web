import React, { forwardRef, Ref, MouseEvent } from 'react';
import cs from 'classnames';
import { isNode } from 'react-flow-renderer';

import Button from '@c/button';
import useObservable from '@lib/hooks/use-observable';
import toast from '@lib/toast';

import type { StoreValue } from '../content/editor/type';
import store from '../content/editor/store';

interface Props {
  onOpen: () => void;
}

function ActionButtons({ onOpen }: Props, ref?: Ref<HTMLButtonElement>): JSX.Element {
  const { status, id, elements } = useObservable<StoreValue>(store);
  const hasNodeConfig = !!elements?.filter((ele) => {
    return isNode(ele) && ele.type !== 'formData' && ele.type !== 'end';
  }).length;
  const forbidden = !id || !hasNodeConfig;

  function onConfirmTip(): void {
    if (forbidden) {
      toast.error('请先配置并保存工作流后再试');
    }
  }

  function onConfirmSubmit(e: MouseEvent): void {
    e.stopPropagation();
    onOpen();
  }

  return (
    <>
      {status === 'DISABLE' && (
        <div className={cs({ 'cursor-not-allowed': !id })} onClick={onConfirmTip}>
          <Button
            modifier="primary"
            forbidden={forbidden}
            iconName="toggle_on"
            onClick={onConfirmSubmit}
            ref={ref}
          >
            发布
          </Button>
        </div>
      )}
      {status === 'ENABLE' && (
        <Button
          forbidden={!id}
          iconName="toggle_on"
          onClick={onConfirmSubmit}
          ref={ref}
        >
          下架
        </Button>
      )}
    </>
  );
}

export default forwardRef(ActionButtons);
