import React, { useState, useEffect, useRef } from 'react';

import Modal from '@c/modal';
import Button from '@c/button';
import DataFilter, { RefProps } from '@c/data-filter';
import { FILTER_FIELD } from '@c/data-filter/utils';
import { getTableSchema } from '@c/form-builder/utils/api';

import './index.scss';

type Props = {
  tableID: string;
  appID: string;
  onChange: (val: FilterConfig) => void;
  value: FilterConfig;
  currentFormSchema: ISchema;
}

function getFields(schema: ISchema): Fields[] {
  return Object.entries(schema.properties || {}).reduce((acc, [key, fieldSchema]) => {
    if (key !== '_id' && FILTER_FIELD.includes(fieldSchema['x-component'] as string)) {
      return acc.concat({ ...fieldSchema, id: key });
    }
    return acc;
  }, [] as Fields[]);
}

function FilterConfig({ tableID, appID, onChange, value, currentFormSchema }: Props): JSX.Element {
  const [visible, setVisible] = useState(false);
  const [fields, setFields] = useState<Fields[]>([]);
  const [currentFields, setCurrentFields] = useState<Fields[]>([]);
  const dataFilterRef = useRef<RefProps>(null);

  const handleSave = (): void => {
    onChange(dataFilterRef.current?.getDataValues() as FilterConfig);
    setVisible(false);
  };

  useEffect(() => {
    if (currentFormSchema) {
      setCurrentFields(getFields(currentFormSchema));
    }
  }, [currentFormSchema]);

  useEffect(() => {
    if (appID && tableID) {
      getTableSchema(appID, tableID).then((res) => {
        setFields(res?.schema ? getFields(res.schema) : []);
      });
    }
  }, [appID, tableID]);

  return (
    <>
      <Button onClick={() => setVisible(true)}>数据过滤规则</Button>
      {visible && (
        <Modal title='设置数据过滤规则' onClose={() => setVisible(false)}>
          <div className='p-20'>
            {(!appID || !tableID) ? (<div>请选择关联记录表</div>) : (
              <>
                <DataFilter
                  initConditions={value?.condition}
                  initTag={value?.tag}
                  associationFields={currentFields}
                  ref={dataFilterRef}
                  fields={fields}
                />
                <div className='mt-10'>
                  <Button className='mr-10' onClick={() => setVisible(false)}>
                    取消
                  </Button>
                  <Button modifier='primary' className='mt-10' onClick={handleSave}>
                    保存
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

export default FilterConfig;
