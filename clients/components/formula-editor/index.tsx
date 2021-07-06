import React, { useState, useRef, useEffect, useImperativeHandle, useMemo } from 'react';
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
  onChange,
  onBlur,
  readOnly,
  defaultValue = '',
}: Props, ref: React.Ref<any>): JSX.Element {
  const [contentLength, setLength] = useState(0);
  const decorator = useMemo(() => {
    const _decorator = new CompositeDecorator(defaultDecorators);
    return _decorator;
  }, []);

  const [editorState, setEditorState] = useState(
    defaultValue ? EditorState.createWithContent(
      convertFromRaw(toContentState(defaultValue, customRules)), decorator,
    ) : EditorState.createEmpty(decorator),
  );

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
    onChange?.(getFormulaValue());
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
    if (!insertBefore(entityData.name.length + 1)) {
      return;
    }

    let contentState = editorState.getCurrentContent();
    contentState = contentState.createEntity('variable', 'IMMUTABLE', entityData);
    const entityKey = contentState.getLastCreatedEntityKey();
    let selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      contentState = Modifier.insertText(
        contentState, selection, entityData.name + ' ', undefined, entityKey,
      );
    } else {
      contentState = Modifier.replaceText(
        contentState, selection, entityData.name + ' ', undefined, entityKey,
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

  const getFormulaValue = (): string => {
    const currentContent = editorState.getCurrentContent();
    const { blocks, entityMap } = convertToRaw(currentContent);
    return blocks.map((block) => {
      let text = block.text;
      block.entityRanges.forEach(({ key }) => {
        text = text.replace(entityMap[key].data.name, entityMap[key].data.key);
      });
      return text;
    }).join(' ').replace('"', '\'').replace('"', '\'');
  };

  return (
    <div className={`formula-editor-container ${className}`}>
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
  );
}

export default React.forwardRef(FormulaEditor);
