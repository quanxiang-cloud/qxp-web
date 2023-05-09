/* eslint-disable max-len */
import React, { useState } from 'react';
import { cond, equals, always, T } from 'ramda';

import EmployeeOrDepartmentPicker from '@c/employee-or-department-picker';
import RadioGroup from '@c/radio/group';
import Radio from '@c/radio';
import Select from '@c/select';
import useObservable from '@lib/hooks/use-observable';
import store from '@flow/content/editor/store';
import type { StoreValue } from '@flow/content/editor/type';
import { ApprovePersonType, ApprovePerson } from '@flow/content/editor/type';

import SpecifyPerson from './specify-person';
import SpecifyField from './specify-field';
import SpecifyFlowVariable from './specify-flow-variable';
import { personTypeOptions, positionOptions } from './constants';

interface Props {
  value: ApprovePerson;
  typeText?: string;
  onChange?: (data: ApprovePerson) => void;
  nodeType?: string;
}

export default function PersonPicker({ value, typeText, onChange, nodeType }: Props): JSX.Element {
  const { users: employees = [], departments = [], type = 'person', positions = [], variablePath } = value || {};
  const { validating } = useObservable<StoreValue>(store);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);

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

  function handleTypeChange(currentType: string | number | boolean): void {
    onUpdate<ApprovePersonType>('type', currentType as ApprovePersonType);
  }

  function handleFieldChange(currentFields: string[]): void {
    onUpdate<string[]>('fields', currentFields);
  }

  function handlePositionChange(currentPositions: string[]): void {
    onUpdate<string[]>('positions', currentPositions);
  }

  function handleVariablePathChange(variablePath: string): void {
    onUpdate<string>('variablePath', variablePath);
  }

  function onDeletePerson(id: string): void {
    onSetPersons(
      departments.filter((department) => department.id !== id),
      employees.filter((employee) => employee.id !== id),
    );
  }

  const specifyPerson = (): JSX.Element => (
    <SpecifyPerson
      onDelete={onDeletePerson}
      validating={validating}
      value={value}
      onAdd={onAdd}
      typeText={typeText}
    />
  );

  const specifyField = (): JSX.Element => (
    <SpecifyField
      value={value}
      onFieldChange={handleFieldChange}
      validating={validating}
      typeText={typeText}
    />
  );

  const position = (): JSX.Element => (
    <Select<string>
      multiple
      options={positionOptions}
      value={positions}
      onChange={handlePositionChange}
    />
  );

  const specifyFlowVariable = (): JSX.Element => (
    <SpecifyFlowVariable value={variablePath} onChange={handleVariablePathChange} />
  );

  const getPickerHandler = cond([
    [equals('person'), always(specifyPerson)],
    [equals('field'), always(specifyField)],
    [equals('position'), always(position)],
    [equals('superior'), always(() => <></>)],
    [equals('leadOfDepartment'), always(() => <></>)],
    [equals('processInitiator'), always(() => <></>)],
    [T, always(specifyFlowVariable)],
  ]);
  const PersonPicker = getPickerHandler(type);

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
          {personTypeOptions.filter((item)=>{
            if (nodeType === 'fillIn' && item.value === 'processVariable') {
              return false;
            }
            return true;
          }).map(({ label, value: val }) => (
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
      <PersonPicker />
    </div>
  );
}
