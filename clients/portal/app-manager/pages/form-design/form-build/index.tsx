import React, { useState } from 'react';
import { FormBuilder } from '@c/form-builder';
import FormStore from '@c/form-builder/store';
import Button from '@c/button';
import Icon from '@c/icon';

// todo delete this
const testSchemaStr = '{"title":"","type":"object","properties":{"_id":{"readOnly":false,"display":false,"x-component":"Input","x-component-props":{},"x-internal":{"permission":3},"x-index":0,"x-mega-props":{"labelAlign":"top"}},"_created_time":{"readOnly":false,"display":false,"x-component":"Input","x-component-props":{},"x-internal":{"permission":3},"x-index":1,"x-mega-props":{"labelAlign":"top"}},"_updated_time":{"readOnly":false,"display":false,"x-component":"Input","x-component-props":{},"x-internal":{"permission":3},"x-index":2,"x-mega-props":{"labelAlign":"top"}},"_created_by":{"readOnly":false,"display":false,"x-component":"Input","x-component-props":{},"x-internal":{"permission":3},"x-index":3,"x-mega-props":{"labelAlign":"top"}},"_updated_by":{"readOnly":false,"display":false,"x-component":"Input","x-component-props":{},"x-internal":{"permission":3},"x-index":4,"x-mega-props":{"labelAlign":"top"}},"yc3ywkol":{"title":"多行文本","description":"","required":false,"format":"","readOnly":false,"display":true,"x-component":"Textarea","x-component-props":{"placeholder":""},"x-internal":{"sortable":false,"valueSource":"customized","permission":3},"x-index":5,"x-mega-props":{"labelAlign":"top"}},"EeUsdtMp":{"title":"单行文本","description":"","required":false,"format":"","readOnly":false,"display":true,"x-component":"Input","x-component-props":{"placeholder":""},"x-internal":{"sortable":false,"permission":3},"x-index":6,"x-mega-props":{"labelAlign":"top"}},"envU0siJ":{"title":"数字","description":"","required":false,"readOnly":false,"display":true,"x-component":"NumberPicker","x-component-props":{"placeholder":"","precision":2,"step":0.01},"x-internal":{"sortable":false,"permission":3},"x-index":7,"x-mega-props":{"labelAlign":"top"}},"bdZ5zgCP":{"title":"单选框","description":"","required":false,"readOnly":false,"display":true,"enum":[{"label":"One","value":"uWXQWnU0","title":"One","name":"One"},{"label":"Two","value":"NE_tFrnN","title":"Two","name":"Two"},{"label":"Three","value":"92eIkE-_","title":"Three","name":"Three"}],"x-component":"RadioGroup","x-component-props":{"name":"单选框"},"x-internal":{"sortable":false,"permission":3},"x-index":8,"x-mega-props":{"labelAlign":"top"}},"xzbmGPOZ":{"title":"下拉复选框","description":"","required":false,"readOnly":false,"display":true,"enum":[{"label":"One","value":"_pk69ug9","title":"One","name":"One"},{"label":"Two","value":"5VFsjJxf","title":"Two","name":"Two"},{"label":"Three","value":"dKzuS-JB","title":"Three","name":"Three"}],"x-component":"Select","x-component-props":{"mode":"multiple"},"x-internal":{"sortable":false,"permission":3},"x-index":9,"x-mega-props":{"labelAlign":"top"}},"45vKsXk0":{"title":"时间日期","description":"","required":false,"readOnly":false,"display":true,"x-component":"DatePicker","x-component-props":{"placeholder":"","format":""},"x-internal":{"sortable":false,"permission":3},"x-index":10,"x-mega-props":{"labelAlign":"top"}}}}';
const schema = JSON.parse(testSchemaStr);

const FormPage = () => {
  const [store] = useState(new FormStore({ schema }));

  return (
    <>
      <div className='form-design-tool'>
        <Button
          modifier="primary"
          onClick={() => {
            console.log(store.schema);
            console.log(JSON.stringify(store.schema));
          }}
        >
          <Icon name="save" />
          保存表单
        </Button>
        <Button>
          <Icon name="preview" />
          预览
        </Button>
        <span className='text-underline-no-color cursor-pointer'>
          🎬 查看新手指引
        </span>
      </div>
      {/* <FormBuilder store={store} className="flex-grow" /> */}
    </>
  );
};

export default FormPage;
