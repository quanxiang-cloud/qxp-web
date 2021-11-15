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
    LayoutGrid: '栅格',
    LayoutTabs: '选项卡',
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

  const [systems, formDatas] = useMemo(() => {
    if (!formData) {
      return [[], []];
    }

    const { record, schema } = formData;

    if (!schema && appID && tableID) {
      return [[], []];
    }

    const _systems: FormInfoCardDataProp[] = [];
    const _formDatas: FormDetailData[] = [];
    const tempSchema = Object.entries(schema.properties || {}).sort((schemaA, schemaB) => {
      return (schemaA[1]?.['x-index'] || 0) - (schemaB[1]?.['x-index'] || 0);
    });

    tempSchema.forEach(([fieldId, fieldSchema]) => {
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
        const fieldSchemaTemp = schemaToFields(fieldSchema).sort((fieldSchemaA, fieldSchemaB) => {
          return (fieldSchemaA?.['x-index'] || 0) - (fieldSchemaB?.['x-index'] || 0);
        });
        fieldSchemaTemp.forEach((field) => {
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
        _formDatas.push({
          type: 'group',
          itemInfo: {
            title,
            key: fieldKey,
            groups: _group,
          },
        });
        return;
      }

      _formDatas.push({
        type: 'details',
        itemInfo: {
          label: fieldSchema.title as string,
          key: fieldKey,
          value: hasValue ? (
            <FormDataValueRenderer schema={fieldSchema as ISchema} value={record?.[fieldKey]} />
          ) : <span className='text-gray-900'>—</span>,
          fieldSchema,
        },
      });
    });
    return [_systems, _formDatas];
  }, [formData]);

  if (loading) {
    return (<Loading />);
  }

  return (

    <div className={cs('flex-1 overflow-auto', className)}>
      <div className={cs('grid gap-x-16 grid-flow-row-dense p-16 pr-0',
        fullScreen ? 'grid-cols-4' : 'grid-cols-2')}
      >
        {formDatas.map(({ type, itemInfo }) => {
          if (type === 'details') {
            const { key } = itemInfo;
            return (
              <InfoCard
                key={key}
                list={itemInfo as FormInfoCardDataProp}
              />
            );
          }
          const { key, groups, title } = itemInfo as GroupInfo;
          return (
            <GroupCard
              key={key}
              list={groups}
              title={title || ''}
              fullScreen={fullScreen}
            />
          );
        })}
        <GroupCard
          key='system'
          list={systems}
          title='系统字段'
          fullScreen={fullScreen}
        />
      </div>
    </div>
  );
}

export default FormDataDetailsCard;
