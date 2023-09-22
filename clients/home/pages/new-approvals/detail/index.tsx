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
import Icon from '@c/icon';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import toast from '@lib/toast';
import { FormRenderer } from '@c/form-builder';
import { buildQueryRef } from '@lib/http-client-form';

import Panel from './panel';
import Toolbar from './toolbar';
import { getPipelineFillInDetail, getPipelineFormData, getPipelineFormSchemaInfo, getPipelineInfo, getPipelineProcessHistories } from '../api';
import store from './store';

import './index.scss';
import Button from '@c/button';
import { FILL_IN } from '../constant';
import Tab from '@c/tab';
import Dynamic from './dynamic';
import Discuss from './discuss';
import ActionModals from './action-modals';

const globalActionKeys = [
  'canMsg', 'canViewStatusAndMsg', 'hasCancelBtn',
  'hasCcHandleBtn', 'hasReadHandleBtn', 'hasResubmitBtn', 'hasUrgeBtn',
];

function ApprovalDetail(): JSX.Element {
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
  const [flowID, setFlowID] = useState();
  const [pipelineInfo, setPilelineInfo] = useState<any>();
  const [data, setData] = useState<any>({});
  const [nodeData, setNodeData] = useState<any>();
  const [formData, setFormData] = useState<any>();
  const [appID, setAppID] = useState<any>();
  const [tableID, setTableID] = useState<any>();

  const { processInstanceID, type, taskID, taskType } = useParams<{
    processInstanceID: string;
    taskID: string;
    type: string;
    taskType: string;
  }>();

  const history = useHistory();
  const queryRelationKey = showSwitch ? [processInstanceID, type, currentTaskId] : [processInstanceID, type];

  const getApprovel = () => {
    return getPipelineProcessHistories(processInstanceID as any).then((res)=>{
      const { Data } = res || {};
      return Data?.find((item: any)=>{
        if (item?.id === taskID) {
          setFlowID(item?.flowID);
          setNodeData(item);
        }
        return item?.id === taskID;
      });
    }).catch(()=>{
      return null;
    });
  };

  const getFillIn = () => {
    return getPipelineFillInDetail(taskID).then((res)=>{
      setFlowID(res?.flowID || res?.flowIDd);
      setNodeData({ flowID: res?.flowIDd, ...res });
      return res;
    }).catch(()=>{
      return null;
    });
  };
  const {
    isLoading, data: _data, isError, error,
  } = useQuery<any, Error>(
    queryRelationKey,
    ()=>{
      if (taskType === FILL_IN) {
        return getFillIn();
      } else {
        return getApprovel();
      }
    },
  );

  const task = useMemo(() => {
    const taskDetailData = get(data, 'taskDetailModels', [])?.find(
      (taskItem: Record<string, any>) => taskItem?.formSchema !== null,
    );
    return taskDetailData ? taskDetailData : get(data, 'taskDetailModels[0]', {});
  }, [data]);

  useEffect(()=>{
    if (flowID) {
      getPipelineInfo(flowID).then((res: any)=>{
        setPilelineInfo(res);
      });
    }
  }, [flowID]);

  useEffect(()=>{
    if (pipelineInfo) {
      const { config, spec: { params, nodes } } = pipelineInfo || {};
      const appID = params?.find((item: any)=>item?.name === 'appID')?.default;
      const tableID = params?.find((item: any)=>item?.name === 'tableID')?.default;
      const curentNode = nodes?.find((item: any)=>item?.name === nodeData?.nodeDefKey);

      setAppID(appID);
      setTableID(tableID);
      const btnObj = {
        hasCancelBtn: false,
        hasResubmitBtn: false,
        hasReadHandleBtn: false,
        hasCcHandleBtn: false,
        hasUrgeBtn: false,
      };
      if (type === 'APPLY_PAGE') {
        btnObj.hasCancelBtn = true;
        btnObj.hasUrgeBtn = true;
      }

      getPipelineFormSchemaInfo(appID, tableID).then((res: any)=>{
        const nodeInfo = JSON.parse(curentNode?.spec?.params?.find((item: any)=>item?.key === 'nodeInfo')?.value || null);
        const { fieldPermission, operatorPermission } = nodeInfo?.data?.businessData || {};
        const reaultList = ['agree', 'reject', 'recall'];
        const isFinish = !!reaultList?.includes(nodeData?.result);
        const fillInOperatorPermission = {
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
        const _data: any = {
          appId: appID,
          canMsg: config?.canMsg === 1,
          canViewStatusAndMsg: config?.canViewStatusMsg === 1,
          flowName: pipelineInfo?.displayName,
          tableId: tableID,
          ...btnObj,
        };
        const taskDetailModelsObj = {
          taskId: taskID,
          taskDefKey: nodeData?.nodeDefKey,
          formSchema: res?.schema,
          fieldPermission: fieldPermission,
          operatorPermission: !isFinish && (taskType === 'fillIn' ? fillInOperatorPermission : operatorPermission),
          taskType: isFinish ? 'Finish' : 'REVIEW',
          taskName: '',
        };
        _data.taskDetailModels = [taskDetailModelsObj];
        setData(_data);
      });
    }
  }, [pipelineInfo]);

  useEffect(()=>{
    if (!taskID || !task?.formSchema) {
      return;
    }
    getPipelineFormData(
      appID,
      tableID,
      {
        query: {
          term: {
            _id: nodeData?.formDataID,
          },
        },
        ref: buildQueryRef(task.formSchema),
      },

    ).then((res: any)=>{
      setFormData(res?.entity);
    }).catch((err) => {
      toast.error(err);
    });
  }, [processInstanceID, taskID, task.formSchema]);

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

  useEffect(()=>{
    if (count > 0) {
      const { value, currTask, reasonRequired } = actionParams;
      validate ? store.handleClickAction(value, currTask, reasonRequired) : toast.error('必填项未填写完整');
    }
  }, [count]);

  const onSubmitClick = (value: any, currTask: any, reasonRequired: any)=>{
    setActionParams({ value, currTask, reasonRequired });
    submitRef?.current?.click();
  };

  const formatProperties = (data: any, fieldPermission?: any)=>{
    for (const key in data) {
      if (data[key].type === 'object') {
        formatProperties(data[key].properties, fieldPermission);
      } else {
        data[key]?.description && (data[key].description = '');
        try {
          if (fieldPermission) {
            if (isNumber(fieldPermission[key] || fieldPermission[key]?.['x-internal']?.permission)) {
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
    return (
      <div className='task-form overflow-auto px-24'>
        <FormRenderer
          value={formData}
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
                      content: (<Dynamic onTaskEnd={setTaskEnd} detailData={data} />),
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