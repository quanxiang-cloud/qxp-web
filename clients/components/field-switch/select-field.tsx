import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { Select } from 'antd';

import { parseJSON } from '@lib/utils';
import { getOptionSetById } from '@portal/modules/option-set/api';

type Props<T> = {
  fieldSchema: ISchema;
  className?: string;
  value?: any;
  onChange: (value: T) => void;
  defaultValue?: T;
  style?: React.CSSProperties;
}

function optionsConverter(initOptions: string[] | LabelValue[]): LabelValue[] {
  return initOptions.map((option) => {
    if (typeof option === 'object') {
      return option;
    }

    return {
      label: option,
      value: option,
    };
  });
}

export default function SelectField({
  className,
  value,
  fieldSchema,
  ...otherProps
}: Props<any>): JSX.Element {
  const [options, setOptions] = useState(optionsConverter((fieldSchema?.enum || []) as string[]));

  useEffect(() => {
    if (fieldSchema['x-internal']?.defaultValueFrom === 'dataset') {
      const { datasetId } = fieldSchema?.['x-component-props'] || {};
      getOptionSetById(datasetId).then(({ content = '' }) => {
        setOptions(parseJSON<LabelValue[]>(content, []).map(({ label }) => ({ label, value: label })));
      });
    }
  }, []);

  return (
    <Select
      mode='multiple'
      value={value || []}
      options={options}
      className={cs('w-full', className || '')}
      {...otherProps}
    />
  );
}
