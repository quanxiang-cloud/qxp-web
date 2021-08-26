import React, { useContext, useEffect, useState, useMemo } from 'react';

import FilterConfig from '@c/form-builder/form-settings-panel/form-field-config/filter-config';
import schemaToFields, { schemaToMap } from '@lib/schema-convert';
import logger from '@lib/logger';
import { toEs, toFilterConfig, ESParameter } from '@c/data-filter/utils';
import { StoreContext } from '@c/form-builder/context';

type Props = {
  associateObject?: { appID: string, tableID: string, sourceFieldId: string };
  onChange: (v: any) => void;
  value: ESParameter;
}

function StatisticalRangeConfig(props: Props): JSX.Element {
  const [customSchemaFields, setCustomSchemaFields] = useState<SchemaFieldItem[]>();
  const [formInfo, setFormInfo] = useState({ appID: '', tableID: '' });
  const { appID, tableID, sourceFieldId } = props.associateObject || {};
  const { schema } = useContext(StoreContext);

  const value = useMemo(() => props.value && toFilterConfig(props.value), [props.value]);

  useEffect(() => {
    if (!sourceFieldId) {
      return;
    }

    const schemaMap = schemaToMap(schema)[sourceFieldId];
    setCustomSchemaFields(undefined);
    switch (schemaMap['x-component']) {
    case 'AssociatedRecords':
      if (appID && tableID) {
        setFormInfo({ appID, tableID });
      } else {
        logger.error('The information is not complete');
      }
      break;
    case 'SubTable':
      setCustomSchemaFields(schemaToFields(schemaMap.items as ISchema));
      break;
    }

    return () => {
      setFormInfo({ appID: '', tableID: '' });
      setCustomSchemaFields(undefined);
    };
  }, [schema]);

  return (
    <FilterConfig
      tableID={formInfo.tableID}
      appID={formInfo.appID}
      onChange={(value) => props.onChange(toEs(value))}
      value={value}
      customSchemaFields={customSchemaFields}
    />
  );
}

export default StatisticalRangeConfig;
