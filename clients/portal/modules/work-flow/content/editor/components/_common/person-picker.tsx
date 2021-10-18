import React, { useState, useContext } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';
import Tag from '@c/tag';
import EmployeeOrDepartmentPicker from '@c/employee-or-department-picker';
import RadioGroup from '@c/radio/group';
import Radio from '@c/radio';
import Select from '@c/select';
import FlowTableContext from '@flow/content/editor/forms/flow-source-table';
import useObservable from '@lib/hooks/use-observable';
import store from '@flow/content/editor/store';
import type { StoreValue } from '@flow/content/editor/type';

import { ApprovePersonType, ApprovePerson } from '@flow/content/editor/type';
import ValidatingTips from './validating-tips';
import { personTypeOptions } from '../../forms/constants';

const positionOptions = [
  {
    label: '产品经理',
    value: 'productManager',
  },
  {
    label: '研发工程师',
    value: 'R&D',
  },
];

interface Props {
  value: ApprovePerson;
  typeText?: string;
  onChange?: (data: ApprovePerson) => void;
}

export default function PersonPicker({ value, typeText, onChange } : Props): JSX.Element {
  const { validating } = useObservable<StoreValue>(store);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const { tableSchema } = useContext(FlowTableContext);

  const fieldOptions = tableSchema.filter((schema) => {
    return schema.componentName === 'userpicker';
  }).map((schema) => {
    return { label: schema.title as string, value: schema.fieldName };
  });

  function onUpdate<T>(key: string, val: T): void {
    onChange?.({ ...value, [key]: val });
  }

  function onAdd(): void {
    setShowAddPersonModal(true);
  }

  async function onSetPersons(
    departments: EmployeeOrDepartmentOfRole[],
    users: EmployeeOrDepartmentOfRole[],
  ): Promise<boolean> {
    onChange?.({ ...value, users, departments });
    return true;
  }

  const {
    users: employees,
    departments,
    type = 'person',
    positions = [],
    fields = [],
  } = value;
  const tagBackgroundColorMap = {
    1: 'var(--blue-100)',
    2: 'var(--yellow-100)',
  };
  const tagIconNameMap = {
    1: 'person-filled',
    2: 'device_hub',
  };

  function handleTypeChange(currentType: string | number | boolean): void {
    onUpdate<ApprovePersonType>('type', currentType as ApprovePersonType);
  }

  function handleFieldChange(currentFields: string[]): void {
    onUpdate<string[]>('fields', currentFields);
  }

  function handlePositionChange(currentPositions: string[]): void {
    onUpdate<string[]>('positions', currentPositions);
  }

  return (
    <div className="mb-24">
      {showAddPersonModal && (
        <EmployeeOrDepartmentPicker
          title={typeText || ''}
          submitText="确认添加"
          onSubmit={onSetPersons}
          onCancel={() => setShowAddPersonModal(false)}
          employees={employees}
          departments={departments}
        />
      )}
      <div className="text-body2-no-color text-gray-600 mb-10">
        <span className="text-red-600">*</span>{typeText}
      </div>
      <div className="grid grid-rows-2 grid-cols-2 mb-10">
        <RadioGroup onChange={handleTypeChange}>
          {personTypeOptions.map(({ label, value: val }) => (
            <Radio
              key={val}
              className="mr-16"
              label={label}
              value={val}
              defaultChecked={type === val}
            />
          ))}
        </RadioGroup>
      </div>
      {type === 'person' && (
        <>
          {(!!departments.length || !!employees.length) && (
            <div className="mt-8 mb-12 py-8 px-12 border border-gray-300 corner-2-8-8-8">
              {[...departments, ...employees].map((member: {
                type: 1 | 2, id: string, ownerName: string
              }) => (
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
                    departments.filter(({ id }: { id: string }) => id !== member.id),
                    employees.filter(({ id }: { id: string }) => id !== member.id),
                  )}
                />
              ))}
            </div>
          )}
          <div
            className={cs(
              'flex items-center border border-dashed corner-8-2-8-8',
              'py-5 text-button mt-8 justify-center cursor-pointer h-32', {
                'border-gray-300': !validating || value.users?.length,
                'border-red-300': validating && !value.users?.length,
              },
            )}
            role="button"
            tabIndex={0}
            onClick={onAdd}
          >
            <Icon name="add" className="mr-8" size={20} />
            <span>
              添加{typeText}
            </span>
          </div>
          <ValidatingTips
            validating={validating && !value.users?.length}
            tips={`请添加${typeText}人`}
          />
        </>
      )}
      {type === 'field' && (
        <>
          <Select<string>
            multiple
            options={fieldOptions}
            value={fields}
            onChange={handleFieldChange}
            className={cs(
              {
                'border-gray-300': !validating || value.fields?.length,
                'border-red-300': validating && !value.fields?.length,
              },
            )}
          />
          <ValidatingTips
            validating={validating && !value.fields?.length}
            tips={`请选择${typeText}人`}
          />
        </>
      )}
      {type === 'position' && (
        <Select<string>
          multiple
          options={positionOptions}
          value={positions}
          onChange={handlePositionChange}
        />
      )}
    </div>
  );
}
