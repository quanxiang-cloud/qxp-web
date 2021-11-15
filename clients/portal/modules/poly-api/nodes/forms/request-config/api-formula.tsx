import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import Tooltip from '@c/tooltip';
import { OPERATES_MAP } from '@portal/modules/poly-api/constants';

import FormulaTree from '../../../components/poly-node-path-tree';
import { ApiRequestNodeConfigContext } from './context';
import { isEmpty } from 'lodash';

type Props = {
  currentRef: any;
  currentExpressionStr: string;
  setExpressionStr: (expressionStr: string) => void;
}

function ApiFormulaConfig({ currentRef, currentExpressionStr, setExpressionStr } : Props): JSX.Element {
  const currentFormulaEditorRef = useContext(ApiRequestNodeConfigContext);

  function handleSelect(value: POLY_API.PolyNodeInput, currentNodePath: string): void {
    if (isEmpty(value.data)) {
      currentFormulaEditorRef?.current.insertEntity({ key: currentNodePath, name: currentNodePath + 'hh' });
    }
  }

  return (
    <div className="formula-config">
      <div className="flex items-center py-12 cursor-pointer border-b-1 mx-12">
        <span className="text-12 font-semibold">运算符：</span>
        <div className="flex-1 flex items-center justify-between gap-8">
          {Object.entries(OPERATES_MAP).map(([operate, label]) => {
            return (
              <Tooltip className="z-10 text-12" key={operate} position="bottom" label={label}>
                <span
                  className="request-op"
                  onClick={() => currentFormulaEditorRef?.current.insertText(operate)}
                >
                  {operate}
                </span>
              </Tooltip>
            );
          })}
        </div>
      </div>
      <div className="pt-6 border-gray-200 flex-1 text-12 overflow-auto">
        <FormulaTree onSelect={handleSelect}/>
      </div>
    </div>
  );
}

export default observer(ApiFormulaConfig);
