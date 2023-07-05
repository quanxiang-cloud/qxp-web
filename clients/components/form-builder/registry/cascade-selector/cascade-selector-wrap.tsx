import React, { useEffect } from 'react';
import { noop } from 'lodash';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import FormDataValueRenderer from '@c/form-data-value-renderer';

import CascadeSelector from './cascade-selector';

function CascadeSelectorWarp(props: ISchemaFieldComponentProps): JSX.Element {
  const { defaultValueFrom } = props.props['x-internal'];

  useEffect(() => {
    // clear cascade when change value source
    // when initialValue not undefined, is edit mode
    if (!props.initialValue) {
      if (props?.value?.value) return;
      if (props?.mutators?.change) props.mutators.change(undefined);
    }
  }, [defaultValueFrom]);

  if (props.props.readOnly) {
    return <FormDataValueRenderer value={props.value} schema={props.schema} />;
  }

  return (
    <CascadeSelector
      {...props.props['x-component-props']}
      defaultValueFrom={defaultValueFrom}
      onChange={props?.mutators?.change ? props?.mutators?.change : noop}
      value={props.value}
    />
  );
}

CascadeSelectorWarp.isFieldComponent = true;

export default CascadeSelectorWarp;
