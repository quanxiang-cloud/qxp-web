/* eslint-disable no-empty */
/* eslint-disable max-len */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { isArray, isString, uniqueId } from 'lodash';
import { Input, Select } from 'antd';

import FieldSwitch from '@c/field-switch';
import Icon from '@c/icon';
import formFieldWrap from '@c/form-field-wrap';

import {
  CONDITION,
  getOperators,
  FILTER_FIELD,
  setValueFormCondition,
  getValue,
  VALUE_FROM,
} from './utils';
import './index.scss';
import { valueFromOptions } from '../context';

type Props = {
  fields: SchemaFieldItem[];
  initConditions?: Condition[];
  initTag?: FilterTag;
  className?: string;
  associationFields?: SchemaFieldItem[];
  associationParentFields?: SchemaFieldItem[];
  formOptions?: any[];
  disFilterField?: any[];
  isAdvancedQuery?: boolean;
  nodesOutputOptions?: any;
  onChange?: any;
}

type FieldCondition = {
  id: string;
  key?: string;
  value?: any;
  op?: string;
  filter?: SchemaFieldItem;
  valueFrom?: 'fixedValue' | 'form';
  associationFieldsOptions?: LabelValue[];
  associationParentFieldsOptions?: LabelValue[];
}

export type RefProps = {
  empty: () => void;
  getDataValues: (data?: any) => FilterConfig;
  validate: () => Promise<boolean>;
}

const FormFieldSwitch = formFieldWrap({ FieldFC: FieldSwitch });
const FormFieldSelect = formFieldWrap({ FieldFC: Select });

