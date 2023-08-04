import React, { useEffect, useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';

import Button from '@c/button';

import RulesConfig from './rules-config';
import AssociativeRuleList from './rule-list';

import './index.scss';
import { SUPPORT_COMPONENT, getTableFieldsToOptions } from '../config';

function AssociativeConfig({ props, value, mutators }: ISchemaFieldComponentProps): JSX.Element {
  const [visible, setVisible] = useState(false);
  const [rules, setRules] = useState<FormBuilder.DataAssignment[]>();
  const { currentFormFields, sourceTableFields, associativeRules } = props?.['x-component-props'] ?? {};
  const [rulesOptions, setRulesOptions] = useState<any>([]);
  function onSubmit(value: Record<string, FormBuilder.DataAssignment[]>): void {
    mutators.change(value);
    setVisible(false);
    setRules(mapAssociativeRules(value.rules));
  }

  function mapAssociativeRules(associativeRules: FormBuilder.DataAssignment[]): FormBuilder.DataAssignment[] {
    if (associativeRules) {
      return associativeRules.map(({ dataSource, match, dataTarget }: FormBuilder.DataAssignment) => {
        const sourceValue = sourceTableFields.find(({ id }: SchemaFieldItem) => id === dataSource)?.title;
        const targetValue = currentFormFields.find(({ fieldName }: SchemaFieldItem) => {
          return fieldName === dataTarget;
        })?.title;

        return { dataSource: sourceValue, match, dataTarget: targetValue, dataSourceID: dataSource };
      });
    }

    return [];
  }

  useEffect(() => {
    associativeRules && setRules(mapAssociativeRules(associativeRules));
  }, [associativeRules]);

  useEffect(()=>{
    let _rulesOptions: any = [];
    sourceTableFields?.forEach((item: any, index: any) => {
      let children;
      const { title, id, componentName } = item;
      const { appID, associationTableID: tableID } = item?.['x-component-props'] || {};
      if (componentName === 'associateddata') {
        getTableFieldsToOptions(appID, tableID, SUPPORT_COMPONENT).then((fields) => {
          children = fields?.map(({ title, id })=> ({ label: title, value: id }));
          _rulesOptions = [..._rulesOptions, { label: title, value: id, children, index }];
          setRulesOptions(_rulesOptions);
        });
      } else {
        _rulesOptions = [..._rulesOptions, { label: title, value: id, children, index }];
        setRulesOptions(_rulesOptions);
      }
    });
  }, [sourceTableFields]);

  return (
    <div className='w-full'>
      {!!rules?.length && <AssociativeRuleList associativeRules={rules} rulesOptions={rulesOptions}/>}
      <Button className="mt-8" onClick={() => setVisible(true)}>设置关联赋值</Button>
      {visible && (
        <RulesConfig
          onSubmit={onSubmit}
          defaultValue={value}
          currentFormFields={currentFormFields}
          sourceTableFields={sourceTableFields}
          rulesOptions={rulesOptions}
          onClose={() => setVisible(false)}
        />
      )}
    </div>
  );
}

AssociativeConfig.isFieldComponent = true;

export default AssociativeConfig;
