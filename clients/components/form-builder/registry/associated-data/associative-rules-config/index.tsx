import React, { useEffect, useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';

import Button from '@c/button';

import RulesConfig from './rules-config';
import AssociativeRuleList from './rule-list';

import './index.scss';

function AssociativeConfig({ props, value, mutators }: ISchemaFieldComponentProps): JSX.Element {
  const [visible, setVisible] = useState(false);
  const [rules, setRules] = useState<FormBuilder.DataAssignment[]>();
  const { currentFormFields, sourceTableFields, associativeRules } = props?.['x-component-props'];

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

        return { dataSource: sourceValue, match, dataTarget: targetValue };
      });
    }

    return [];
  }

  useEffect(() => {
    associativeRules && setRules(mapAssociativeRules(associativeRules));
  }, [associativeRules]);

  return (
    <div>
      {!!rules?.length && <AssociativeRuleList associativeRules={rules} />}
      <Button className="mt-8" onClick={() => setVisible(true)}>设置关联赋值</Button>
      {visible && (
        <RulesConfig
          onSubmit={onSubmit}
          defaultValue={value}
          currentFormFields={currentFormFields}
          sourceTableFields={sourceTableFields}
          onClose={() => setVisible(false)}
        />
      )}
    </div>
  );
}

AssociativeConfig.isFieldComponent = true;

export default AssociativeConfig;
