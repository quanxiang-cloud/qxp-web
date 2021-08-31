import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';
import { pick, get } from 'lodash';

import Breadcrumb from '@c/breadcrumb';
import Switch from '@c/switch';
import { useURLSearch } from '@lib/hooks';
import Tab from '@c/tab';
import Icon from '@c/icon';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import toast from '@lib/toast';
import { FormRenderer } from '@c/form-builder';
import { schemaToMap } from '@lib/schema-convert';

import Panel from './panel';
import Toolbar from './toolbar';
import Dynamic from './dynamic';
import Discuss from './discuss';
import ActionModals from './action-modals';
import * as apis from '../api';
import { wrapSchemaWithFieldPermission } from './utils';
import store from './store';

import './index.scss';

const globalActionKeys = [
  'canMsg', 'canViewStatusAndMsg', 'hasCancelBtn',
  'hasCcHandleBtn', 'hasReadHandleBtn', 'hasResubmitBtn', 'hasUrgeBtn',
];

function ApprovalDetail(): JSX.Element {
  const [search] = useURLSearch();
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [status, setStatus] = useState<FormBuilder.Option[]>([{ label: '', value: '' }]);
  const [showSwitch, setShowSwitch] = useState<boolean>(false);
  const listType = search.get('list') || 'todo';
  const { processInstanceID, type } = useParams<{
    processInstanceID: string;
    type: string
  }>();
  const [currentTaskId, setCurrentTaskId] = useState<string>('');
  const history = useHistory();

  const {
    isLoading, data, isError, error,
  } = useQuery<any, Error>(
    [processInstanceID, currentTaskId, type],
    () => apis.getTaskFormById(processInstanceID, { taskId: currentTaskId, type }),
  );

  const getTask = (): Record<string, any> => {
    return get(data, 'taskDetailModels', []).find(
      (taskItem: Record<string, any>) => taskItem?.formData !== null,
    );
  };

  useEffect(() => {
    document.title = '流程详情';
  }, []);

  useEffect(() => {
    setFormValues(getTask()?.formData || {});
  }, [data]);

  useEffect(() => {
    if (type === 'HANDLED_PAGE') {
      apis.getTaskFormById(processInstanceID, { type }).then((data) => {
        const taskDetailModels = get(data, 'taskDetailModels', []);
        if (taskDetailModels.length > 1) {
          setShowSwitch(true);
          const status = taskDetailModels.map(({ taskName, taskId }: Record<string, string>) => {
            return {
              label: taskName,
              value: taskId,
            };
          });
          setStatus(status);
          setCurrentTaskId(taskDetailModels[0]?.taskId);
        }
      });
    }
  }, []);

  const renderSchemaForm = (task: any): JSX.Element | null => {
    const extraPermissions = [
      ...(task?.fieldPermission?.custom || []),
      ...(task?.fieldPermission?.system || []),
    ];
    const formSchema = wrapSchemaWithFieldPermission(task.formSchema.table, extraPermissions);
    return (
      <div className='task-form'>
        <FormRenderer
          defaultValue={task.formData}
          schema={task?.fieldPermission ? formSchema : task.formSchema.table}
          onFormValueChange={setFormValues}
        />
      </div>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!data || isError) {
    toast.error(error?.message);
    return <ErrorTips />;
  }

  const task = getTask();
  const appID = get(data, 'appId');
  const tableID = get(data, 'tableId');

  return (
    <div>
      <Breadcrumb
        segments={[
          {
            key: 'back', text: '返回', render: () => (
              <span className="inline-flex items-center cursor-pointer" onClick={() => history.goBack()}>
                <Icon name="keyboard_backspace" className="mr-6" />返回
              </span>
            ),
          },
          { key: 'list', text: '审批列表', path: `/approvals?list=${listType}` },
          { key: 'current', text: data?.flowName },
        ]}
        className="px-24 py-20"
      />

      <div className="approval-detail w-full h-full flex px-20">
        <Panel className="flex flex-col flex-1 mr-20 px-24 py-24">
          {
            <>
              {showSwitch && (
                <Switch
                  className="pb-24"
                  onChange={
                    (value: string) => {
                      setCurrentTaskId(value);
                    }
                  }
                  value={currentTaskId}
                  options={status}
                />
              )}
              <Toolbar
                currTask={task}
                permission={task?.operatorPermission || {}}
                globalActions={pick(task, globalActionKeys)}
                onClickAction={store.handleClickAction}
              />
              {renderSchemaForm(task)}
            </>
          }

        </Panel>
        <Panel className="approval-detail-tab w-400">
          <Tab
            items={[
              {
                id: 'history',
                name: '动态',
                content: (<Dynamic />),
              },
              {
                id: 'discuss',
                name: '讨论',
                content: (<Discuss />),
              },
            ]}
          />
        </Panel>
      </div>
      {appID && tableID && (
        <ActionModals
          flowName={data?.flowName}
          formData={formValues}
          defaultValue={task.formData}
          appID={appID}
          tableID={tableID}
          schemaMap={schemaToMap(task?.formSchema?.table)}
        />
      )}
    </div>
  );
}

export default observer(ApprovalDetail);
