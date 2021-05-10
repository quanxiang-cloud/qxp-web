import httpClient from '@lib/http-client';
import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { SchemaForm } from '@formily/antd';

import { visibleHiddenLinkageEffect } from '@c/form-builder';
import registry from '@c/form-builder/registry';

type TaskForm = {
  form: { table: ISchema },
}

type Props = {
  onChange: (value: any) => void;
}

async function getTaskFormById(processInstanceID: string, taskID: string): Promise<TaskForm> {
  return await httpClient(`/api/v1/flow/instance/getTaskForm/${processInstanceID}/${taskID}`);
}

function TaskForm({ onChange }: Props): JSX.Element {
  const { processInstanceID, taskID } = useParams<{ processInstanceID: string; taskID: string }>();
  const {
    isLoading, data, isError,
  } = useQuery<TaskForm, Error>([processInstanceID, taskID], () => getTaskFormById(processInstanceID, taskID));

  if (isLoading) {
    return (
      <div>loading...</div>
    );
  }

  if (!data || isError) {
    return (
      <div>something wrong, please try again later</div>
    );
  }

  const schema = data.form.table;

  return (
    <div>
      <SchemaForm
        components={{ ...registry.components }}
        schema={schema}
        onChange={onChange}
        effects={() => {
          visibleHiddenLinkageEffect(
            // todo refactor formStore any type
            schema['x-internal']?.visibleHiddenLinkages || []
          );
        }}
      />
    </div>
  );
}

export default TaskForm;
