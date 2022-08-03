import React, { useState, useMemo } from 'react';
import { Search, Icon, Tooltip } from '@one-for-all/ui';
import { APIStatesSpec } from '@one-for-all/artery';
import { omit } from 'lodash';

import SelectApiModal from './select-api-modal';
import DisplayApi from './display-api';
import styles from '../index.m.scss';

type Props = {
  apiStateSpec?: APIStatesSpec;
  onChangeApiState?: (apiState: APIStatesSpec) => void;
  hasSameKey: (key: string) => boolean;
};

export default function ApiState({
  apiStateSpec,
  onChangeApiState,
  hasSameKey,
}: Props): JSX.Element {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const filteredApi = useMemo(() => {
    if (!search || !apiStateSpec) return apiStateSpec;
    return Object.entries(apiStateSpec).reduce((total: APIStatesSpec, [name, apiSpec]) => {
      if (name.match(search)) {
        total[name] = apiSpec;
      }

      return total;
    }, {});
  }, [search, apiStateSpec]);

  function handleSelectApi(name: string, apiPath: string, method: string, desc?: string): void {
    const currentApi = {
      apiID: `${method}:${apiPath}`,
      desc,
    };

    onChangeApiState?.({ ...apiStateSpec, [name]: currentApi });
  }

  function handleDelete(name: string): void {
    if (!apiStateSpec) return;
    onChangeApiState?.(omit(apiStateSpec, [name]));
  }

  function hasSelectApi(apiStateSpec?: APIStatesSpec): boolean {
    if (!apiStateSpec) return false;
    if (!Object.keys(apiStateSpec).length) return false;
    return true;
  }

  return (
    <div>
      <Search
        className={styles.search}
        value={search}
        onChange={setSearch}
        placeholder='搜索 API 名称..'
        actions={(
          <Tooltip position='top' label='选中平台 API'>
            <Icon name='add' clickable onClick={() => setModalOpen(true)} />
          </Tooltip>
        )}
      />
      <div className='relative'>
        {hasSelectApi(filteredApi) ? (
          <div className='flex flex-col h-full'>
            {Object.entries(filteredApi || {}).map(([name, spec]) => {
              return (
                <DisplayApi key={name} name={name} spec={spec} onDelete={() => handleDelete(name)} />
              );
            })}
          </div>
        ) : (
          <div
            className='flex justify-center items-center h-full flex-col text-center px-40 text-gray-400'
            style={{ marginTop: '72px' }}
          >
            <p>暂无数据</p>
            {!hasSelectApi(apiStateSpec) && <p>可以选择将该应用的内部 API 和第三方 API</p>}
          </div>
        )}
      </div>
      {modalOpen && (
        <SelectApiModal
          closeModal={() => setModalOpen(false)}
          onSelectApi={handleSelectApi}
          existSameName={hasSameKey}
        />
      )}
    </div>
  );
}
