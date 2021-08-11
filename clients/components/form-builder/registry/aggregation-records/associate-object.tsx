import React, { useContext, useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { get } from 'lodash';

import Select from '@c/select';
import { StoreContext } from '@c/form-builder/context';
import schemaToFields, { schemaToMap } from '@lib/schema-convert';

const acceptFieldTypes = [
  'SubTable',
  'AssociatedRecords',
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

function AssociateObject(props: ISchemaFieldComponentProps): JSX.Element {
  const { schema, appID } = useContext(StoreContext);
  const selectTables = schemaToFields(schema).reduce((acc: LabelValue[], field) => {
    if (acceptFieldTypes.includes(field.componentName)) {
      acc.push({ label: field.title as string, value: field.id });
    }
    return acc;
  }, []);

  useEffect(() => {
    // trigger first linkage effect
    handleChange(props.value?.sourceFieldId, { initial: true });
  }, [appID]);

  const getTargetTableOptions = (fieldName: string): Promise<AssociateTableOptions | null> => {
    const fieldSchema = get(schemaToMap(schema), fieldName, {});
    const compName = get(fieldSchema, 'x-component');
    const compProps = get(fieldSchema, 'x-component-props');

    if (compName === 'SubTable') {
      const targetTableId = get(compProps, 'tableID', '');
      const subTableSchema = get(fieldSchema, 'items.properties', {});
      if (targetTableId) {
        return Promise.resolve({
          tableID: targetTableId,
          fields: getNumericFields(subTableSchema),
        });
      }
    }

    if (compName === 'AssociatedRecords') {
      const targetTableId = get(compProps, 'tableID', '');
      const associateTableSchema = get(compProps, 'associatedTable.properties', {});
      if (targetTableId) {
        return Promise.resolve({
          tableID: targetTableId,
          fields: getNumericFields(associateTableSchema),
        });
      }
    }
    return Promise.resolve(null);
  };

  const handleChange = (fieldName: string, extra?: Record<string, any>): void => {
    getTargetTableOptions(fieldName).then((options) => {
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
