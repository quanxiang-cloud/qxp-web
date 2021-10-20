import React, { useEffect } from 'react';
import { NumberPicker as NumberPickerAnt } from '@formily/antd-components';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

function NumberPicker(p: ISchemaFieldComponentProps): JSX.Element {
  useEffect(() => {
    const defaultValue = p.props['x-component-props']?.defaultValue;
    if (typeof defaultValue === 'number' || !isNaN(Number(defaultValue))) {
      p.mutators.change(defaultValue);
    }
  }, []);

  return (
    <NumberPickerAnt {...p} />
  );
}

NumberPicker.isFieldComponent = true;

export default NumberPicker;
