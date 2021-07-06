import React from 'react';

import './index.scss';

export const FieldSpan = (props: any) => {
  return (
    <span
      className='formula-field-span'
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
  );
};

export const operatorSpan = (props: any) => {
  return (
    <span
      className='formula-operator-span'
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
  );
};

export const funcSpan = (props: any): JSX.Element => {
  return (
    <span
      className='formula-func-span'
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
  );
};
