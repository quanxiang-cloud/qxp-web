import React, { useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Select, { SelectOption } from '@c/select';

import mockDataset from './mock-dataset';

function getDatasets(): Promise<SelectOption<any>[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDataset);
    }, 1 * 1000);
  });
}

function DatasetSelector({ mutators, value }: ISchemaFieldComponentProps): JSX.Element {
  const [options, setOptions] = React.useState<SelectOption<any>[]>([]);
  useEffect(() => {
    getDatasets().then((datasetOptions) => setOptions(datasetOptions));
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
