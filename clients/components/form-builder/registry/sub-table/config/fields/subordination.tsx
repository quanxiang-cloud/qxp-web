import React, { useContext } from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { useMutation } from 'react-query';

import { ActionsContext } from '../context';
import { createBlankFormTable } from '../api';
import { LINKED_TABLE } from '../constants';

function Subordination({ value, mutators, props }: ISchemaFieldComponentProps): JSX.Element {
  const { actions } = useContext(ActionsContext);

  const runnerMap: Record<string, Function> = {
    sub_table: onSubTable,
    foreign_table: onForeignTable,
  };

  const createTableMutation = useMutation(createBlankFormTable, {
    onSuccess: (data) => {
      if (!data?.tableID) {
        return;
      }
      actions.getFieldState('Fields.linkedTable', (state) => {
        actions.setFieldState('Fields.linkedTable', (st) => {
          st.value = Object.assign(state.value || LINKED_TABLE, { tableID: data.tableID });
        });
      });
    },
  });

  function onSubTable() {
    actions.getFieldState('Fields.linkedTable', ({ value: linkedTable }) => {
      if (value === 'sub_table' && linkedTable.appID) {
        return;
      }
      createTableMutation.mutate({ appID: linkedTable.appID });
      actions.setFieldState('Fields.subTableSchema', (state) => {
        state.value = {
          type: 'object',
          properties: {},
        };
      });
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

  function onChange(e: RadioChangeEvent) {
    const runner = runnerMap[e.target.value];
    runner();
    mutators.change(e);
  }

  return (
    <Radio.Group
      value={value}
      onChange={onChange}
    >
      {props.enum.map(({ label, value }: Record<string, string>) => {
        return (
          <Radio key={value} value={value}>{label}</Radio>
        );
      })}
    </Radio.Group>
  );
}

Subordination.isFieldComponent = true;

export default Subordination;
