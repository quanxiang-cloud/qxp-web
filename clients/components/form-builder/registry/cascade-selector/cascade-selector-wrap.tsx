import React, { useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import FormDataValueRenderer from '@c/form-data-value-renderer';

import CascadeSelector from './cascade-selector';

function CascadeSelectorWarp(props: ISchemaFieldComponentProps): JSX.Element {
  const { predefinedDataset, defaultValueFrom, showFullPath } = props.props['x-internal'];

  useEffect(() => {
    // clear cascade when change value source
    // when initialValue not undefined, is edit mode
    if (!props.initialValue) {
      props.mutators.change({ label: '', value: '' });
    }
  }, [defaultValueFrom]);

  if (props.props.readOnly) {
    return <FormDataValueRenderer value={props.value} schema={props.schema} />;
  }

  return (
    <CascadeSelector
      {...props.props['x-component-props']}
      predefinedDataset={predefinedDataset}
      defaultValueFrom={defaultValueFrom}
      showFullPath={showFullPath}
      onChange={props.mutators.change}
      value={props.value}
    />
  );
}

CascadeSelectorWarp.isFieldComponent = true;

export default CascadeSelectorWarp;
