import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
import { isArray, uniqueId } from 'lodash';

import Select from '@c/select';
import FieldSwitch from '@appC/field-switch';
import Icon from '@c/icon';
import Button from '@c/button';
import formFieldWrap from '@appC/form-field-wrap';
import toast from '@lib/toast';
import { fetchDataAccessPer, saveDataAccessPer } from '@appLib/api';

import { getFilterField } from '../../utils';
import store from '../../store';

type Props = {
  rightsID: string;
}

const CONDITION = [{
  label: '所有',
  value: 'and',
},
{
  label: '任一',
  value: 'or',
}];

const OPERATORS = [
  {
    label: '等于',
    value: 'eq',
  },
  {
    label: '模糊',
    value: 'like',
  },
  {
    label: '包含',
    value: 'in',
  },
];

const FormFieldSwitch = formFieldWrap({ FieldFC: FieldSwitch });
const FormFieldSelect = formFieldWrap({ FieldFC: Select });

export default function DataPermission({ rightsID }: Props) {
  const [conditions, setConditions] = useState<any[]>([]);
  const [tag, setTag] = useState('all');
  const { handleSubmit, control, formState: { errors } } = useForm();

  const fieldList = store.fieldList.map((field) => getFilterField(field));

  useEffect(() => {
    fetchDataAccessPer(rightsID).then((res) => {
      setConditions(
        res.data.conditions.map((condition: any) => {
          const filtrate: FilterField | undefined = fieldList.find(({ id }) => {
            return id === condition.key;
          });

          if (!filtrate) {
            return {};
          }

          return {
            id: uniqueId(),
            op: condition.op,
            value: filtrate.multiple ? condition.value : condition.value[0],
            key: condition.key,
            filtrate,
          };
        })
      );
    });
  }, []);

  const fieldOption = fieldList.map((field) => ({
    value: field.id,
    label: field.label,
  }));

  const handleFieldChange = (rowID: number, field: string) => {
    setConditions(conditions.map((condition) => {
      if (condition.id === rowID) {
        return { ...condition, filtrate: fieldList.find(({ id }) => id === field) };
      }
      return condition;
    }));
  };

  const addCondition = () => {
    setConditions([...conditions, { id: uniqueId() }]);
  };

  const handleRemove = (_id: number) => {
    setConditions(conditions.filter(({ id }) => _id !== id));
  };

  const handleSave = (formData: any) => {
    const _conditions = conditions.map((condition) => {
      let value = formData[`condition-${condition.id}`];

      if (!isArray(value)) {
        value = moment(value).isValid() ? [new Date(value).getTime()] : [value];
      }

      return {
        key: formData[`field-${condition.id}`],
        op: formData[`operators-${condition.id}`],
        value,
      };
    });
    saveDataAccessPer({ perGroupID: rightsID, tag, conditions: _conditions }).then(() => {
      toast.success('保存成功！');
    });
  };

  return (
    <div>
      <div className='flex items-center'>
        筛选出符合以下
        <Select
          className='mx-4'
          value={tag}
          onChange={(tag: string) => setTag(tag)}
          options={CONDITION}
        />
        条件的数据
      </div>
      <form>
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
                      style={{ width: '288px' }}
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
            <Controller
              name={'operators-' + condition.id}
              control={control}
              defaultValue={condition.op || 'eq'}
              render={({ field }) => (
                <Select
                  {...field}
                  options={OPERATORS}
                  style={{ width: '120px' }}
                />
              )
              }
            />
            {condition.filtrate ? (
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
                      filtrate={condition.filtrate}
                      style={{ width: '420px' }}
                    />
                  )
                  }
                />
              </div>
            ) : null}
            <Icon
              clickable
              changeable
              onClick={() => handleRemove(condition.id)}
              name='restore_from_trash'
              size={20}
            />
          </div>
        ))}
      </form>
      <div className='mt-24'>
        <span onClick={addCondition} className='text-icon-btn'><Icon name='add' /> 添加筛选条件</span>
      </div>
      <div className='mt-20'>
        <Button
          modifier='primary'
          forbidden={conditions.length === 0}
          onClick={handleSubmit(handleSave)}
        >
          保存
        </Button>
      </div>
    </div>
  );
}
