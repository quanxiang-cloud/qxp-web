import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import {
  Editor,
  EditorState,
  CompositeDecorator,
  Modifier,
  SelectionState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import 'draft-js/dist/Draft.css';

import {
  handleFieldHighlight,
  handleOperatorHighlight,
  handleFuncHighlight,
  handleSymbolHighlight,
} from './decorator-func';
import { FieldSpan, operatorSpan, funcSpan } from './decorator-span';
import { toContentState } from './utils';
import './index.scss';

export type CustomRule = {
  key: string;
  name: string;
  type: string;
}

type Props = {
  customRules: CustomRule[];
  className: string;
  defaultValue?: string;
}

export type RefProps = {
  insertText: (text: string, hasSpacing?: boolean, backNumber?: number) => void;
  insertEntity: (data: any) => void;
  getFormulaValue: () => string;
}

function FormulaEditor({
  customRules,
  className = '',
  defaultValue = '',
}: Props, ref: React.Ref<any>): JSX.Element {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(toContentState(defaultValue, customRules))),
  );
  const editorDom = useRef<any>();

  useImperativeHandle(ref, () => ({
    insertText: insertText,
    insertEntity: insertEntity,
    getFormulaValue: getFormulaValue,
  }));

  const onChange = (_editorState: EditorState): void => {
    setEditorState(_editorState);
  };

  useEffect(() => {
    const compositeDecorator = new CompositeDecorator([
      {
        strategy: (contentBlock, callback, contentState) => {
          handleFieldHighlight(contentBlock, callback, contentState, customRules.map(({ name }) => name));
        },
        component: FieldSpan,
      },
      {
        strategy: handleOperatorHighlight,
        component: operatorSpan,
      },
      {
        strategy: handleFuncHighlight,
        component: funcSpan,
      },
      {
        strategy: handleSymbolHighlight,
        component: funcSpan,
      },
    ]);
    onChange(EditorState.set(editorState, { decorator: compositeDecorator }));
  }, [customRules]);

  const insertEntity = (entityData: any): void => {
    let contentState = editorState.getCurrentContent();
    contentState = contentState.createEntity(entityData.entity_type, 'IMMUTABLE', entityData);
    const entityKey = contentState.getLastCreatedEntityKey();

    let selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      contentState = Modifier.insertText(
        contentState, selection, entityData.name, undefined, entityKey,
      );
    } else {
      contentState = Modifier.replaceText(
        contentState, selection, entityData.name, undefined, entityKey,
      );
    }

    let end;

    contentState.getFirstBlock().findEntityRanges(
      (character) => character.getEntity() === entityKey,
      (_, _end) => {
        end = _end;
      });

    let newEditorState = EditorState.set(editorState, { currentContent: contentState });

    selection = selection.merge({
      anchorOffset: end,
      focusOffset: end,
    }) as SelectionState;

    // move cursor after new inserted text
    newEditorState = EditorState.forceSelection(newEditorState, selection);

    onChange(newEditorState);
  };

  const insertText = (text: string, hasSpacing = true, backNumber = 0): void => {
    let contentState = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    let textTmp = `${text}`;
    if (hasSpacing) {
      textTmp += ' ';
    }

    if (selection.isCollapsed()) {
      contentState = Modifier.insertText(contentState, selection, textTmp);
    } else {
      contentState = Modifier.replaceText(contentState, selection, textTmp);
    }

    let newEditorState = EditorState.set(editorState, { currentContent: contentState });
    selection = selection.merge({
      anchorOffset: selection.getAnchorOffset() + textTmp.length - backNumber,
      focusOffset: selection.getFocusOffset() + textTmp.length - backNumber,
    }) as SelectionState;

    newEditorState = EditorState.forceSelection(newEditorState, selection);
    onChange(newEditorState);
  };

  const getFormulaValue = (): string => {
    const currentContent = editorState.getCurrentContent();
    const { blocks, entityMap } = convertToRaw(currentContent);
    return blocks.map((block) => {
      let text = block.text;
      block.entityRanges.forEach(({ key }) => {
        text = text.replace(entityMap[key].data.name, entityMap[key].data.key);
      });

      return text;
    }).join(' ');
  };

  return (
    <div className={className}>
      <Editor
        editorState={editorState}
        onChange={onChange}
        placeholder="请输入...."
        ref={editorDom}
        spellCheck={true}
      />
    </div>
  );
}

export default React.forwardRef(FormulaEditor);
