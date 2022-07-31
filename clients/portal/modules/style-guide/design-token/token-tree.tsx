import React from 'react';
import { observer } from 'mobx-react';

import Icon from '@one-for-all/icon';
import MoreMenu from '@c/more-menu';
import TokenButton from './token-button';

import store from '../store';
import { isSingleToken, isTypographyToken } from './utils';
import { TokenTypes } from './constants/constants-types';
import DesignTokenStore from './store';
import { Token } from './types/token';
import { ShowFormProps } from './token-list';

interface Props{
  path?: string;
  type: TokenTypes;
  level: number;
  draggedToken: null | Token;
  tokenValues: Record<string, any>;
  showNewForm: (c: ShowFormProps) => void;
  showForm: (c: ShowFormProps) => void;
  setDraggedToken: (token: Token) => void;
}

function TokenTree({
  tokenValues,
  path,
  type,
  level,
  draggedToken,
  showNewForm,
  showForm,
  setDraggedToken,
}: Props): JSX.Element {
  const paddingLeft = level * 10;
  const { deleteTokenGroup, activeTokenSet, isEditDisabled } = store.designTokenStore as DesignTokenStore;

  return (
    <div
      className="flex justify-start flex-row flex-wrap pb-4"
    >
      {Object.entries(tokenValues).map(([name, value]) => {
        const stringPath = [path, name].filter((n) => n).join('.');

        return (
          <React.Fragment key={stringPath}>
            {typeof value === 'object' &&
            !isTypographyToken(value) &&
            !isSingleToken(value) ? (
                <div className="property-wrapper w-full" style={{ paddingLeft: paddingLeft + 'px' }}>
                  <div className="flex items-center justify-between group-head pl-8 mb-4 h-24">
                    <h3 className="text-12">{name}</h3>
                    {!isEditDisabled && (<div className="group-button items-center">
                      <span
                        className="mr-4"
                        onClick={() => {
                          showNewForm({ name: `${stringPath}.` });
                        }}
                      >
                        <Icon name="add" size={24} />
                      </span>
                      <MoreMenu
                        menus={[
                          {
                            key: 'delete',
                            label: (
                              <div className="flex items-center">
                                <Icon name="delete" size={16} className="mr-8" />
                                <span className="font-normal">删除Group</span>
                              </div>
                            ),
                          },
                        ]}
                        onMenuClick={(key) => {
                          if (key === 'delete') {
                            deleteTokenGroup({
                              parent: activeTokenSet,
                              path: stringPath,
                            });
                          }
                        }}
                      />
                    </div>)}
                  </div>

                  <TokenTree
                    tokenValues={value}
                    showNewForm={showNewForm}
                    showForm={showForm}
                    draggedToken={draggedToken}
                    setDraggedToken={setDraggedToken}
                    path={stringPath}
                    type={type}
                    level={level + 1}
                  />
                </div>
              ) : (
                <TokenButton
                  draggedToken={draggedToken}
                  setDraggedToken={setDraggedToken}
                  type={type}
                  token={value}
                  showForm={showForm}
                />
              )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default observer(TokenTree);
