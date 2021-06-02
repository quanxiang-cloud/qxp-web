import React, { useState } from 'react';
import { parse } from 'qxp-formula';

import Modal from '@c/modal';

const MATH_FUNCTIONS = [
  'sum', 'average', 'max', 'min', 'abs', 'ceil', 'floor',
];

function parseRAWFormula(
  rawFormula: string,
  variables: Array<{ fieldName: string; title: string; }>,
): string {
  let formula = rawFormula;
  variables.forEach(({ fieldName, title }) => {
    const reg = new RegExp(fieldName, 'g');
    formula = formula.replace(reg, `${fieldName}:${title}`);
  });

  return formula;
}

// return: [errorMessage, formula]
function toRAWFormula(
  readableFormula: string,
  variables: Array<{ fieldName: string; title: string; }>,
): [string, string] {
  // convert readableFormula to formula
  let formula = readableFormula;
  variables.forEach(({ fieldName, title }) => {
    const reg = new RegExp(`${fieldName}:${title}`, 'g');
    formula = formula.replace(reg, fieldName);
  });

  try {
    parse(formula.trim());
    return ['', formula.trim()];
  } catch (error) {
    return [String(error), ''];
  }
}

type Props = {
  rawFormula: string;
  variables: Array<{ fieldName: string; title: string; }>;
  onSubmit: (formula: string) => void;
  onClose: () => void;
}

function EditFormulaModal({ onClose, onSubmit, rawFormula, variables }: Props): JSX.Element {
  const [readableFormula, setFormula] = useState(parseRAWFormula(rawFormula, variables));
  const [errorMessage, setErrorMessage] = useState('');

  function onSave(): void {
    const [err, formula] = toRAWFormula(readableFormula, variables);
    if (err) {
      setErrorMessage(err);
      return;
    }

    onSubmit(formula);
  }

  if (!variables.length) {
    return (
      <Modal
        title="没法配置计算公式"
        onClose={onClose}
        footerBtns={[{ key: '取消', text: '确定', onClick: onClose, modifier: 'primary' }]}
      >
        <div className="form-validation-formula">
          当前表单中没有可使用的数字类型字段
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="编辑计算公式"
      onClose={onClose}
      width={588}
      footerBtns={[
        { key: '取消', text: '取消', onClick: onClose },
        { key: '保存', text: '保存', onClick: onSave, modifier: 'primary' },
      ]}
    >
      <div className="form-validation-formula">
        {errorMessage && (
          <p className="text-red-600">{errorMessage}</p>
        )}
        <div className="mb-8">表单字段:</div>
        <div className="mb-16">
          {variables.map(({ fieldName, title }) => {
            return (
              <span
                key={fieldName}
                className="inline-block mb-8 p-2 bg-gray-100 mr-4 border border-gray-300"
              >
                {fieldName}:{title}
              </span>
            );
          })}
        </div>
      </div>
      <div className="mb-8">函数:</div>
      <div className="mb-16">
        {MATH_FUNCTIONS.map((funcName) => (
          <span
            key={funcName}
            className="inline-block mb-8 p-2 bg-gray-100 mr-4 border border-gray-300"
          >
            {funcName}
          </span>
        ))}
      </div>
      <div className="mb-8">验证公式:</div>
      <textarea
        className="block border border-gray-600 w-full mb-16"
        value={readableFormula}
        onChange={({ target }) => {
          setErrorMessage('');
          setFormula(target.value);
        }}
      />
    </Modal>
  );
}

export default EditFormulaModal;
