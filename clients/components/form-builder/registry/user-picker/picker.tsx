import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';

import Modal from '@c/modal';
import EmployeePicker from '@c/employee-or-department-picker/employee-picker';
import Button from '@c/button';
import './index.scss';
import classNames from 'classnames';

interface Props {
  // defaultValue: EmployeeOrDepartmentOfRole[];
  value: EmployeeOrDepartmentOfRole[];
  rangeList: EmployeeOrDepartmentOfRole[];
  onChange: (list: EmployeeOrDepartmentOfRole[]) => void;
  isMy: boolean
}

const Picker = ({ value = [], onChange, isMy, rangeList }: Props) => {
  const [defaultValue, setDefaultValue] = useState<Array<EmployeeOrDepartmentOfRole>>(rangeList || []);
  const [visible, setVisible] = useState(false);

  // use ref not state  avoid state change then refresh view
  const valueListRef = useRef<Array<EmployeeOrDepartmentOfRole>>(defaultValue);

  const close = useCallback(() => setVisible(false), [setVisible]);

  const handleChange = useCallback((list: EmployeeOrDepartmentOfRole[]) => {
    valueListRef.current = list;
    // onChange(list);
  }, [onChange]);

  const handleSubmit = useCallback(() => {
    const list = JSON.parse(JSON.stringify(valueListRef.current));
    onChange(list);
    setDefaultValue(valueListRef.current);
    close();
  }, [onChange, close]);

  useEffect(() => {
    valueListRef.current = defaultValue;
  }, [visible]);

  const showName = useMemo(() => {
    return (defaultValue)
      .map((itm) => itm.ownerName)
      .join(',')
      .substr(0, 20);
  }, [defaultValue]);

  return (
    <div>
      <div
        className={classNames({ disabled_test: isMy })} onClick={() => isMy || setVisible((v) => !v)}>
        {defaultValue.length === 0 ?
          <Button> 选择成员范围</Button> :
          <div className={'text_flow '}>{showName}</div>}
      </div>
      {
        visible && (<Modal
          title={'员工可选范围'}
          onClose={close}
          width={1234}
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
          <EmployeePicker
            className="p-20"
            employees={defaultValue}
            onChange={handleChange}
          />
        </Modal>)
      }
    </div >
  );
};

export default Picker;
