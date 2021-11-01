import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import cs from 'classnames';
import { debounce } from 'lodash';

import Loading from '@c/loading';
import Icon from '@c/icon';
import Tab, { TabProps } from '@c/no-content-tab';
import Search from '@c/search';
import ShowModal from './show-modal';
import MoreIconMenu from './more-icon-menu';
import { useURLSearch } from '@lib/hooks';

import store from './store';

import './index.scss';

interface Props {
  className?: string;
}

const TABS: TabProps[] = [
  { label: '单层级', key: 'list' },
  { label: '多层级', key: 'tree' },
];

function OptionSetList({ className }: Props): JSX.Element {
  const [hoverID, setHoverID] = useState('');
  const [searchQuery] = useURLSearch();
  const id = searchQuery.get('id') as string;
  const type = searchQuery.get('type') || 'list';
  store.queryID = id;
  store.queryType = type;

  const history = useHistory();

  useEffect(() => {
    store.fetchAllNames();
    return store.reset;
  }, []);

  const debounceSearch = useCallback(debounce(() => {
    store.fetchAllNames({ name: store.search }).then(
      () => {
        store.setActive('', store.queryType);
        history.push(`/apps/option-set?type=${store.queryType}&id=${store.activeId}`);
      },
    );
  }, 300), []);

  const handleSearch = useCallback((val: string) => {
    store.setSearch(val);
    debounceSearch();
  }, []);

  const typeNum = store.queryType === 'list' ? 1 : 2;
  const filteredList = store.optionSetNames?.filter((itm) => itm.type === typeNum);

  return (
    <div className={cs('dataset-names w-1/5 flex flex-col overflow-auto text-blueGray-400', className)}>
      <div className="dataset-names--toolbar flex flex-col">
        <Tab
          activeTab={type}
          tabs={TABS}
          onChange={(key) => {
            store.queryType = key;
            store.setActive('', key);
            store.search.length === 0 ? store.fetchAllNames() : store.fetchAllNames({ name: store.search });
            history.push(`/apps/option-set?type=${key}&id=${store.activeId}`);
          }}
          className='w-full border-b-1'
          labelClassName='w-1/2 justify-center'
        />
        <Search
          placeholder="搜索选项集名称..."
          value={store.search}
          onChange={handleSearch}
          className='mt-16 border-none'
        />
        {!store.search && (<span
          className='flex mt-8 py-8 pl-16 items-center hover:bg-blue-100 cursor-pointer hover:text-blue-600'
          onClick={() => {
            store.modalType = 'add';
            store.modalOpen = true;
          }}
        >
          <Icon name='add' size={20} />
          <span className='ml-8'>添加选项集</span>
        </span>)}
      </div>
      {store.loadingNames && <Loading />}
      {!store.loadingNames && (
        <div className='flex flex-col overflow-auto'>
          {!!filteredList?.length && filteredList.map(({ id, name }) => {
            return (
              <div
                className={cs('name-item flex items-center cursor-pointer pl-16 py-8', {
                  'item-active': store.activeId === id || hoverID === id,
                })}
                key={id}
                onMouseEnter={() => setHoverID(id)}
                onMouseLeave={() => setHoverID('')}
                onClick={() => {
                  history.push(`/apps/option-set?type=${store.queryType}&id=${id}`);
                  store.setActive(id);
                }}
              >
                {name === '职位' && <Icon name="folder_shared_qxp" />}
                {name !== '职位' && <Icon name="database" />}
                <span className="ml-8 flex-grow w-0 truncate">{name}</span>
                <MoreIconMenu tabKey={store.queryType} />
              </div>
            );
          })}
        </div>
      )}
      {store.modalOpen && <ShowModal modalType={store.modalType} />}
    </div>
  );
}

export default observer(OptionSetList);
