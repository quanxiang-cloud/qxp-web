import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
import { uniqueId } from 'lodash';

import Select from '@c/select';
import FieldSwitch from '@c/field-switch';
import Icon from '@c/icon';
import formFieldWrap from '@c/form-field-wrap';

import { CONDITION, getOperators, FILTER_FIELD, getCondition, VALUE_FROM } from './utils';
import './index.scss';

type Props = {
  fields: SchemaField[];
  initConditions?: Condition[];
  initTag?: string;
  className?: string;
  associationFields?: SchemaField[];
}

type FieldCondition = {
  id: string;
  key?: string;
  value?: any;
  op?: string;
  filter?: SchemaField;
  valueFrom?: 'fixedValue' | 'form';
  associationFieldsOptions?: LabelValue[];
}

export type RefProps = {
  getDataPer: () => Promise<FilterConfig | string>;
  empty: () => void;
  getDataValues: () => FilterConfig
}

function getValue(
  field: SchemaField, initValue: Array<string | number | Date | LabelValue> | undefined,
): string | number | LabelValue | Date | (string | number | LabelValue | Date)[] | moment.Moment |
  moment.Moment[] {
  if (!initValue || initValue.length === 0) {
    return '';
  }

  if (field.type === 'datetime') {
    return Array.isArray(initValue) ? initValue.map((value) => moment(value as string)) : moment(initValue);
  }

  if (field.enum && field.enum.length) {
    return initValue;
  }

  return initValue[0];
}

const FormFieldSwitch = formFieldWrap({ FieldFC: FieldSwitch });
const FormFieldSelect = formFieldWrap({ FieldFC: Select });

function DataFilter({
  fields,
  associationFields = [],
  className = '',
  initConditions,
  initTag = 'and',
}: Props, ref: React.Ref<any>): JSX.Element {
  const [conditions, setConditions] = useState<FieldCondition[]>([]);
  const [tag, setTag] = useState(initTag);
  const { trigger, control, setValue, getValues, formState: { errors } } = useForm();

  useImperativeHandle(ref, () => ({
    getDataPer: getDataPer,
    getDataValues: getDataValues,
    empty: () => setConditions([]),
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
          value: getValue(filter, condition.value),
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
      if (condition.id === rowID) {
        return {
          ...condition, valueFrom, associationFieldsOptions: getAssociationOptions(condition.filter),
        } as FieldCondition;
      }
      return condition;
    }));
    setValue('condition-' + rowID, '');
  };

  const addCondition = () => {
    setConditions([...conditions, { id: uniqueId() }]);
  };

  const handleRemove = (_id: string) => {
    setConditions(conditions.filter(({ id }) => _id !== id));
  };

  const getDataValues = () => {
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

        _conditions.push({
          ...getCondition(
            condition.filter,
            formData[`condition-${condition.id}`],
            condition.filter.id,
            formData[`operators-${condition.id}`],
          ),
          valueFrom: formData[`valueFrom-${condition.id}`] || 'fixedValue',
        });
      }
    });

    return {
      condition: _conditions,
      tag,
    };
  };

  const getDataPer = () => {
    if (conditions.length === 0) {
      return Promise.resolve({ condition: [], tag });
    }

    return trigger().then((flag) => {
      if (flag) {
        const formData = getValues();
        const _conditions = conditions.filter((condition) => {
          return !!condition.filter;
        }).map((condition) => {
          return getCondition(
            condition.filter as SchemaField,
            formData[`condition-${condition.id}`],
            (condition.filter as SchemaField).id,
            formData[`operators-${condition.id}`],
          );
        });

        return {
          condition: _conditions,
          tag,
        };
      }

      return 'notPass';
    });
  };

  return (
    <div className={className}>
      <div className='flex items-center'>
        满足以下
        <Select
          className='mx-4'
          value={tag}
          onChange={(tag: string) => setTag(tag)}
          options={CONDITION}
        />
        条件的数据
      </div>
      <div className='qxp-data-filter-box beauty-scroll'>
        {conditions.map((condition) => (
          <div key={condition.id} className='flex gap-x-8 mt-24 items-center'>
            <div>
              <Controller
                name={'field-' + condition.id}
                control={control}
                defaultValue={condition.key}
                rules={{ required: true }}
                render={({ field }) => {
                  return (
                    <FormFieldSelect
                      style={{ width: '250px' }}
                      optionClassName='qxp-data-filter-options'
                      error={errors['field-' + condition.id]}
                      register={{ name: field.name, ref: field.ref, value: field.value }}
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
                        style={{ width: '100px' }}
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
                          style={{ width: '100px' }}
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
                          style={{ width: '300px' }}
                          error={errors['condition-' + condition.id]}
                          register={field}
                          options={condition.associationFieldsOptions || []}
                        />
                      ) : (
                        <FormFieldSwitch
                          error={errors['condition-' + condition.id]}
                          register={{ ...field, value: field.value ? field.value : '' }}
                          field={condition.filter}
                          style={{ width: '300px' }}
                        />
                      )
                    )
                    }
                  />
                </div>
              </>
            ) : null}
            <Icon
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
        <span onClick={addCondition} className='text-icon-btn'><Icon name='add' /> 添加筛选条件</span>
      </div>
    </div>
  );
}

export default forwardRef(DataFilter);
