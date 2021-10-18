import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
import { toArr, FormPath } from '@formily/shared';
import { ArrayList } from '@formily/react-shared-components';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { SchemaField } from '@formily/antd';

import Icon from '@c/icon';
import MoreMenu from '@c/more-menu';
import Button from '@c/button';

import { availableVariableCtx } from './utils';

const RowStyleLayout = styled((props) => <div {...props} />)`
  display: flex;

  .variable-name {
    width: 70px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .ant-btn {
    margin-right: 16px;
  }
  .ant-form-item {
    display: inline-flex;
    margin-right: 16px;
    margin-bottom: 16px;
  }
  > .ant-form-item {
    margin-bottom: 0;
    margin-right: 0;
  }
`;

function getLeftOptions(used: string[], variables: ProcessVariable[]): LabelValue[] {
  return variables
    .filter(({ code }) => !used.includes(code))
    .map(({ code, name }) => ({ label: name, value: code }));
}

function RulesList(props: ISchemaFieldComponentProps): JSX.Element {
  const { value, path, mutators } = props;
  const variables = useContext(availableVariableCtx);
  const used = useMemo(() => {
    // todo fix this type cast
    return (props.value as Array<{ variableName: string; }>).map(({ variableName }) => variableName);
  }, [props.value.length]);
  const leftVariableOptions = getLeftOptions(used, variables || []);

  function handAddRule(variableName: string): void {
    mutators.push({
      variableName,
      valueFrom: 'fixedValue',
      valueOf: undefined,
    });
  }

  return (
    <ArrayList value={value}>
      {toArr(value).map((item, index) => (
        <RowStyleLayout key={index}>
          <SchemaField path={FormPath.parse(path).concat(index)} />
          <Icon
            clickable
            changeable
            name="delete"
            size={32}
            className="mr-15"
            onClick={() => mutators.remove(index)}
          />
        </RowStyleLayout>
      ))}
      {
        leftVariableOptions.length ? (
          <MoreMenu
            menus={leftVariableOptions.map(({ label, value }) => ({ label, key: value }))}
            onMenuClick={handAddRule}
          >
            <Button>新增赋值规则</Button>
          </MoreMenu>
        ) : (<span className="text-caption">所有流程参数已被使用在上方规则中</span>)
      }
    </ArrayList>
  );
}

RulesList.isFieldComponent = true;

export default RulesList;
