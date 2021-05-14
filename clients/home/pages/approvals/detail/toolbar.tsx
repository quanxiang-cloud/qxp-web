import React from 'react';
import Icon from '@c/icon';
import Select from '@c/select';
import Button from '@c/button';
import cs from 'classnames';

import actionMap from './action-map';

interface Props {
  className?: string;
  permission: { custom: PermissionItem[], system: PermissionItem[], default?: PermissionItem[] };
  globalActions: Record<string, boolean>;
  onClickAction: (actionKey: TaskHandleType) => void;
}

const moreActions = [
  { label: '打印', value: 'print' },
  { label: '分享', value: 'share' },
  { label: '流转图', value: 'chart' },
];

const getIconByAction = (action: string) => {
  return actionMap[action]?.icon || 'api';
};

function Toolbar({ permission, onClickAction, globalActions }: Props) {
  const { custom = [], system = [], default: defaultActions = [] } = permission;

  // fixme: mock
  // custom = ['FILL_IN', 'DELIVER', 'STEP_BACK', 'SEND_BACK', 'CC', 'ADD_SIGN', 'READ'].map((v) => {
  //   return ({ enabled: true, value: v, ...actionMap[v] })
  // })
  // defaultActions = ['AGREE', 'REFUSE'].map((v) => {
  //   return ({ enabled: true, value: v, ...actionMap[v] })
  // })
  //
  // Object.assign(globalActions, {
  //   hasCancelBtn: true,
  //   hasCcHandleBtn: true,
  //   hasReadHandleBtn: true,
  //   // hasResubmitBtn: true,
  //   // hasUrgeBtn: true,
  // });

  return (
    <div className="approval-detail-toolbar flex justify-between items-center px-10 pb-20 mb-24">
      <div className="left-btns task-custom-actions flex flex-1 flex-wrap">
        {custom.map(({ name, value, enabled, defaultText, text }: PermissionItem) => {
          if (!enabled) {
            return null;
          }
          return (
            <span key={name} onClick={(ev) => onClickAction(value)}>
              <Icon name={getIconByAction(value)} className="mr-8" />{text ?? defaultText ?? name}
            </span>
          );
        })}
        {
          Object.entries(globalActions).map(([action, enabled]) => {
            if (!enabled) {
              return null;
            }
            return (
              <span key={action} onClick={(ev) => onClickAction(action as TaskHandleType)}>
                <Icon name={getIconByAction(action)} className="mr-8" />{actionMap[action].text}
              </span>
            );
          })
        }
        <span>
          <Select multiple={false} options={moreActions} onChange={() => {}}>
            <span>
              <Icon name="more_horiz" className="mr-8" />更多
            </span>
          </Select>
        </span>
      </div>

      <div className="right-btns task-default-actions">
        {
          (system.concat(defaultActions)).map(({ name, value, enabled, defaultText, text }: PermissionItem) => {
            if (!enabled) {
              return null;
            }

            return (
              <Button
                iconName={getIconByAction(value)}
                modifier={value === 'REFUSE' ? 'danger' : 'primary'}
                className={cs(value === 'AGREE' && 'btn-item-done')}
                onClick={() => onClickAction(value)}
                key={name}
              >
                {text ?? defaultText ?? name}
              </Button>
            );
          })
        }
      </div>
    </div>
  );
}

export default Toolbar;
