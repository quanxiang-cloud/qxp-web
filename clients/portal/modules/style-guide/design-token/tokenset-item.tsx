import React, { DragEvent } from 'react';
import cs from 'classnames';

import MoreMenu from '@c/more-menu';
import Icon from '@one-for-all/icon';
import { Checkbox } from '@one-for-all/headless-ui';

import store from '../store';
import DesignTokenStore, { GLOBAL_SET } from './store';
interface Props {
  token: string;
  draggedTokenSet: string | null;
  setDraggedTokenSet: (token: string | null) => void;
  editTokenSet: (token: string) => void;
  deleteTokenSet: (token: string) => void;
}

enum MenuKey {
  EDIT = 'EDIT',
  DUPLICATE = 'DUPLICATE',
  DELETE = 'DELETE',
}

function TokensetItem({
  token,
  editTokenSet,
  deleteTokenSet,
  draggedTokenSet,
  setDraggedTokenSet,
}: Props): JSX.Element {
  const {
    usedTokenSet,
    activeTokenSet,
    setActiveTokenSet,
    toggleUsedTokenSet,
    duplicateTokenSet,
    setTokens,
    tokens,
  } = store.designTokenStore as DesignTokenStore;

  const checked = usedTokenSet.includes(token);
  const editable = token !== GLOBAL_SET;

  const onDragStart = (e: DragEvent): void => {
    e.stopPropagation();
    setDraggedTokenSet(token);
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
    let draggedTokenSetIndex = null;
    let dropTokenSetIndex = null;
    if (draggedTokenSet && editable) {
      const mappedTokens = Object.entries(tokens);
      mappedTokens.forEach(([name, group], index) => {
        if (name === draggedTokenSet) {
          draggedTokenSetIndex = index;
        }
        if (name === token) {
          dropTokenSetIndex = index;
        }
      });

      if (draggedTokenSetIndex !== null && dropTokenSetIndex !== null) {
        mappedTokens.splice(dropTokenSetIndex, 0, ...mappedTokens.splice(draggedTokenSetIndex, 1));
        setTokens(Object.fromEntries(mappedTokens));
      }
    }
  };

  const dragProps = {
    draggable: editable,
    onDrag,
    onDrop,
    onDragEnd,
    onDragEnter,
    onDragLeave,
    onDragStart,
    onDragOver,
  };

  return (
    <div
      {...dragProps}
      className={cs('flex justify-between py-4 px-10', {
        'bg-blue-50': activeTokenSet === token,
      })}
      onClick={() => setActiveTokenSet(token)}
    >
      {editable ? (<Checkbox
        label={token}
        value={token}
        disabled={!editable}
        checked={checked}
        onChange={toggleUsedTokenSet}
      />) : <label>{token}</label>}
      {editable && (
        <MoreMenu
          menus={[
            {
              key: MenuKey.EDIT,
              label: (
                <div className="flex items-center">
                  <Icon name="edit" size={16} className="mr-8" />
                  <span className="font-normal">修改集合</span>
                </div>
              ),
            },
            {
              key: MenuKey.DUPLICATE,
              label: (
                <div className="flex items-center">
                  <Icon name="content_copy" size={16} className="mr-8" />
                  <span className="font-normal">复制集合</span>
                </div>
              ),
            },
            {
              key: MenuKey.DELETE,
              label: (
                <div className="flex items-center">
                  <Icon name="delete" size={16} className="mr-8" />
                  <span className="font-normal">删除集合</span>
                </div>
              ),
            },
          ]}
          onMenuClick={(key) => {
            if (key === MenuKey.EDIT) {
              editTokenSet(token);
            }

            if (key === MenuKey.DELETE) {
              deleteTokenSet(token);
            }

            if (key === MenuKey.DUPLICATE) {
              duplicateTokenSet(token);
            }
          }}
        />
      )}
    </div>
  );
}

export default TokensetItem;
