import React, { useEffect, useState, useMemo } from 'react';
import { UnionColumn } from 'react-table';
import cs from 'classnames';

import { Table } from '@one-for-all/headless-ui';
import { DEFAULT_WIDTH } from '@c/table/utils';
import schemaToFields from '@lib/schema-convert';
import { FormDataSubTableValueRenderer } from '@c/form-data-value-renderer';
import { getTableSchema } from '@lib/http-client';

type Props = {
  value: Record<string, any>[];
  schema: ISchema;
  className?: string;
}

const DEFAULT_COMP_WIDTH = {
  FileUpload: 40,
  ImageUpload: 60,
};
const DEFAULT_GAP = 50;

function ReadOnlySubTable({ value, schema: definedSchema, className }: Props): JSX.Element {
  const [schema, setSchema] = useState<ISchema | undefined>();
  const {
    subordination, columns, appID, tableID,
  } = definedSchema?.['x-component-props'] || {};
  const isFromForeign = subordination === 'foreign_table';

  useEffect(() => {
    if (isFromForeign) {
      getTableSchema(appID, tableID).then((res) => {
        setSchema(res?.schema);
      });
      return;
    }

    setSchema(definedSchema?.items as ISchema);
  }, []);

  const componentColumns = useMemo(() => {
    if (!schema) {
      return [] as UnionColumn<any>[];
    }

    return schemaToFields(schema).reduce<UnionColumn<any>[]>((acc, field) => {
      const isHidden = !field.display;
      if ((isFromForeign && !columns?.includes(field.id)) || field.id === '_id' || isHidden) {
        return acc;
      }

      const _columns: UnionColumn<any> = {
        Header: (field.title) as string,
        id: field.id,
        accessor: (value: Record<string, any>) =>
          (<FormDataSubTableValueRenderer value={value[field.id]} schema={field}/>),
      };

      if (field['x-component'] === 'FileUpload' || field['x-component'] === 'ImageUpload') {
        const maxLength = Math.max(...value.map((val) => val[field.id]?.length ?? 0));
        const width = (DEFAULT_COMP_WIDTH[field['x-component']] * maxLength) + DEFAULT_GAP;
        _columns.width = width < DEFAULT_WIDTH ? DEFAULT_WIDTH : width;
      }

      return [
        ...acc,
        _columns,
      ] as UnionColumn<any>[];
    }, []);
  }, [schema]);

  return (
    <Table
      rowKey="_id"
      className={cs('border rounded-8', 'qxp-read-only-sub-table', className)}
      columns={componentColumns}
      data={value}
    />
  );
}

export default ReadOnlySubTable;
