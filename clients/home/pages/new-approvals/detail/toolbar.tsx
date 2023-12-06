import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import cs from 'classnames';
import { Input } from 'antd';

import MoreMenu from '@c/more-menu';
import PopConfirm from '@c/pop-confirm';
import toast from '@lib/toast';
import Icon from '@c/icon';
import Button from '@c/button';

import { getPipelineFillInProcessInfo, getPipelineProcessHistories, handleReadTask } from '../api';
import actionMap from './action-map';
import { FILL_IN } from '../constant';
import { isArray } from 'lodash';

const { TextArea } = Input;
interface Props {
  currTask: any;
  className?: string;
  permission: { custom: PermissionItem[], system: PermissionItem[], default?: PermissionItem[] };
  globalActions: Record<string, boolean>;
  onClickAction: (actionKey: TaskHandleType, task: any, reasonRequired?: boolean) => void;
  onSubmitClick: (actionKey: TaskHandleType, task: any, reasonRequired?: boolean) => void;
  workFlowType?: string;
  schema: ISchema;
  formData: Record<string, unknown>;
  taskType?: string;
}

const moreActions = [
  { label: <span><Icon name="print" className="mr-12" />打印</span>, key: 'print' },
  // { label: <span><Icon name="share" className="mr-12" />分享</span>, key: 'share' },
  // { label: <span><Icon name="trending_up" className="mr-12" />流转图</span>, key: 'chart' },
];

const getIconByAction = (action: string): string => {
  return actionMap[action]?.icon || 'arrow_circle_up';
};

