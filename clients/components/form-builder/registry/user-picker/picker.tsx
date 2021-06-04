import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'

import Modal from '@c/modal'
import EmployeePicker from '@c/employee-or-department-picker/employee-picker'

import Button from '@c/button'
import './index.scss'

interface Props {
    // defaultValue: EmployeeOrDepartmentOfRole[];
    value: EmployeeOrDepartmentOfRole[];
    onChange: (list: EmployeeOrDepartmentOfRole[]) => void;
}

const Picker = ({ value: defaultValue = [], onChange }: Props) => {
    const [visible, setVisible] = useState(false)

    //use ref not state  avoid state change then refresh view
    const valueListRef = useRef<Array<EmployeeOrDepartmentOfRole>>(defaultValue)

    const close = useCallback(() => setVisible(false), [setVisible])

    const handleChange = useCallback((list: EmployeeOrDepartmentOfRole[]) => {
        valueListRef.current = list
        onChange(list)
    }, [onChange])

    const handleSubmit = useCallback(() => {
        onChange(valueListRef.current)
        close()
    }, [onChange, close])

    useEffect(() => {
        if (visible) {
            valueListRef.current = defaultValue
        }
    }, [visible])

    const showName = useMemo(() => defaultValue
        .map(itm => itm.ownerName)
        .join(',')
        .substr(0, 20),
        [defaultValue])

    return <div>
        <div onClick={() => setVisible(v => !v)}>
            {defaultValue.length <= 0
                ? <Button> 选择成员范围</Button>
                : <div className={'text_flow '}>{showName}</div>}

        </div>

        {
            visible && <Modal
                title={"员工可选范围"}
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
                    employees={defaultValue}
                    onChange={handleChange}
                />
            </Modal>
        }
    </div >
}

export default Picker