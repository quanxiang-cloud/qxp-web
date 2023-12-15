/* eslint-disable max-len */
/* eslint-disable guard-for-in */
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { get, set } from 'lodash';

import { getFormFieldSchema } from '@newFlow/content/editor/forms/api';
import { schemaToMap } from '@lib/schema-convert';
import { buildQueryRef, getTableSchema } from '@lib/http-client-form';

import { transformSchemaTableDataQuery as transformSchema } from '../utils';
import Button from '@c/button';
import RuleItem from './rule-item';
import { uuid } from '@lib/utils';

interface Props {
  appId: string;
  tableId: string;
}

function TargetTableFields({ appId, tableId, queryDataList, onChange }: Props | any): JSX.Element {
  const { data: schema, isLoading, isError } = useQuery(['GET_TARGET_TABLE_SCHEMA', tableId, appId],
    getFormFieldSchema, {
      enabled: !!appId && !!tableId,
    });
  const tableSchemaMap = schemaToMap(schema, (currentSchema: SchemaFieldItem) => {
    return currentSchema.componentName !== 'associatedrecords';
  });
  const [schemaToTransform, setSchemaToTransform] = useState({ ...schema, properties: tableSchemaMap });
  const [ref, setRef] = useState<any>();
  const [queryList, setQueryList] = useState<any>(queryDataList || []);
  const [typeOptions, setTypeOptions] = useState<any>([]);
  const [showError, setShowError] = useState<any>(false);
  const [normalFields, setNormalFields] = useState<any>([]);
  const [subFields, setSubFields] = useState<any>([]);

  useEffect(()=>{
    onChange(queryList, ref);
  }, [queryList]);

  useEffect(()=>{
    const ref = buildQueryRef(schema as any);
    setRef(ref);
  }, [schema]);

  useEffect(()=>{
    onChange(queryList, ref);
  }, [ref]);

  useEffect(()=>{
    const normalTableFields = transformSchema(schemaToTransform, {})?.properties;

    const normalTableFieldsOption: any = [];
    for (const key in normalTableFields) {
      normalTableFieldsOption.push({
        label: normalTableFields?.[key]?.['x-component-props']?.title,
        value: key,
      });
    }

    const subTableFields = transformSchema(schemaToTransform, { filterSubTable: true })?.properties;
    const subTableFieldsOption = [];
    for (const key in subTableFields) {
      const currentSubTableFieldsOption = [];
      const curentSubTableFields = subTableFields?.[key]?.properties;
      for (const k in curentSubTableFields) {
        currentSubTableFieldsOption.push({
          label: curentSubTableFields?.[k]?.['x-component-props']?.title,
          value: k,
        });
      }
      subTableFieldsOption.push({
        label: subTableFields?.[key]?.['x-component-props']?.title,
        value: key,
        data: currentSubTableFieldsOption,
      });
    }
    setNormalFields(normalTableFields);
    setSubFields(subTableFields);
  }, [schemaToTransform]);

  useEffect(()=>{
    const _typeOptions = [];
    for (const key in normalFields) {
      _typeOptions.push({
        label: normalFields?.[key]?.['x-component-props']?.title,
        value: key,
      });
    }
    for (const key in subFields) {
      // const curentSubTableFields = subFields?.[key]?.properties;
      // for (const k in curentSubTableFields) {
      //   _typeOptions.push({
      //     label: `${subFields?.[key]?.['x-component-props']?.title}.${curentSubTableFields?.[k]?.['x-component-props']?.title }`,
      //     value: `${k}`,
      //   });
      // }
      if (subFields[key]?.['x-component-props']?.['x-component-props']?.subordination === 'foreign_table') {
        _typeOptions.push({
          label: `${subFields?.[key]?.['x-component-props']?.title}`,
          value: `${key}`,
        });
      }
    }
    setTypeOptions(_typeOptions);
  }, [normalFields, subFields]);

  useEffect(() => {
    const initSchemaToTransform = { ...schema, properties: tableSchemaMap };
    Promise.all(
      Object.entries(initSchemaToTransform.properties).map(([fieldName, fieldSchema]) => {
        const compProps = get(fieldSchema, 'x-component-props');
        const subordination = get(compProps, 'subordination', '');

        if (subordination === 'foreign_table') {
          const foreignAppId = get(compProps, 'appID', '');
          const foreignTableId = get(compProps, 'tableID', '');
          const foreignTableFields = get(compProps, 'columns', []);
          return getTableSchema(foreignAppId, foreignTableId).then((res) => {
            const foreignTableSchema = res?.schema.properties || {};
            Object.entries(foreignTableSchema).forEach(([foreignKey, foreignSchema]) => {
              if (foreignTableFields.includes(foreignKey)) {
                set(
                  initSchemaToTransform.properties[fieldName],
                  `items.properties.${foreignKey}`, foreignSchema,
                );
              }
            });
          });
        }
      })).then(() => {
      setSchemaToTransform(initSchemaToTransform);
    });
  }, [schema]);

  useEffect(()=>{
    const obj: any = {};
    let flag = false;
    queryList?.forEach((item: any)=>{
      if (item?.queryVal && item?.value?.length) {
        if (obj?.[item.queryVal]) {
          obj[item.queryVal] += 1;
        } else {
          obj[item.queryVal] = 1;
        }
      }
    });
    for (const key in obj) {
      if (obj[key] > 1) {
        flag = true;
        break;
      }
    }
    setShowError(flag);
  }, [queryList]);

  if (isLoading) {
    return (
      <div>Loading table schema</div>
    );
  }

  if (isError) {
    return (
      <div>Load table schema failed</div>
    );
  }

  const onAdd = ()=>{
    setQueryList(() => [...queryList, {
      id: 'tableDataQuery' + uuid(),
      type: '',
      queryVal: '',
      value: [],
      descrption: '',
    }]);
  };

  const onRemove = (idx: any)=>{
    setQueryList(queryList.filter((child: any)=>{
      return child.id !== idx;
    }));
  };

  const handleChange = (item: any)=>{
    setQueryList(queryList?.map((child: any)=>{
      const { value } = child;
      let descrption = '';
      if (value?.length > 1) {
        const option = typeOptions?.find((item: any)=>{
          return item?.value === value?.[0];
        });
        if (option) {
          const _des = option?.label;
          const _subDes = option?.children?.find((item: any)=>{
            return item?.value === value?.[1];
          })?.label;
          descrption = _des + '/' + _subDes;
        }
      } else {
        descrption = typeOptions?.find((item: any)=>{
          return item?.value === value?.[0];
        })?.label;
      }
      if (item.id === child.id) {
        return {
          ...item,
          descrption,
        };
      } else {
        return {
          ...child,
          descrption,
        };
      }
    }));
  };

  return (
    <div className="flex flex-col mt-20">
      <fieldset className="">
        <div className="flex my-10 justify-between">
          <legend className="text-h6">查询字段</legend>
          <Button className='mr-20' onClick={onAdd}>新增</Button>
        </div>
        <div className="flex flex-col update-conditions">
          {
            !!queryList?.length &&
            (<div className="flex items-center mb-10 px-10 py-8 bg-gray-100 rounded-8">
              {/* <div className="flex flex-1 items-center ml-10">相关数据</div> */}
              <div className="flex flex-1 items-center ml-10">字段</div>
              <div className="flex flex-1 items-center ml-10">字段查询值</div>
            </div>)
          }
          {queryList?.map((item: any) =>{
            return (
              <RuleItem
                key={item?.id}
                data={item}
                options={typeOptions}
                onRemove={() => onRemove(item?.id)}
                onChange={handleChange}
              />
            );
          },
          )}
          {/* {showError && <div className={'text-caption-no-color text-red-600 ml-8'}>字段查询值不能重复</div>} */}
        </div>
      </fieldset>
    </div>
  );
}

export default TargetTableFields;
