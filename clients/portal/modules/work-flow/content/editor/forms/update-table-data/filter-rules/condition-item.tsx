import React, { useContext, useState } from 'react';

import Select from '@c/select';
import IconBtn from '@c/icon-btn';
import { getSchemaFields } from '../../utils';
import { Condition } from './index';
import FlowSourceTableContext from '@flow/content/editor/forms/flow-source-table';

interface Props {
  targetSchema: Record<string, SchemaFieldItem>;
  condition: Condition;
  onRemove: () => void;
  onChange: (data: Partial<Condition>) => void;
}

const operators = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'neq' },
  { label: '包含', value: 'in' },
  { label: '不包含', value: 'nin' },
];

function ConditionItem(props: Props): JSX.Element {
  const [item, setItem] = useState<Condition>(props.condition);
  const { tableSchema: curTableSchema } = useContext(FlowSourceTableContext);

  const onChange = (val: Partial<Condition> = {}): void => {
    setItem((v) => ({ ...v, ...val }));
    props.onChange(val);
  };

  return (
    <div className="flex items-center mb-10">
      <span className="text-caption">目标表:</span>
      <Select
        options={getSchemaFields(Object.values(props.targetSchema))}
        value={item.fieldName}
        onChange={(fieldName: string) => onChange({ fieldName } as Condition)}
      />
      <Select
        options={operators}
        value={item.operator}
        onChange={(operator: string) => onChange({ operator } as Condition)}
        className="mx-10"
      />
      <Select
        options={getSchemaFields(curTableSchema)}
        value={item.value as any}
        onChange={(value: string) => onChange({ value } as Condition)}
      />
      <IconBtn iconName="delete" className="ml-8" onClick={props.onRemove} />
    </div>
  );
}

export default ConditionItem;
