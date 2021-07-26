import React from 'react';

import { CustomRule } from '@c/formula-editor';

export interface Props {
  label: string;
  ruleList: CustomRule[];
  onInsert: (rule: CustomRule) => void;
}

export default function RuleItem<T>({ label, ruleList, onInsert }: Props): JSX.Element {
  return (
    <div className="mb-16">
      <h1 className="mb-8">{label}</h1>
      <ul className="flex flex-row flex-wrap">
        {ruleList.map((rule) => {
          return (
            <li
              className="px-10 py-5 mr-10 mb-5 bg-green-50 border cursor-pointer rounded-8"
              key={rule.key}
              onClick={() => onInsert(rule)}
            >
              {rule.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
