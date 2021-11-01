import React, { useMemo, useEffect, useState } from 'react';
import cs from 'classnames';

import FormDataValueRenderer from '@c/form-data-value-renderer';
import Loading from '@c/page-loading';
import { fetchOneFormDataWithSchema } from '@lib/http-client';
import { isEmpty } from '@lib/utils';
import schemaToFields from '@lib/schema-convert';

import GroupCard, { InfoCard } from './group-card';

import './index.scss';

type Props = {
  appID: string;
  tableID: string;
  rowID: string;
  className?: string;
  fullScreen?: boolean;
}

function FormDataDetailsCard({
  appID,
  tableID,
  rowID,
  className = '',
  fullScreen = false,
}: Props): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<{ schema: ISchema, record: Record<string, any> } | null>(null);

  const groupTitleMap: Record<string, string> = {
    LayoutGrid: '栅格分组',
    LayoutTabs: '选项卡分组',
  };

  useEffect(() => {
    setLoading(false);
    fetchOneFormDataWithSchema(appID, tableID, rowID).then(({ schemaRes, record = {} }) => {
      setLoading(false);
      if (!schemaRes) {
        return Promise.reject(new Error('没有找到表单 schema，请联系管理员。'));
      }

      setFormData({ schema: schemaRes.schema, record });
    });
  }, [appID, tableID]);

  const [details, systems, groups] = useMemo(() => {
    if (!formData) {
      return [[], []];
    }

    const { record, schema } = formData;
    const _details: FormInfoCardDataProp[] = [];
    const _systems: FormInfoCardDataProp[] = [];
    const _groups: {title: string, group:FormInfoCardDataProp[]}[] = [];

    if (!schema && appID && tableID) {
      return [[], [], []];
    }

    Object.entries(schema.properties || {}).forEach(([fieldId, fieldSchema]) => {
      const fieldKey = fieldId;
      const hasValue = record && !isEmpty(record[fieldKey]);
      if ((fieldSchema as ISchema)['x-internal']?.isSystem) {
        _systems.push({
          label: fieldSchema.title as string,
          key: fieldKey,
          value: hasValue ? (
            <FormDataValueRenderer schema={fieldSchema as ISchema} value={record?.[fieldKey]} />
          ) : <span className='text-gray-900'>—</span>,
          fieldSchema,
        });
        return;
      }
      if ((fieldSchema as ISchema)['x-internal']?.isLayoutComponent) {
        const component = (fieldSchema as ISchema)['x-component'] || '';
        const title = (fieldSchema as ISchema).title ? (fieldSchema as ISchema).title as string :
          groupTitleMap[component];
        const _group: FormInfoCardDataProp[] = [];
        schemaToFields(fieldSchema).forEach((field) => {
          const fieldKey = field.id;
          const fieldSchema = field;
          const hasValue = record && !isEmpty(record[fieldKey]);
          _group.push({
            label: fieldSchema.title as string,
            key: fieldKey,
            value: hasValue ? (
              <FormDataValueRenderer schema={fieldSchema as ISchema} value={record?.[fieldKey]} />
            ) : <span className='text-gray-900'>—</span>,
            fieldSchema,
          });
        });
        _groups.push({
          title,
          group: _group,
        });
        return;
      }
      _details.push({
        label: fieldSchema.title as string,
        key: fieldKey,
        value: hasValue ? (
          <FormDataValueRenderer schema={fieldSchema as ISchema} value={record?.[fieldKey]} />
        ) : <span className='text-gray-900'>—</span>,
        fieldSchema,
      });
    },
    );

    return [_details, _systems, _groups];
  }, [formData]);

  if (loading) {
    return (<Loading />);
  }

  return (

    <div className={cs('flex-1 overflow-auto', className)}>
      <InfoCard list={details} className={fullScreen ? 'grid-cols-4' : 'grid-cols-2'}/>

      { groups?.map((group, key) => (
        <GroupCard
          key={key}
          list={group.group}
          title={group.title || ''}
          fullScreen={fullScreen}
        />
      ))}

      <GroupCard
        key='system'
        list={systems}
        title='系统字段'
        fullScreen={fullScreen}
      />
    </div>
  );
}

export default FormDataDetailsCard;
