import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
import { isArray, uniqueId } from 'lodash';

import Select from '@c/select';
import FieldSwitch from '@c/field-switch';
import Icon from '@c/icon';
import formFieldWrap from '@c/form-field-wrap';

import { CONDITION, getOperators } from './utils';
import './index.scss';

type Props = {
  fields: Fields[];
  initConditions?: Condition[];
  initTag?: string;
  className?: string;
}

type FieldCondition = {
  id: string;
  key?: string;
  value?: any;
  op?: string;
  filter?: Fields;
}

export type ConditionItemMap = {
  arr: Condition[];
  tag: 'or' | 'and';
}

export type RefProps = {
  getDataPer: () => Promise<ConditionItemMap | string>;
  empty: () => void;
  getDataValues: () => ConditionItemMap
}

function getCondition(formData: any, condition: FieldCondition) {
  let value = formData[`condition-${condition.id}`];
  switch (condition.filter?.type) {
  case 'datetime':
    value = isArray(value) ? value.map((date: string) => {
      return moment(date).format();
    }) : [moment(value).format()];
    break;
  case 'number':
    value = isArray(value) ? value.map((_value) => Number(_value)) : [Number(value)];
    break;
  default:
    value = isArray(value) ? value : [value];
    break;
  }

  return {
    key: formData[`field-${condition.id}`],
    op: formData[`operators-${condition.id}`],
    value,
  };
}

function getValue(field: Fields, initValue: Array<string | number | Date> | undefined) {
  if (!initValue || initValue.length === 0) {
    return '';
  }

  if (field.type === 'datetime') {
    return Array.isArray(initValue) ? initValue.map((value) => moment(value)) : moment(initValue);
  }

  if (field.enum && field.enum.length) {
    return initValue;
  }

  return initValue[0];
}

const FormFieldSwitch = formFieldWrap({ FieldFC: FieldSwitch });
const FormFieldSelect = formFieldWrap({ FieldFC: Select });

function DataFilter({ fields, className = '', initConditions, initTag = 'and' }: Props, ref: React.Ref<any>) {
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
          op: condition.op,
          value: getValue(filter, condition.value),
          key: condition.key,
          filter,
        });
      }
    });
    setConditions(conditionsTmp);
  }, [initConditions]);

  const fieldOption = fields.map((field) => ({
    value: field.id,
    label: field.title,
  }));

  const handleFieldChange = (rowID: string, field: string) => {
    setConditions(conditions.map((condition) => {
      if (condition.id === rowID) {
        return { ...condition, filter: fields.find(({ id }) => id === field) };
      }
      return condition;
    }));
    setValue('operators-' + rowID, '');
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
      return { arr: [], tag };
    }

    const formData = getValues();
    const _conditions: Condition[] = [];
    conditions.forEach((condition) => {
      const value = formData[`condition-${condition.id}`];
      if (
        formData[`field-${condition.id}`] &&
        formData[`operators-${condition.id}`] &&
        value
      ) {
        if (Array.isArray(value) && value.length === 0) {
          return;
        }

        _conditions.push(getCondition(formData, condition));
      }
    });

    return {
      arr: _conditions,
      tag,
    };
  };

  const getDataPer = () => {
    if (conditions.length === 0) {
      return Promise.resolve({ arr: [], tag });
    }

    return trigger().then((flag) => {
      if (flag) {
        const formData = getValues();
        const _conditions = conditions.map((condition) => {
          return getCondition(formData, condition);
        });

        return {
          arr: _conditions,
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
                <div>
                  <Controller
                    name={'condition-' + condition.id}
                    control={control}
                    defaultValue={condition.value}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormFieldSwitch
                        error={errors['condition-' + condition.id]}
                        register={{ ...field, value: field.value ? field.value : '' }}
                        field={condition.filter}
                        style={{ width: '300px' }}
                      />
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
