import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Modal from '@c/modal';
import Icon from '@c/icon';
import Checkbox from '@c/checkbox';
import { toEs } from '@c/data-filter/utils';
import { exportForm } from '@c/task-lists/api';
import { subscribeStatusChange } from '@c/task-lists/utils';

import { StoreContext } from './context';

type Props = {
  onClose: () => void;
}

const COMPONENTS_SUPPORT_EXPORT: string[] = [
  'Input',
  'Textarea',
  'RadioGroup',
  'CheckboxGroup',
  'Select',
  'NumberPicker',
  'MultipleSelect',
  'DatePicker',
  'UserPicker',
  'OrganizationPicker',
];

function ExportFormModal({ onClose }: Props): JSX.Element {
  const store = useContext(StoreContext);
  const [length, setLength] = useState(0);
  const [checkAll, setCheckAll] = useState(false);
  const [selectedNum, setSelectedNum] = useState(0);
  const [selected, setSelected] = useState<Record<string, { checked: boolean, title: string }>>({});

  useEffect(() => {
    const { fields } = store;
    const optionalField = fields.filter(
      (field) => COMPONENTS_SUPPORT_EXPORT.includes(field['x-component'] as string),
    );
    setLength(optionalField.length);
    const initSelect = Object.assign(
      {},
      ...optionalField.map((field) => ({ [field.fieldName]: { checked: false, title: field.title } })),
    );
    setSelected(initSelect);
  }, []);

  useEffect(() => {
    if (selectedNum === length) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }
  }, [selected]);

  function handleCheckAllChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const selectesTemp = { ...selected };
    setCheckAll(e.target.checked);
    Object.keys(selectesTemp).map((fieldName) => {
      selectesTemp[fieldName].checked = e.target.checked;
    });
    setSelected(selectesTemp);
    setSelectedNum(e.target.checked ? length : 0);
  }

  function handleChange(
    title: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ): void {
    setSelected({ ...selected, [e.target.value]: { checked: e.target.checked, title: title } });
    if (e.target.checked) {
      setSelectedNum(selectedNum + 1);
    } else {
      setSelectedNum(selectedNum - 1);
    }
  }

  async function handSubmit(): Promise<void> {
    const { condition = [], tag = 'must' } = store.params;
    const { condition: frontCondition = [], tag: frontTag } = store.filterConfig || {};
    const query = toEs({ tag: frontTag || tag, condition: [...condition, ...frontCondition] });
    const filterKey: string[] = [];
    const filterName: string[] = [];
    Object.entries(selected).forEach(([key, value]) => {
      if (value.checked) {
        filterKey.push(key);
        filterName.push(value.title);
      }
    });
    const taskID = await exportForm({
      value: {
        appID: store.appID,
        tableID: store.pageID,
        query,
        filterKey,
        filterName,
      },
      title: `【${store.appName}-${store.pageName}】表单数据导出 `,
    });
    subscribeStatusChange(taskID, '导出');
    onClose();
  }

  return (
    <Modal
      title='导出数据'
      onClose={onClose}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: onClose,
        },
        {
          text: '确定',
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          forbidden: !selectedNum,
          onClick: () => handSubmit(),
        },
      ]}
    >
      <div className='rounded-12 rounded-tl-4 mx-16 my-20 flex items-center bg-blue-100 text-blue-600 py-10 px-16'>
        <Icon name='info' color='blue' className='w-16 h-16 fill-current' size={18} />
        <span className='ml-10 text-12'>
          支持：单行文本、多行文本、多选框等基础字段，以及人员选择器、部门选择器字段，其他字段暂不支持
        </span>
      </div>
      <div className='my-16 mx-40 text-gray-900 border-1 border-gray-300 rounded-8 text-12'>
        <div className='pb-field-item-title h-36 rounded-t-8'>
          <div className='h-36 w-36  border-r-1 border-gray-300 flex items-center justify-center'>
            <Checkbox
              onChange={handleCheckAllChange}
              checked={checkAll}
              indeterminate={Boolean(selectedNum) && !checkAll}
            />
          </div>
          <span>字段</span>
        </div>
        {store.fields.map((field) => {
          const { title, fieldName } = field;
          const disabled = !COMPONENTS_SUPPORT_EXPORT.includes(field['x-component'] as string);
          return (
            <div key={fieldName} className='pb-field-item h-36 text-gray-900'>
              <div className='h-36 w-36  border-r-1 border-gray-300 flex items-center justify-center'>
                <Checkbox
                  checked={(!disabled && selected[fieldName]?.checked) || false}
                  value={fieldName}
                  disabled={disabled}
                  onChange={(e) => handleChange(title as string, e)}
                />
              </div>
              <span
                title={title as string}
                className={cs('truncate', {
                  'text-gray-400': disabled,
                })}
              >
                {title}
              </span>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

export default observer(ExportFormModal);

