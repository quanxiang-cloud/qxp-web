import React, { useState, useCallback, useMemo } from 'react';
import cs from 'classnames';
import { useQuery } from 'react-query';
import { Select, SelectProps } from 'antd';
import { debounce } from 'lodash';

import { searchUser, Res } from './messy/api';
import { Option } from './messy/enum';
import './index.scss';

type OptionalRange = 'customize' | 'all' | 'currentUser';

interface Props extends SelectProps<any> {
  optionalRange?: OptionalRange;
  appID?: string;
  dataSource?: any[];
}

interface AllUserPickerProps extends SelectProps<any> {
  appID: string;
}

type SyntheticEvent<T = Element, E = Event> = React.BaseSyntheticEvent<E, EventTarget & T, EventTarget>
type UIEvent<T = Element, E = Event> = SyntheticEvent<T, E>

const PAGE_SIZE = 10;

const UserPicker = ({ optionalRange, appID, onChange, value, ...componentsProps }: Props): JSX.Element => {
  const handleChange = (_: any, _selected: any): void => {
    onChange && onChange(_selected ? [].concat(_selected) : [], _);
  };

  const selected = Array.isArray(value) ? (value).map(({ value }: Option) => value) : value.value;

  if (!componentsProps.options?.length && componentsProps.dataSource?.length) {
    componentsProps.options = componentsProps.dataSource;
  }

  if (optionalRange === 'all') {
    return (
      <AllUserPicker
        {...componentsProps}
        onChange={handleChange}
        value={selected}
        appID={appID as string}
      />
    );
  }

  return (
    <Select
      allowClear
      {...componentsProps}
      value={selected}
      onChange={handleChange}
      className={cs('user-selector', componentsProps.className || '')}
    />
  );
};

const AllUserPicker = ({ appID, ...otherProps }: AllUserPickerProps): JSX.Element | null => {
  const [options, setOptions] = useState<Option[]>([]);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>();
  const [isAppend, setIsAppend] = useState(false);
  const [page, setCurrent] = useState(1);

  const _setKeyword = useCallback((str) => {
    setKeyword(str);
    setIsAppend(false);
    setCurrent(1);
  }, [setKeyword, setIsAppend, setCurrent]);

  const params = useMemo(() => ({
    userName: keyword,
    page,
    limit: PAGE_SIZE,
  }), [keyword, page]);

  const { isLoading } = useQuery(
    ['query_user_picker', params, appID],
    () => searchUser(appID, params),
    {
      onSuccess(data: Res): void {
        if (data) {
          const newOptions = (data.data || []).map((itm) => ({
            label: itm.userName,
            value: itm.id,
          }));
          let totalOptions = [...newOptions];
          if (isAppend) {
            totalOptions = [...options, ...newOptions];
          }
          setOptions(totalOptions);
          setHasNext(data.total_count > page * PAGE_SIZE);
        }
      },
    });

  const componentsProps = Object.assign({}, otherProps, {
    loading: isLoading,
    onSearch: debounce(_setKeyword, 500),
    showSearch: true,
    filterOption: false,
    onPopupScroll: (e: React.UIEvent<HTMLDivElement, globalThis.UIEvent>): void => {
      if (!hasNext) return;
      const dom = e.target;
      const { scrollTop, clientHeight, scrollHeight } = dom as Element;
      if ((scrollTop + clientHeight == scrollHeight) && !isLoading) {
        setIsAppend(true);
        setCurrent((current) => 1 + current);
      }
    },
  });

  if (isLoading && options.length === 0) {
    return null;
  }

  return (
    <Select
      allowClear
      {...componentsProps}
      options={options}
      className={cs('user-selector', componentsProps.className)}
    />
  );
};

export default UserPicker;
