import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Field, Label, Control, Radio, RadioGroup } from '@QCFE/lego-ui';
import cs from 'classnames';

const { TextField } = Form;

interface Props {
  className?: string;
  editInfo?: DatasetName & { type: DatasetType };
}

// form add/edit dataset
function FormAddData({ editInfo, className }: Props, ref: React.LegacyRef<Form>) {
  const formAddRef = useRef<Form>();
  const [datasetType, setDatasetType] = useState<DatasetType>(editInfo?.type || 1);

  // @ts-ignore
  useImperativeHandle(ref, () => {
    return {
      getValues: () => ({
        // @ts-ignore
        ...formAddRef?.current.getFieldsValue(),
        type: datasetType,
      }),
    };
  });

  return (
    // @ts-ignore
    <Form className={cs('form-add-dataset', className)} ref={formAddRef}>
      <Field>
        <Label>类型:</Label>
        <Control>
          <RadioGroup name='dataset_type' value={datasetType} onChange={setDatasetType} disabled={!!editInfo}>
            <Radio value={1}>数组</Radio>
            <Radio value={2}>层级</Radio>
          </RadioGroup>
        </Control>
      </Field>
      <TextField
        label="名称:"
        name="dataset_name"
        placeholder="数据集名称"
        validateOnChange
        defaultValue={editInfo?.name || ''}
        schemas={[
          {
            rule: { required: true },
            help: '请输入数据集名称',
            status: 'error',
          },
        ]} />
      <TextField label="Tag:" name="dataset_tag" defaultValue={editInfo?.tag || ''} />
    </Form>
  );
}

export default forwardRef(FormAddData);
