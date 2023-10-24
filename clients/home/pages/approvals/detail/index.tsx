/* eslint-disable no-empty */
/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useHistory } from 'react-router';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';
import { pick, get, isNumber } from 'lodash';

import Breadcrumb from '@c/breadcrumb';
import RadioButtonGroup from '@c/radio/radio-button-group';
import { useURLSearch } from '@lib/hooks';
import Tab from '@c/tab';
import Icon from '@c/icon';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import toast from '@lib/toast';
import { FormRenderer } from '@c/form-builder';
import { buildQueryRef } from '@lib/http-client-form';
import { getFlowFormData } from '@lib/api/flow';

import Panel from './panel';
import Toolbar from './toolbar';
import Dynamic from './dynamic';
import Discuss from './discuss';
import ActionModals from './action-modals';
import { getFillInDetail, getTaskFormById } from '../api';
import store from './store';

import './index.scss';
import Button from '@c/button';
import { FILL_IN } from '../constant';

const globalActionKeys = [
  'canMsg', 'canViewStatusAndMsg', 'hasCancelBtn',
  'hasCcHandleBtn', 'hasReadHandleBtn', 'hasResubmitBtn', 'hasUrgeBtn',
];

function ApprovalDetail(): JSX.Element {
  const [search] = useURLSearch();
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [status, setStatus] = useState<FormBuilder.Option[]>([{ label: '', value: '' }]);
  const [currentTaskId, setCurrentTaskId] = useState<string>('');
  const [showSwitch, setShowSwitch] = useState<boolean>(false);
  const [taskEnd, setTaskEnd] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [fillTask, setFillTask] = useState<any>({});

  const [validate, setValidate] = useState<boolean>(false);
  const [actionParams, setActionParams] = useState<any>({});
  const submitRef = useRef<any>();

  const listType = search.get('list') || 'todo';
  const { processInstanceID, type, taskID, taskType } = useParams<{
    processInstanceID: string;
    taskID: string;
    type: string;
    taskType: string;
  }>();

  const history = useHistory();
  const queryRelationKey = showSwitch ? [processInstanceID, type, currentTaskId] : [processInstanceID, type];

  const {
    isLoading, data, isError, error,
  } = useQuery<any, Error>(
    queryRelationKey,
    ()=>{
      if (taskType === FILL_IN) {
        return getFillIn();
      }
      return getApprovel();
    },
  );

  const getApprovel = () => getTaskFormById(processInstanceID, { type, taskId: currentTaskId }).then((res) => {
    if (!currentTaskId) {
      setCurrentTaskId(get(res, 'taskDetailModels[0].taskId', '').toString());
    }

    if (type === 'HANDLED_PAGE') {
      const taskDetailModels = get(res, 'taskDetailModels', []);
      if (taskDetailModels.length > 1) {
        setShowSwitch(true);
        const status = taskDetailModels.map(({ taskName, taskId }: Record<string, string>) => {
          return {
            label: taskName,
            value: taskId,
          };
        });
        setStatus(status);
      }
    }

    return res;
  });

  const task = useMemo(() => {
    const taskDetailData = get(data, 'taskDetailModels', [])?.find(
      (taskItem: Record<string, any>) => taskItem?.formSchema !== null,
    );
    return taskDetailData ? taskDetailData : get(data, 'taskDetailModels[0]', {});
  }, [data]);

  const {
    data: formData,
  } = useQuery<any, Error>(
    [processInstanceID, currentTaskId, task?.taskId],
    () => {
      if (!currentTaskId || !task?.formSchema) {
        return Promise.resolve({});
      }
      return getFlowFormData(
        processInstanceID,
        currentTaskId,
        buildQueryRef(task.formSchema),
      ).catch((err) => {
        toast.error(err);
      });
    },
  );

  const getFillIn = () => {
    return getFillInDetail(type, taskID, { ref: buildQueryRef(task?.formSchema) }).then((res) => {
      if (res?.taskType && res.taskType === 'Pending') {
        res.operatorPermission = {
          custom: null,
          system: [
            {
              enabled: true,
              changeable: false,
              name: '提交',
              text: '提交',
              value: 'FILL_IN',
              only: 'filIn',
            },
          ],
        };
      }
      res.taskDetailModels = [JSON.parse(JSON.stringify(res))];
      if (!currentTaskId) {
        setCurrentTaskId(get(res, 'taskDetailModels[0].taskId', '').toString());
      }

      if (type === 'HANDLED_PAGE') {
        const taskDetailModels = get(res, 'taskDetailModels', []);
        if (taskDetailModels.length > 1) {
          setShowSwitch(true);
          const status = taskDetailModels.map(({ taskName, taskId }: Record<string, string>) => {
            return {
              label: taskName,
              value: taskId,
            };
          });
          setStatus(status);
        }
      }
      setFillTask(res);
      return res;
    });
  };

  useEffect(()=>{
    if (task.formSchema) {
      getFillIn();
    }
  }, [JSON.stringify(buildQueryRef(task.formSchema))]);

  useEffect(() => {
    setFormValues(formData);
  }, [formData]);

  useEffect(() => {
    document.title = '流程详情';
  }, []);

  const onSubmitClick = (value: any, currTask: any, reasonRequired: any)=>{
    setActionParams({ value, currTask, reasonRequired });
    submitRef?.current?.click();
  };

  useEffect(()=>{
    if (count > 0) {
      const { value, currTask, reasonRequired } = actionParams;
      validate ? store.handleClickAction(value, currTask, reasonRequired) : toast.error('必填项未填写完整');
    }
  }, [count]);

  const formatProperties = (data: any, fieldPermission?: any)=>{
    for (const key in data) {
      if (data[key].type === 'object') {
        formatProperties(data[key].properties);
      } else {
        data[key]?.description && (data[key].description = '');
        try {
          if (fieldPermission && taskType === FILL_IN) {
            if (isNumber(fieldPermission[key])) {
              data[key]['x-internal'].permission = fieldPermission[key];
            } else {
              fieldPermission?.[key]?.['x-internal']?.permission && (data[key]['x-internal'].permission = fieldPermission[key]['x-internal'].permission);
            }
          }
          if (data[key]?.['x-component'] === 'AssociatedRecords') {
            const componentProps: any = data[key]['x-component-props'];
            componentProps['isNew'] = false;
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const formatFormSchema = (formSchema: any, fieldPermission?: any)=>{
    formSchema && formatProperties(formSchema.properties, fieldPermission);
    return formSchema;
  };

  const renderSchemaForm = (task: any): JSX.Element | null => {
    let _formData = formData;
    if (taskType === FILL_IN) {
      _formData = fillTask?.FormData;
    }
    return (
      <div className='task-form overflow-auto px-24'>
        <FormRenderer
          value={_formData}
          schema={formatFormSchema(task.formSchema, task?.fieldPermission) || {}}
          onFormValueChange={setFormValues}
          readOnly={taskEnd || type === 'APPLY_PAGE' || type === 'HANDLED_PAGE' || task?.taskType === 'Finish' }
          usePermission
          onValidate={(value) => {
            setValidate(value);
            setCount(count + 1);
          }}
        >
          <Button style={{ display: 'none' }} ref={submitRef} type="submit" modifier="primary">submit</Button>
        </FormRenderer>
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
  const appID = get(data, 'appId');
  const tableID = get(data, 'tableId');

  const listText = taskType === FILL_IN ? '填写列表' : '审批列表';
  return (
    <>
      <Breadcrumb
        segments={[
          {
            key: 'back', text: '返回', render: () => (
              <span className="inline-flex items-center cursor-pointer" onClick={() => history.goBack()}>
                <Icon name="keyboard_backspace" className="mr-6" />返回
              </span>
            ),
          },
          // { key: 'list', text: listText, path: `/approvals?list=${listType}` },
          { key: 'current', text: data?.flowName },
        ]}
        className="px-24 py-10"
      />

      <div className="approval-detail w-full h-full flex px-20 gap-20">
        <Panel className="flex flex-col flex-1 bg-white">
          {
            <>
              {showSwitch &&
                (<RadioButtonGroup
                  radioBtnClass="bg-white"
                  onChange={(value) => {
                    setCurrentTaskId(value as string);
                  }}
                  listData={status as any}
                  currentValue={currentTaskId}
                />)
              }
              <Toolbar
                currTask={task}
                permission={task?.operatorPermission || {}}
                globalActions={pick(task, globalActionKeys)}
                onClickAction={store.handleClickAction}
                workFlowType={type}
                schema={task?.formSchema}
                formData={formValues}
                onSubmitClick={onSubmitClick}
                taskType = {taskType}
              />
              <div className='flow-name hidden'>{data?.flowName}</div>
              {renderSchemaForm(task)}
            </>
          }

        </Panel>
        {
          // taskType !== FILL_IN &&
          data.canViewStatusAndMsg && (
            <>
              <div className='approval-detail-tab-name hidden'>审批详情</div>
              <Panel className="approval-detail-tab overflow-auto bg-gray-100">
                <Tab
                  navsClassName="px-16"
                  contentClassName="px-16"
                  items={[
                    {
                      id: 'history',
                      name: '动态',
                      content: (<Dynamic onTaskEnd={setTaskEnd} />),
                    },
                    {
                      id: 'discuss',
                      name: '讨论',
                      content: (<Discuss showInput={data.canMsg} />),
                    },
                  ]} />
              </Panel>
            </>
          )
        }
      </div>
      {(appID || taskType === FILL_IN) && (
        <ActionModals
          flowName={data?.flowName}
          formData={formValues}
          defaultValue={formData}
          appID={appID}
          tableID={tableID}
          schema={task?.formSchema}
        />
      )}
    </>
  );
}

export default observer(ApprovalDetail);
