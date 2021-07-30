import React, { useEffect, useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { useFormEffects, FormEffectHooks } from '@formily/antd';

import Toggle from '@c/toggle';

const { onFieldValueChange$ } = FormEffectHooks;

type ColumnsPickerProps = {
  columns: Array<{ fieldKey: string; fieldName: string; }>;
  selected: string[];
  onChange: (selected: string[]) => void;
}

type ColumnsMap = Record<string, { index: number; fieldName: string; checked: boolean; }>;

const WHITE_LIST_FIELDS = [
  'Input',
  'DatePicker',
  'NumberPicker',
  'RadioGroup',
  'MultipleSelect',
  'CheckboxGroup',
  'Select',
  'UserPicker',
  'OrganizationPicker',
  'FileUpload',
  'ImageUpload',
  'CascadeSelector',
];

function getTableFields(linkedTableSchema: ISchema): Array<{ fieldKey: string, fieldName: string; }> {
  return Object.entries(linkedTableSchema?.properties || {}).filter(([key, fieldSchema]) => {
    if (key === '_id') {
      return false;
    }

    return WHITE_LIST_FIELDS.includes(fieldSchema['x-component'] || '');
  }).map(([key, fieldSchema]) => {
    return {
      fieldKey: key,
      fieldName: (fieldSchema.title || key) as string,
    };
  });
}

function getColumnsMap(
  columns: Array<{ fieldKey: string; fieldName: string; }>,
  selected: string[],
): ColumnsMap {
  return columns.reduce<ColumnsMap>((acc, { fieldKey, fieldName }, index) => {
    acc[fieldKey] = { index, fieldName, checked: selected.includes(fieldKey) };

    return acc;
  }, {});
}

function convertColumns(columnsMap: ColumnsMap): string[] {
  return Object.entries(columnsMap).map(([fieldKey, { index, checked }]) => {
    return { fieldKey, index, checked };
  }).filter(({ checked }) => checked).sort((a, b) => {
    return a.index - b.index;
  }).map(({ fieldKey }) => fieldKey);
}

function ensureIDFieldExist(columns: string[]): string[] {
  const _columns = columns.filter((key) => key !== '_id');
  _columns.unshift('_id');
  return _columns;
}

function ColumnsPicker({ columns, selected, onChange }: ColumnsPickerProps): JSX.Element {
  const [columnsMap, setColumnsMap] = useState<ColumnsMap>(getColumnsMap(columns, selected));
  useEffect(() => {
    setColumnsMap(getColumnsMap(columns, selected));
  }, [columns]);

  useEffect(() => {
    onChange(convertColumns(columnsMap));
  }, [columnsMap]);

  function toggleCheck(key: string, checked: boolean): void {
    columnsMap[key].checked = checked;
    setColumnsMap({ ...columnsMap });
  }

  return (
    <div className="columns-picker w-full">
      {columns.map(({ fieldKey, fieldName }) => {
        return (
          <span className="flex justify-between" key={fieldKey}>
            {fieldName}
            <Toggle
              onChange={(checked) => toggleCheck(fieldKey, checked)}
              defaultChecked={selected.includes(fieldKey)}
            />
          </span>
        );
      })}
    </div>
  );
}

function AssociatedTableColumnsPicker(props: ISchemaFieldComponentProps): JSX.Element {
  const [linkedTableFields, setTableFields] = useState<Array<{ fieldKey: string; fieldName: string; }>>([]);
  useEffect(() => {
    const { associatedTable } = props.form.getFieldValue('linkedTable') || {};
    if (associatedTable) {
      setTableFields(getTableFields(associatedTable));
    }
  }, []);

  useFormEffects(() => {
    onFieldValueChange$('linkedTable').subscribe(({ value }) => {
      if (!value) {
        return;
      }

      setTableFields(getTableFields(value.associatedTable));
    });
  });

  if (!linkedTableFields.length) {
    return (
      <div>没有可显示字段</div>
    );
  }

  return (
    <ColumnsPicker
      columns={linkedTableFields}
      selected={props.value}
      onChange={(selected) => {
        const withIDFields = ensureIDFieldExist(selected);
        props.mutators.change(withIDFields);
      }}
    />
  );
}

AssociatedTableColumnsPicker.isFieldComponent = true;

export default AssociatedTableColumnsPicker;
