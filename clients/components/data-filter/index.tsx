/* eslint-disable no-empty */
/* eslint-disable max-len */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { uniqueId } from 'lodash';
import { Select } from 'antd';

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

type Props = {
  fields: SchemaFieldItem[];
  initConditions?: Condition[];
  initTag?: FilterTag;
  className?: string;
  associationFields?: SchemaFieldItem[];
  associationParentFields?: SchemaFieldItem[];
  formOptions?: any[];
  disFilterField?: any[];
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

function DataFilter({
  fields,
  associationFields = [],
  associationParentFields = [],
  className = '',
  initConditions,
  initTag = 'must',
  formOptions,
  disFilterField = [],
}: Props, ref: React.Ref<RefProps>): JSX.Element {
  const [conditions, setConditions] = useState<FieldCondition[]>([]);
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

    const conditionsTmp: FieldCondition[] = [];
    initConditions.forEach((condition: Condition) => {
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
      if (fields['x-component'] === curField?.['x-component']) {
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
      if (fields['x-component'] === curField?.['x-component']) {
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
      const value = formData[`condition-${condition.id}`];
      if (
        formData[`field-${condition.id}`] &&
        formData[`operators-${condition.id}`] &&
        value && condition.filter
      ) {
        if (Array.isArray(value) && value.length === 0) {
          return;
        }

        _conditions.push(
          setValueFormCondition({
            valueFrom: formData[`valueFrom-${condition.id}`] || 'fixedValue',
            key: condition.filter.id,
            op: formData[`operators-${condition.id}`],
            value: formData[`condition-${condition.id}`],
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
                          style={{ width: '95px' }}
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
                            style={{ width: '95px' }}
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
                    <Controller
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
                          res = (
                            <FormFieldSelect
                              style={{ width: '280px' }}
                              error={errors['condition-' + condition.id]}
                              register={field}
                              options={condition.associationFieldsOptions || []}
                            />
                          );
                          break;
                        case 'parentForm':
                          res = (
                            <FormFieldSelect
                              style={{ width: '280px' }}
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
