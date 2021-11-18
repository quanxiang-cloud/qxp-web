import React, { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import cs from 'classnames';
import { useClickAway } from 'react-use';
import { isObject } from 'lodash';

import ArrowDownTrigger from './arrow-down-trigger';
import { getElementWidth } from '../utils/dom';

interface Props<T> {
  value?: T;
  options: T[];
  titleIndex?: string;
  valueIndex?: string;
  onChange?: (value: T) => void;
}

function FieldTypeSelector<T extends Record<string, unknown> | string>(
  { value, onChange, options, titleIndex, valueIndex }: Props<T>,
): JSX.Element {
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

  function onSelect(value: T) {
    return () => {
      onChange?.(value);
      setIsSelectorShow(false);
    };
  }

  const title = (titleIndex && isObject(value) ? value[titleIndex] : value) as string;

  return (
    <>
      <div className="flex items-center" ref={(node) => setReferenceElRef(node)}>
        <div className="flex items-center cursor-pointer" onClick={toggle}>
          <p className="capitalize text-caption-no-color-weight text-gray-900 w-52">{title}</p>
          <ArrowDownTrigger isContentVisible={isSelectorShow} className="ml-8" />
        </div>
      </div>
      <ul
        {...popperRef.attributes.popper}
        ref={(node) => setPopperElRef(node)}
        style={{
          ...popperRef.styles.popper,
          transition: 'all .2s linear',
          boxShadow: '0 0 10px rgba(200, 200, 200, .4)',
          width: referenceElRef ? getElementWidth(referenceElRef) : 'auto',
        }}
        className={cs('bg-white z-10 rounded-8', {
          'opacity-0 pointer-events-none': !isSelectorShow,
          'opacity-1 pointer-events-auto': isSelectorShow,
        })}
      >
        {options.map((value: T) => {
          const title = (titleIndex && isObject(value) ? value[titleIndex] : value) as string;
          const val = (valueIndex && isObject(value) ? value[valueIndex] : value) as string;
          return (
            <li
              key={val}
              className="capitalize hover:bg-gray-100 px-6 py-8 cursor-pointer"
              onClick={onSelect(value)}
            >
              {title}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default FieldTypeSelector;