function DataFilter(props: Props, ref: React.Ref<RefProps>): JSX.Element {
  const {
    fields,
    associationFields = [],
    associationParentFields = [],
    className = '',
    initConditions,
    initTag = 'must',
    formOptions,
    disFilterField = [],
    isAdvancedQuery = false,
    nodesOutputOptions,
    onChange,
  } = props;
  const [conditions, setConditions] = useState<FieldCondition[]>([]);
  const [option, setOption] = useState<any>({});
  const [nodesOutputObj, setNodesOutputObj] = useState<any>({});
  const [nodesOutputKey, setNodesOutputKey] = useState<any>({});
  const [nodesOutputNodeID, setNodesOutputNodeID] = useState<any>({});

  const [tag, setTag] = useState<FilterTag>(initTag);
  const { trigger, control, setValue, getValues, unregister, formState: { errors } } = useForm();
  useImperativeHandle(ref, () => ({
    getDataValues: getDataValues,
    empty: () => setConditions([]),
    validate: validate,
  }));

  useEffect(() => {
    if (!initConditions) {
      return;
    }

    const conditionsTmp: FieldCondition | any [] = [];
    initConditions?.forEach((condition: Condition | any) => {
      const filter = fields.find(({ id }) => {
        return id === condition.key;
      });

      if (filter) {
        conditionsTmp.push({
          id: uniqueId(),
          op: condition.op as string,
          valueFrom: condition.valueFrom,
          value: getValue(filter, condition.value, condition.valueFrom),
          associationFieldsOptions: condition.valueFrom === 'form' ? getAssociationOptions(filter) : [],
          associationParentFieldsOptions: condition.valueFrom === 'parentForm' ? getAssociationParentOptions(filter) : [],
          key: condition.key as string,
          filter,
          outputKey: condition?.outputKey,
          outputNodeID: condition?.outputNodeID,
        });
      }
    });
    setConditions(conditionsTmp);
    const _nodesOutputObj: any = {};
    const _nodesOutputKey: any = {};
    const _nodesOutputNodeID: any = {};

    const _option: any = {};
    conditionsTmp?.forEach((condition)=>{
      try {
        _option['condition-' + condition.id] = condition?.value?.includes('.output.') ? 'nodesOutput' : 'fixedValue';
      } catch (error) {
        _option['condition-' + condition.id] = 'fixedValue';
      }
      _nodesOutputObj['condition-' + condition.id] = condition?.value;
      _nodesOutputKey['condition-' + condition.id] = condition?.outputKey;
      _nodesOutputNodeID['condition-' + condition.id] = condition?.outputNodeID;
    });
    setOption(_option);
    setNodesOutputObj(_nodesOutputObj);
    setNodesOutputKey(_nodesOutputKey);
    setNodesOutputNodeID(_nodesOutputNodeID);
  }, [initConditions]);

  const fieldOption = fields.filter((field) => {
    // return FILTER_FIELD.filter((field)=> !disFilterField?.find((disField)=>disField === field))?.includes(field['x-component'] as string) && field.id !== '_id';
    return FILTER_FIELD.filter((field)=> !disFilterField?.find((disField)=>disField === field))?.includes(field['x-component'] as string);
  }).map((field) => ({
    value: field.id,
    label: field.title,
  }));

  const getAssociationOptions = (curField: ISchema | undefined): LabelValue[] => {
    if (!curField) {
      return [];
    }

    return associationFields?.reduce((acc, fields) => {
      if (fields['x-component'] === curField?.['x-component'] || (fields['x-component'] === 'Input' && curField?.['x-component'] === 'Serial')) {
        return acc.concat({ label: fields.title as string, value: fields.id });
      }
      return acc;
    }, [] as LabelValue[]);
  };

  const getAssociationParentOptions = (curField: ISchema | undefined): LabelValue[] => {
    if (!curField) {
      return [];
    }

    return associationParentFields?.reduce((acc, fields) => {
      if (fields['x-component'] === curField?.['x-component'] || (fields['x-component'] === 'Input' && curField?.['x-component'] === 'Serial')) {
        return acc.concat({ label: fields.title as string, value: fields.id });
      }
      return acc;
    }, [] as LabelValue[]);
  };

  const handleFieldChange = (rowID: string, field: string) => {
    let valueFrom = 'fixedValue';
    const componentName = fields?.find((item)=>item?.id === field)?.componentName;
    if (componentName === 'associateddata') {
      valueFrom = 'form';
    }
    setConditions(conditions.map((condition) => {
      if (condition.id === rowID) {
        return {
          ...condition,
          valueFrom,
          filter: fields.find(({ id }) => id === field),
          associationFieldsOptions: [],
          associationParentFieldsOptions: [],
        } as FieldCondition;
      }
      return condition;
    }));

    setValue('operators-' + rowID, '');
    setValue('condition-' + rowID, '');
    setValue('valueFrom-' + rowID, valueFrom);
  };

  const handleValueFromChange = (rowID: string, valueFrom: string) => {
    setConditions(conditions.map((condition) => {
      if (condition.id !== rowID) {
        return condition;
      }

      if (condition.filter?.['x-component'] === 'DatePicker') {
        setValue('operators-' + rowID, '');
        condition.filter = {
          ...condition.filter,
          type: valueFrom === 'form' ? 'number' : 'datetime',
        };
      }

      return {
        ...condition,
        valueFrom,
        associationFieldsOptions: getAssociationOptions(condition.filter),
        associationParentFieldsOptions: getAssociationParentOptions(condition.filter),
      } as FieldCondition;
    }));
    setValue('condition-' + rowID, '');
  };

  const addCondition = () => {
    setConditions([...conditions, { id: uniqueId() }]);
  };

  const handleRemove = (_id: string) => {
    unregister([`condition-${_id}`, `field-${_id}`, `operators-${_id}`, `valueFrom-${_id}`]);
    setConditions(conditions.filter(({ id }) => _id !== id));
  };

  const getDataValues = (data = {}): FilterConfig => {
    if (conditions.length === 0) {
      return { condition: [], tag, ...data };
    }

    const formData = getValues();
    const _conditions: Condition[] = [];
    conditions.forEach((condition) => {
      const value: any = formData[`condition-${condition.id}`];
      const componentName = condition?.filter?.componentName;
      if (
        formData[`field-${condition.id}`] &&
        formData[`operators-${condition.id}`] &&
        (value || nodesOutputObj?.[`condition-${condition.id}`]) && condition.filter
      ) {
        if (Array.isArray(value) && value.length === 0) {
          return;
        }
        const getValue = ()=>{
          try {
            if (nodesOutputObj?.[`condition-${condition.id}`] && isString(nodesOutputObj?.[`condition-${condition.id}`]) && nodesOutputObj?.[`condition-${condition.id}`]?.includes('.output.')) {
              return nodesOutputObj?.[`condition-${condition.id}`];
            }
          } catch (error) {
            console.log('error', error);
          }
          if (componentName === 'associateddata' && isAdvancedQuery) {
            return {
              ...formData[`condition-${condition.id}`],
              value: formData[`condition-${condition.id}`]._id,
            };
          }
          return formData[`condition-${condition.id}`];
        };

        const getOutputKey = ()=>{
          return nodesOutputKey?.[`condition-${condition.id}`];
        };
        const getOutputNodeID = ()=>{
          return nodesOutputNodeID?.[`condition-${condition.id}`];
        };
        _conditions.push(
          setValueFormCondition({
            valueFrom: formData[`valueFrom-${condition.id}`] || 'fixedValue',
            key: condition.filter.id,
            op: formData[`operators-${condition.id}`],
            value: getValue(),
            schema: condition.filter,
            outputKey: getOutputKey(),
            outputNodeID: getOutputNodeID(),
          }),
        );
      }
    });
    return {
      condition: _conditions,
      tag,
      ...data,
    };
  };

  useEffect(()=>{
    onChange && onChange();
  }, [tag, conditions, nodesOutputKey, nodesOutputNodeID, nodesOutputObj]);

  const validate = async (): Promise<boolean> => {
    await trigger();
    return Object.keys(errors).length === 0;
  };
  const getVal = (val: any, condition: any)=>{
    if (isArray(nodesOutputOptions) && val) {
      const opt = nodesOutputOptions?.find((item: any)=>{
        return item?.value === val;
      });
      if (!opt) {
        // handleRemove(condition.id);
        return '';
      } else {
        return val;
      }
    } else {
      return '';
    }
  };
  const renderValueBox = (condition: any) => {
    if (option?.['condition-' + condition.id] === 'nodesOutput') {
      const name = 'condition-' + condition?.id;
      return (
        <div data-name ={'condition-' + condition.id} className='flex items-center'>
          <Select
            key={nodesOutputOptions?.length}
            style={{ minWidth: '200px' }}
            options={nodesOutputOptions?.filter((item: any)=>!!item?.value)}
            value={getVal(nodesOutputObj?.[name], condition)}
            onChange={(val)=>{
              setNodesOutputObj({
                ...nodesOutputObj,
                [name]: val,
              });

              const valArr = val?.replace(')', '')?.split('.');
              const key = valArr?.[valArr?.length - 1];
              setNodesOutputKey({
                ...nodesOutputKey,
                // [name]: val?.replace('{{', '')?.replace('}}', '')?.replace('.Local.', ''),
                [name]: key,
              });

              setNodesOutputNodeID({
                ...nodesOutputNodeID,
                [name]: nodesOutputOptions?.find((item: any)=>item?.value === val)?.nodeID,
              });
            }}
            allowClear
          />
          <div className='flex items-center'>
            <span className='noWrap ml-10'>key： </span>
            <Input
              style={{ width: '100px' }}
              defaultValue={condition?.outputKey}
              value={nodesOutputKey?.[name]}
              onChange={(e)=>{
                const value = e.target.value;
                const filteredString = value?.replace(/[^0-9a-zA-Z_]/g, '');
                setNodesOutputKey({
                  ...nodesOutputKey,
                  [name]: filteredString,
                });
              }}></Input> </div>
        </div>
      );
    }
  };

  return (
    <div className={className}>
      <div className='flex items-center'>
        筛选出符合以下
        <Select
          className='mx-4'
          style = {{
            width: '134px',
            borderRadius: '2px 8px 8px 8px',
          }}
          value={tag}
          onChange={(tag) => setTag(tag)}
          options={CONDITION}
        />
        条件的数据
      </div>
      <div className='qxp-data-filter-box overflow-hidden'>
        {conditions.map((condition: any) => {
          try {
            condition.filter.optionalRange = 'all';
            condition.filter.multiple = 'multiple';
            condition.filter['x-component-props'].optionalRange = 'all';
            condition.filter['x-component-props'].multiple = 'multiple';
            if (condition.filter.componentName === 'userpicker') {
              condition.filter.defaultValue = [];
              condition.filter['x-component-props'].defaultValue = [];
            }
          } catch (error) {
          }
          const componentName = condition?.filter?.componentName;
          let options = formOptions || VALUE_FROM;
          if (componentName === 'associateddata') {
            options = options.filter((item)=>item.value !== 'fixedValue');
          }
          return (
            <div
              key={condition.id}
              className={`flex gap-x-8 mt-8 items-center px-8 h-64 w-full rounded-8 bg-gray-100 overflow-auto ${window?.isMobile ? 'qxp-data-filter-box-wrap-is-mobile' : ''}`}
            >
              <div>
                <Controller
                  name={'field-' + condition.id}
                  control={control}
                  defaultValue={condition.key}
                  rules={{ required: true }}
                  render={({ field }) => {
                    return (
                      <FormFieldSelect
                        style={{ width: '170px' }}
                        error={errors['field-' + condition.id]}
                        register={{ name: field.name, value: field.value }}
                        options={fieldOption}
                        onChange={(_field: string) => {
                          handleFieldChange(condition.id, _field);
                          field.onChange(_field);
                        }}
                      />
                    );
                  }}
                />
              </div>
              {condition.filter ? (
                <>
                  <div>
                    <Controller
                      name={'operators-' + condition.id}
                      control={control}
                      defaultValue={condition.op || 'eq'}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormFieldSelect
                          style={{ width: '105px' }}
                          error={errors['operators-' + condition.id]}
                          register={field}
                          options={getOperators(condition.filter?.type || '', condition.filter?.enum)}
                        />
                      )
                      }
                    />
                  </div>
                  {(associationFields.length !== 0 || associationParentFields?.length !== 0) && (
                    <div>
                      <Controller
                        name={'valueFrom-' + condition.id}
                        control={control}
                        defaultValue={condition.valueFrom || 'fixedValue'}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <FormFieldSelect
                            style={{ width: '105px' }}
                            error={errors['valueFrom-' + condition.id]}
                            register={field}
                            options={options}
                            onChange={(valueFrom: string) => {
                              handleValueFromChange(condition.id, valueFrom);
                              field.onChange(valueFrom);
                            }}
                          />
                        )
                        }
                      />
                    </div>
                  )}
                  <div>
                    <div className='flex items-center'>
                      <Select
                        className='w-100'
                        options={valueFromOptions}
                        value={option?.['condition-' + condition.id]}
                        onChange={(val)=>{
                          setOption({
                            ...option,
                            ['condition-' + condition.id]: val,
                          });
                          setNodesOutputObj({
                            ...nodesOutputObj,
                            ['condition-' + condition.id]: undefined,
                          });
                          setNodesOutputKey({
                            ...nodesOutputKey,
                            ['condition-' + condition.id]: undefined,
                          });
                          setValue('condition-' + condition.id, '');
                        }}
                        allowClear
                      />
                      <div className="inline-flex items-center custom-field__value ml-8">
                        {
                          option?.['condition-' + condition.id] === 'nodesOutput' &&
                          (<div className="inline-flex items-center custom-field__value ml-8">
                            {renderValueBox(condition)}
                          </div>)
                        }
                        {
                          option?.['condition-' + condition.id] !== 'nodesOutput' &&
                          (<Controller
                            name={'condition-' + condition.id}
                            control={control}
                            defaultValue={condition.value}
                            rules={{ required: true }}
                            render={({ field }) => {
                              let res;
                              const { filter: { componentName } } = condition;
                              if (componentName === 'associateddata') {
                                condition.associationFieldsOptions = getAssociationOptions(condition.filter);
                              }
                              switch (condition.valueFrom) {
                              case 'form':
                                if (isAdvancedQuery && componentName === 'associateddata') {
                                  res = (
                                    <FormFieldSwitch
                                      error={errors['condition-' + condition.id]}
                                      register={{ ...field, value: field.value ? field.value : '' }}
                                      field={condition.filter}
                                      style={{ width: '200px' }}
                                    />
                                  );
                                } else {
                                  res = (
                                    <FormFieldSelect
                                      style={{ width: '200px' }}
                                      error={errors['condition-' + condition.id]}
                                      register={field}
                                      options={condition.associationFieldsOptions || []}
                                    />
                                  );
                                }
                                break;
                              case 'parentForm':
                                res = (
                                  <FormFieldSelect
                                    style={{ width: '200px' }}
                                    error={errors['condition-' + condition.id]}
                                    register={field}
                                    options={condition.associationParentFieldsOptions || []}
                                  />
                                );
                                break;
                              default:
                                res = (
                                  <FormFieldSwitch
                                    error={errors['condition-' + condition.id]}
                                    register={{ ...field, value: field.value ? field.value : '' }}
                                    field={condition.filter}
                                    style={{ width: '200px' }}
                                  />
                                );
                                break;
                              }
                              return res;
                            }
                            }
                          />)
                        }
                      </div>
                    </div>

                  </div>
                </>
              ) : null}
              <Icon
                style={{ minWidth: '19px' }}
                clickable
                changeable
                onClick={() => handleRemove(condition.id)}
                name='delete'
                size={20}
              />
            </div>
          );
        })}
      </div>
      <div className='mt-24'>
        <span onClick={addCondition} className='text-btn'><Icon name='add' className='text-btn'/>
          添加筛选条件
        </span>
      </div>
    </div>
  );
}

export default forwardRef(DataFilter);
