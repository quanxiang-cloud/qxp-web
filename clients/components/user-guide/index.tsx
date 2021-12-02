import React, { Ref, PropsWithChildren, useState, cloneElement, isValidElement, useEffect } from 'react';
import { usePopper } from 'react-popper';
import cs from 'classnames';

import './style.scss';

type Props = PropsWithChildren<{
  position: 'top' | 'bottom' | 'left' | 'right';
  content: string | JSX.Element;
  visible: boolean;
  onClose: () => void;
}>

function UserGuide({ position, content, children, visible, onClose }: Props): JSX.Element | null {
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const [popper, setPopper] = useState(null);

  useEffect(() => {
    const tr = trigger as HTMLElement;
    if (tr && 'addEventListener' in tr) {
      tr.addEventListener('click', onClose);
      return () => tr.removeEventListener('click', onClose);
    }
  }, [trigger, onClose]);

  const popperRef = usePopper(trigger, popper, {
    modifiers: [{ name: 'offset', options: { offset: [0, 4] } }],
    placement: position || 'bottom-start',
  });

  let triggerSource = null;
  if (children) {
    triggerSource = isValidElement(children) ?
      cloneElement(children, { ref: setTrigger }) :
      <span>{children}</span>;
  }

  return (
    <>
      {triggerSource}
      <div
        {...popperRef.attributes.popper}
        style={popperRef.styles.popper}
        className={cs(
          'user-guide-popper text-white transition-opacity duration-300 rounded-10 px-8 py-5',
          `user-guide-popper--${position} text-caption-no-color-weight font-semibold`,
          {
            'opacity-1 cursor-pointer': visible,
            'opacity-0 pointer-events-none cursor-default': !visible,
          },
        )}
        onClick={visible ? onClose : undefined}
        ref={setPopper as Ref<HTMLDivElement>}
      >
        {content}
      </div>
    </>
  );
}

export default UserGuide;
