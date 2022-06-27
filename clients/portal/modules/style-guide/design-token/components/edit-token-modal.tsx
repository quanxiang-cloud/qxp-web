import React, {
  useState,
  useMemo,
  useEffect,
  MouseEvent,
} from 'react';
import { observer } from 'mobx-react';

import ColorPicker from './color-picker';
import Modal from '@c/modal';

import { getAliasValue } from '../utils/aliases';
import BoxShadowInput from './boxshadow-input';
import store from '../../store';
import DesignTokenStore, { TokenEdited } from '../store';
import { Token } from '../types/token';
import {
  TokenBoxshadowUnit,
  TokenBoxshadowValue,
  TokenTypograpyUnit,
  TokenTypograpyValue,
} from '../types/values';
import { UpdateTokenInput } from '../types/input';
import TokenValueInput from './TokenValueInput';
interface Props {
  onClose: () => void;
}

function EditTokenModal<T extends Token>({ onClose }: Props): JSX.Element {
  const {
    createToken,
    updateToken,
    isEditDisabled,
    activeTokenSet,
    resolvedTokens,
    tokenToBeEdited,
  } = store.designTokenStore as DesignTokenStore;

  const [error, setError] = useState<string | null>(null);
  const [editToken, setEditToken] = useState<TokenEdited<T> | null>(
    tokenToBeEdited,
  );

  const isValid = useMemo(() => editToken?.value && !error, [editToken, error]);

  const nameWasChanged = useMemo(() => editToken?.initialName !== editToken?.name, [editToken]);

  const hasName = useMemo(
    () => resolvedTokens.filter((t) => t.parent === activeTokenSet).find((t) => t.name === editToken?.name),
    [editToken, resolvedTokens, activeTokenSet],
  );

  const hasGroupName = useMemo(
    () => resolvedTokens.filter((t) => t.parent === activeTokenSet).find((t) => t.name.startsWith(`${editToken?.name}.`)),
    [editToken, resolvedTokens, activeTokenSet],
  );

  useEffect(() => {
    if ((editToken?.isPristine || nameWasChanged) && hasName) {
      setError('Token名称不能重复');
    }
    if ((editToken?.isPristine || nameWasChanged) && hasGroupName) {
      setError('不能使用其他组的名称');
    }
  }, [editToken, hasName, hasGroupName]);

  const handleChange = (key: string, value: TokenEdited<T>['value'] | TokenEdited<T>['unit'] | TokenEdited<T>['options']): void => {
    setError(null);
    if (editToken) {
      setEditToken({
        ...editToken,
        [key]: value,
      });
    }
  };

  const submitTokenValue = ({ value, name, options, unit }: TokenEdited<T>): void => {
    if (!editToken) {
      return;
    }
    let oldName;
    if (editToken.initialName !== name && editToken.initialName) {
      oldName = editToken.initialName;
    }
    const newName = name.split('/').map((n) => n.trim()).join('.');

    if (editToken.isPristine) {
      createToken({
        parent: activeTokenSet,
        name: newName,
        unit,
        value,
        options,
      } as UpdateTokenInput);
    } else {
      updateToken({
        parent: activeTokenSet,
        name: newName,
        oldName,
        unit,
        value,
        options,
      } as UpdateTokenInput);
    }
  };

  const handleSubmit = (e: MouseEvent): void => {
    e.preventDefault();
    if (isValid && editToken) {
      submitTokenValue(editToken);
      onClose();
    }
  };

  const resolvedValue = useMemo(() => {
    if (editToken) {
      return typeof editToken?.value === 'object' ?
        null :
        getAliasValue(editToken.value, resolvedTokens);
    }
    return null;
  }, [editToken, resolvedTokens]);

  const renderTokenForm = (): null | JSX.Element => {
    if (!editToken) {
      return null;
    }

    switch (editToken.type) {
    case 'boxShadow': {
      return (
        <BoxShadowInput
          onValueChange={(shadow) => handleChange('value', shadow)}
          onUnitChange={(unit) => handleChange('unit', unit)}
          value={editToken.value as TokenBoxshadowValue}
          unit={editToken.unit as TokenBoxshadowUnit}
        />
      );
    }
    case 'typography': {
      return (
        <>
          {Object.keys(editToken.schema.value as TokenTypograpyValue).map(
            (key) => (
              <TokenValueInput
                name={key}
                key={key}
                label={key}
                value={(editToken.value as TokenTypograpyValue)[key as keyof TokenTypograpyValue]}
                onChange={(e) =>
                  handleChange('value', {
                    ...(editToken.value as TokenTypograpyValue),
                    [key]: e.target.value,
                  })
                }
                afterAddon={
                  key in (editToken.schema.unit as TokenTypograpyUnit) && (
                    <input
                      type="text"
                      className="w-40 p-4"
                      value={(editToken.unit as TokenTypograpyUnit)[key as keyof TokenTypograpyUnit]}
                      onChange={(e) =>
                        handleChange('unit', {
                          ...(editToken.unit as TokenTypograpyUnit),
                          [key]: e.target.value,
                        })
                      }
                      name={key}
                    />
                  )
                }
              />
            ),
          )}
        </>
      );
    }
    default: {
      return (
        <TokenValueInput
          name="value"
          label={editToken?.property}
          value={editToken?.value as string}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          type={editToken?.type}
          preAddon={
            editToken.type === 'color' && (
              <ColorPicker
                className="w-20 h-20 border-1 border-gray-400 mr-4"
                value={
                  resolvedValue ? resolvedValue : (editToken.value as string)
                }
                onChange={(color) => handleChange('value', color)}
              />
            )
          }
          afterAddon={
            editToken.schema.unit && (
              <input
                type="text"
                className="w-40 p-4"
                value={editToken?.unit as string}
                name="unit"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            )
          }
        />
      );
    }
    }
  };

  return (
    <Modal
      title={editToken?.isPristine ? '创建Token' : '编辑Token'}
      onClose={onClose}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: onClose,
        },
        {
          text: '确定',
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: (key, e) => handleSubmit(e),
        },
      ]}
    >
      <form className="flex flex-col justify-start">
        <p className="text-orange-500 px-20">{error}</p>
        <TokenValueInput
          label="name"
          name="name"
          value={editToken?.name}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          disabled={isEditDisabled}
        />
        {renderTokenForm()}
        {editToken?.explainer && (
          <div className="px-20 text-12">{editToken.explainer}</div>
        )}
        {editToken?.schema.options ?
          Object.keys(editToken.schema.options).map((key: string) => (
            <TokenValueInput
              key={key}
              label={key}
              name={key}
              value={editToken.options[key as keyof typeof editToken.options]}
              onChange={(e) =>
                handleChange('options', {
                  ...editToken.options,
                  [key]: e.target.value,
                })
              }
            />
          )) :
          null}
      </form>
    </Modal>
  );
}

export default observer(EditTokenModal);
