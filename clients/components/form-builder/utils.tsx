import React from 'react';
import { nanoid } from 'nanoid';
import Icon from '@c/icon';
import { Tooltip } from 'antd';
import styled from 'styled-components';

export const getItemPathArr = (path: string): Array<string> => {
  if (!path) {
    return [];
  }

  const pathArr: string[] = [];
  const dropPathArr = path.split('-');
  dropPathArr.shift();
  if (dropPathArr.length) {
    dropPathArr.forEach((p) => {
      pathArr.push(p);
      pathArr.push('children');
    });
  }
  return pathArr;
};

export const arrayMove = (array: Array<any>, from: number, to: number) => {
  const startIndex = from < 0 ? array.length + from : from;
  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = to < 0 ? array.length + to : to;

    const [item] = array.splice(from, 1);
    array.splice(endIndex, 0, item);
  }
};

const Wrapper = styled.span`
  display: flex;
  align-items: center;
`;

export const createTooltipLabel = (label: string, tooltip: string, action = () => {}) => {
  return (
    <Wrapper>
      {label}
      <Tooltip title={tooltip}>
        <span style={{ display: 'inline-flex' }} onClick={action}>
          <Icon name="question" />
        </span>
      </Tooltip>
    </Wrapper>
  );
};

interface tempOption {
  value: any;
  checked: boolean;
}

export const getvalueSourceOptions = (options: Array<tempOption>, multiple: boolean) => {
  const values: Array<any> = [];
  options.forEach((option) => {
    if (option.checked) values.push(option.value);
  });
  if (values.length) {
    values.sort();
    return multiple ? values : values[0];
  }
  return null;
};

// export const getDefaultValue = (data = [], defaultValue = {}) => {
//   data.forEach((item) => {
//     const { props = {}, children, component } = item;
//     const { name, initialValue, optionType, options } = props as any;
//     if (initialValue) {
//       defaultValue[name] = initialValue;
//     }

//     if (optionType === 'static' && options) {
//       const multiple = props.multiple || component === 'Checkbox';
//       defaultValue[name] = getvalueSourceOptions(options, multiple);
//     }

//     if (Array.isArray(children)) {
//       getDefaultValue(children, defaultValue);
//     }
//   });
//   return defaultValue;
// };

export const uuid = (length: number) => {
  return nanoid(length);
};

export const string2Json = (str: string) => {
  // eslint-disable-next-line no-new-func
  return new Function(`return ${str}`)();
};
