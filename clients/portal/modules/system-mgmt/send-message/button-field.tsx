import React, { useState, useMemo } from 'react';
import { toJS } from 'mobx';
import cs from 'classnames';

import Button from '@c/button';
import toast from '@lib/toast';
import Icon from '@c/icon';
import ModalSelectReceiver from '@c/employee-or-department-picker';

export type CheckedInfo = EmployeeOrDepartmentOfRole & {
  name: string;
}

interface Props {
  value?: CheckedInfo[];
  onChange?: (values: CheckedInfo[]) => void;
}

function ButtonField({ value, onChange }: Props): JSX.Element {
  const [openReceiverModal, setOpenReceiverModal] = useState(false);
  const [_chosenDepOrPerson, setChosenDepOrPerson] = useState<CheckedInfo[]>(
    value || []); // 已选中的员工或部门

  const chosenDepOrPerson = useMemo(() => {
    return _chosenDepOrPerson.map(({ id, type, name, ownerName, departmentName }) => (
      { id, type, name: name || ownerName || departmentName }
    ));
  }, [_chosenDepOrPerson]);

  const chooseReceiver = (departments: any[], employees: any[]): Promise<any> => {
    const receivers = [...departments, ...employees].map((d) => toJS(d));
    if (!receivers.length) {
      toast.error('请至少选择一个员工或部门');
      return Promise.reject(new Error('请至少选择一个员工或部门'));
    }
    setOpenReceiverModal(false);
    onChange && onChange(receivers);
    setChosenDepOrPerson(receivers);
    return Promise.resolve(true);
  };

  const removeReceiver = (key: number): void => {
    const receivers = _chosenDepOrPerson.filter((_, idx) => idx !== key);
    setChosenDepOrPerson(receivers);
    onChange && onChange(receivers);
  };

  return (
    <div>
      <Button
        onClick={() => setOpenReceiverModal(true)}
        iconName="add"
      >
        选择
      </Button>
      {openReceiverModal && (
        <ModalSelectReceiver
          onSubmit={chooseReceiver}
          onCancel={() => setOpenReceiverModal(false)}
          title="选择员工或部门"
          submitText="确定选择"
          departments={_chosenDepOrPerson.filter((itm) => itm.type === 2)}
          employees={_chosenDepOrPerson.filter((itm) => itm.type === 1)}
        />
      )}
      <div className="mt-8">
        {chosenDepOrPerson.map(({ id, name, type }: Qxp.MsgReceiver, key) => {
          return (
            <span className={cs('inline-flex items-center bg-blue-100 rounded-tl-4',
              'rounded-br-4 py-2 px-8 mr-8 mb-8 text-blue-600', {
                'text-yellow-600 bg-amber-50': type === 2,
                '': type === 1,
              })} key={id}>
              <span>{name}</span>
              <Icon
                name='close'
                className="relative top-1 w-10 h-10 text-gray-500 cursor-pointer"
                onClick={() => removeReceiver(key)}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default ButtonField;
