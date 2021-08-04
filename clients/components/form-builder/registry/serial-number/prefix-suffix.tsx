import React, { useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import Modal from '@c/modal';
import { Select, Input, Button } from 'antd';

type Props = {
    type: 'prefix' | 'suffix';
}
type Format = 'yyyy'|'yyyyMM'|'yyyyMMdd'|'yyyyMMddHHmm'|'yyyyMMddHHmmss';

function PrefixSuffix(props: Props & ISchemaFieldComponentProps): JSX.Element {
  const componentProps = props.schema.getExtendsComponentProps() || {};
  const type = componentProps.type;
  const { value } = props;
  const typeName = type === 'prefix' ? '前缀' : '后缀';
  const [show, setShow] = useState(false);
  const [frontward, setFrontward] = useState('');
  const [backward, setBackward] = useState('date{yyyyMMdd}');
  const values = frontward + backward;
  const handleClick = (): void => {
    setShow(true);
  };
  const onSelectChange = (value: Format): void => {
    setBackward(`date{${value}}`);
  };
  const onInputChange = (e: any): void => {
    const prefixInput = e.target.value;
    setFrontward(`${prefixInput}.`);
  };
  return (
    <div>
      <Button onClick={handleClick}>选择{typeName}</Button>
      {show && (
        <Modal
          title = {`选择${typeName}`}
          footerBtns={[
            {
              key: 'close',
              text: '取消',
              onClick: ()=>{
                setShow(false);
              },
            },
            {
              key: 'sure',
              modifier: 'primary',
              text: '确定',
              onClick: ()=>{
                setShow(false);
                props.mutators.change(values);
              },
            },
          ]}
        >
          <div>
            {type === 'prefix' && <Input placeholder='请输入前缀字母' onChange={onInputChange}/>}
            <Select defaultValue='yyyyMMdd' onChange={onSelectChange} >
              <option value='yyyy'>yyyy</option>
              <option value='yyyyMM'>yyyyMM</option>
              <option value='yyyyMMdd'>yyyyMMdd</option>
              <option value='yyyyMMddHHmm'>yyyyMMddHHmm</option>
              <option value='yyyyMMddHHmmss'>yyyyMMddHHmmss</option>
            </Select>
          </div>
        </Modal>)
      }
      <p>{value}</p>
    </div>
  );
}

PrefixSuffix.isFieldComponent = true;

export default PrefixSuffix;
