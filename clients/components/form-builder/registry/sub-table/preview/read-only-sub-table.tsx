import React, { useEffect, useState, useMemo } from 'react';
import { UnionColumns } from 'react-table';

import Table from '@c/table';
import schemaToFields from '@lib/schema-convert';
import FormDataValueRenderer from '@c/form-data-value-renderer';
import { isEmpty } from '@lib/utils';
import { getTableSchema } from '@lib/http-client';

type Props = {
  value: Record<string, any>[];
  schema: ISchema;
  className?: string;
}

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
      return [] as UnionColumns<any>[];
    }

    return schemaToFields(schema).reduce<UnionColumns<any>[]>((acc, field) => {
      const isHidden = !field.display;
      if ((isFromForeign && !columns?.includes(field.id)) || field.id === '_id' || isHidden) {
        return acc;
      }

      return [
        ...acc,
        {
          Header: field.title,
          id: field.id,
          accessor: (value: Record<string, any>) => {
            if (isEmpty(value)) {
              return <span className='text-gray-300'>——</span>;
            }

            return <FormDataValueRenderer value={value[field.id]} schema={field} />;
          },
        },
      ] as UnionColumns<any>[];
    }, []);
  }, [schema]);

  return (
    <Table
      rowKey="_id"
      className={className}
      columns={componentColumns}
      data={value}
    />
  );
}

export default ReadOnlySubTable;
