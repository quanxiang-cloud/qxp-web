import React from 'react';
import cs from 'classnames';

import Icon from '@c/icon';
import Radio from '@c/radio';
import RadioGroup from '@c/radio/group';

import { updateDataField, ApproveDataBasicConfig, CurrentElement } from '../../store';

interface Props {
  type: 'approve' | 'fillIn';
  currentElement: CurrentElement;
}

export default function BasicConfig({ type, currentElement }: Props) {
  const typeText = type === 'approve' ? '审批' : '填写';
  function onAddApprovePerson() {

  }

  function onAddFillInPerson() {

  }

  function onAdd() {
    const handler = type === 'approve' ? onAddApprovePerson : onAddFillInPerson;
    handler();
  }

  console.log(currentElement.data.basicConfig);

  return (
    <div>
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
        <RadioGroup onChange={(v) => updateDataField('approve', 'basicConfig',
          (basicConfig: ApproveDataBasicConfig) => ({
            ...basicConfig,
            multiplePersonApproveWay: v,
          })
        )}>
          <Radio
            name="multiplePersonApproveWay"
            className="mr-16"
            label="或签"
            value="or"
            defaultChecked={currentElement.data.basicConfig.multiplePersonApproveWay === 'or'}
          />
          <Radio
            name="multiplePersonApproveWay"
            className="mr-16"
            label="会签"
            value="and"
            defaultChecked={currentElement.data.basicConfig.multiplePersonApproveWay === 'and'}
          />
        </RadioGroup>
      </div>
      <div className="text-body2-no-color text-gray-600 mb-8">无{typeText}人时</div>
      <div className="flex items-center mb-24">
        <RadioGroup onChange={(v) => updateDataField('approve', 'basicConfig',
          (basicConfig: ApproveDataBasicConfig) => ({
            ...basicConfig,
            whenNoApprovePerson: v,
          })
        )}>
          <Radio
            name="whenNoApprovePerson"
            className="mr-16"
            label="自动跳过该节点"
            value="skip"
            defaultChecked={currentElement.data.basicConfig.whenNoApprovePerson === 'skip'}
          />
          <Radio
            name="whenNoApprovePerson"
            className="mr-16"
            label="转交给管理员"
            value="transferAdmin"
            defaultChecked={currentElement.data.basicConfig.whenNoApprovePerson === 'transferAdmin'}
          />
        </RadioGroup>
      </div>
    </div>
  );
}
