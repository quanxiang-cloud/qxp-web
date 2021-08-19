import React, { useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { getDefinedOne } from '@c/form-builder/utils';

import CascadeSelector from './cascade-selector';

function CascadeSelectorWarp(props: ISchemaFieldComponentProps): JSX.Element {
  const isEditable = getDefinedOne(props?.editable, props?.props.editable);
  const { predefinedDataset, defaultValueFrom, showFullPath } = props.props['x-internal'];

  useEffect(() => {
    // clear cascade when change value source
    // when initialValue not undefined, is edit mode
    if (!props.initialValue) {
      props.mutators.change({ label: '', value: '' });
    }
  }, [defaultValueFrom]);

  return (
    <CascadeSelector
      predefinedDataset={predefinedDataset}
      defaultValueFrom={defaultValueFrom}
      showFullPath={showFullPath}
      onChange={props.mutators.change}
      value={props.value}
      disabled={!isEditable}
      {...props.props['x-component-props']}
    />
  );
}

CascadeSelectorWarp.isFieldComponent = true;

export default CascadeSelectorWarp;
