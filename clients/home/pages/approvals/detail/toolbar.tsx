import React from 'react';
import Icon from '@c/icon';
import Button from '@c/button';
import cs from 'classnames';

import actionMap from './action-map';
import MoreMenu from '@c/more-menu';

interface Props {
  className?: string;
  permission: { custom: PermissionItem[], system: PermissionItem[], default?: PermissionItem[] };
  globalActions: Record<string, boolean>;
  onClickAction: (actionKey: TaskHandleType) => void;
}

const moreActions = [
  { label: <span><Icon name="print" className="mr-12" />打印</span>, key: 'print' },
  { label: <span><Icon name="share" className="mr-12" />分享</span>, key: 'share' },
  { label: <span><Icon name="trending_up" className="mr-12" />流转图</span>, key: 'chart' },
];

const getIconByAction = (action: string) => {
  return actionMap[action]?.icon || 'arrow_circle_up';
};

function Toolbar({ permission, onClickAction, globalActions }: Props) {
  const { custom = [], system = [] } = permission;

  // fixme: mock
  // custom = ['FILL_IN', 'DELIVER', 'STEP_BACK', 'SEND_BACK', 'CC', 'ADD_SIGN', 'READ'].map((v) => {
  //   return ({ enabled: true, value: v, ...actionMap[v] });
  // })
  //
  // system = ['AGREE', 'REFUSE'].map((v: string) => {
  //   return ({ enabled: true, value: v, ...actionMap[v] });
  // })
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
            <span key={`${value}-${idx}`} onClick={(ev) => onClickAction(value)}>
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
              if (key === 'share') {

              }
              if (key === 'chart') {

              }
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
                onClick={() => onClickAction(value)}
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
            return (
              <Button
                iconName={getIconByAction(action)}
                modifier="primary"
                onClick={() => onClickAction(action as TaskHandleType)}
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
