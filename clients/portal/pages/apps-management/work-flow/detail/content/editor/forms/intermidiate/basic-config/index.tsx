import React, { ChangeEvent, useState } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';
import Radio from '@c/radio';
import Checkbox from '@c/checkbox';
import Toggle from '@c/toggle';
import Tag from '@c/tag';
import RadioGroup from '@c/radio/group';
import EmployeeOrDepartmentPicker from '@c/employee-or-department-picker';
import Urge from './urge';
import TimerSelector from './timer-selector';
import WhenTimeout from './when-timeout';

import {
  updateDataField,
  BasicNodeConfig,
  CurrentElement,
  WhenTimeout as WhenTimeoutType,
  Urge as UrgeType,
} from '../../../store';

interface Props {
  type: 'approve' | 'fillIn';
  currentElement: CurrentElement;
}

export default function BasicConfig({ type, currentElement }: Props) {
  const [openMore, setOpenMore] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const typeText = type === 'approve' ? '审批' : '填写';

  function onAdd() {
    setShowAddPersonModal(true);
  }

  function onUpdate(keyOrFunc: string | Function, value?: number | boolean | string) {
    if (typeof keyOrFunc === 'string') {
      updateDataField(type, 'basicConfig',
        (basicConfig: BasicNodeConfig) => ({
          ...basicConfig,
          [keyOrFunc]: value,
        })
      );
    } else if (typeof keyOrFunc === 'function') {
      updateDataField(type, 'basicConfig', keyOrFunc);
    }
  }

  function onUpdateAutoRules(e: ChangeEvent<HTMLInputElement>) {
    const { checked, value } = e.target;
    ((basicConfig: BasicNodeConfig) => {
      const { autoRules } = basicConfig;
      return {
        ...basicConfig,
        autoRules: checked ? [...autoRules, value] : autoRules.filter(
          (autoApproveRule) => autoApproveRule !== value
        ),
      };
    });
  }

  function onTimeRuleUpdate(key: 'deadLine' | 'whenTimeout', secondKey: string) {
    return (v:
      string | number | boolean | ChangeEvent<HTMLInputElement> | UrgeType | WhenTimeoutType
    ) => (
      (basicConfig: BasicNodeConfig) => {
        if (!secondKey) {
          return {
            ...basicConfig,
            timeRule: {
              ...basicConfig.timeRule,
              whenTimeout: v,
            },
          };
        }
        return {
          ...basicConfig,
          timeRule: {
            ...basicConfig.timeRule,
            [key]: {
              ...basicConfig.timeRule[key],
              [secondKey as string]: (v as ChangeEvent<HTMLInputElement>).target?.value || v,
            },
          },
        };
      });
  }

  async function onSetPersons(
    departments: EmployeeOrDepartmentOfRole[],
    employees: EmployeeOrDepartmentOfRole[]
  ) {
    updateDataField(type, 'basicConfig',
      (basicConfig: BasicNodeConfig) => ({
        ...basicConfig,
        persons: {
          employees,
          departments,
        },
      })
    );
    return true;
  }

  const { basicConfig } = currentElement.data.businessData;
  const { employees, departments } = basicConfig.persons;

  return (
    <div>
      {showAddPersonModal && (
        <EmployeeOrDepartmentPicker
          title={`选择${typeText}人`}
          submitText="确认添加"
          onSubmit={onSetPersons}
          onCancel={() => setShowAddPersonModal(false)}
          employees={employees}
          departments={departments}
        />
      )}
      <div className="text-body2-no-color text-gray-600">{typeText}人</div>
      {(!!departments.length || !!employees.length) && (
        <div className="mt-8 mb-12 py-8 px-12 border border-gray-300 input-border-radius">
          {[...departments, ...employees].map((member) => (
            <Tag<string>
              className="mr-6 rounded-tl-4 rounded-br-4 mb-8"
              style={{ backgroundColor: 'white' }}
              key={member.id}
              id={member.id}
              value={member.ownerName}
              deleteIconSize={16}
              onDelete={() => onSetPersons(
                departments.filter(({ id }) => id !== member.id),
                employees.filter(({ id }) => id !== member.id),
              )}
            />
          ))}
        </div>
      )}
      <div
        className={cs(
          'flex items-center border border-dashed border-gray-300 small-border-radius',
          'py-5 text-button mb-24 mt-8 justify-center cursor-pointer h-32',
        )}
        onClick={onAdd}
      >
        <Icon name="add" className="mr-8" size={20} />
        <span>添加{typeText}人</span>
      </div>
      <div className="text-body2-no-color text-gray-600 mb-8">多人{typeText}时</div>
      <div className="flex items-center mb-24">
        <RadioGroup onChange={(v) => onUpdate('multiplePersonWay', v)}>
          <Radio
            className="mr-16"
            label="或签"
            value="or"
            defaultChecked={basicConfig.multiplePersonWay === 'or'}
          />
          <Radio
            className="mr-16"
            label="会签"
            value="and"
            defaultChecked={basicConfig.multiplePersonWay === 'and'}
          />
        </RadioGroup>
      </div>
      <div className="text-body2-no-color text-gray-600 mb-8">无{typeText}人时</div>
      <div className="flex items-center mb-24">
        <RadioGroup onChange={(v) => onUpdate('whenNoPerson', v)}>
          <Radio
            className="mr-16"
            label="自动跳过该节点"
            value="skip"
            defaultChecked={basicConfig.whenNoPerson === 'skip'}
          />
          <Radio
            className="mr-16"
            label="转交给管理员"
            value="transferAdmin"
            defaultChecked={basicConfig.whenNoPerson === 'transferAdmin'}
          />
        </RadioGroup>
      </div>
      {type === 'approve' && (
        <>
          <div className="text-body2-no-color text-gray-600 mb-8">自动审批通过规则</div>
          <div className="flex flex-col">
            <Checkbox
              label="审批人为发起人时"
              value="origin"
              className="mb-8 inline-flex"
              labelClassName="text-body2"
              labelStyle={{ color: 'var(--gray-900)' }}
              defaultChecked={basicConfig.autoRules.includes('origin')}
              onChange={onUpdateAutoRules}
            />
            <Checkbox
              label="审批人与上一节点审批人相同时"
              value="parent"
              className="mb-8 inline-flex"
              labelClassName="text-body2"
              labelStyle={{ color: 'var(--gray-900)' }}
              defaultChecked={basicConfig.autoRules.includes('parent')}
              onChange={onUpdateAutoRules}
            />
            <Checkbox
              label="审批人与前置节点 (非上一个节点) 审批人相同时"
              value="previous"
              className="mb-24 inline-flex"
              labelClassName="text-body2"
              labelStyle={{ color: 'var(--gray-900)' }}
              defaultChecked={basicConfig.autoRules.includes('previous')}
              onChange={onUpdateAutoRules}
            />
          </div>
        </>
      )}
      <div className="flex items-center justify-between mb-16">
        <div>
          <div className="text-body2">{typeText}用时限制</div>
          <span className="text-caption">{
            type === 'approve' ?
              '设置审批超时规则，满足条件后可进行催办、按需处理等' :
              '限制该节点填写所需要的时间，满足条件后可进行催办、按需处理等'
          }</span>
        </div>
        <Toggle onChange={(v) => setOpenMore(!!v)} />
      </div>
      <div className={cs('transition overflow-hidden pb-200', {
        visible: openMore,
        invisible: !openMore,
        'h-0': !openMore,
        'h-auto': openMore,
        'opacity-0': !openMore,
        'opacity-1': openMore,
      })}>
        <div className="bg-gray-100 p-16 input-border-radius mb-16">
          <div className="text-body2 mb-8">负责人需在以下时间内处理：</div>
          <RadioGroup onChange={onTimeRuleUpdate('deadLine', 'breakPoint')}>
            <Radio
              className="mb-8 flex"
              label="不处理"
              value="entry"
              defaultChecked={basicConfig.timeRule.deadLine.breakPoint === 'entry'}
            />
            <Radio
              className="mb-8 flex"
              label="自动处理"
              value="firstEntry"
              defaultChecked={basicConfig.timeRule.deadLine.breakPoint === 'firstEntry'}
            />
            <Radio
              className="mb-8 flex"
              label="跳转至其他节点"
              value="flowWorked"
              defaultChecked={basicConfig.timeRule.deadLine.breakPoint === 'flowWorked'}
            />
          </RadioGroup>
          <TimerSelector
            onDayChange={onTimeRuleUpdate('deadLine', 'day')}
            onHoursChange={onTimeRuleUpdate('deadLine', 'hours')}
            onMinutesChange={onTimeRuleUpdate('deadLine', 'minutes')}
            defaultDay={basicConfig.timeRule.deadLine.day}
            defaultHours={basicConfig.timeRule.deadLine.hours}
            defaultMinutes={basicConfig.timeRule.deadLine.minutes}
          />
          <Urge
            onSave={onTimeRuleUpdate('deadLine', 'urge')}
            defaultValue={basicConfig.timeRule.deadLine.urge}
          />
        </div>
        <WhenTimeout
          onChange={onTimeRuleUpdate('whenTimeout', '')}
          defaultValue={basicConfig.timeRule.whenTimeout}
        />
      </div>
    </div>
  );
}
