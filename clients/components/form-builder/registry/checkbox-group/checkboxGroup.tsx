import React, { SetStateAction, useEffect, useMemo, useState } from 'react';
import cs from 'classnames';
import { Checkbox, Input, Space } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

import useEnumOptions from '@lib/hooks/use-enum-options';
import FormDataValueRenderer from '@c/form-data-value-renderer';
import Icon from '@c/icon';
import toast from '@lib/toast';

const CUSTOM_OTHER_VALUE = 'CUSTOM_OTHER_VALUE';

function useCustomOtherValues(
  options: string[],
  initialValues: string[],
): [string[], React.Dispatch<SetStateAction<string[]>>] {
  const [customValues, setCustomValues] = useState<string[]>([]);
  useEffect(() => {
    if (customValues.length) {
      return;
    }
    const initCustomValues = initialValues?.filter((value) => options.length && !options.includes(value));
    if (initCustomValues.length) {
      setCustomValues(initCustomValues);
    }
  }, [options]);

  return [customValues, setCustomValues];
}

function CheckBoxGroup(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const options = useEnumOptions(fieldProps);
  const [customValues, setCustomValues] = useCustomOtherValues(options, fieldProps.value);
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const { optionsLayout } = fieldProps.props['x-component-props'];
  const isAllowCustom = !!fieldProps.props['x-component-props'].allowCustom;

  useEffect(() => {
    if (!isAllowCustom) {
      setCheckedValues(fieldProps.value);
      return;
    }

    function deep(acc:string[], option:string, index:number):string[] {
      if (index !== -1) {
        const customCheckValue = customCheckValues[index];
        if (!acc.includes(customCheckValue)) {
          return [...acc, customCheckValue];
        } else {
          const _index = customValues.indexOf(option, index + 1);
          return deep(acc, option, _index);
        }
      }
      return acc;
    }

    setCheckedValues(
      fieldProps.value.reduce((acc: string[], option:string) => {
        if (options.includes(option) && !acc.includes(option)) {
          return [...acc, option];
        }
        const index = customValues.indexOf(option);
        return deep(acc, option, index);
      }, []));
  }, [options, fieldProps.value, customValues.length]);

  const customCheckValues = useMemo(() => {
    if (!isAllowCustom) {
      return [];
    }

    return customValues.map((value, index) => `${CUSTOM_OTHER_VALUE}_${index}`);
  }, [customValues]);

  function getRealValue(values:string[]):string[] {
    return values.reduce((acc: string[], option: string) => {
      if (options.includes(option)) {
        return [...acc, option];
      }
      const index = customCheckValues.indexOf(option);
      if (index !== -1) {
        const otherValue = customValues[index];
        return [...acc, otherValue];
      }
      return acc;
    }, []);
  }

  function handleCheckBoxChange(value: Array<CheckboxValueType>): void {
    fieldProps?.mutators?.change(getRealValue((value as string[])));
    setCheckedValues((value as string[]));
  }

  function handleCustomValuesChange(e: React.ChangeEvent<HTMLInputElement>, index:number): void {
    customValues[index] = e.target.value;
    setCustomValues([...customValues]);
  }

  function handleCustomValuesAdd():void {
    if (customValues.length > 2) {
      toast.error('自定义项不可超过三项');
      return;
    }

    setCustomValues([...customValues, '']);
  }

  function handleBlur(index:number):void {
    const value = customValues[index];
    if (value === '') {
      fieldProps?.mutators?.change(
        getRealValue(checkedValues.filter((v: string) => v !== `${CUSTOM_OTHER_VALUE}_${index}`)),
      );
      return;
    }
    if (options.includes(value) || customValues.filter((v, i) => i !== index).includes(value)) {
      toast.error('不可输入重复项');
      customValues[index] = '';
      setCustomValues([...customValues]);
      fieldProps?.mutators?.change(
        getRealValue(checkedValues.filter((v: string) => v !== `${CUSTOM_OTHER_VALUE}_${index}`)),
      );
    } else {
      fieldProps?.mutators?.change(getRealValue(checkedValues));
    }
  }

  if (!options.length) {
    return <span>暂无可选项</span>;
  }

  if (fieldProps.props.readOnly) {
    return <FormDataValueRenderer value={fieldProps.value} schema={fieldProps.schema} />;
  }

  return (
    <div className="flex items-center">
      <Checkbox.Group onChange={handleCheckBoxChange} value={checkedValues}>
        <Space direction={optionsLayout}>
          {options.map((option): JSX.Element => (
            <Checkbox key={option} value={option}>{option}</Checkbox>
          ))}
          {
            isAllowCustom && (
              customValues.map((option, index): JSX.Element => (
                <Checkbox
                  value={customCheckValues[index]}
                  key={customCheckValues[index]}
                  disabled={customValues[index] === ''}
                >
                  <Input
                    className='w-80'
                    value={option}
                    onChange={(e) => handleCustomValuesChange(e, index)}
                    onBlur={() => handleBlur(index)}
                    placeholder="请输入"
                    maxLength={15}
                  />
                </Checkbox>
              ))
            )
          }
        </Space>
        {
          isAllowCustom && (
            <Icon
              className={cs({
                'cursor-not-allowed': customValues.length > 2,
              })}
              name="add"
              size={16}
              clickable
              disabled={customValues.length > 2}
              onClick={handleCustomValuesAdd}
            ></Icon>
          )
        }
      </Checkbox.Group>
    </div>
  );
}

CheckBoxGroup.isFieldComponent = true;

export default CheckBoxGroup;
