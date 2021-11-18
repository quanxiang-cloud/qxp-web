import React, { forwardRef, ForwardedRef, useRef, useImperativeHandle } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { Store, ItemStore } from '@polyApi/components/object-editor/store';
import { Row } from '@polyApi/components/object-editor/';
import BodyEditor from '@polyApi/components/body-editor';
import FormularEditor, { CustomRule, RefProps } from '@c/formula-editor';
import { isObjectField } from '@portal/modules/poly-api/utils/object-editor';

type Props = ISchemaFieldComponentProps & {
  customRules: CustomRule[];
}

const columnsDataIndexToOmit = ['required', 'desc'];

export type RefType = { getCurrent: () => RefProps | null; }

function EndOutputEditor(props: Props, ref: ForwardedRef<RefType>): JSX.Element {
  const formularRefs = useRef<Map<ItemStore<POLY_API.ObjectSchema>, RefProps>>(new Map());
  const currentFormularRef = useRef<RefProps | null>(null);
  useImperativeHandle(ref, () => ({
    getCurrent: () => currentFormularRef.current,
  }));

  const { customRules } = props;

  function handleRuleChange(
    current$: ItemStore<POLY_API.ObjectSchema>, store$: Store<POLY_API.ObjectSchema>,
  ) {
    return (value: string) => {
      handleRuleClick(current$);
      current$.set('rule', value.replace(/\s/g, ''));
      store$.update();
    };
  }

  function handleRuleClick(current$: ItemStore<POLY_API.ObjectSchema>): void {
    currentFormularRef.current = formularRefs.current.get(current$) || null;
  }

  function handleOnAddField(): void {
    currentFormularRef.current = null;
  }

  function setRef(current$: ItemStore<POLY_API.ObjectSchema>, ref: RefProps | null): void {
    ref && formularRefs.current.set(current$, ref);
  }

  function ruleRender(
    { current$, rule, type }: Row<POLY_API.ObjectSchema>, store$: Store<POLY_API.ObjectSchema>,
  ): JSX.Element | null {
    if (isObjectField(type)) {
      return <span className="text-caption-no-color-weight text-gray-400">仅原始参数类型可配置</span>;
    }
    if (!customRules.length) {
      return null;
    }
    return (
      <div onClick={() => handleRuleClick(current$)}>
        <FormularEditor
          className="h-full node-formula-editor"
          ref={(node) => setRef(current$, node)}
          onChange={handleRuleChange(current$, store$)}
          customRules={customRules}
          defaultValue={rule || ''}
          help=""
        />
      </div>
    );
  }

  const columns = [{
    title: '运算公式',
    dataIndex: 'rule',
    render: ruleRender,
  }];

  return (
    <BodyEditor
      {...props}
      typeConfig={{ rule: true }}
      defaultFieldType="direct_expr"
      columnsDataIndexToOmit={columnsDataIndexToOmit}
      extraColumns={columns}
      onAddField={handleOnAddField}
    />
  );
}

export default forwardRef<RefType, Props>(EndOutputEditor);
