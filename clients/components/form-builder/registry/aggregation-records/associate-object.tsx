import React, { useContext } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { get } from 'lodash';

import Select from '@c/select';
import { StoreContext } from '@c/form-builder/context';
import { getTableSchema } from '@c/form-builder/utils/api';

const acceptFieldTypes = [
  'SubTable',
  'AssociatedRecords',
  'AssociatedData',
];

export type AssociateTableOptions = {
  tableID: string;
  fields: LabelValue[];
}

const getNumericFields = (properties: { [key: string]: ISchema }) => {
  return Object.entries(properties).map(([key, fieldSchema]) => {
    if (fieldSchema.type === 'number') {
      return { label: fieldSchema.title, value: key };
    }
    return false;
  }).filter(Boolean) as LabelValue[];
};

function AssociateObject(props: ISchemaFieldComponentProps): JSX.Element {
  const { schema, appID } = useContext(StoreContext);
  const selectTables = Object.entries(schema?.properties || {}).reduce((acc, [fieldName, fieldSchema]) => {
    if (acceptFieldTypes.includes(fieldSchema['x-component'] as string)) {
      acc.push({ label: fieldSchema.title as string, value: fieldName });
    }
    return acc;
  }, [] as LabelValue[]);

  const getTargetTableOptions = (fieldName: string): Promise<AssociateTableOptions | null> => {
    const fieldSchema = get(schema.properties, fieldName, {});
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

    if (compName === 'AssociatedData') {
      const targetTableId = get(compProps, 'associationTableID', '');
      if (targetTableId) {
        return getTableSchema(appID, targetTableId).then((schema) => {
          return {
            tableID: targetTableId,
            fields: getNumericFields(get(schema, 'schema.properties', {})),
          };
        });
      }
    }
    return Promise.resolve(null);
  };

  const handleChange = (fieldName: string) => {
    getTargetTableOptions(fieldName).then((options) => {
      props.mutators.change({
        appID,
        tableID: options?.tableID || '',
        sourceFieldId: fieldName,
        fields: options?.fields || '',
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
