/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Select from '@c/select';
import { getTableSchema } from '@lib/http-client-form';
import schemaToFields from '@lib/schema-convert';

type Option = {
  label: string;
  value: string;
}

function LinkedTableField({ mutators, value, props }: ISchemaFieldComponentProps): JSX.Element {
  const componentProps = props?.['x-component-props'] || {};
  const { appID, tableID, pageID } = componentProps;
  const { fieldID } = value || {};
  const [linkageTableFields, setLinkageTableFields] = useState<Array<Option>>([]);

  useEffect(()=>{
    appID && tableID && getLinkedTableFields();
  }, [appID, tableID, pageID]);

  useEffect(()=>{
    !linkageTableFields?.filter((item: any)=>item.value === fieldID) && mutators.change(undefined);
  }, [linkageTableFields]);

  // 获取table 关联本表的关联数据字段
  const getLinkedTableFields = async ()=>{
    const res = await getTableSchema(appID, tableID);
    let fields: any = [];
    if (res?.schema.properties) {
      const fieldsArr = schemaToFields(res.schema)?.filter((item: any)=>{
        const { associationTableID } = item?.['x-component-props'];
        return item?.componentName === 'associateddata' && associationTableID === pageID;
      });
      fields = fieldsArr?.map((item)=>{
        return { label: item?.title, value: item?.id };
      });
    }
    setLinkageTableFields(fields);
  };

  const handleChange = (fieldID: string) => {
    mutators.change( { fieldID } );
  };

  return (
    <Select
      key={fieldID}
      defaultValue={fieldID}
      options={linkageTableFields}
      onChange={handleChange}
    />
  );
}

LinkedTableField.isFieldComponent = true;

export default LinkedTableField;
