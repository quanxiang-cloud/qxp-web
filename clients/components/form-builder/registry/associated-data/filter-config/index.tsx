import React, { useState, useEffect, useRef } from 'react';

import Modal from '@c/modal';
import Button from '@c/button';
import PageLoading from '@c/page-loading';
import DataFilter, { RefProps } from '@c/data-filter';
import { FILTER_FIELD } from '@c/data-filter/utils';
import { getTableSchema } from '@c/form-builder/utils/api';
import schemaToFields from '@lib/schema-convert';

import './index.scss';

type Props = {
  tableID?: string;
  appID?: string;
  onChange: (val: FilterConfig) => void;
  value: FilterConfig;
  currentFormSchema?: ISchema;
  customSchemaFields?: SchemaFieldItem[];
  filterFunc?: (field: SchemaFieldItem) => boolean;
}

type FieldsProps = {
  schema: ISchema;
  excludedSystemField?: boolean;
  filterFunc?: (field: SchemaFieldItem) => boolean;
}

function getFields({ schema, excludedSystemField, filterFunc }: FieldsProps): SchemaFieldItem[] {
  return schemaToFields(schema, (schemaFieldItem) => {
    if (filterFunc?.(schemaFieldItem) === false) {
      return false;
    }

    const isAllowField = schemaFieldItem.fieldName !== '_id' &&
      FILTER_FIELD.includes(schemaFieldItem?.['x-component'] || '');
    if (excludedSystemField) {
      return isAllowField && !schemaFieldItem['x-internal']?.isSystem;
    }

    return isAllowField;
  });
}

function FilterConfig({
  tableID,
  appID,
  onChange,
  value,
  currentFormSchema,
  customSchemaFields,
  filterFunc,
}: Props): JSX.Element {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [schemaFields, setSchemaFields] = useState<SchemaFieldItem[]>([]);
  const [currentFields, setCurrentFields] = useState<SchemaFieldItem[]>([]);
  const dataFilterRef = useRef<RefProps>(null);

  const allowSelect = (!!tableID && !!appID) || (customSchemaFields && customSchemaFields.length);

  const handleSave = (): void => {
    dataFilterRef.current?.validate().then((flag) => {
      if (flag) {
        onChange(dataFilterRef.current?.getDataValues() as FilterConfig);
        setVisible(false);
      }
    });
  };

  useEffect(() => {
    if (currentFormSchema) {
      setCurrentFields(getFields({ schema: currentFormSchema, excludedSystemField: true }));
    }
  }, [currentFormSchema]);

  useEffect(() => {
    if (customSchemaFields) {
      setSchemaFields(customSchemaFields);
      return;
    }

    if (appID && tableID && visible) {
      setLoading(true);
      getTableSchema(appID, tableID).then((res) => {
        setSchemaFields(res?.schema ? getFields({ schema: res.schema, filterFunc }) : []);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [allowSelect, visible, customSchemaFields]);

  return (
    <>
      <Button onClick={() => setVisible(true)}>设置过滤规则</Button>
      {visible && (
        <Modal
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              iconName: 'close',
              onClick: () => setVisible(false),
            },
            {
              text: '保存',
              key: 'confirm',
              iconName: 'check',
              modifier: 'primary',
              forbidden: !allowSelect,
              onClick: handleSave,
            },
          ]}
          title='设置数据过滤规则'
          onClose={() => setVisible(false)}
        >
          <div className='p-20'>
            {!allowSelect && (<div>请选择关联表</div>)}
            {loading && allowSelect && (<PageLoading />)}
            {!loading && allowSelect && (
              <DataFilter
                initConditions={value?.condition}
                initTag={value?.tag}
                associationFields={currentFields}
                ref={dataFilterRef}
                fields={schemaFields}
              />
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

export default FilterConfig;
