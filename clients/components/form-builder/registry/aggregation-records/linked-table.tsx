import React, { useContext, useState } from 'react';

import { StoreContext } from '@c/form-builder/context';

import Select from '@c/select';

const WHITE_LIST_FIELDS = [
  'SubTable',
  'AssociatedRecords',
];

const WHITE_LIST_FIELDS1 = [
  'NumberPicker',
];

interface Options {
  value: string;
  label: string;
}

interface TableFields {
  [key: string]: Array<Options>;
}

interface SubTableFields {
  properties: {
    numberpicker?: ISchema;
  }
}

interface AssociatedRecords {
  associatedTable: ISchema;
}

const tableFields: TableFields = {
  select: [
    { value: '请选择', label: '请选择' },
  ],
};

function getTables(linkedTableSchema: ISchema) {
  return Object.entries(linkedTableSchema?.properties || {}).filter(([key, fieldSchema]) => {
    if (key === '_id') {
      return false;
    }
    return WHITE_LIST_FIELDS.includes(fieldSchema['x-component'] || '');
  });
}

function getLinkTable(linkedTableSchema: ISchema) {
  return getTables(linkedTableSchema).map(([key, fieldSchema]) => {
    return {
      value: key,
      label: (fieldSchema.title || key) as string,
    };
  });
}

function getTableFields(linkedTableSchema: ISchema) {
  getTables(linkedTableSchema).map(([key, fieldSchema]) => {
    if (fieldSchema['x-component'] === 'SubTable') {
      const subTableFields = fieldSchema.items as SubTableFields;
      tableFields[key] = [{
        value: key,
        label: (subTableFields.properties.numberpicker?.title) as string,
      }];
    } else {
      const associatedRecords = fieldSchema['x-component-props'] as AssociatedRecords;
      const associatedRecordsFields = Object.entries(
        associatedRecords.associatedTable?.properties || {}).filter(([key, fieldSchema]) => {
        if (key === '_id') {
          return false;
        }
        return WHITE_LIST_FIELDS1.includes(fieldSchema['x-component'] || '');
      });
      tableFields[key] = associatedRecordsFields.map(([key1, fieldSchema1]) => {
        return {
          value: key,
          label: (fieldSchema1.title || key1) as string,
        };
      });
    }
  });
}

function LinkedTable(): JSX.Element {
  const store = useContext(StoreContext);
  const aggregationTable = store.schema;
  const linkTable = getLinkTable(aggregationTable);
  getTableFields(aggregationTable);
  const [linkTableFields, setLinkTableFields] = useState<string>('请选择');
  const [tableFieldsOptions, setTableFieldsOptions] = useState<Array<{ value: string; label: string; }>>(tableFields['select']);
  const [selectedTableFields, setSelectedTableFields] = useState<string>(tableFields['select'][0].value);

  return (
    <div>
      <Select
        value={linkTableFields}
        onChange={(linkTableFields: string) => {
          const options = tableFields[linkTableFields];
          setLinkTableFields(linkTableFields);
          setTableFieldsOptions(options);
        }}
        options={linkTable}
      />
      <Select
        value={selectedTableFields}
        options={tableFieldsOptions}
        onChange={(selectedTableFields:string) => {
          setSelectedTableFields(selectedTableFields);
        }}
      />
    </div>
  );
}

LinkedTable.isFieldComponent = true;

export default LinkedTable;
