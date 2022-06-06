import React, { useContext, useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { get } from 'lodash';
import { Select } from 'antd';

import { StoreContext } from '@c/form-builder/context';
import schemaToFields, { schemaToMap } from '@lib/schema-convert';
import { getTableSchema } from '@lib/http-client-form';

const acceptFieldTypes = [
  'subtable',
  'associatedrecords',
];

export type AssociateTableOptions = {
  tableID: string;
  fields: LabelValue[];
}

const getNumericFields = (properties: Record<string, ISchema>): LabelValue[] => {
  return Object.entries(properties).map(([key, fieldSchema]) => {
    if (fieldSchema.type === 'number') {
      return { label: fieldSchema.title, value: key };
    }
    return false;
  }).filter(Boolean) as LabelValue[];
};

const getTargetTableOptions = (fieldName: string, schema: ISchema): Promise<AssociateTableOptions | null> => {
  const fieldSchema = get(schemaToMap(schema), fieldName, {});
  const compName = get(fieldSchema, 'x-component');
  const compProps = get(fieldSchema, 'x-component-props');
  const targetTableId = get(compProps, 'tableID', '');

  if (!targetTableId) {
    return Promise.resolve(null);
  }

  if (compName === 'SubTable') {
    const subordination = get(compProps, 'subordination', '');

    if (subordination === 'sub_table') {
      const subTableSchema = get(fieldSchema, 'items.properties', {});
      return Promise.resolve({
        tableID: targetTableId,
        fields: getNumericFields(subTableSchema),
      });
    }

    if (subordination === 'foreign_table') {
      const appId = get(compProps, 'appID', '');
      const targetTableFields = get(compProps, 'columns', []);
      return getTableSchema(appId, targetTableId).then((res) => {
        const targetTableSchema = res?.schema.properties || {};
        const filterTargetTableFields = Object.entries(targetTableSchema).map(([key, fieldSchema]) => {
          if (targetTableFields.includes(key) && fieldSchema.type === 'number') {
            return { label: fieldSchema.title, value: key };
          }
        }).filter(Boolean) as LabelValue[];
        return Promise.resolve({
          tableID: targetTableId,
          fields: filterTargetTableFields,
        });
      });
    }
  }

  if (compName === 'AssociatedRecords') {
    const associateTableSchema = get(compProps, 'associatedTable.properties', {});
    return Promise.resolve({
      tableID: targetTableId,
      fields: getNumericFields(associateTableSchema),
    });
  }

  return Promise.resolve(null);
};

function AssociateObject(props: ISchemaFieldComponentProps): JSX.Element {
  const { schema, appID, activeFieldId } = useContext(StoreContext);
  const selectTables = schemaToFields(schema).reduce((acc: LabelValue[], field) => {
    if (acceptFieldTypes.includes(field.componentName) && field.id !== activeFieldId) {
      acc.push({ label: field.title as string, value: field.id });
    }
    return acc;
  }, []);

  useEffect(() => {
    // trigger first linkage effect
    handleChange(props.value?.sourceFieldId, { initial: true });
  }, [appID]);

  const handleChange = (fieldName: string, extra?: Record<string, any>): void => {
    getTargetTableOptions(fieldName, schema).then((options) => {
      props.mutators.change({
        appID,
        tableID: options?.tableID || '',
        sourceFieldId: fieldName,
        fields: options?.fields || [],
        ...extra,
      });
    });
  };

  return (
    <Select
      value={props.value?.sourceFieldId}
      options={selectTables}
      onChange={handleChange}
    />
  );
}

AssociateObject.isFieldComponent = true;

export default AssociateObject;
