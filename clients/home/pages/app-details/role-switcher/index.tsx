import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Icon from '@c/icon';
import Popper from '@c/popper';

import store from '../store';

function RoleSwitcher(): JSX.Element {
  const roleSwitcherRef = useRef(null);
  const popperRef = useRef<Popper>(null);
  const {
    currentRoleInfo, roleOptions, handleRoleChange,
  } = store;
  const [isShowRoleList, setIsShowRoleList] = useState(popperRef.current?.state.popVisible);

  return (
    <>
      <div
        className="relative z-50 w-208 h-56 flex items-center flex-shrink-0 px-16 py-10 gap-8 role-switcher-wrap"
        ref={roleSwitcherRef}
      >
        <div className="flex justify-center items-center w-36 h-36 rounded-8 rounded-tr-2 bg-white shadow-more-action role-icon">
          <Icon
            name="role"
            size={20}
            className="text-yellow-400"
            style={{ fill: 'var(--yellow-600)' }}
          />
        </div>
        <div className="flex justify-between items-center flex-1 role-switcher">
          <div className="flex flex-col justify-between items-start select-none text-12 role-name">
            <div className="font-semibold w-100 text-gray-900 whitespace-nowrap overflow-ellipsis overflow-hidden">
              {currentRoleInfo.name}
            </div>
            <div className="text-gray-600">当前角色</div>
          </div>
          <Icon
            clickable
            size={21}
            name="keyboard_arrow_down"
            className={cs('transition-transform duration-100 transform flex-shrink-0',
              {
                'rotate-180': isShowRoleList,
              })}
          />
        </div>
      </div>
      {
        roleOptions.length > 1 && (
          <Popper
            trigger='hover'
            ref={popperRef}
            placement="top-start"
            reference={roleSwitcherRef}
            className='rounded-12'
            onVisibilityChange={(visible)=> setIsShowRoleList(visible)}
          >
            <div
              className={cs(
                'w-208 h-160 top-0 left-4 py-10 flex flex-col justify-start',
                'bg-white overflow-x-hidden role-selector-pop-wrap',
              )}
            >
              {
                roleOptions.map((option: LabelValue) => {
                  const { label, value } = option;
                  const isActive = value === currentRoleInfo.id;
                  return (
                    <div
                      key={value}
                      className={cs('flex justify-between items-center py-8 px-16 group cursor-pointer')}
                      onClick={() => {
                        if (currentRoleInfo.id === value) return;
                        handleRoleChange(value, label);
                      }}
                    >
                      <div
                        className={cs('text-14 text-current group-hover:text-blue-600 w-142 break-words',
                          {
                            'text-blue-600': isActive,
                          })}>
                        { label }
                      </div>
                      {
                        isActive && (
                          <Icon
                            size={20}
                            name="check"
                            className="text-blue-600 flex-shrink-0"
                          />)
                      }
                    </div>
                  );
                })
              }
            </div>
          </Popper>
        )
      }
    </>
  );
}

export default observer(RoleSwitcher);
