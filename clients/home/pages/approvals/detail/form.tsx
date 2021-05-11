import React from 'react';
import cs from 'classnames';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { SchemaForm } from '@formily/antd';

import { visibleHiddenLinkageEffect } from '@c/form-builder';
import registry from '@c/form-builder/registry';

import { getTaskFormById } from '../api';

type Props = {
  onChange: (value: any) => void;
  className?: string;
}

function parseFormValue(formData: TaskFormData): Record<string, any> {
  return Object.entries(formData).reduce((acc, [key, { value }]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, any>);
}

function TaskForm({ onChange, className }: Props): JSX.Element {
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
    <div className={cs('task-form', className)}>
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
