import React, { useContext, useRef } from 'react';

import Modal from '@c/modal';
import { getSchemaFields } from '@flow/content/editor/forms/utils';
import { COLLECTION_OPERATORS } from '@c/formula-editor/constants';
import FormulaEditor, { CustomRule, RefProps } from '@c/formula-editor';
import FlowTableContext from '@flow/content/editor/forms/flow-source-table';
import schemaToFields from '@lib/schema-convert';

interface Props {
  onClose: () => void;
  onSave: (rule: string) => void;
  defaultValue?: string;
  targetSchema?: ISchema;
}

function FormulaModal(props: Props): JSX.Element | null {
  const formulaRef = useRef<RefProps>();
  const { tableSchema: sourceSchema } = useContext(FlowTableContext);

  const targetFields = getSchemaFields(schemaToFields(props.targetSchema));
  const sourceFields = getSchemaFields(sourceSchema);
  const formulaCustomRules: CustomRule[] = targetFields.concat(sourceFields).map(({ label, value }) => ({
    key: value,
    name: label,
    type: 'field',
  }));

  function addText(text: string, hasSpacing = true, backNumber = 0): void {
    formulaRef.current?.insertText(text, hasSpacing, backNumber);
  }

  function addField(entityData: { name: string, key: string }): void {
    formulaRef.current?.insertEntity(entityData);
  }

  return (
    <Modal
      title="设置过滤条件"
      onClose={props.onClose}
      footerBtns={[
        {
          key: 'cancel',
          text: '取消',
          onClick: props.onClose,
        },
        {
          key: 'confirm',
          text: '确认',
          onClick: () => {
            const formula = formulaRef.current?.getFormulaValue().trim() || '';
            props.onSave(formula);
          },
          modifier: 'primary',
        },
      ]}
    >
      <div className="p-20">
        <div className="flex flex-col mb-20">
          <div>目标表单字段</div>
          <div className="target-table-fields">
            {targetFields.map(({ label, value }) => {
              return (
                <span
                  key={value}
                  onClick={() => addField({ key: value, name: label })}
                  className="inline-block mb-8 p-2 bg-gray-100 mr-4 border border-gray-300 cursor-pointer"
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col mb-20">
          <div>集合操作符</div>
          <div className="mb-16">
            {[
              {
                tips: '',
                content: '==',
              },
              {
                tips: '',
                content: '!=',
              },
              {
                tips: '',
                content: '||',
              },
              {
                tips: '',
                content: '&&',
              },
            ].concat(COLLECTION_OPERATORS).map(({ content }) => (
              <span
                key={content}
                onClick={() => addText(content)}
                className="inline-block mb-8 p-2 bg-gray-100 mr-4 border border-gray-300 cursor-pointer"
              >
                {content}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col mb-20">
          <div>当前表单字段</div>
          <div className="source-table-fields">
            {sourceFields.map(({ label, value }) => {
              return (
                <span
                  key={value}
                  onClick={() => addField({ key: value, name: label })}
                  className="inline-block mb-8 p-2 bg-gray-100 mr-4 border border-gray-300 cursor-pointer"
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>
        <div>
          <div>过滤公式</div>
          <FormulaEditor
            ref={formulaRef}
            className="block mb-16"
            customRules={formulaCustomRules}
            defaultValue={props.defaultValue || ''}
          />
        </div>
      </div>
    </Modal>
  );
}

export default FormulaModal;
