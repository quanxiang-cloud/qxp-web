import React, { forwardRef, Ref } from 'react';

import Select from '@c/select';
import Icon from '@c/icon';

import store from '../../store';

export default forwardRef(function FormSelector(_, ref?: Ref<HTMLInputElement>) {
  const options = [{
    label: '出差申请单',
    value: '1',
  }, {
    label: '差旅报销',
    value: '2',
  }, {
    label: '请假单',
    value: '3',
  }, {
    label: '离职申请表',
    value: '4',
  }, {
    label: '测试表单',
    value: '5',
  }, {
    label: '公有云工单示例',
    value: '6',
  }];

  return (
    <div className="flex items-center">
      <div className="inline-flex items-center mr-8">
        <Icon name="folder" size={20} />
        <span className="text-body2">工作表:</span>
      </div>
      <Select
        inputRef={ref}
        name="workForm"
        placeholder="请选择"
        defaultValue={
          store.value.elements.find(({ type }) => type === 'formData')?.data?.form?.value
        }
        onChange={(v: string) => store.next({
          ...store.value,
          elements: store.value.elements.map((element) => {
            const el = { ...element };
            if (element.type === 'formData') {
              el.data.form = { value: v, name: options.find(({ value }) => value === v)?.label };
            }
            return el;
          }),
        })}
        className="h-28 border border-gray-300 select-border-radius
              px-12 text-12 flex items-center flex-1"
        options={options}
      />
    </div>
  );
});
