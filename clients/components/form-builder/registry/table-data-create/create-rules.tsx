/* eslint-disable react/prop-types */

import React, { useState, useEffect, useRef } from 'react';
import Modal from '@c/modal';
import Button from '@c/button';
import PageLoading from '@c/page-loading';
import { RefProps } from '@c/data-filter';
import { FILTER_FIELD } from '@c/data-filter/utils';
import { getTableSchema } from '@lib/http-client-form';
import schemaToFields from '@lib/schema-convert';
import CreateDataRules from './create-data-rules';

type Props = {
  tableID?: string;
  appID?: string;
  onChange: (val: FilterConfig) => void;
  value: FilterConfig;
  currentFormSchema?: ISchema;
  customSchemaFields?: SchemaFieldItem[];
  filterFunc?: (field: SchemaFieldItem) => boolean;
  showSelectAll?: any;
  parentFormSchema?: ISchema;
  disFilterField?: any;
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

function CreateRules(prop: any): JSX.Element {
  console.log('CreateRules props====', prop);
  const props: any = prop?.props || {};
  const {
    onChange,
    value,
    currentFormSchema,
    customSchemaFields,
    parentFormSchema,
    filterFunc,
    disFilterField,
  } = props;
  const componentProps = props?.['x-component-props'] || {};
  const {
    appID,
    tableID,
  } = componentProps;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [schemaFields, setSchemaFields] = useState<SchemaFieldItem[]>([]);
  const [currentFields, setCurrentFields] = useState<SchemaFieldItem[]>([]);
  const [subFields, setSubFields] = useState<SchemaFieldItem[]>([]);

  const dataFilterRef = useRef<RefProps>(null);
  const allowSelect = (!!tableID && !!appID) || (customSchemaFields && customSchemaFields.length);

  const handleSave = (): void => {
    dataFilterRef.current?.validate().then((flag) => {
      if (flag) {
        setVisible(false);
      }
    });
  };

  useEffect(() => {
    if (currentFormSchema) {
      setCurrentFields(
        getFields({ schema: currentFormSchema, excludedSystemField: true }),
      );
      if (parentFormSchema) {
        setSubFields(
          getFields({ schema: parentFormSchema, excludedSystemField: true }),
        );
      }
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
      <Button onClick={() => setVisible(true)}>设置新增规则</Button>
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
          title='设置数据新增规则'
          onClose={() => setVisible(false)}
        >
          <div className='p-20'>
            {!allowSelect && (<div>请选择目标表</div>)}
            {loading && allowSelect && (<PageLoading />)}
            {!loading && allowSelect && (
              <CreateDataRules
                initConditions={value?.condition}
                initTag={value?.tag}
                associationFields={currentFields}
                associationParentFields={subFields}
                ref={dataFilterRef}
                fields={schemaFields}
                disFilterField={disFilterField}
              />
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

CreateRules.isFieldComponent = true;

export default CreateRules;
