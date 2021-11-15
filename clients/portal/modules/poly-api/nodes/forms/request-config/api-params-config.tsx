import React from 'react';

import Icon from '@c/icon';
import FormulaEditor, { RefProps } from '@c/formula-editor';
import { observer } from 'mobx-react';

type Props = {
  setCurrentFormulaRef: (ref: any) => void;
  configs?: any;
}

function ApiParamsConfig({ configs, setCurrentFormulaRef }: Props): JSX.Element {
  const polyParams = Object.entries(configs);

  function formulaEditorChange(value: string): void {
  }

  return (
    <div className="p-12 flex-2 bg-gray-50 overflow-auto config-params-container">
      {polyParams?.length && polyParams.map(([type, params]: any) => {
        return (
          <div key={type} className="my-20">
            <div className="pb-4 text-gray-900">{type.replace(/^\S/, (s: string) => s.toUpperCase())}</div>
            <div className="config-param">
              {params.map(({ title, name, required, path }: any) => {
                const configParmaTag = path ? path : name;
                const formulaRef = React.useRef<RefProps>();

                return (
                  <div
                    key={configParmaTag}
                    className="flex justify-between"
                    onClick={() => setCurrentFormulaRef(formulaRef)}
                  >
                    <div className="flex items-center justify-between w-142 p-8 flex-1">
                      <div className="flex-1 truncate">
                        <span>{title}</span>
                        <span className="mx-4 text-gray-400">{name}</span>
                        {required && <span className="text-red-600">*</span>}
                      </div>
                      <Icon className="ml-8" name="arrow_left_alt" />
                    </div>
                    <FormulaEditor
                      help=""
                      ref={formulaRef}
                      className="node-formulaEditor"
                      onChange={formulaEditorChange}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default observer(ApiParamsConfig);
