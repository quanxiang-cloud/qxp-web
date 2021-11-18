import React, { CSSProperties, useCallback, ForwardedRef, forwardRef } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';
import store$ from '@polyApi/store';
import useObservable from '@lib/hooks/use-observable';
import { removeNode } from '@polyApi/utils';

interface Props {
  id: string;
}

function NodeRemove({ id }: Props, ref: ForwardedRef<HTMLDivElement | null>): JSX.Element {
  const elements$ = store$.value.nodes;
  const elements = useObservable<POLY_API.Element[]>(elements$);

  const style: CSSProperties = {
    boxShadow: '0px 8px 24px 4px rgba(148, 163, 184, 0.25)',
  };

  const handleRemoveNode = useCallback(() => {
    const elementToRemove = elements.find((element) => element.id === id) as POLY_API.NodeElement;
    if (!elementToRemove) {
      return;
    }
    const newElements: POLY_API.Element[] = removeNode(elementToRemove, elements);
    elements$.set(newElements);
  }, [elements, id]);

  return (
    <div
      ref={ref}
      className={cs(
        'flex justify-center items-center p-4 cursor-pointer transition duration-240 opacity-0 absolute',
        '-right-8 -top-8 bg-white rounded-full',
      )}
      onClick={handleRemoveNode}
      style={style}
    >
      <Icon name="delete" />
    </div>
  );
}

export default forwardRef<HTMLDivElement, Props>(NodeRemove);
