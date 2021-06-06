import React, { useContext, useEffect } from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { useMutation } from 'react-query';

import { ActionsContext, StoreContext } from '../context';
import { createBlankFormTable } from '../api';
import { LINKED_TABLE } from '../constants';

function Subordination({ value, mutators, props }: ISchemaFieldComponentProps): JSX.Element {
  const { actions } = useContext(ActionsContext);
  const { appID } = useContext(StoreContext);

  const runnerMap: Record<string, Function> = {
    sub_table: onSubTable,
    foreign_table: onForeignTable,
  };

  useEffect(() => {
    value === 'sub_table' && onSubTable();
  }, []);

  const createTableMutation = useMutation(createBlankFormTable, {
    onSuccess: (data) => {
      if (!data?.tableID) {
        return;
      }
      actions.getFieldState('Fields.linkedTable', (state) => {
        actions.setFieldState('Fields.linkedTable', (st) => {
          st.value = Object.assign(state.value || LINKED_TABLE, { tableID: data.tableID });
          if (!st.value?.appID) {
            st.value = Object.assign(st.value, { appID });
          }
        });
      });
    },
  });

  function onSubTable() {
    actions.getFieldState('Fields.linkedTable', (state) => {
      if (state.tableID) {
        return;
      }
      createTableMutation.mutate({ appID });
      actions.setFieldState('Fields.subTableSchema', (state) => {
        state.value = {
          type: 'object',
          properties: {},
        };
      });
    });
  }

  function onForeignTable() {
    actions.setFieldState('Fields.subTableColumns', (state) => {
      state.value = [];
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
