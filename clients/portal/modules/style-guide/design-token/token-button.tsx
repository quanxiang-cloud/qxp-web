import React, { useMemo, DragEvent } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import { Menus } from '@c/more-menu';
import { Token } from './types/token';
import { getAliasValue } from './utils/aliases';
import store from '../store';
import usePopper from '@c/popper2';
import DesignTokenStore from './store';
import { ShowFormProps } from './token-list';

enum MenuKey {
  EDIT = 'EDIT',
  DUPLICATE = 'DUPLICATE',
  DELETE = 'DELETE',
}

interface Props {
  type: string;
  token: Token;
  draggedToken: null | Token;
  setDraggedToken: (token: Token) => void;
  showForm: (c: ShowFormProps) => void;
}

function TokenButton({
  type,
  token,
  draggedToken,
  showForm,
  setDraggedToken,
}: Props): JSX.Element {
  const { Popper, referenceRef, handleClick, close } =
    usePopper<HTMLDivElement>();
  const { tokens, resolvedTokens, activeTokenSet, setTokens, deleteToken, duplicateToken, isEditDisabled } =
    store.designTokenStore as DesignTokenStore;

  const displayValue = getAliasValue(token, resolvedTokens);

  const visibleName = token.name.split('.').slice(-1).join('.');
  const isColorType = type === 'color';
  let style = {};
  let showValue = true;

  if (type === 'borderRadius') {
    style = { ...style, borderRadius: `${displayValue}${token.unit}` };
  }
  if (type === 'color') {
    showValue = false;
    style = { backgroundColor: displayValue };
  }

  const resolveFailed = useMemo(
    () => resolvedTokens.find((t) => t.name === token.name)?.resolveFailed,
    [token, resolvedTokens],
  );

  const handleMenuClick = (key: MenuKey): void => {
    if (key === MenuKey.DELETE) {
      handleDeleteClick();
    }

    if (key === MenuKey.DUPLICATE) {
      handleDuplicateClick();
    }

    if (key === MenuKey.EDIT) {
      handleEditClick();
    }

    close();
  };

  const handleEditClick = (): void => {
    showForm({ name: token.name, token });
  };

  const handleDeleteClick = (): void => {
    deleteToken({ parent: activeTokenSet, path: token.name });
  };
  const handleDuplicateClick = (): void => {
    duplicateToken({ parent: activeTokenSet, name: token.name });
  };

  const menuItems = [
    {
      key: MenuKey.EDIT,
      label: '编辑token',
    },
  ];

  if (!isEditDisabled) {
    menuItems.push({
      key: MenuKey.DUPLICATE,
      label: '复制token',
    },
    {
      key: MenuKey.DELETE,
      label: '删除token',
    });
  }

  const onDragStart = (e: DragEvent): void => {
    e.stopPropagation();
    setDraggedToken(token);
  };
  const onDragEnd = (e: DragEvent): void => e.stopPropagation();
  const onDrag = (e: DragEvent): void => e.stopPropagation();
  const onDragEnter = (e: DragEvent): void => e.stopPropagation();
  const onDragLeave = (e: DragEvent): void => e.stopPropagation();
  const onDragOver = (e: DragEvent): void => {
    e.stopPropagation();
    e.preventDefault();
  };

  const onDrop = (e: DragEvent): void => {
    e.stopPropagation();
    let draggedTokenIndex = null;
    let dropTokenIndex = null;

    if (draggedToken && token && draggedToken.type === token.type) {
      tokens[activeTokenSet].forEach((element, index) => {
        if (element.name === draggedToken.name) draggedTokenIndex = index;
        if (element.name === token.name) dropTokenIndex = index;
      });
      if (draggedTokenIndex !== null && dropTokenIndex !== null) {
        const set = tokens[activeTokenSet];
        set.splice(dropTokenIndex, 0, set.splice(draggedTokenIndex, 1)[0]);
        const newTokens = {
          ...tokens,
          [activeTokenSet]: set,
        };

        setTokens(newTokens);
      }
    }
  };

  const dragProps = {
    draggable: !isEditDisabled,
    onDrag,
    onDrop,
    onDragEnd,
    onDragEnter,
    onDragLeave,
    onDragStart,
    onDragOver,
  };

  return (
    <div {...dragProps} className="mb-4 mr-4 border-1 border-gray-100 relative" style={style}>
      {/* <TokenTooltipWrapper token={token}> */}
      <div
        onClick={handleClick()}
        ref={referenceRef}
        style={style}
        className={cs('p-4', {
          'bg-gray-200': !isColorType,
          'w-20': isColorType,
          'h-20': isColorType,
        })}
      >
        <p className="button-text">
          {showValue && <span>{visibleName}</span>}
        </p>
        {resolveFailed && (
          <i className="absolute right-2 top-2 w-4 h-4 bg-orange-600"></i>
        )}
      </div>
      {/* </TokenTooltipWrapper> */}
      <Popper placement="bottom">
        <Menus
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Popper>
    </div>
  );
}

export default observer(TokenButton);
