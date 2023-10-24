import React, { useContext, useEffect, useState } from 'react';

import FilterConfig from '@c/form-builder/registry/associated-data/filter-config';
import schemaToFields, { schemaToMap } from '@lib/schema-convert';
import { StoreContext } from '@c/form-builder/context';

type Props = {
  associateObject?: { appID: string, tableID: string, sourceFieldId: string };
  onChange: (v: FilterConfig) => void;
  value: FilterConfig;
}

function StatisticalRangeConfig(props: Props): JSX.Element {
  const [customSchemaFields, setCustomSchemaFields] = useState<SchemaFieldItem[]>();
  const [formInfo, setFormInfo] = useState({ appID: '', tableID: '' });
  const { appID, tableID, sourceFieldId } = props.associateObject || {};
  const { schema } = useContext(StoreContext);

  useEffect(() => {
    if (!sourceFieldId) {
      return;
    }

    const schemaField = schemaToMap(schema)[sourceFieldId];
    setCustomSchemaFields(undefined);
    switch (schemaField?.['x-component']) {
    case 'AssociatedRecords':
      if (appID && tableID) {
        setFormInfo({ appID, tableID });
      }
      break;
    case 'SubTable':
      setCustomSchemaFields(schemaToFields(schemaField.items as ISchema));
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
      onChange={props.onChange}
      value={props.value}
      customSchemaFields={customSchemaFields}
      disFilterField = {['AssociatedData']}
    />
  );
}

export default StatisticalRangeConfig;
