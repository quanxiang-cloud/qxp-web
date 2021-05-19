import React, { ChangeEvent, useState } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';
import Radio from '@c/radio';
import Checkbox from '@c/checkbox';
import Toggle from '@c/toggle';
import Tag from '@c/tag';
import RadioGroup from '@c/radio/group';
import EmployeeOrDepartmentPicker from '@c/employee-or-department-picker';
import { toggleArray } from '@lib/utils';
import { mergeDataAdapter } from '@flow/detail/content/editor/utils';

import Urge from './urge';
import TimerSelector from './timer-selector';
import WhenTimeout from './when-timeout';

import type {
  BusinessData,
  BasicNodeConfig,
  NodeType,
} from '@flow/detail/content/editor/type';

interface Props {
  type: NodeType;
  value: BasicNodeConfig;
  onChange: (value: Partial<BusinessData>) => void;
}

export default function BasicConfig({ type, value, onChange: _onChange }: Props) {
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const typeText = type === 'approve' ? '审批' : '填写';
  const { timeRule } = value;

  function onChange(basicConfig: BasicNodeConfig) {
    _onChange({ basicConfig });
  }

  function onAdd() {
    setShowAddPersonModal(true);
  }

  function onUpdate<T>(key: string, val: T): void {
    onChange({ ...value, [key]: val });
  }

  function onUpdateAutoRules(e: ChangeEvent<HTMLInputElement>) {
    const { autoRules } = value;
    const { checked, value: val } = e.target;
    onUpdate('autoRules', toggleArray<string>(autoRules, val, !checked));
  }

  async function onSetPersons(
    departments: EmployeeOrDepartmentOfRole[],
    users: EmployeeOrDepartmentOfRole[]
  ) {
    onUpdate('approvePersons', { users, departments });
    return true;
  }

  function onTimeRuleUpdate<T>(path: string) {
    return (v: T) => onChange(
      mergeDataAdapter<T, BasicNodeConfig>(value, `timeRule.${path}`, () => v)
    );
  }

  const {
    approvePersons: { users: employees, departments },
    timeRule: { deadLine, whenTimeout },
  } = value;
  const tagBackgroundColorMap = {
    1: 'var(--blue-100)',
    2: 'var(--yellow-100)',
  };
  const tagIconNameMap = {
    1: 'person-filled',
    2: 'device_hub',
  };

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
        <div className="mt-8 mb-12 py-8 px-12 border border-gray-300 corner-2-8-8-8">
          {[...departments, ...employees].map((member) => (
            <Tag<string>
              className="mr-8 rounded-tl-4 rounded-br-4 mb-8 overflow-hidden h-24"
              style={{
                backgroundColor: tagBackgroundColorMap[member.type],
                paddingLeft: 0,
              }}
              key={member.id}
              id={member.id}
              value={(
                <div
                  className="rounded-tl-4 flex items-center mr-4 h-full"
                >
                  <div
                    className={cs('flex w-24 justify-center items-center mr-8 h-full', {
                      'bg-blue-600': member.type === 1,
                      'bg-yellow-600': member.type === 2,
                    })}
                  >
                    <Icon name={tagIconNameMap[member.type]} className="text-white" />
                  </div>
                  <span
                    className={cs({
                      'text-blue-600': member.type === 1,
                      'text-yellow-600': member.type === 2,
                    })}
                  >
                    {member.ownerName}
                  </span>
                </div>
              )}
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
          'flex items-center border border-dashed border-gray-300 corner-8-2-8-8',
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
            label={type === 'approve' ? '或签' : '任填'}
            value="or"
            defaultChecked={value.multiplePersonWay === 'or'}
          />
          <Radio
            className="mr-16"
            label={type === 'approve' ? '会签' : '全填'}
            value="and"
            defaultChecked={value.multiplePersonWay === 'and'}
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
            defaultChecked={value.whenNoPerson === 'skip'}
          />
          <Radio
            className="mr-16"
            label="转交给管理员"
            value="transferAdmin"
            defaultChecked={value.whenNoPerson === 'transferAdmin'}
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
              defaultChecked={value.autoRules.includes('origin')}
              onChange={onUpdateAutoRules}
            />
            <Checkbox
              label="审批人与上一节点审批人相同时"
              value="parent"
              className="mb-8 inline-flex"
              labelClassName="text-body2"
              labelStyle={{ color: 'var(--gray-900)' }}
              defaultChecked={value.autoRules.includes('parent')}
              onChange={onUpdateAutoRules}
            />
            <Checkbox
              label="审批人与前置节点 (非上一个节点) 审批人相同时"
              value="previous"
              className="mb-24 inline-flex"
              labelClassName="text-body2"
              labelStyle={{ color: 'var(--gray-900)' }}
              defaultChecked={value.autoRules.includes('previous')}
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
        <Toggle
          onChange={onTimeRuleUpdate('enabled')}
          defaultChecked={timeRule?.enabled}
        />
      </div>
      <div className={cs('transition overflow-hidden pb-200', {
        visible: timeRule?.enabled,
        invisible: !timeRule?.enabled,
        'h-0': !timeRule?.enabled,
        'h-auto': timeRule?.enabled,
        'opacity-0': !timeRule?.enabled,
        'opacity-1': timeRule?.enabled,
      })}>
        <div className="bg-gray-100 p-16 corner-2-8-8-8 mb-16">
          <div className="text-body2 mb-8">负责人需在以下时间内处理：</div>
          <RadioGroup onChange={onTimeRuleUpdate('deadLine.breakPoint')}>
            <Radio
              className="mb-8 flex"
              label="进入该节点后"
              value="entry"
              defaultChecked={deadLine.breakPoint === 'entry'}
            />
            <Radio
              className="mb-8 flex"
              label="首次进入该节点后"
              value="firstEntry"
              defaultChecked={deadLine.breakPoint === 'firstEntry'}
            />
            <Radio
              className="mb-8 flex"
              label="工作流开始后"
              value="flowWorked"
              defaultChecked={deadLine.breakPoint === 'flowWorked'}
            />
          </RadioGroup>
          <TimerSelector
            onDayChange={onTimeRuleUpdate('deadLine.day')}
            onHoursChange={onTimeRuleUpdate('deadLine.hours')}
            onMinutesChange={onTimeRuleUpdate('deadLine.minutes')}
            defaultDay={deadLine.day}
            defaultHours={deadLine.hours}
            defaultMinutes={deadLine.minutes}
          />
          <Urge
            onSave={onTimeRuleUpdate('deadLine.urge')}
            defaultValue={deadLine.urge}
          />
        </div>
        <WhenTimeout
          onChange={onTimeRuleUpdate('whenTimeout')}
          defaultValue={whenTimeout}
        />
      </div>
    </div>
  );
}