function Toolbar({
  currTask, permission, onClickAction, globalActions, workFlowType, schema, formData, taskType,
  onSubmitClick,
}: Props): JSX.Element {
  const { processInstanceID, taskID } = useParams<{ processInstanceID: string; taskID: string }>();
  const [comment, setComment] = useState('');
  const history = useHistory();

  const [approvalTaskList, setApprovalTaskList] = useState<any>([]);
  const [fillInTaskList, setFillInTaskList] = useState<any>([]);
  const [allTaskList, setAllTaskList] = useState<any>([]);
  const [showBtn, setShowBtn] = useState(true);

  const getApprovel = () => {
    return getPipelineProcessHistories(processInstanceID as any).then((res)=>{
      const { Data } = res || {};
      isArray(Data) && setApprovalTaskList(Data);
    }).catch(()=>{
      return null;
    });
  };

  const getFillIn = () => {
    return getPipelineFillInProcessInfo(processInstanceID).then((res)=>{
      const { data } = res || {};
      isArray(data) && setFillInTaskList(data);
      return res;
    }).catch(()=>{
      return null;
    });
  };

  useEffect(()=>{
    if (processInstanceID) {
      getApprovel();
      getFillIn();
    }
  }, [processInstanceID]);

  useEffect(()=>{
    setAllTaskList([...approvalTaskList, ...fillInTaskList]);
  }, [approvalTaskList, fillInTaskList]);

  useEffect(()=>{
    const nodeResult = allTaskList?.find((item: any)=>item?.id === currTask?.taskId)?.nodeResult;
    if (nodeResult === 'Finish') {
      setShowBtn(false);
    }
  }, [currTask, allTaskList]);
  const { custom = [], system = [] } = permission;
  const systemApproval: any = [
    {
      enabled: true,
      changeable: false,
      name: '通过',
      text: '通过',
      value: 'AGREE',
      only: 'approve',
      reasonRequired: false,
    },
    {
      enabled: true,
      changeable: false,
      name: '拒绝',
      text: '拒绝',
      value: 'REFUSE',
      only: 'approve',
      reasonRequired: true,
    },
  ];
  function handleReadOk(): Promise<never> | undefined {
    if (comment && comment.length > 1000) {
      toast.error('字数不能超过1000字');
      return Promise.reject(new Error('字数不能超过1000字'));
    }
    handleReadTask(processInstanceID, taskID, comment || '').then((data) => {
      if (data) {
        toast.success('操作成功');
        history.push('/approvals?list=todo');
      } else {
        toast.error('操作失败');
      }
    }).catch((err) => toast.error(err.message || '操作失败'));
  }
  return (
    <div className="approval-detail-toolbar flex justify-between items-center py-10 px-24 mb-10">
      <div className="left-btns task-custom-actions flex flex-1 flex-wrap">
        {custom?.map(({ name, value, enabled, defaultText, text }: PermissionItem, idx) => {
          if (!enabled) {
            return null;
          }

          if (workFlowType === 'APPLY_PAGE' && !['hasCancelBtn', 'hasUrgeBtn'].includes(value)) {
            return null;
          }

          return (
            <span key={`${value}-${idx}`} onClick={(ev) => onClickAction(value, currTask)}>
              <Icon name={getIconByAction(value)} className="mr-8" />{text ?? name ?? defaultText}
            </span>
          );
        })}
        <span>
          <MoreMenu
            menus={moreActions}
            placement="bottom-end"
            onMenuClick={(key) => {
              if (key === 'print') {
                setTimeout(window.print, 0);
              }
              // if (key === 'share') {

              // }
              // if (key === 'chart') {

              // }
            }}
          >
            <span className="inline-flex items-center">
              <Icon name="more_horiz" className="mr-8" />更多
            </span>
          </MoreMenu>
        </span>
      </div>

      <div className="right-btns task-default-actions">
        {
          ((taskType !== FILL_IN && workFlowType === 'WAIT_HANDLE_PAGE' && !system?.length) ? systemApproval : system)?.map(({ name, value, enabled, defaultText, text, reasonRequired }: PermissionItem, idx) => {
            if (!enabled) {
              return null;
            }
            if (currTask?.taskType !== 'REVIEW') {
              return null;
            }

            if (workFlowType === 'HANDLED_PAGE') {
              return null;
            }

            if (workFlowType === 'APPLY_PAGE' && !['hasCancelBtn', 'hasUrgeBtn'].includes(value)) {
              return null;
            }

            if (!showBtn) {
              return null;
            }

            return (
              <Button
                iconName={getIconByAction(value)}
                modifier={value === 'REFUSE' ? 'danger' : 'primary'}
                // className={cs(value === 'AGREE' && 'btn-item-done')}
                className={cs(value === 'AGREE' && 'btn-item-done', value === 'FILL_IN' && 'btn-item-submit')}
                onClick={()=>onSubmitClick(value, currTask, reasonRequired)}
                // onClick={async () => {
                //   const isValidate = await validateTaskFrom(schema, formData);
                //   isValidate ? onClickAction(value, currTask, reasonRequired) : toast.error('必填项未填写完整');
                // }}
                key={`${value}-${idx}`}
              >
                {text ?? name ?? defaultText}
              </Button>
            );
          })
        }
        {
          taskType !== FILL_IN &&
          Object.entries(globalActions).map(([action, enabled], idx) => {
            if (!enabled) {
              return null;
            }

            if (currTask?.taskType !== 'REVIEW') {
              return null;
            }

            if (workFlowType === 'HANDLED_PAGE') {
              return null;
            }

            if (workFlowType === 'APPLY_PAGE' && !['hasCancelBtn', 'hasUrgeBtn'].includes(action)) {
              return null;
            }

            if (action === 'hasReadHandleBtn') {
              return (
                <PopConfirm content={(
                  <div>
                    <div className="mb-8" style={{ width: '374px' }}>请输入阅示意见</div>
                    <TextArea
                      rows={2}
                      placeholder=''
                      value={comment}
                      defaultValue={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <MoreMenu
                      menus={[
                        { label: '我已阅示，非常赞同', key: '我已阅示，非常赞同' },
                        { label: '我已阅示，这个情况还是慎重处理吧', key: '我已阅示，这个情况还是慎重处理吧' },
                        { label: '我已阅示', key: '我已阅示' },
                      ]}
                      onMenuClick={(key) => {
                        setComment(key);
                      }}
                    >
                      <span className="inline-flex text-blue-600 mt-20 cursor-pointer">选择常用语</span>
                    </MoreMenu>
                  </div>
                )}
                okText="提交"
                onOk={handleReadOk}
                key={`${action}-${idx}`}
                >
                  <Button
                    iconName={getIconByAction(action)}
                    modifier="primary"
                    key={`${action}-${idx}`}
                  >
                    {actionMap[action].text}
                  </Button>
                </PopConfirm>
              );
            }

            if (['canMsg', 'canViewStatusAndMsg'].includes(action)) {
              return null;
            }

            if (!showBtn) {
              return null;
            }

            return (
              <Button
                iconName={getIconByAction(action)}
                modifier="primary"
                onClick={() => onClickAction(action as TaskHandleType, currTask)}
                key={`${action}-${idx}`}
              >
                {actionMap[action].text}
              </Button>
            );
          })
        }
      </div>
    </div>
  );
}

export default Toolbar;
