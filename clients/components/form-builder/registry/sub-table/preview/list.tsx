/* eslint-disable max-len */
/* eslint-disable guard-for-in */
import React, { JSXElementConstructor, useEffect, useState } from 'react';
import { Rule } from 'rc-field-form/lib/interface';
import cs from 'classnames';
import { IMutators, InternalFieldList as FieldList, ValidatePatternRules, useFormEffects } from '@formily/antd';

import Icon from '@c/icon';

import SubTableRow from './row';
import { useForeignFormula } from './use-foreign-formula';
import type { Layout } from '../convertor';
import Modal from '@c/modal';
import httpClient from '@lib/http-client';
import { FormEffectHooks } from '@formily/antd';
import Table from '@c/table';
import { FormDataSubTableValueRenderer } from '@c/form-data-value-renderer';

export type Rules = (ValidatePatternRules | ValidatePatternRules[]) & Rule[];
export type Column = {
  title: string;
  dataIndex: string;
  componentName: string;
  props: Record<string, any>;
  readOnly: boolean;
  rules: Rules;
  schema: ISchema;
  component: JSXElementConstructor<any>;
  dataSource?: any[];
  required?: boolean;
  render?: (value: unknown) => JSX.Element;
}

interface Props {
  name?: string;
  schema?: ISchema;
  value: any[];
  props: { className?: string; readOnly?: boolean; };
  componentColumns: Column[];
  layout: Layout;
  rowLimit: string;
  onAddRow: (mutators: IMutators) => void;
  isFromForeign: boolean;
  columns: string[];
  definedSchema?: any;
  mutators?: IMutators;
  rowPlaceHolder?: any;
  form?: any;
}

