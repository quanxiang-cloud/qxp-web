import { useState, useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { uniq } from 'lodash';

import { parseJSON } from '@lib/utils';
import { getOptionSetById } from '@portal/modules/option-set/api';
import { convertEnumsToLabels } from '@c/form-builder/utils';

export default function useEnumOptions(fieldProps: ISchemaFieldComponentProps): string[] {
  const [options, setOptions] = useState<string[]>([]);
  const { datasetId } = fieldProps.props['x-component-props'];
  const defaultValueFrom = fieldProps.props['x-internal']?.defaultValueFrom;

  useEffect(() => {
    if (defaultValueFrom === 'customized') {
      // compatible with old version
      const labels: string[] = convertEnumsToLabels(fieldProps.dataSource || fieldProps.props.enum || []);
      setOptions(uniq(labels));
      return;
    }

    if (datasetId && defaultValueFrom === 'dataset') {
      getOptionSetById(datasetId).then(({ content = '' }) => {
        const labels = parseJSON<LabelValue[]>(content, []).map(({ label }) => label);
        setOptions(uniq(labels));
      });
    }
  }, [datasetId, fieldProps.props.enum, fieldProps.dataSource]);

  return options;
}
