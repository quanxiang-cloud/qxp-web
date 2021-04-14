import React from 'react';
import { FormBuilder } from '@c/form-builder';
import FormStore from '@c/form-builder/store';
import Button from '@c/button';
import './style.scss';
import logger from '@clients/lib/logger';

// todo delete this
const testSchemaStr = '{"title":"","type":"object","properties":{"O95_w3Io":{"title":"单行文本","description":"","required":false,"format":"","readOnly":false,"display":true,"x-component":"Input","x-component-props":{"placeholder":""},"x-internal":{"sortable":false,"permission":3},"x-index":0,"x-mega-props":{"labelAlign":"top"}},"J7Y-JDdW":{"title":"单选框","description":"","required":false,"readOnly":false,"display":true,"enum":[{"label":"One","value":"7xU09Egd","title":"One","name":"One"},{"label":"Two","value":"P_baRkG8","title":"Two","name":"Two"},{"label":"Three","value":"a-pqUYQh","title":"Three","name":"Three"}],"x-component":"RadioGroup","x-component-props":{"name":"单选框"},"x-internal":{"sortable":false,"permission":3},"x-index":1,"x-mega-props":{"labelAlign":"top"}},"bLTwXbpb":{"title":"复选框","description":"","required":false,"readOnly":false,"display":true,"enum":[{"label":"One","value":"6dDWmqzf","title":"One","name":"One"},{"label":"Two","value":"3rERmZHo","title":"Two","name":"Two"},{"label":"Three","value":"hcGOJgs8","title":"Three","name":"Three"}],"x-component":"CheckboxGroup","x-component-props":{},"x-internal":{"sortable":false,"permission":3},"x-index":2,"x-mega-props":{"labelAlign":"top"}},"gQgNfUk2":{"title":"下拉框","description":"","required":false,"readOnly":false,"display":true,"enum":[{"label":"One","value":"UR_cTuUk","title":"One","name":"One"},{"label":"Two","value":"iOoQwRl-","title":"Two","name":"Two"},{"label":"Three","value":"gMZNTaX3","title":"Three","name":"Three"}],"x-component":"Select","x-component-props":{},"x-internal":{"sortable":false,"permission":3},"x-index":3,"x-mega-props":{"labelAlign":"top"}}}}';
const schema = JSON.parse(testSchemaStr);

const FormPage = () => {
  const store = new FormStore({ schema });

  return (
    <div>
      <Button
        onClick={() => {
          logger.log(store.schema);
          logger.log(JSON.stringify(store.schema));
        }}
      >
        获取 schema
      </Button>
      <FormBuilder store={store} className="custom-form-builder" />
    </div>
  );
};

export default FormPage;
