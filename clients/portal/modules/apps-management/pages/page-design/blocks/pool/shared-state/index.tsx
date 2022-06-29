import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { pickBy, set } from 'lodash';
import { useUpdateEffect, useDebounce } from 'react-use';
import { Search, Icon, Tooltip } from '@one-for-all/ui';

import { Artery } from '@one-for-all/artery';

import VarItem from './var-item';
import FormAddVal from './form-add-val';

import styles from '../index.m.scss';
import { mapSharedStateSpec, mapShareState } from './utils';
import toast from '@lib/toast';

type Props = {
  artery: Artery;
  onChange: (artery: Artery) => void;
};

function SharedState({ artery, onChange }: Props): JSX.Element {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sharedState, setSharedState] = useState(mapSharedStateSpec(artery));
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [curStates, setCurStates] = useState(sharedState);
  const [curSharedStateKey, setCurSharedStateKey] = useState<string>('');

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },
    500,
    [search],
  );

  useUpdateEffect(() => {
    setCurStates(pickBy(sharedState, (_, key) => key.toLowerCase().includes(debouncedSearch.toLowerCase())));
  }, [sharedState, debouncedSearch]);

  function saveSharedState(key: string, val: any): void {
    if (curSharedStateKey) {
      const oldKey = curSharedStateKey;
      if (oldKey === key && sharedState[oldKey] === val) {
        toast.success('数据未更改');
        return;
      }
      set(sharedState, key, val);
      if (oldKey !== key) {
        delete sharedState[oldKey];
      }
    } else {
      set(sharedState, key, val);
    }
    toast.success(curSharedStateKey ? '修改变量成功' : '新增变量成功');
    setModalOpen(false);
    setCurSharedStateKey('');
    setSharedState({ ...sharedState });
    onChange({
      ...artery,
      sharedStatesSpec: mapShareState(sharedState),
    });
  }

  function removeSharedState(key: string): void {
    delete sharedState[key];
    setSharedState({ ...sharedState });
    onChange({
      ...artery,
      sharedStatesSpec: mapShareState(sharedState),
    });
  }

  const noData = !Object.keys(curStates).length;

  return (
    <div>
      <Search
        className={styles.search}
        value={search}
        onChange={setSearch}
        placeholder="搜索参数名称.."
        actions={
          (<Tooltip position="top" label="新建状态">
            <Icon
              name="add"
              clickable
              onClick={() => {
                setCurSharedStateKey('');
                setModalOpen(true);
              }}
            />
          </Tooltip>)
        }
      />
      <div className="relative">
        {noData && (
          <div
            className="flex justify-center items-center h-full text-gray-400"
            style={{ marginTop: '72px' }}
          >
            暂无数据
          </div>
        )}
        {!noData && (
          <div className="flex flex-col h-full">
            {Object.entries(curStates).map(([name, conf]: [string, any]) => {
              return (
                <VarItem
                  key={name}
                  name={name}
                  conf={conf}
                  sharedState={sharedState}
                  setSharedState={setSharedState}
                  setModalOpen={setModalOpen}
                  setCurSharedStateKey={setCurSharedStateKey}
                  saveSharedState={saveSharedState}
                  removeSharedState={removeSharedState}
                />
              );
            })}
          </div>
        )}
      </div>
      {modalOpen && (
        <FormAddVal
          sharedState={sharedState}
          curSharedStateKey={curSharedStateKey}
          setModalOpen={setModalOpen}
          saveSharedState={saveSharedState}
        />
      )}
    </div>
  );
}

export default observer(SharedState);
