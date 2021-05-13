import httpClient from '@lib/http-client';
import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { SchemaForm } from '@formily/antd';

import { visibleHiddenLinkageEffect } from '@c/form-builder';
import registry from '@c/form-builder/registry';

// todo refactor this type
type TaskFormData = Record<string, { title: string; type: 'string' | 'number' | string; value: any }>;
type TaskForm = {
  form: { table: ISchema },
  formData: TaskFormData;
}

type Props = {
  onChange: (value: any) => void;
}

function parseFormValue(formData: TaskFormData): Record<string, any> {
  return Object.entries(formData).reduce((acc, [key, { value }]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, any>);
}

async function getTaskFormById(processInstanceID: string, taskID: string): Promise<TaskForm> {
  return await httpClient(`/api/v1/flow/instance/getTaskForm/${processInstanceID}/${taskID}`);
}

function TaskForm({ onChange }: Props): JSX.Element {
  const { processInstanceID, taskID } = useParams<{ processInstanceID: string; taskID: string }>();
  const {
    isLoading, data, isError,
  } = useQuery<TaskForm, Error>(
    [processInstanceID, taskID],
    () => getTaskFormById(processInstanceID, taskID)
  );

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

  return (
    <div>
      <SchemaForm
        defaultValue={parseFormValue(data.formData)}
        components={{ ...registry.components }}
        schema={data.form.table}
        onChange={onChange}
        effects={() => {
          visibleHiddenLinkageEffect(
            // todo refactor formStore any type
            data.form.table['x-internal']?.visibleHiddenLinkages || []
          );
        }}
      />
    </div>
  );
}

export default TaskForm;
