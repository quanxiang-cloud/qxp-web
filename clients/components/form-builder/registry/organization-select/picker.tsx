import React, { useState, useRef, useMemo } from 'react';

import Modal from '@c/modal';
import DepartmentPicker from '@c/employee-or-department-picker/department-picker';

import Button from '@c/button';
import './index.scss';

interface Props {
    // defaultValue: EmployeeOrDepartmentOfRole[];
    value: EmployeeOrDepartmentOfRole[];
    onChange: (list: EmployeeOrDepartmentOfRole[]) => void;
}

const Picker = ({ value: defaultValue = [], onChange }: Props) => {
  const [visible, setVisible] = useState(false);

  const [currentValue, setValue] = useState(defaultValue);

  // use ref not state  avoid state change then refresh view
  const valueListRef = useRef<Array<EmployeeOrDepartmentOfRole>>(defaultValue);

  const close = () => setVisible(false);

  const handleChange = (list: EmployeeOrDepartmentOfRole[]) => {
    setValue(list);
    onChange(list);
  };

  const handleSubmit = () => {
    onChange(currentValue);
    close();
  };

  const showName = useMemo(() => defaultValue
    .map((itm) => itm.ownerName)
    .join(',')
    .substr(0, 20),
  [defaultValue]);

  const open = ()=>{
    setVisible((v) => !v);
    valueListRef.current = defaultValue;
  };

  return (
    <div>
      <div onClick={open}>
        {defaultValue.length <= 0 ?
          <Button> 选择部门范围</Button> :
          <div className={'text_flow '}>{showName}</div>}
      </div>

      {
        visible && (<Modal
          title={'部门可选范围'}
          onClose={close}
          width={764}
          height={760}
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              iconName: 'close',
              onClick: close,
            },
            {
              text: '确定',
              key: 'confirm',
              iconName: 'check',
              modifier: 'primary',
              onClick: handleSubmit,
            },
          ]}

        >
          <DepartmentPicker
            className="p-20"
            departments={valueListRef.current}
            onChange={handleChange}
          />
        </Modal>)
      }
    </div >
  );
};

export default Picker;
