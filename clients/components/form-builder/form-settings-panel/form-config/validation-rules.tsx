import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import { parse } from 'qxp-formula/lib/src/logical-formula';

import Button from '@c/button';
import Modal from '@c/modal';
import Icon from '@c/icon';
import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';

import { StoreContext } from '../../context';

const Operators: Array<FormBuilder.CompareOperator> = [
  '!=',
  '==',
  '∈',
  '∉',
  '<',
  '<=',
  '>',
  '>=',
];

type EditValidationModalProps = {
  ruleID: string;
  onClose: () => void;
}

function getVariables(schema: ISchema): Array<{ fieldName: string; title: string; }> {
  return Object.entries(schema.properties || {}).filter(([fieldName, schema]) => {
    if (INTERNAL_FIELD_NAMES.includes(fieldName)) {
      return false;
    }

    const componentName = schema['x-component']?.toLowerCase();
    return componentName === 'input' || componentName === 'numberpicker';
  }).sort((fieldA, fieldB) => {
    return Number(fieldA[1]['x-index']) - Number(fieldB[1]['x-index']);
  }).map(([fieldName, { title }]) => ({ fieldName, title: title as string }));
}

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

function EditValidationModal({ onClose, ruleID }: EditValidationModalProps): JSX.Element {
  const [errorMessage, setErrorMessage] = useState('');
  const store = useContext(StoreContext);
  const fields = getVariables(store.schema);
  const validation = store.schema['x-internal']?.validations?.find(({ id }) => {
    return id === ruleID;
  }) || { formula: '', message: '', name: '' };
  const [readableFormula, setFormula] = useState(parseRAWFormula(validation.formula, fields));
  const [message, setMessage] = useState(validation.message);
  const [ruleName, setRuleName] = useState(validation.name);

  function onSave(): void {
    const [err, formula] = toRAWFormula(readableFormula, fields);
    if (err) {
      setErrorMessage(err);
      return;
    }

    if (!formula) {
      setErrorMessage('公式不能为空');
      return;
    }

    // todo limit message and name length
    store.updateValidation({
      id: ruleID,
      type: 'formula',
      formula: formula,
      message: message.trim(),
      name: ruleName.trim(),
    });
    onClose();
  }

  if (!fields.length) {
    return (
      <Modal
        title="无法配置验证规则"
        onClose={onClose}
        footerBtns={[{ key: '取消', text: '确定', onClick: onClose, modifier: 'primary' }]}
      >
        <div className="form-validation-formula">
          请先添加表单项
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={`${ruleID ? '编辑' : '新增'}验证规则`}
      onClose={onClose}
      width={588}
      footerBtns={[
        { key: '取消', text: '取消', onClick: onClose },
        { key: '保存', text: '保存', onClick: onSave, modifier: 'primary' },
      ]}
    >
      <div>
        <div className="mb-8">规则名称:</div>
        <input
          type="text"
          className="input mb-8"
          value={ruleName}
          onChange={(e) => setRuleName(e.target.value)}
        />
      </div>
      <div className="form-validation-formula">
        {errorMessage && (
          <p className="text-red-600">{errorMessage}</p>
        )}
        <div className="mb-8">表单字段:</div>
        <div className="mb-16">
          {fields.map(({ fieldName, title }) => {
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
      <div className="mb-8">比较符号和函数:</div>
      <div className="mb-16">
        {Operators.map((operator) => (
          <span
            key={operator}
            className="inline-block mb-8 p-2 bg-gray-100 mr-4 border border-gray-300"
          >
            {operator}
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
      <div className="mb-8">错误提示:</div>
      <input
        type="text"
        className="input mb-8"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </Modal>
  );
}

function ValidationConfig(): JSX.Element {
  const store = useContext(StoreContext);
  const [showModal, setModalVisible] = useState(false);
  const [ruleID, setRuleID] = useState('');
  const validations = store.schema['x-internal']?.validations || [];

  return (
    <div>
      {validations.map((validation) => {
        return (
          <div className="flex justify-between mb-16" key={validation.id}>
            <span>{validation.name || '未命名规则'}</span>
            <span>
              <Icon
                clickable
                changeable
                size={24}
                className="mr-8"
                name="edit"
                onClick={() => {
                  setRuleID(validation.id);
                  setModalVisible(true);
                }}
              />
              <Icon
                clickable
                changeable
                size={24}
                name="delete"
                onClick={() => store.deleteValidation(validation.id)}
              />
            </span>
          </div>
        );
      })}
      <Button
        onClick={() => {
          setRuleID('');
          setModalVisible(true);
        }}
      >
        新增验证规则
      </Button>
      {showModal && (<EditValidationModal ruleID={ruleID} onClose={() => setModalVisible(false)} />)}
    </div>
  );
}

export default observer(ValidationConfig);
