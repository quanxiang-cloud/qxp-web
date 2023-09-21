/* eslint-disable no-empty */
/* eslint-disable max-len */
import React, { useState, useEffect, forwardRef, useImperativeHandle, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { uniqueId } from 'lodash';
import { InputNumber, Select } from 'antd';

import FieldSwitch from '@c/field-switch';
import Icon from '@c/icon';
import formFieldWrap from '@c/form-field-wrap';

import {
  FILTER_FIELD,
  setValueFormCondition,
  getValue,
  VALUE_FROM,
} from './utils';
import './index.scss';
import { StoreContext } from '@c/form-builder/context';
import schemaToFields from '@lib/schema-convert';

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

enum createNumberEnum {
  fixedValue ='fixedValue',
  form = 'form',
}

function CreateDataRules(props: Props, ref: React.Ref<RefProps>): JSX.Element {
  const {
    fields,
    associationFields = [],
    associationParentFields = [],
    className = '',
    initConditions,
    initTag = 'must',
    disFilterField = [],
    isAdvancedQuery = false,
  } = props;
  console.log('CreateDataRulesprops===', props);
  const [conditions, setConditions] = useState<FieldCondition[]>([]);
  const [createNumber, setCreateNumber] = useState<any>();
  const [createNumberType, setCreateNumberType] = useState<createNumberEnum>(createNumberEnum.fixedValue);

  const [tag, setTag] = useState<FilterTag>(initTag);
  const { trigger, control, setValue, getValues, unregister, formState: { errors } } = useForm();

  const { schema: currentFormSchema } = useContext(StoreContext);
  const [currentSchemaFields, setCurrentSchemaFields] = useState(schemaToFields(currentFormSchema)); // 获取主表下的schema
  const [customSchemaNumberFields, setCustomSchemaNumberFields] = useState<any>();
  const [createNumberFieldsOption, setCreateNumberFieldsOption] = useState<any>();

  useEffect(()=>{
    getCustomSchemaNumberFields();
  }, [currentSchemaFields]);

  // 获取主表下number字段
  const getCustomSchemaNumberFields = ()=>{
    const numberFields = currentSchemaFields?.filter((item)=>{
      const { componentName } = item || {};
      return componentName === 'numberpicker';
    });
    console.log('numberFields', numberFields);
    setCustomSchemaNumberFields(numberFields);
  };

  // 获取主表下的子表
  const getCustomSchemaSubTableFields = ()=>{

  };

  // 获取子表下number字段
  const getCustomSchemaSubTableNumberFields = ()=>{

  };

  useImperativeHandle(ref, () => ({
    getDataValues: getDataValues,
    empty: () => setConditions([]),
    validate: validate,
  }));

  useEffect(() => {
    if (!initConditions) {
      return;
    }

    const conditionsTmp: FieldCondition[] = [];
    initConditions.forEach((condition: Condition) => {
      const filter = fields.find(({ id }) => {
        return id === condition.key;
      });

      if (filter) {
        conditionsTmp.push({
          id: uniqueId(),
          op: condition.op as string,
          value: getValue(filter, condition.value, condition.valueFrom),
          associationFieldsOptions: condition.valueFrom === 'form' ? getAssociationOptions(filter) : [],
          associationParentFieldsOptions: condition.valueFrom === 'parentForm' ? getAssociationParentOptions(filter) : [],
          key: condition.key as string,
          filter,
        });
      }
    });
    setConditions(conditionsTmp);
  }, [initConditions]);

  const fieldOption = fields.filter((field) => {
    return FILTER_FIELD.filter((field)=> !disFilterField?.find((disField)=>disField === field))?.includes(field['x-component'] as string) && field.id !== '_id';
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
        value && condition.filter
      ) {
        if (Array.isArray(value) && value.length === 0) {
          return;
        }
        const getValue = ()=>{
          if (componentName === 'associateddata' && isAdvancedQuery) {
            return {
              ...formData[`condition-${condition.id}`],
              value: formData[`condition-${condition.id}`]._id,
            };
          }
          return formData[`condition-${condition.id}`];
        };
        _conditions.push(
          setValueFormCondition({
            valueFrom: formData[`valueFrom-${condition.id}`] || 'fixedValue',
            key: condition.filter.id,
            op: formData[`operators-${condition.id}`],
            value: getValue(),
            schema: condition.filter,
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

  const validate = async (): Promise<boolean> => {
    await trigger();
    return Object.keys(errors).length === 0;
  };

  const handleChangeCreateNumberType = (valueFrom: any)=>{
    setCreateNumberType(valueFrom);
    setCreateNumber(undefined);
  };

  const handleChangeCreateNumber = (val: any)=>{
    setCreateNumber(val);
  };

  return (
    <div className={className}>
      <div className='qxp-data-filter-box overflow-hidden flex align-center'>
        <span>新增数据数量</span>
        <span className='mx-10'>=</span>
        <Select
          className='mx-10 w-95'
          options={VALUE_FROM}
          value={createNumberType}
          onChange={handleChangeCreateNumberType}
        />
        <div>
          {
            createNumberType === createNumberEnum.fixedValue &&
            (<InputNumber
              className={className}
              type='number'
              precision={0}
              value={createNumber}
              onChange={handleChangeCreateNumber}
            />)
          }
          {
            createNumberType === createNumberEnum.form &&
            (<Select
              className='w-95'
              options={createNumberFieldsOption}
              value={createNumber}
              onChange={handleChangeCreateNumber}
            />)
          }

        </div>
      </div>=≠
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
          let options = VALUE_FROM;
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
              { condition.filter && (<>
                <span className='mx-10'>
                  =
                </span>
                <div>
                  <Controller
                    name={'valueFrom-' + condition.id}
                    control={control}
                    defaultValue={condition.valueFrom || 'fixedValue'}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormFieldSelect
                        style={{ width: '95px' }}
                        error={errors['valueFrom-' + condition.id]}
                        register={field}
                        options={VALUE_FROM}
                        onChange={(valueFrom: string) => {
                          handleValueFromChange(condition.id, valueFrom);
                          field.onChange(valueFrom);
                        }}
                      />
                    )
                    }
                  />
                </div>
                <div>
                  <Controller
                    name={'condition-' + condition?.id}
                    control={control}
                    defaultValue={condition?.value}
                    rules={{ required: true }}
                    render={({ field }) => {
                      console.log('condition===========', condition);
                      let res;
                      const { filter: { componentName } } = condition;
                      if (componentName === 'associateddata') {
                        condition.associationFieldsOptions = getAssociationOptions(condition?.filter);
                      }
                      switch (condition?.valueFrom) {
                      case 'form':
                        if (isAdvancedQuery && componentName === 'associateddata') {
                          res = (
                            <FormFieldSwitch
                              error={errors['condition-' + condition?.id]}
                              register={{ ...field, value: field.value ? field.value : '' }}
                              field={condition?.filter}
                              style={{ width: '280px' }}
                            />
                          );
                        } else {
                          res = (
                            <FormFieldSelect
                              style={{ width: '280px' }}
                              error={errors['condition-' + condition?.id]}
                              register={field}
                              options={condition?.associationFieldsOptions || []}
                            />
                          );
                        }
                        break;
                      case 'parentForm':
                        res = (
                          <FormFieldSelect
                            style={{ width: '280px' }}
                            error={errors['condition-' + condition?.id]}
                            register={field}
                            options={condition?.associationParentFieldsOptions || []}
                          />
                        );
                        break;
                      default:
                        res = (
                          <FormFieldSwitch
                            error={errors['condition-' + condition?.id]}
                            register={{ ...field, value: field.value ? field.value : '' }}
                            field={condition?.filter}
                            style={{ width: '280px' }}
                          />
                        );
                        break;
                      }
                      return res;
                    }
                    }
                  />
                </div>
              </>)}
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
          新增设置规则
        </span>
      </div>
    </div>
  );
}

export default forwardRef(CreateDataRules);
