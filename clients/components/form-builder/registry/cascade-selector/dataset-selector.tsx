import React, { useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Select, { SelectOption } from '@c/select';

import { getDatasetNames } from '@portal/modules/system-mgmt/dataset/api';

function DatasetSelector({ mutators, value }: ISchemaFieldComponentProps): JSX.Element {
  const [options, setOptions] = React.useState<SelectOption<any>[]>([]);

  useEffect(() => {
    getDatasetNames({ type: 2 }).then(({ list }) => {
      setOptions(list.map(({ id, name }) => ({
        label: name,
        value: id,
      })));
    });
  }, []);

  return (
    <Select
      value={value}
      options={options}
      onChange={mutators.change}
    />
  );
}

DatasetSelector.isFieldComponent = true;

export default DatasetSelector;
