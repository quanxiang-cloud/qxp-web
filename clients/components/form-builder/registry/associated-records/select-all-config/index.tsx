/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react';

import RulesConfig from './rules-config';
import './index.scss';
import { generateRandomFormFieldID } from '@c/form-builder/utils';
import Button from '@c/button';

const SelectAllConfig = (prps: any): JSX.Element =>{
  const { value, mutators } = prps;
  const [visible, setVisible] = React.useState(false);
  const [rulesObj, setRulesObj] = useState<any>(value);

  useEffect(()=>{
    mutators?.change(rulesObj);
  }, [rulesObj]);

  const handleSubmit = (linkage: any) => {
    setVisible(false);
    setRulesObj({
      ...linkage,
      key: rulesObj ? rulesObj?.key : generateRandomFormFieldID(),
    });
  };

  return (
    <>
      <div className="pb-24 w-full">
        <Button className="" onClick={() => {
          setVisible(true);
        }}>设置选择全部数据规则</Button>
      </div>
      {visible && (
        <RulesConfig
          data={rulesObj}
          onSubmit={handleSubmit}
          onClose={() => setVisible(false)}
        />
      )}
    </>
  );
};

SelectAllConfig.isFieldComponent = true;

export default SelectAllConfig;
