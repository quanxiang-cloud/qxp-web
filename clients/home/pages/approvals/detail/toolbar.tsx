import React, { useRef, useState } from 'react';
import Icon from '@c/icon';
import Button from '@c/button';
import cs from 'classnames';
import { useParams } from 'react-router-dom';
import { TextArea } from '@QCFE/lego-ui';

import actionMap from './action-map';
import MoreMenu from '@c/more-menu';
import PopConfirm from '@c/pop-confirm';
import toast from '@lib/toast';

import { handleReadTask } from '../api';

interface Props {
  currTask: any;
  className?: string;
  permission: { custom: PermissionItem[], system: PermissionItem[], default?: PermissionItem[] };
  globalActions: Record<string, boolean>;
  onClickAction: (actionKey: TaskHandleType, task: any) => void;
}

const moreActions = [
  { label: <span><Icon name="print" className="mr-12" />打印</span>, key: 'print' },
  // { label: <span><Icon name="share" className="mr-12" />分享</span>, key: 'share' },
  // { label: <span><Icon name="trending_up" className="mr-12" />流转图</span>, key: 'chart' },
];

const getIconByAction = (action: string) => {
  return actionMap[action]?.icon || 'arrow_circle_up';
};

function Toolbar({ currTask, permission, onClickAction, globalActions }: Props) {
  const { processInstanceID, taskID } = useParams<{ processInstanceID: string; taskID: string }>();
  const [comment, setComment] = useState('');
  const commentRef = useRef<{node: HTMLTextAreaElement}>(null);

  const { custom = [], system = [] } = permission;

  // fixme: mock
  // custom = [
  //   'FILL_IN',
  //   'DELIVER',
  //   'STEP_BACK',
  //   'SEND_BACK',
  //   'CC',
  //   // 'ADD_SIGN',
  //   'READ',
  // ].map((v) => {
  //   return ({ enabled: true, value: v, ...actionMap[v] });
  // });
  //
  // system = ['AGREE', 'REFUSE'].map((v: string) => {
  //   return ({ enabled: true, value: v, ...actionMap[v] });
  // });
  //
  // Object.assign(globalActions, {
  //   hasCancelBtn: true,
  //   hasCcHandleBtn: true,
  //   hasReadHandleBtn: true,
  //   hasResubmitBtn: true,
  //   hasUrgeBtn: true,
  // });

  return (
    <div className="approval-detail-toolbar flex justify-between items-center px-10 pb-20 mb-24">
      <div className="left-btns task-custom-actions flex flex-1 flex-wrap">
        {custom.map(({ name, value, enabled, defaultText, text }: PermissionItem, idx) => {
          if (!enabled) {
            return null;
          }
          return (
            <span key={`${value}-${idx}`} onClick={(ev) => onClickAction(value, currTask)}>
              <Icon name={getIconByAction(value)} className="mr-8" />{name ?? text ?? defaultText}
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
          system.map(({ name, value, enabled, defaultText, text }: PermissionItem, idx) => {
            if (!enabled) {
              return null;
            }

            return (
              <Button
                iconName={getIconByAction(value)}
                modifier={value === 'REFUSE' ? 'danger' : 'primary'}
                className={cs(value === 'AGREE' && 'btn-item-done')}
                onClick={() => onClickAction(value, currTask)}
                key={`${value}-${idx}`}
              >
                {name ?? text ?? defaultText}
              </Button>
            );
          })
        }
        {
          Object.entries(globalActions).map(([action, enabled], idx) => {
            if (!enabled) {
              return null;
            }

            if (action === 'hasReadHandleBtn') {
              return (
                <PopConfirm content={(
                  <div>
                    <div className="mb-8" style={{ width: '374px' }}>请输入阅示意见</div>
                    <TextArea
                      rows={2}
                      // @ts-ignore
                      ref={commentRef}
                      name="comment"
                      placeholder=''
                      defaultValue={comment}
                      // onChange={(ev: unknown, value: string) => setComment(value)}
                    />
                    <MoreMenu
                      menus={[
                        { label: '我已阅示，非常赞同', key: '我已阅示，非常赞同' },
                        { label: '我已阅示，这个情况还是慎重处理吧', key: '我已阅示，这个情况还是慎重处理吧' },
                        { label: '我已阅示', key: '我已阅示' },
                      ]}
                      onMenuClick={(key) => {
                        setComment(key);
                        // @ts-ignore
                        commentRef?.current?.setState({ value: key });
                      }}
                    >
                      <span className="inline-flex text-blue-600 mt-20 cursor-pointer">选择常用语</span>
                    </MoreMenu>
                  </div>
                )}
                okText="提交"
                onOk={()=> {
                  handleReadTask(processInstanceID, taskID, commentRef?.current?.node.value || '').then((data) => {
                    if (data) {
                      toast.success('操作成功');
                    } else {
                      toast.error('操作失败');
                    }
                  }).catch((err)=> toast.error(err.message || '操作失败'));
                }}
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
