/* eslint-disable react/prop-types */

import React, { useEffect, useState } from 'react';
import { FormEffectHooks, ISchemaFieldComponentProps, useFormEffects } from '@formily/antd';
import AssociatedTableModal from './associated-table-modal';

const { onFieldValueChange$ } = FormEffectHooks;

function TableDataCreate(prop: any): JSX.Element {
  console.log('TableDataCreate', prop);
  const { props, mutators } = prop;
  const { title } = props as ISchemaFieldComponentProps;
  const componentProps = props?.['x-component-props'] || {};
  const { defaultValue, linkedTableField, display } = componentProps;
  const [showTableModal, setShowTableModal] = useState(false);
  const [rowDataId, setRowDataId] = useState();
  const [filterConfig, setFilterConfig] = useState<any>();

  useFormEffects(() => {
    onFieldValueChange$('_id').subscribe((state) => {
      setRowDataId(state?.value);
    });
  });

  useEffect(()=>{
    mutators.change({});
  }, []);

  useEffect(()=>{
    if (linkedTableField && rowDataId) {
      const filterConfig = {
        tag: 'must',
        condition: [
          {
            key: `${linkedTableField}.value`,
            op: 'eq',
            value: rowDataId,
            valueFrom: 'fixedValue',
          },
        ],
      };

      setFilterConfig(filterConfig);
    } else {
      setFilterConfig(undefined);
    }
  }, [linkedTableField, rowDataId]);

  return (
    <div className='associatet-table-wrap' >
      {
        rowDataId ?
          (<div
            className="text-blue-600 cursor-pointer"
            onClick={()=>setShowTableModal(true)}>
            {defaultValue || '查看数据新增'}
          </div>) :
          <div className='text-gray-400'>暂无数据新增</div>
      }
      {
        showTableModal &&
        (<AssociatedTableModal
          title={title}
          componentProps={componentProps}
          filterConfig={filterConfig}
          onClose={()=> setShowTableModal(false)}
        />)
      }
    </div>
  );
}

TableDataCreate.isFieldComponent = true;

export default TableDataCreate;