export default function SubTableList({
  name, value, props: prps, componentColumns, layout, onAddRow, rowLimit, isFromForeign, columns, schema,
  definedSchema, mutators, rowPlaceHolder, form,
}: Props): JSX.Element {
  useForeignFormula(isFromForeign, columns, name, schema);
  const itemsComponentProps = definedSchema?.items?.['x-component-props'];
  const { appID } = definedSchema?.['x-component-props'] || {};
  const { subAssociatedFields = [], subOptionsSchema, subTableID, associatedFieldID } = itemsComponentProps || {};
  const [showModel, setShowModel] = useState(false);
  const [subTableList, setSubTableList] = useState<any>([]);
  const [subTableColumns, setSubTableColumns] = useState<any>([]);
  const [subTableQueryID, setSubTableQueryID] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any>([]);
  const [currentValue, setCurrentValue] = useState<any>([]);
  const [selectList, setSelectList] = useState([]);

  useEffect(()=>{
    setCurrentValue(value);
  }, []);
  useEffect(()=>{
    getSubTableColumns();
    getSubTabletData();
  }, []);

  useEffect(()=>{
    setSelected(value?.map(({ linkedSubTableSelectedID }: any)=>linkedSubTableSelectedID)?.filter((item)=>!!item));
  }, [value]);

  useEffect(()=>{
    // 获取子表单数据
    subAssociatedFields?.length && showModel && getSubTabletData();
  }, [subAssociatedFields, showModel]);

  useFormEffects((_) => {
    FormEffectHooks.onFieldChange$('*').subscribe((state) => {
      const { name, value } = state;
      if (name === associatedFieldID) {
        setSubTableQueryID(value?.value);
        !window.location.href.includes('approvals') && mutators?.change([]);
        window.location.href.includes('approvals') && getSubTabletData();
      }
    });
  });

  const onRemove = (data: any)=>{
    const { linkedSubTableSelectedID } = data || {};
    setSelected(selected.filter((item: any)=>item !== linkedSubTableSelectedID));
    setCurrentValue(currentValue?.filter((item: any)=>(item?.linkedSubTableSelectedID !== linkedSubTableSelectedID)));
  };

  // 获取子表数据
  const getSubTabletData = ()=>{
    setSubTableList([]);
    let query;
    const formState = form?.getFormState();
    const { values } = formState || {};
    const linkedQueryID = values?.[associatedFieldID]?.value;
    linkedQueryID && (query = { term: { _id: linkedQueryID } });
    if ((subTableID && query)) {
      setLoading(true);
      httpClient(
        `/api/v1/form/${appID}/home/form/${subAssociatedFields?.[0]}/get`,
        {
          ref: {
            [subTableID]: {
              type: 'sub_table',
              appID,
              tableID: subAssociatedFields?.[1],
            },
          },
          query,
        },
      ).then((res: any) => {
        setLoading(false);
        const { entity } = res || {};
        const dataList = entity[subTableID];
        setSubTableList(dataList);
      });
    }
  };

  const getSubTableColumns = ()=>{
    const arr = [];
    for (const key in subOptionsSchema) {
      if (key !== '_id') {
        arr.push({
          id: key,
          Header: subOptionsSchema[key]?.title,
          accessor: (value: Record<string, any>) =>{
            return (
              <FormDataSubTableValueRenderer
                value={value[key]}
                schema={subOptionsSchema[key]}/>
            );
          },
        });
      }
    }
    setSubTableColumns(arr);
  };

  const onAddLinkedSubTableRow = ()=>{
    setShowModel(true);
  };

  const handleSubTableSelectChange = (rowData: any): void => {
    setSelectList(rowData);
  };

  const onClose = ()=>{
    setShowModel(false);
  };

  const handleSubmit = ()=>{
    mutators?.change([]);
    const arr: any = [];
    const _selected = [...new Set([...selectList, ...selected])];
    setSelected(_selected);
    _selected?.forEach((item: any)=>{
      const hasItem = value?.find((itm: any)=>{
        const { linkedSubTableSelectedID } = itm;
        return (item === linkedSubTableSelectedID);
      });
      arr?.push(
        hasItem ? hasItem :
          {
            ...rowPlaceHolder,
            linkedSubTableSelectedID: item,
            linkedSubTableQueryID: subTableQueryID,
            linkedSubTableID: subTableID,
          },
      );
    });
    mutators?.push(arr);
    setCurrentValue(arr);
    onClose();
  };

  const btns: any = [
    {
      key: 'cancel',
      text: '取消',
      onClick: onClose,
    },
    {
      key: 'submit',
      text: '确定',
      modifier: 'primary',
      onClick: handleSubmit,
    },
  ];

  return (
    <>
      {
        (
          <FieldList name={name} initialValue={value}>
            {({ state, mutators, form }) => {
              return (
                <div className={cs('w-full flex flex-col border border-gray-300', prps?.className)}>
                  <div className="overflow-auto">
                    {state.value.map((item: Record<string, FormDataValue>, index: number) => {
                      return (
                        <SubTableRow
                          name={name}
                          componentColumns={componentColumns}
                          linkSubTableComponentProps={itemsComponentProps}
                          key={index}
                          index={index}
                          item={item}
                          form={form}
                          layout={layout}
                          mutators={mutators}
                          removeAble={!prps.readOnly}
                          subTableList={!!subAssociatedFields?.length && subTableList}
                          subOptionsSchema={!!subAssociatedFields?.length && subOptionsSchema}
                          onRemove={!!subAssociatedFields?.length && onRemove}
                        />
                      );
                    })}
                  </div>
                  {
                    !subAssociatedFields?.length ?
                      (rowLimit === 'multiple' && !prps.readOnly) && (
                        <div className="border-t-1 border-gray-300 flex items-center">
                          <Icon
                            name="add"
                            size={24}
                            className='m-5 font-bold cursor-pointer'
                            onClick={() => onAddRow(mutators)}
                          />
                        </div>
                      ) :
                      (
                        !prps.readOnly &&
                        (<div className="border-t-1 border-gray-300 flex items-center">
                          <Icon
                            name="add"
                            size={24}
                            className='m-5 font-bold cursor-pointer'
                            onClick={() => onAddLinkedSubTableRow(mutators)}
                          />
                        </div>)
                      )
                  }
                </div>
              );
            }}
          </FieldList>
        )
      }
      {
        showModel &&
        (<Modal
          title="选择子表数据"
          onClose={onClose}
          footerBtns={btns}
        >
          <div className="p-20 flex" style={{ minHeight: '200px' }}>
            <div className='flex flex-1 overflow-hidden'>
              <Table
                showCheckbox={true}
                emptyTips='暂无数据'
                rowKey="_id"
                loading={loading}
                initialSelectedRowKeys={selected || []}
                onSelectChange={handleSubTableSelectChange}
                columns={subTableColumns}
                data={subTableList}
              />
            </div>
          </div>
        </Modal>)
      }
    </>
  );
}
