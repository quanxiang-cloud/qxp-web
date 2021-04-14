import React, { useState } from 'react';
import { Button, Divider, Space } from 'antd';
import CodeEditor from './elements/CodeEditor/CodeEditor';
import { string2Json } from './utils';

type DataSettingModalProps = {
  data: Record<string, unknown>;
  closeModal: () => void;
  setFormData: (value: Record<string, unknown>) => void;
}

function DataSettingModal({ data, closeModal, setFormData }: DataSettingModalProps) {
  const [value, setValue] = useState<string>(JSON.stringify(data, null, 2));

  const handleChange = (v: string) => {
    setValue(v);
  };

  const handleImport = () => {
    const newValue = string2Json(value);
    setFormData(newValue);
    closeModal();
  };

  return (
    <>
      <CodeEditor
        onChange={handleChange}
        languageSelector={false}
        language="application/json"
        value={value}
      />
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Space>
          <Button onClick={closeModal}>取消</Button>
          <Button onClick={handleImport} type="primary">
            导入
          </Button>
        </Space>
      </div>
    </>
  );
}

export default DataSettingModal;
