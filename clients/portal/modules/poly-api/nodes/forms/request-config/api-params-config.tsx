import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import FormulaEditor, { RefProps } from '@c/formula-editor';
import { convertToParamsConfig } from '@portal/modules/poly-api/utils/request-node';
import { ApiRequestNodeConfigContext } from './context';

type Props = {
  configValue?: any;
  initRequestNodeInputs?: any;
  onChange: (value: any) => void;
  setCurrentFormulaRef: (ref: any) => void;
}

function ApiParamsConfig({
  configValue, initRequestNodeInputs, setCurrentFormulaRef, onChange }: Props,
): JSX.Element {
  const { customRules } = useContext(ApiRequestNodeConfigContext);
  configValue.doc.inputs = initRequestNodeInputs;
  const polyParams = Object.entries(convertToParamsConfig(configValue));

  function updateRequestNodeConfigValueInputs(
    nodeInput: any, targetPath: string, value: string, path?: string,
  ): any {
    return nodeInput?.map((arr: any, index: number) => {
      const fullPath = path ? `${path}.${index}` : `${index}`;
      if (fullPath === targetPath) {
        if ((arr.type === 'string' || arr.type === 'number') && value) {
          arr.data = value;
          arr.type = 'direct_expr';
        }
        return arr;
      }

      if (arr.type === 'object') {
        arr.data = updateRequestNodeConfigValueInputs(arr.data, targetPath, value, fullPath);
      }

      return arr;
    });
  }

  function handleFormulaChange(value: string, formulaTargePath: string): void {
    const requestNodeInputs = updateRequestNodeConfigValueInputs(
      [...configValue.doc.input.inputs], formulaTargePath, value,
    );
    onChange(requestNodeInputs);
  }

  return (
    <div className="p-12 flex-2 bg-gray-50 overflow-auto config-params-container">
      {polyParams?.length && polyParams.map(([type, params]: any) => {
        return (
          <div key={type} className="my-20">
            <div className="pb-4 text-gray-900">{type.replace(/^\S/, (s: string) => s.toUpperCase())}</div>
            <div className="config-param">
              {params.map(({ title, name, required, path }: any, index: number) => {
                const configParamTag = path ? path : `${index}`;
                const formulaRef = React.useRef<RefProps>();

                return (
                  <div
                    key={configParamTag}
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
                      customRules={customRules}
                      className="node-formula-editor"
                      onChange={(value) => handleFormulaChange(value, configParamTag)}
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
