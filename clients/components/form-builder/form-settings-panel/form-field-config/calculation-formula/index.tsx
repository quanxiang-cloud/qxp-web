import React, { useState, useRef } from 'react';
import { parse } from 'qxp-formula';

import FormulaEditor, { RefProps } from '@c/formula-editor';
import MATH_FUNCTIONS from '@c/formula-editor/function';
import { collectionOperators } from '@c/formula-editor/operator';
import Modal from '@c/modal';
import logger from '@lib/logger';

type Props = {
  rawFormula: string;
  variables: Array<{ fieldName: string; title: string; }>;
  onSubmit: (formula: string) => void;
  onClose: () => void;
}

function EditFormulaModal({ onClose, onSubmit, rawFormula, variables }: Props): JSX.Element {
  const [errorMessage, setErrorMessage] = useState('');
  const formulaEditorRef = useRef<RefProps>();

  function onSave(): void {
    const formula = formulaEditorRef.current?.getFormulaValue().trim() || '';
    try {
      parse(formula);
    } catch (error) {
      setErrorMessage('公式格式错误!');
      logger.warn('formula-error:', error);
      return;
    }
    onSubmit(formula);
  }

  function addText(text: string, hasSpacing = true, backNumber = 0): void {
    formulaEditorRef.current?.insertText(text, hasSpacing, backNumber);
  }

  function addField(entityData: { name: string, key: string }): void {
    formulaEditorRef.current?.insertEntity(entityData);
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
                onClick={() => addField({ key: fieldName, name: title })}
                className="inline-block mb-8 p-2 bg-gray-100 mr-4 border border-gray-300 cursor-pointer"
              >
                {title}
              </span>
            );
          })}
        </div>
      </div>
      <div className="mb-8">函数:</div>
      <div className="mb-16">
        {MATH_FUNCTIONS.map(({ name, content }) => (
          <span
            key={name}
            onClick={() => addText(content, false, 1)}
            className="inline-block mb-8 p-2 bg-gray-100 mr-4 border border-gray-300 cursor-pointer"
          >
            {name}
          </span>
        ))}
      </div>
      <div className="mb-8">集合操作符:</div>
      <div className="mb-16">
        {collectionOperators.map(({ content }) => (
          <span
            key={content}
            onClick={() => addText(content)}
            className="inline-block mb-8 p-2 bg-gray-100 mr-4 border border-gray-300 cursor-pointer"
          >
            {content}
          </span>
        ))}
      </div>
      <div className="mb-8">验证公式:</div>
      <FormulaEditor
        ref={formulaEditorRef}
        customRules={variables.map(({ title, fieldName }) => {
          return { key: fieldName, name: title, type: 'field' };
        })}
        className="block mb-16"
        defaultValue={rawFormula}
      />
    </Modal>
  );
}

export default EditFormulaModal;
