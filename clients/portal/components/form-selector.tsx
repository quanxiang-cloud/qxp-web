import React, { forwardRef, Ref, useState } from 'react';
import cs from 'classnames';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import Select from '@c/select';
import Icon from '@c/icon';
import ToolTip from '@c/tooltip';
import toast from '@lib/toast';
import Modal from '@c/modal';
import { noop } from '@lib/utils';

import { getFormDataOptions } from '@flow/detail/content/editor/forms/api';
import { resetElementsData } from '@flow/detail/content/editor/store';
import type { NodeWorkForm } from '@flow/detail/content/editor/type';

interface Props {
  value: NodeWorkForm;
  changeable?: boolean;
  onChange?: (value: NodeWorkForm) => void;
  onResetFormData: (form: NodeWorkForm) => void;
  validating: boolean;
}

function WorkFormSelector(
  { value, changeable = true, onChange = noop, onResetFormData, validating }: Props,
  ref?: Ref<HTMLInputElement>
) {
  const { appID } = useParams<{appID: string}>();
  const [currentWorkTable, setCurrentWorkTable] = useState('');

  const {
    data: options = [],
    isError,
    error = '获取工作表失败',
  } = useQuery(['GET_WORK_FORM_LIST', appID], getFormDataOptions);

  isError && toast.error(error);

  function onWorkFormChange(val: string) {
    if (value.value && value.value != val) {
      setCurrentWorkTable(val);
      return false;
    } else {
      const label = options.find(({ value: _value }) => _value === val)?.label;
      label && onChange({
        value: val,
        name: label,
      });
    }
  }

  function onSubmitWorkFormChange() {
    const label = options.find(({ value }) => value === currentWorkTable)?.label;
    if (!label) {
      return;
    }
    const form = { value: currentWorkTable, name: label };
    resetElementsData('formData', { form });
    onResetFormData(form);
    onCancelSubmitWorkForm();
  }

  function onCancelSubmitWorkForm() {
    setCurrentWorkTable('');
  }

  return (
    <>
      <div className={cs('px-16 py-10 border flex items-center corner-2-8-8-8 h-40', {
        'bg-gray-100 mb-22': !validating || value.value,
        'bg-red-50 border-red-600': validating && !value.value,
      })}>
        <div className="inline-flex items-center mr-8">
          <Icon name="article" size={20} className="mr-8" />
          <span className="text-body2">工作表:</span>
        </div>
        {changeable && (
          <Select
            inputRef={ref}
            name="workForm"
            placeholder="请选择"
            value={value.value}
            onChange={onWorkFormChange}
            className={cs(
              'h-28 border-none px-12 text-12 flex items-center',
              'flex-1 work-flow-form-selector text-body2-no-color',
              {
                'text-gray-900': !validating || value.value,
                'text-gray-400': validating && !value.value,
              },
            )}
            options={options}
          />
        )}
        {!changeable && (
          <ToolTip
            position="top"
            label="已自动关联开始节点工作表，暂不支持更改"
            labelClassName="whitespace-nowrap"
          >
            <Select
              disabled
              inputRef={ref}
              name="workForm"
              placeholder="请选择"
              value={value.value}
              className={cs(
                'h-28 border-none px-12 text-12 flex items-center',
                'flex-1 work-flow-form-selector',
              )}
              options={options}
            />
          </ToolTip>
        )}
        {currentWorkTable && (
          <Modal
            title="更换触发工作表"
            onClose={onCancelSubmitWorkForm}
            footerBtns={[
              {
                text: '取消',
                key: 'cancel',
                onClick: onCancelSubmitWorkForm,
              },
              {
                text: '确定',
                key: 'confirm',
                modifier: 'primary',
                onClick: onSubmitWorkFormChange,
              },
            ]}
          >
            <p className="text-body2">
              更换新的触发工作表后，该节点及其他关联节点配置将会被重置，确定要更换吗？
            </p>
          </Modal>
        )}
      </div>
      {validating && !value.value && (
        <div className="mb-22 text-caption-no-color text-red-600 mt-4">
          请选择一张工作表用以触发工作流
        </div>
      )}
    </>
  );
}

export default forwardRef(WorkFormSelector);
