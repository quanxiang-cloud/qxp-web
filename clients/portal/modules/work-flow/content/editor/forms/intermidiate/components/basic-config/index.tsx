import React, { ChangeEvent } from 'react';
import cs from 'classnames';

import Radio from '@c/radio';
import Checkbox from '@c/checkbox';
import Toggle from '@c/toggle';
import RadioGroup from '@c/radio/group';
import { toggleArray } from '@lib/utils';
import { mergeDataAdapter } from '@flow/content/editor/utils';
import PersonPicker from '@flow/content/editor/components/_common/person-picker';
import useObservable from '@lib/hooks/use-observable';
import store from '@flow/content/editor/store';
import type {
  BasicNodeConfig, NodeType, StoreValue, AutoApproveRule, FillInData,
} from '@flow/content/editor/type';

import Urge from './urge';
import TimerSelector from './timer-selector';
import WhenTimeout from './when-timeout';

interface Props {
  type: NodeType;
  value: BasicNodeConfig;
  onChange: (value: Partial<FillInData>) => void;
}

export default function BasicConfig({ type, value, onChange: _onChange }: Props): JSX.Element {
  const { validating } = useObservable<StoreValue>(store);
  const typeText = type === 'approve' ? '审批' : '填写';
  const { timeRule } = value;

  function onChange(basicConfig: BasicNodeConfig): void {
    _onChange({ basicConfig });
  }

  function onUpdate<T>(key: string, val: T): void {
    onChange({ ...value, [key]: val });
  }

  function onUpdateAutoRules(e: ChangeEvent<HTMLInputElement>): void {
    const { autoRules } = value;
    const { checked, value: val } = e.target;
    onUpdate('autoRules', toggleArray<string>(autoRules, val, !checked));
  }

  function onTimeRuleUpdate<T>(path: string) {
    return (v: T) => onChange(
      mergeDataAdapter<T, BasicNodeConfig>(value, `timeRule.${path}`, () => v),
    );
  }

  function autoApproveBuilder(label: string, key: AutoApproveRule): JSX.Element {
    return (
      <Checkbox
        label={
          (<span className="text-body2 text-gray-900">{label}</span>)
        }
        value={key}
        className="mb-8 inline-flex"
        defaultChecked={value.autoRules.includes(key)}
        onChange={onUpdateAutoRules}
      />
    );
  }

  function breakPointBuilder(label: string, key: string): JSX.Element {
    return (
      <Radio
        className="mb-8 flex"
        label={label}
        error={validating && !deadLine.breakPoint}
        value={key}
        defaultChecked={deadLine.breakPoint === key}
      />
    );
  }

  function noPersonBuilder(label: string, key: string): JSX.Element {
    return (
      <Radio
        className="mr-16"
        label={label}
        value={key}
        defaultChecked={value.whenNoPerson === key}
      />
    );
  }

  function multiplePersonBuilder(label: string, key: string): JSX.Element {
    return (
      <Radio
        className="mr-16"
        label={label}
        value={key}
        defaultChecked={value.multiplePersonWay === key}
      />
    );
  }

  const { timeRule: { deadLine, whenTimeout } } = value;

  return (
    <div>
      <PersonPicker
        typeText={`${typeText}人`}
        value={value.approvePersons}
        onChange={(value) => onUpdate('approvePersons', value)}
      />
      <div className="text-body2-no-color text-gray-600 mb-8">
        <span className="text-red-600">*</span>多人{typeText}时
      </div>
      <div className={cs('flex items-center mb-24')}>
        <RadioGroup onChange={(v) => onUpdate('multiplePersonWay', v)}>
          {multiplePersonBuilder(type === 'approve' ? '或签' : '任填', 'or')}
          {multiplePersonBuilder(type === 'approve' ? '会签' : '全填', 'and')}
        </RadioGroup>
      </div>
      <div className="text-body2-no-color text-gray-600 mb-8">
        <span className="text-red-600">*</span>无{typeText}人时
      </div>
      <div className="flex items-center mb-24">
        <RadioGroup onChange={(v) => onUpdate('whenNoPerson', v)}>
          {noPersonBuilder('自动跳过该节点', 'skip')}
          {noPersonBuilder('转交给管理员', 'transferAdmin')}
        </RadioGroup>
      </div>
      {type === 'approve' && (
        <>
          <div className="text-body2-no-color text-gray-600 mb-8">自动审批通过规则</div>
          <div className="flex flex-col">
            {autoApproveBuilder('审批人为发起人时', 'origin')}
            {autoApproveBuilder('审批人与上一节点审批人相同时', 'parent')}
            {autoApproveBuilder('审批人与前置节点 (非上一个节点) 审批人相同时', 'previous')}
          </div>
        </>
      )}
      <div className="flex items-center justify-between mb-16 mt-24">
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
            {breakPointBuilder('进入该节点后', 'entry')}
            {breakPointBuilder('首次进入该节点后', 'firstEntry')}
            {breakPointBuilder('工作流开始后', 'flowWorked')}
          </RadioGroup>
          {validating && !deadLine.breakPoint && (
            <div className={'text-red-600'}>
              请设置处理节点
            </div>
          )}
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
