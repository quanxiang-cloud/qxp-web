import React, { useContext, useEffect } from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { useMutation } from 'react-query';
import usePrevious from 'react-use/lib/usePrevious';

import { StoreContext } from '../../context';
import { createBlankFormTable } from './api';
import { ActionsContext } from './config-form';

function Subordination(originalProps: ISchemaFieldComponentProps): JSX.Element {
  const { actions } = useContext(ActionsContext);
  const { appID } = useContext(StoreContext);

  const runnerMap: Record<string, Function> = {
    sub_table: onSubTable,
    foreign_table: onForeignTable,
  };

  const createTableMutation = useMutation(createBlankFormTable, {
    onSuccess: (data) => {
      data?.tableID && actions.getFieldState('Fields.linkedTable', (state) => {
        actions.setFieldState('Fields.linkedTable', (st) => {
          st.value = Object.assign(state.value || {
            appID: '',
            tableID: '',
            tableName: '',
          }, { tableID: data.tableID });
        });
      });
    },
  });

  function onSubTable() {
    createTableMutation.mutate({ appID });
    actions.setFieldState('Fields.items', (state) => {
      state.value = {
        type: 'object',
        properties: {},
      };
    });
  }

  function onForeignTable() {
    actions.setFieldState('Fields.items', (state) => {
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
