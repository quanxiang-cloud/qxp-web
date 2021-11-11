import React, { useState } from 'react';
import { usePopper } from 'react-popper';
import cs from 'classnames';

import Icon from '@c/icon';

interface Props {
  type: POLY_API.API_FIELD_TYPE;
  onChange?: (value: POLY_API.API_FIELD_TYPE) => void;
}

const types = ['string', 'number', 'object', 'array', 'boolean'] as POLY_API.API_FIELD_TYPE[];

function FieldTypeSelector({ type, onChange }: Props): JSX.Element {
  const [referenceElRef, setReferenceElRef] = useState<HTMLDivElement | null>(null);
  const [popperElRef, setPopperElRef] = useState<HTMLUListElement | null>(null);
  const [isSelectorShow, setIsSelectorShow] = useState(false);

  const popperRef = usePopper(referenceElRef, popperElRef, {
    modifiers: [{ name: 'offset', options: { offset: [0, 4] } }],
    placement: 'bottom-start',
  });

  function toggle(): void {
    setIsSelectorShow((show) => !show);
  }

  return (
    <>
      <div className="flex content-center" ref={(node) => setReferenceElRef(node)} onClick={toggle}>
        <span className="capitalize">{type}</span>
        <Icon name="keyword_arrow_up" className="mr-5" />
      </div>
      <ul
        {...popperRef.attributes.popper}
        ref={(node) => setPopperElRef(node)}
        style={{ ...popperRef.styles.popper }}
        className={cs('transition duration-300', {
          'opacity-0 pointer-events-none': !isSelectorShow,
          'opacity-1 pointer-events-auto': isSelectorShow,
        })}
      >
        {types.map((type: POLY_API.API_FIELD_TYPE) => {
          return (
            <li key={type} className="capitalize" onClick={() => onChange?.(type)}>{type}</li>
          );
        })}
      </ul>
    </>
  );
}

export default FieldTypeSelector;
