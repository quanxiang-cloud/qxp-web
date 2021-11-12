import React, { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import cs from 'classnames';
import { useClickAway } from 'react-use';

import Icon from '@c/icon';

interface Props {
  type: boolean;
  onChange?: (value: boolean) => void;
}

const types = [true, false];

function RequiredSelector({ type, onChange }: Props): JSX.Element {
  const [referenceElRef, setReferenceElRef] = useState<HTMLDivElement | null>(null);
  const [popperElRef, setPopperElRef] = useState<HTMLUListElement | null>(null);
  const [isSelectorShow, setIsSelectorShow] = useState(false);

  const popperRef = usePopper(referenceElRef, popperElRef, {
    modifiers: [{ name: 'offset', options: { offset: [0, 4] } }],
    placement: 'bottom-start',
  });

  useEffect(() => {
    popperRef.update?.();
  }, [isSelectorShow]);

  useClickAway({ current: popperElRef }, onHideSelector);

  function onHideSelector(e: Event): void {
    !referenceElRef?.contains(e.target as HTMLElement) && setIsSelectorShow(false);
  }

  function toggle(): void {
    popperRef.update?.();
    setTimeout(() => {
      setIsSelectorShow((show) => !show);
    }, 200);
  }

  function onSelect(type: boolean) {
    return () => {
      onChange?.(type);
      setIsSelectorShow(false);
    };
  }

  return (
    <>
      <div className="flex items-center" ref={(node) => setReferenceElRef(node)}>
        <p className="capitalize text-caption-no-color-weight text-gray-900 w-52">{type}</p>
        <Icon
          clickable
          name="caret-down"
          className={cs('ml-8 transition duration-240 transform', {
            '-rotate-180': isSelectorShow,
          })}
          onClick={toggle}
        />
      </div>
      <ul
        {...popperRef.attributes.popper}
        ref={(node) => setPopperElRef(node)}
        style={{
          ...popperRef.styles.popper,
          transition: 'all .2s linear',
          boxShadow: '0 0 10px rgba(200, 200, 200, .4)',
        }}
        className={cs('bg-white z-10 rounded-8', {
          'opacity-0 pointer-events-none': !isSelectorShow,
          'opacity-1 pointer-events-auto': isSelectorShow,
        })}
      >
        {types.map((type: boolean) => {
          return (
            <li
              key={`${type}`}
              className="capitalize hover:bg-gray-100 px-6 py-8 cursor-pointer"
              onClick={onSelect(type)}
            >
              {type ? '是' : '否'}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default RequiredSelector;
