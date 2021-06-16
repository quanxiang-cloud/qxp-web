import React, { useContext, useEffect, useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { StoreContext } from '@c/form-builder/context';

import Select from '@c/select';
// todo remove this
import {
  getLinkageTables,
} from '@c/form-builder/form-settings-panel/form-field-config/default-value-linkage-config/get-tables';
import { getTableSchema } from '@lib/http-client';

type Option = {
  label: string;
  value: string;
}

function LinkedTable({ mutators, value }: ISchemaFieldComponentProps): JSX.Element {
  const store = useContext(StoreContext);
  const [linkageTables, setLinkageTables] = useState<Array<Option>>([]);
  const [tableID, setTableID] = useState<string>(value.tableID);

  useEffect(() => {
    getLinkageTables(store.appID).then((options) => {
      const filteredOptions = options.filter(({ value }) => value !== store.pageID);
      setLinkageTables(filteredOptions);
    });
  }, []);

  useEffect(() => {
    if (!tableID) {
      return;
    }

    getTableSchema(store.appID, tableID).then(({ schema }) => {
      mutators.change({
        tableID,
        appID: store.appID,
        tableName: linkageTables.find(({ value }) => value === tableID)?.label || tableID,
        associatedTable: schema,
      });
    });
  }, [tableID]);

  return (
    <Select
      defaultValue={value.tableID}
      options={linkageTables}
      onChange={(tableID: string) => {
        setTableID(tableID);
      }}
    />
  );
}

LinkedTable.isFieldComponent = true;

export default LinkedTable;
