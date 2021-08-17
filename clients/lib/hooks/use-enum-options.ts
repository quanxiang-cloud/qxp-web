import { useState, useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { parseJSON } from '@lib/utils';
import { getDatasetById } from '@portal/modules/system-mgmt/dataset/api';

export default function useEnumOptions(fieldProps: ISchemaFieldComponentProps): LabelValue[] {
  const [options, setOptions] = useState<LabelValue[]>([]);
  const { datasetId } = fieldProps.props['x-component-props'];
  const defaultValueFrom = fieldProps.props['x-internal'].defaultValueFrom;

  useEffect(() => {
    if (fieldProps.props.enum && defaultValueFrom === 'customized') {
      setOptions(fieldProps.props.enum || []);
      return;
    }

    if (datasetId && defaultValueFrom === 'dataset') {
      getDatasetById(datasetId).then(({ content = '' }) => {
        let _options = [];
        _options = parseJSON(content, []);
        setOptions(_options);
      });
    }
  }, [fieldProps.props.enum, datasetId]);

  return options;
}
