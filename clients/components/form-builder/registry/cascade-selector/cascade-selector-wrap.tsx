import React, { useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

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

  return (
    <CascadeSelector
      predefinedDataset={predefinedDataset}
      defaultValueFrom={defaultValueFrom}
      showFullPath={showFullPath}
      onChange={props.mutators.change}
      value={props.value}
      {...props.props['x-component-props']}
    />
  );
}

CascadeSelectorWarp.isFieldComponent = true;

export default CascadeSelectorWarp;
