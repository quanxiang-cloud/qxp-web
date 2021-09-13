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
  VALUE_FROM,
  setValueFormCondition,
  getValue,
} from './utils';
import './index.scss';

type Props = {
  fields: SchemaFieldItem[];
  initConditions?: Condition[];
  initTag?: FilterTag;
  className?: string;
  associationFields?: SchemaFieldItem[];
}

type FieldCondition = {
  id: string;
  key?: string;
  value?: any;
  op?: string;
  filter?: SchemaFieldItem;
  valueFrom?: 'fixedValue' | 'form';
  associationFieldsOptions?: LabelValue[];
}

export type RefProps = {
  empty: () => void;
  getDataValues: () => FilterConfig;
  validate: () => Promise<boolean>;
}

const FormFieldSwitch = formFieldWrap({ FieldFC: FieldSwitch });
const FormFieldSelect = formFieldWrap({ FieldFC: Select });

function DataFilter({
  fields,
  associationFields = [],
  className = '',
  initConditions,
  initTag = 'must',
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
          key: condition.key as string,
          filter,
        });
      }
    });
    setConditions(conditionsTmp);
  }, [initConditions]);

  const fieldOption = fields.filter((field) => {
    return FILTER_FIELD.includes(field['x-component'] as string) && field.id !== '_id';
  }).map((field) => ({
    value: field.id,
    label: field.title,
  }));

  const getAssociationOptions = (curField: ISchema | undefined): LabelValue[] => {
    if (!curField) {
      return [];
    }

    return associationFields.reduce((acc, fields) => {
      if (fields['x-component'] === curField?.['x-component']) {
        return acc.concat({ label: fields.title as string, value: fields.id });
      }
      return acc;
    }, [] as LabelValue[]);
  };

  const handleFieldChange = (rowID: string, field: string) => {
    setConditions(conditions.map((condition) => {
      if (condition.id === rowID) {
        return {
          ...condition,
          valueFrom: 'fixedValue',
          filter: fields.find(({ id }) => id === field),
          associationFieldsOptions: [],
        } as FieldCondition;
      }
      return condition;
    }));
    setValue('operators-' + rowID, '');
    setValue('condition-' + rowID, '');
    setValue('valueFrom-' + rowID, 'fixedValue');
  };

  const handleValueFromChange = (rowID: string, valueFrom: string) => {
    setConditions(conditions.map((condition) => {
      if (condition.id !== rowID) {
        return condition;
      }

      if (condition.filter?.['x-component'] === 'DatePicker') {
        condition.filter = {
          ...condition.filter,
          type: valueFrom === 'form' ? 'number' : 'datetime',
        };
      }

      return {
        ...condition,
        valueFrom,
        associationFieldsOptions: getAssociationOptions(condition.filter),
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

  const getDataValues = (): FilterConfig => {
    if (conditions.length === 0) {
      return { condition: [], tag };
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
      <div className='qxp-data-filter-box beauty-scroll'>
        {conditions.map((condition) => (
          <div key={condition.id} className='flex gap-x-8 py-16 px-8 mt-8 items-center bg-gray-100 rounded-8'>
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
                }
                }
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
                {associationFields.length !== 0 && (
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
                )}
                <div>
                  <Controller
                    name={'condition-' + condition.id}
                    control={control}
                    defaultValue={condition.value}
                    rules={{ required: true }}
                    render={({ field }) => (
                      condition.valueFrom === 'form' ? (
                        <FormFieldSelect
                          style={{ width: '270px' }}
                          error={errors['condition-' + condition.id]}
                          register={field}
                          options={condition.associationFieldsOptions || []}
                        />
                      ) : (
                        <FormFieldSwitch
                          error={errors['condition-' + condition.id]}
                          register={{ ...field, value: field.value ? field.value : '' }}
                          field={condition.filter}
                          style={{ width: '270px' }}
                        />
                      )
                    )
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
        ))}
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
