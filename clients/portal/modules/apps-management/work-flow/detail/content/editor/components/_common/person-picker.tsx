import React, { useState, useContext } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';
import Tag from '@c/tag';
import EmployeeOrDepartmentPicker from '@c/employee-or-department-picker';
import RadioGroup from '@c/radio/group';
import Radio from '@c/radio';
import Select from '@c/select';
import FlowTableContext from '@flowEditor/forms/flow-source-table';

import { ApprovePersonType, ApprovePerson } from '@flowEditor/type';

interface Option {
  label: string;
  value: string;
}

const typeOptions: Option[] = [
  {
    label: '指定人员',
    value: 'person',
  },
  {
    label: '表单字段',
    value: 'field',
  },
  {
    label: '上级领导',
    value: 'superior',
  },
  {
    label: '部门负责人',
    value: 'leadOfDepartment',
  },
];

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
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const { tableSchema } = useContext(FlowTableContext);

  const fieldOptions = Object.entries(tableSchema?.properties || {}).reduce((
    cur: Option[], next,
  ) => {
    const [fieldName, fieldSchema] = next;
    if (fieldSchema?.['x-component']?.toLowerCase() === 'userpicker') {
      cur.push({ label: fieldSchema.title as string, value: fieldName });
    }
    return cur;
  }, []) || [];

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
          title={`选择${typeText}人`}
          submitText="确认添加"
          onSubmit={onSetPersons}
          onCancel={() => setShowAddPersonModal(false)}
          employees={employees}
          departments={departments}
        />
      )}
      <div className="text-body2-no-color text-gray-600 mb-10">
        {typeText}
        人
      </div>
      <div className="grid grid-rows-2 grid-cols-2 mb-10">
        <RadioGroup onChange={handleTypeChange}>
          {typeOptions.map(({ label, value: val }) => (
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
              'flex items-center border border-dashed border-gray-300 corner-8-2-8-8',
              'py-5 text-button mt-8 justify-center cursor-pointer h-32',
            )}
            role="button"
            tabIndex={0}
            onClick={onAdd}
          >
            <Icon name="add" className="mr-8" size={20} />
            <span>
              添加
              {typeText}
              人
            </span>
          </div>
        </>
      )}
      {type === 'field' && (
        <Select<string>
          multiple
          options={fieldOptions}
          value={fields}
          onChange={handleFieldChange}
        />
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
