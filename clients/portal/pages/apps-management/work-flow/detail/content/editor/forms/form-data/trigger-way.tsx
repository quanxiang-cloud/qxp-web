import React, { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, forwardRef, Ref } from 'react';

import store from '../../store';

export default forwardRef(function(
  props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  ref?: Ref<HTMLInputElement>,
) {
  function onChange(name: string) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        store.next({
          ...store.value,
          elements: store.value.elements.map((element) => {
            const el = { ...element };
            if (element.type === 'formData') {
              el.data.triggerWay = name;
            }
            return el;
          }),
        });
      }
    };
  }

  return (
    <div className="mb-24">
      <div className="mb-8">触发方式</div>
      <label htmlFor="whenAdd" className="mb-8 flex items-center cursor-pointer">
        <input
          {...props}
          ref={ref}
          className="mr-6 checkbox__input"
          name="triggerWay"
          id="whenAdd"
          type="checkbox"
          value="whenAdd"
          onChange={onChange('whenAdd')}
          checked={
            store.value.elements.find(
              ({ type }) => type === 'formData'
            )?.data?.triggerWay === 'whenAdd'
          }
        />
          新增数据时
      </label>
      <label htmlFor="whenAlter" className="flex items-center cursor-pointer">
        <input
          {...props}
          ref={ref}
          className="mr-6 checkbox__input"
          name="triggerWay"
          id="whenAlter"
          type="checkbox"
          value="whenAlter"
          onChange={onChange('whenAlter')}
          checked={
            store.value.elements.find(
              ({ type }) => type === 'formData'
            )?.data?.triggerWay === 'whenAlter'
          }
        />
          修改数据时
      </label>
    </div>
  );
});
