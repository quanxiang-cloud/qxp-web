import React, { useState, useRef, useEffect, useImperativeHandle, useMemo } from 'react';
import { useUpdateEffect } from 'react-use';
import {
  Editor,
  EditorState,
  CompositeDecorator,
  Modifier,
  SelectionState,
  convertToRaw,
  convertFromRaw,
  DraftHandleValue,
} from 'draft-js';

import {
  handleOperatorHighlight,
  handleFuncHighlight,
  handleSymbolHighlight,
  handleFieldHighlight,
} from './decorator-func';
import { operatorSpan, funcSpan, FieldSpan } from './decorator-span';
import { toContentState } from './utils';

import 'draft-js/dist/Draft.css';
import './index.scss';

export type CustomRule = {
  key: string;
  name: string;
  type?: string;
}

type Props = {
  onBlur?: (value: string) => void;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  customRules?: CustomRule[];
  className?: string;
  defaultValue?: string;
  value?: string;
  help?: string;
  maxLength?: number;
}

export type RefProps = {
  insertText: (text: string, hasSpacing?: boolean, backNumber?: number) => void;
  insertEntity: (data: CustomRule) => void;
  getFormulaValue: () => string;
}

const defaultDecorators = [
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
];

function FormulaEditor({
  customRules = [],
  className = '',
  maxLength = 500,
  help = '文本常量请用双引号括起来',
  onChange,
  onBlur,
  readOnly,
  defaultValue = '',
  value,
}: Props, ref: React.Ref<any>): JSX.Element {
  const [contentLength, setLength] = useState(0);
  const decorator = useMemo(() => new CompositeDecorator(defaultDecorators), []);
  const _value = value || defaultValue;
  const [editorState, setEditorState] = useState(
    _value ? EditorState.createWithContent(
      convertFromRaw(toContentState(_value, customRules)), decorator,
    ) : EditorState.createEmpty(decorator),
  );

  useUpdateEffect(() => {
    if (typeof value !== 'string' || value === getFormulaValue()) {
      return;
    }

    let newEditorState = EditorState.createWithContent(
      convertFromRaw(toContentState(value, customRules)),
      decorator,
    );
    newEditorState = EditorState.forceSelection(newEditorState, editorState.getSelection());
    setEditorState(newEditorState);
  }, [value]);

  const editorDom = useRef<any>();
  useImperativeHandle(ref, () => ({
    insertText: insertText,
    insertEntity: insertEntity,
    getFormulaValue: getFormulaValue,
  }));

  const handleChange = (_editorState: EditorState): void => {
    const currentContent = _editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;
    setLength(currentContentLength);
    setEditorState(_editorState);
    onChange?.(getFormulaValue(_editorState));
  };

  const getLengthOfSelectedText = (): number => {
    const currentSelection = editorState.getSelection();
    const isCollapsed = currentSelection.isCollapsed();
    let length = 0;
    if (!isCollapsed) {
      const currentContent = editorState.getCurrentContent();
      const startKey = currentSelection.getStartKey();
      const endKey = currentSelection.getEndKey();
      const startBlockTextLength = currentContent.getBlockForKey(startKey).getLength();
      const startSelectedTextLength = startBlockTextLength - currentSelection.getStartOffset();
      const endSelectedTextLength = currentSelection.getEndOffset();
      const keyAfterEnd = currentContent.getKeyAfter(endKey);
      if (startKey === endKey) {
        length += currentSelection.getEndOffset() - currentSelection.getStartOffset();
      } else {
        let currentKey = startKey;

        while (currentKey && currentKey !== keyAfterEnd) {
          if (currentKey === startKey) {
            length += startSelectedTextLength + 1;
          } else if (currentKey === endKey) {
            length += endSelectedTextLength;
          } else {
            length += currentContent.getBlockForKey(currentKey).getLength() + 1;
          }

          currentKey = currentContent.getKeyAfter(currentKey);
        }
      }
    }

    return length;
  };

  const handleBeforeInput = (): DraftHandleValue => {
    if (typeof maxLength !== 'number') {
      return 'not-handled';
    }

    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;
    const selectedTextLength = getLengthOfSelectedText();
    if (currentContentLength - selectedTextLength > maxLength - 1) {
      return 'handled';
    }

    return 'not-handled';
  };

  const handlePastedText = (pastedText: string): DraftHandleValue => {
    if (typeof maxLength !== 'number') {
      return 'not-handled';
    }

    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;
    const selectedTextLength = getLengthOfSelectedText();
    if (currentContentLength + pastedText.length - selectedTextLength > maxLength - 1) {
      return 'handled';
    }

    return 'not-handled';
  };

  const handleBlur = (): void => {
    onBlur?.(getFormulaValue());
  };

  useEffect(() => {
    if (customRules.length === 0) {
      return;
    }

    const compositeDecorator = new CompositeDecorator([
      ...defaultDecorators,
      {
        strategy: (contentBlock, callback, contentState) => {
          handleFieldHighlight(contentBlock, callback, contentState, customRules.map(({ name }) => name));
        },
        component: FieldSpan,
      },
    ]);
    handleChange(EditorState.set(editorState, { decorator: compositeDecorator }));
  }, [customRules]);

  const insertBefore = (insertLength: number): boolean => {
    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;
    if (currentContentLength + insertLength > maxLength) {
      return false;
    }

    return true;
  };

  const insertEntity = (entityData: CustomRule): void => {
    if (!insertBefore(entityData.name.length + 2)) {
      return;
    }

    const contentState = editorState.getCurrentContent();
    let contentStateWithEntity = contentState.createEntity('variable', 'IMMUTABLE', entityData);
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    let selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      contentStateWithEntity = Modifier.insertText(
        contentStateWithEntity, selection, entityData.name, undefined, entityKey,
      );
    } else {
      contentStateWithEntity = Modifier.replaceText(
        contentStateWithEntity, selection, entityData.name, undefined, entityKey,
      );
    }

    let end = 0;
    contentStateWithEntity.getBlockForKey(selection.getFocusKey()).findEntityRanges(
      (character) => character.getEntity() === entityKey,
      (_, _end) => {
        end = _end + 1;
      });

    selection = selection.merge({
      anchorOffset: end,
      focusOffset: end,
    }) as SelectionState;
    contentStateWithEntity = Modifier.insertText(contentStateWithEntity, selection, ' ');
    let newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    newEditorState = EditorState.forceSelection(newEditorState, selection);
    handleChange(newEditorState);
  };

  const insertText = (text: string, hasSpacing = true, backNumber = 0): void => {
    if (!insertBefore(text.length)) {
      return;
    }

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
    handleChange(newEditorState);
  };

  const getFormulaValue = (_editorState?: EditorState): string => {
    const currentContent = (_editorState || editorState).getCurrentContent();
    const { blocks, entityMap } = convertToRaw(currentContent);
    return blocks.map((block) => {
      let text = block.text;
      block.entityRanges.forEach(({ key }) => {
        text = text.replace(entityMap[key].data.name, entityMap[key].data.key);
      });
      return text;
    }).join(' ').replace('\'', '"').replace('\'', '"');
  };

  return (
    <div className={className}>
      <div className='formula-editor-container border border-gray-300 w-full corner-2-8-8-8 overflow-hidden'>
        <Editor
          onBlur={handleBlur}
          readOnly={readOnly}
          handleBeforeInput={handleBeforeInput}
          handlePastedText={handlePastedText}
          editorState={editorState}
          onChange={handleChange}
          placeholder="请输入...."
          ref={editorDom}
          spellCheck={true}
        />
        {typeof maxLength === 'number' && (
          <div className='text-right px-8 py-2 text-gray-400'>
            {contentLength}/{maxLength}
          </div>
        )}
      </div>
      {help ? <p className='text-gray-600 mt-8'>{help}</p> : null}
    </div>
  );
}

export default React.forwardRef(FormulaEditor);
