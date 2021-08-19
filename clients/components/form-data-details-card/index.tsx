import React, { useMemo, useEffect, useState } from 'react';
import cs from 'classnames';

import Tab from '@c/tab';
import FormDataValueRenderer from '@c/form-data-value-renderer';
import Loading from '@c/page-loading';
import { findOneRecord, getTableSchema } from '@lib/http-client';
import { isEmpty } from '@lib/utils';
import schemaToFields from '@lib/schema-convert';

type FormDataProp = {
  label: string;
  key: string;
  value: any;
  fieldSchema: ISchema;
}

type Props = {
  appID: string;
  tableID: string;
  rowID: string;
  className?: string;
}

const FULL_COMP = ['AssociatedRecords', 'SubTable'];

function InfoCard({ list }: { list: FormDataProp[] }): JSX.Element {
  return (
    <div className='grid gap-20 grid-cols-2 grid-flow-row-dense'>
      {list.map(({ label, value, key, fieldSchema }) => (
        <div
          className={cs(
            'page-data-info-view',
            { 'col-span-2': FULL_COMP.includes(fieldSchema['x-component'] as string) },
          )}
          key={key}
        >
          <div className='text-body2-no-color text-gray-600'>{label}</div>
          {value}
        </div>),
      )}
    </div>
  );
}

function FormDataDetailsCard({ appID, tableID, rowID, className = '' }: Props): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<{ schema: ISchema, record: Record<string, any> } | null>(null);

  useEffect(() => {
    setLoading(false);
    Promise.all([
      getTableSchema(appID, tableID),
      findOneRecord(appID, tableID, rowID),
    ]).then(([pageSchema, record]) => {
      setLoading(false);
      if (!pageSchema) {
        return Promise.reject(new Error('没有找到表单 schema，请联系管理员。'));
      }

      setFormData({ schema: pageSchema.schema, record });
    });
  }, [appID, tableID]);

  const [details, systems] = useMemo(() => {
    if (!formData) {
      return [[], []];
    }

    const { record, schema } = formData;
    const _details: FormDataProp[] = [];
    const _systems: FormDataProp[] = [];

    if (!schema && appID && tableID) {
      return [[], []];
    }

    schemaToFields(schema).forEach((field) => {
      const fieldKey = field.id;
      const fieldSchema = field;
      const hasValue = record && !isEmpty(record[fieldKey]);
      if ((fieldSchema as ISchema)['x-internal']?.isSystem) {
        _systems.push({
          label: fieldSchema.title as string,
          key: fieldKey,
          value: hasValue ? (
            <FormDataValueRenderer schema={fieldSchema as ISchema} value={record?.[fieldKey]} />
          ) : <span className='text-gray-300'>——</span>,
          fieldSchema,
        });
        return;
      }

      _details.push({
        label: fieldSchema.title as string,
        key: fieldKey,
        value: hasValue ? (
          <FormDataValueRenderer schema={fieldSchema as ISchema} value={record?.[fieldKey]} />
        ) : <span className='text-gray-300'>——</span>,
        fieldSchema,
      });
    });

    return [_details, _systems];
  }, [formData]);

  if (loading) {
    return (<Loading />);
  }

  return (
    <Tab
      className={cs('rounded-12', className)}
      items={[
        {
          id: 'details',
          name: '详细信息',
          content: <InfoCard list={details} />,
        },
        {
          id: 'system',
          name: '系统信息',
          content: <InfoCard list={systems} />,
        },
      ]}
    />
  );
}

export default FormDataDetailsCard;
