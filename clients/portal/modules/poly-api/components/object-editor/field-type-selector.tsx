import React from 'react';

import SelectValue from '../select-value';

interface Props {
  type: POLY_API.API_FIELD_TYPE;
  onChange?: (value: POLY_API.API_FIELD_TYPE) => void;
  simple?: boolean;
}

const types = ['string', 'number', 'object', 'array', 'boolean'] as POLY_API.API_FIELD_TYPE[];

function FieldTypeSelector({ type, onChange, simple }: Props): JSX.Element {
  return (
    <SelectValue<POLY_API.API_FIELD_TYPE>
      options={simple ? types.filter((type) => type !== 'array' && type !== 'object') : types}
      onChange={onChange}
      value={type}
    />
  );
}

export default FieldTypeSelector;
