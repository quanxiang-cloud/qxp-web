import React, { ChangeEvent, useState } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';
import Radio from '@c/radio';
import Checkbox from '@c/checkbox';
import Toggle from '@c/toggle';
import RadioGroup from '@c/radio/group';
import EmployeeOrDepartmentPicker from '@c/employee-or-department-picker';

import { updateDataField, ApproveDataBasicConfig, CurrentElement } from '../../store';

interface Props {
  type: 'approve' | 'fillIn';
  currentElement: CurrentElement;
}

export default function BasicConfig({ type, currentElement }: Props) {
  const [openMore, setOpenMore] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const typeText = type === 'approve' ? '审批' : '填写';
  function onAddApprovePerson() {
    setShowAddPersonModal(true);
  }

  function onAddFillInPerson() {

  }

  function onAdd() {
    const handler = type === 'approve' ? onAddApprovePerson : onAddFillInPerson;
    handler();
  }

  function onUpdate(keyOrFunc: string | Function, value?: number | boolean | string) {
    if (typeof keyOrFunc === 'string') {
      updateDataField('approve', 'basicConfig',
        (basicConfig: ApproveDataBasicConfig) => ({
          ...basicConfig,
          [keyOrFunc]: value,
        })
      );
    } else if (typeof keyOrFunc === 'function') {
      updateDataField('approve', 'basicConfig', keyOrFunc);
    }
  }

  function onUpdateAutoApproveRules(e: ChangeEvent<HTMLInputElement>) {
    const { checked, value } = e.target;
    onUpdate((basicConfig: ApproveDataBasicConfig) => {
      const { autoApproveRules } = basicConfig;
      return {
        ...basicConfig,
        autoApproveRules: checked ? [...autoApproveRules, value] : autoApproveRules.filter(
          (autoApproveRule) => autoApproveRule !== value
        ),
      };
    });
  }

  function onTimeRuleUpdate(key: 'deadLine' | 'whenTimeout', secondKey: string) {
    return (v: string | number | boolean | ChangeEvent<HTMLInputElement>) => onUpdate(
      (basicConfig: ApproveDataBasicConfig) => {
        return {
          ...basicConfig,
          timeRule: {
            ...basicConfig.timeRule,
            [key]: {
              ...basicConfig.timeRule[key],
              [secondKey]: (v as ChangeEvent<HTMLInputElement>).target?.value || v,
            },
          },
        };
      });
  }

  async function onAddPersonSubmit(
    departments: EmployeeOrDepartmentOfRole[],
    employees: EmployeeOrDepartmentOfRole[]
  ) {
    console.log(JSON.parse(JSON.stringify([...departments, ...employees])));
  }

  const { basicConfig } = currentElement.data.businessData;

  return (
    <div>
      {showAddPersonModal && (
        <EmployeeOrDepartmentPicker
          title={`选择${typeText}人`}
          submitText="确认添加"
          onSubmit={onAddPersonSubmit}
          onCancel={() => setShowAddPersonModal(false)}
          employees={[]}
          departments={[]}
        />
      )}
      <div className="text-body2-no-color text-gray-600">{typeText}人</div>
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
        <RadioGroup onChange={(v) => onUpdate('multiplePersonApproveWay', v)}>
          <Radio
            className="mr-16"
            label="或签"
            value="or"
            defaultChecked={basicConfig.multiplePersonApproveWay === 'or'}
          />
          <Radio
            className="mr-16"
            label="会签"
            value="and"
            defaultChecked={basicConfig.multiplePersonApproveWay === 'and'}
          />
        </RadioGroup>
      </div>
      <div className="text-body2-no-color text-gray-600 mb-8">无{typeText}人时</div>
      <div className="flex items-center mb-24">
        <RadioGroup onChange={(v) => onUpdate('whenNoApprovePerson', v)}>
          <Radio
            className="mr-16"
            label="自动跳过该节点"
            value="skip"
            defaultChecked={basicConfig.whenNoApprovePerson === 'skip'}
          />
          <Radio
            className="mr-16"
            label="转交给管理员"
            value="transferAdmin"
            defaultChecked={basicConfig.whenNoApprovePerson === 'transferAdmin'}
          />
        </RadioGroup>
      </div>
      {type === 'approve' && (
        <>
          <div className="text-body2-no-color text-gray-600 mb-8">自动审批通过规则</div>
          <Checkbox
            label="审批人为发起人时"
            value="origin"
            className="mb-8"
            labelClassName="text-body2"
            labelStyle={{ color: 'var(--gray-900)' }}
            defaultChecked={basicConfig.autoApproveRules.includes('origin')}
            onChange={onUpdateAutoApproveRules}
          />
          <Checkbox
            label="审批人与上一节点审批人相同时"
            value="parent"
            className="mb-8"
            labelClassName="text-body2"
            labelStyle={{ color: 'var(--gray-900)' }}
            defaultChecked={basicConfig.autoApproveRules.includes('parent')}
            onChange={onUpdateAutoApproveRules}
          />
          <Checkbox
            label="审批人与前置节点 (非上一个节点) 审批人相同时"
            value="previous"
            className="mb-24"
            labelClassName="text-body2"
            labelStyle={{ color: 'var(--gray-900)' }}
            defaultChecked={basicConfig.autoApproveRules.includes('previous')}
            onChange={onUpdateAutoApproveRules}
          />
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
      <div className={cs('overflow-hidden transition-all', {
        visible: openMore,
        invisible: !openMore,
        'h-0': !openMore,
        'h-auto': openMore,
        'opacity-0': !openMore,
        'opacity-1': openMore,
      })}>
        <div className="bg-white p-16 input-border-radius mb-16">
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
          <div
            className="flex items-center py-16"
            style={{ borderBottom: '1px solid var(--gray-200)' }}
          >
            <div className="relative mr-12">
              <input
                type="number"
                className="input w-full flex-1"
                style={{ paddingRight: 36 }}
                onChange={onTimeRuleUpdate('deadLine', 'day')}
                defaultValue={basicConfig.timeRule.deadLine.day}
              />
              <span className="absolute right-5 top-1/2 transform -translate-y-1/2
               text-body2-no-color text-gray-400">
                天
              </span>
            </div>
            <div className="relative mr-12">
              <input
                type="number"
                className="input w-full flex-1"
                style={{ paddingRight: 36 }}
                max="24"
                maxLength={2}
                onChange={onTimeRuleUpdate('deadLine', 'hours')}
                defaultValue={basicConfig.timeRule.deadLine.hours}
              />
              <span className="absolute right-5 top-1/2 transform -translate-y-1/2
              text-body2-no-color text-gray-400">
                小时
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                className="input w-full flex-1"
                style={{ paddingRight: 36 }}
                max="60"
                maxLength={2}
                onChange={onTimeRuleUpdate('deadLine', 'minutes')}
                defaultValue={basicConfig.timeRule.deadLine.minutes}
              />
              <span className="absolute right-5 top-1/2 transform -translate-y-1/2
               text-body2-no-color text-gray-400">
                分钟
              </span>
            </div>
          </div>
          <div className="input-border-radius mt-16 bg-gray-100 px-16 py-5 flex items-center
           cursor-pointer">
            <Icon name="timer" className="mr-8" />
            <span>设置催办</span>
          </div>
        </div>
        <div className="bg-white p-16 input-border-radius mb-20">
          <div className="text-body2 mb-8">超时后: </div>
          <RadioGroup onChange={onTimeRuleUpdate('whenTimeout', 'type')}>
            <Radio
              className="mb-8 flex"
              label="不处理"
              value="noDealWith"
              defaultChecked={basicConfig.timeRule.whenTimeout.type === 'noDealWith'}
            />
            <Radio
              className="mb-8 flex"
              label="自动处理"
              value="autoDealWith"
              defaultChecked={basicConfig.timeRule.whenTimeout.type === 'autoDealWith'}
            />
            <Radio
              className="mb-8 flex"
              label="跳转至其他节点"
              value="jump"
              defaultChecked={basicConfig.timeRule.whenTimeout.type === 'jump'}
            />
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
