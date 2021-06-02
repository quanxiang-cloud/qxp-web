import React, { useContext, useEffect } from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import usePrevious from 'react-use/lib/usePrevious';

import { createBlankFormTable } from './api';
import { ActionsContext } from './config-form';

function Subordination(originalProps: ISchemaFieldComponentProps): JSX.Element {
  const { appID } = useParams<{ appID: string }>();
  const actions = useContext(ActionsContext);

  const runnerMap: Record<string, Function> = {
    sub_table: onSubTable,
    foreign_table: onForeignTable,
  };

  const createTableMutation = useMutation(createBlankFormTable, {
    onSuccess: (data) => {
      data?.tableID && actions.setFieldState('Fields.tableID', (state) => {
        state.value = data.tableID;
      });
    },
  });

  function onSubTable() {
    createTableMutation.mutate({ appID });
  }

  function onForeignTable() {
    actions.setFieldState('Fields.items', (state) => {
      console.log('here');
      state.value = {
        type: 'object',
        properties: {},
      };
    });
  }

  const prevValue = usePrevious(originalProps.value);
  useEffect(() => {
    if (prevValue && prevValue !== originalProps.value) {
      const runner = runnerMap[originalProps.value];
      runner();
    }
  }, [originalProps.value]);

  function onChange(e: RadioChangeEvent) {
    originalProps.mutators.change(e);
  }

  return (
    <Radio.Group
      value={originalProps.value}
      onChange={onChange}
    >
      {originalProps.props.enum.map(({ label, value }: Record<string, string>) => {
        return (
          <Radio key={value} value={value}>{label}</Radio>
        );
      })}
    </Radio.Group>
  );
}

Subordination.isFieldComponent = true;

export default Subordination;
