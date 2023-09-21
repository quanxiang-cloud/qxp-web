/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-unsafe-optional-chaining */
import React, { useContext, useEffect, useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { StoreContext } from '@c/form-builder/context';

import Select from '@c/select';
import { getFormDataMenuList } from '@c/form-table-selector/api';
import { getTableSchema } from '@lib/http-client-form';
import schemaToFields from '@lib/schema-convert';

type Option = {
  label: string;
  value: string;
}

function LinkedTable({ mutators, value }: ISchemaFieldComponentProps): JSX.Element {
  const store = useContext(StoreContext);
  const [linkageTables, setLinkageTables] = useState<Array<Option>>([]);
  const [tableID, setTableID] = useState<string>(value?.tableID);

  useEffect(() => {
    getFormDataMenuList(store.appID).then((options) => {
      const filteredOptions = options.filter(({ value }) => value !== store.pageID);
      setLinkageTables(filteredOptions);
    });
  }, []);

  useEffect(() => {
    if (!tableID) {
      return;
    }
    getLinkedTableFields();
  }, [tableID]);

  // 获取table 关联本表的关联数据字段
  const getLinkedTableFields = async ()=>{
    const res = await getTableSchema(store.appID, tableID);
    let fields: any = [];
    if (res?.schema.properties) {
      const fieldsArr = schemaToFields(res.schema)?.filter((item: any)=>{
        const { associationTableID } = item?.['x-component-props'];
        return item?.componentName === 'associateddata' && associationTableID === store.pageID;
      });
      fields = fieldsArr?.map((item: any)=>{
        return { label: item?.title, value: item?.id };
      });
    }
    getTableSchema(store.appID, tableID).then(() => {
      mutators.change({
        tableID,
        appID: store.appID,
        linkedTableField: fields?.[0]?.value,
        tableName: linkageTables.find(({ value }) => value === tableID)?.label || tableID,
      });
    });
  };

  return (
    <Select
      defaultValue={value?.tableID}
      options={linkageTables}
      onChange={(tableID: string) => {
        setTableID(tableID);
      }}
    />
  );
}

LinkedTable.isFieldComponent = true;

export default LinkedTable;
