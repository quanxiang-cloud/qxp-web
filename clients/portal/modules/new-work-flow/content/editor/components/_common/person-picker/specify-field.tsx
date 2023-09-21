import React, { useContext, Fragment } from 'react';
import cs from 'classnames';

import FlowTableContext from '@newFlow/content/editor/forms/flow-source-table';
import Select from '@c/select';

import ValidatingTips from '../validating-tips';
import { ApprovePerson } from '@newFlow/content/editor/type';

interface Props {
  value: ApprovePerson;
  validating: boolean;
  onFieldChange: (fields: string[]) => void;
  typeText?: string;
}

export default function SpecifyField({ value, validating, typeText, onFieldChange }: Props): JSX.Element {
  const { fields = [] } = value;
  const { tableSchema } = useContext(FlowTableContext);

  const fieldOptions = tableSchema
    .filter((schema) => schema.componentName === 'userpicker')
    .map((schema) => ({ label: schema.title as string, value: schema.fieldName }));

  return (
    <Fragment>
      <Select<string>
        multiple
        options={fieldOptions}
        value={fields}
        onChange={onFieldChange}
        className={cs({
          'border-gray-300': !validating || fields?.length,
          'border-red-300': validating && !fields?.length,
        })}
      />
      <ValidatingTips
        validating={validating && !fields.length}
        tips={`请选择${typeText}人`}
      />
    </Fragment>
  );
}
