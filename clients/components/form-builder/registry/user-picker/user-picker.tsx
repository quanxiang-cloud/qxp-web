import React from 'react';
import cs from 'classnames';
import { useQuery } from 'react-query';
import { Select, SelectProps } from 'antd';
import { debounce } from 'lodash';

import { searchUser, Res } from './messy/api';
import { Option } from './messy/enum';
import './index.scss';

type OptionalRange = 'customize' | 'all';

interface Props extends SelectProps<any> {
  optionalRange?: OptionalRange;
  appID?: string;
  dataSource?: any[];
}

interface AllUserPickerProps extends SelectProps<any> {
  appID: string;
}

const PAGE_SIZE = 10;

const UserPicker = ({ optionalRange, appID, onChange, value, ...componentsProps }: Props): JSX.Element => {
  const handleChange = (_: any, _selected: any): void => {
    onChange && onChange(_selected ? [].concat(_selected) : [], _);
  };

  const selected = Array.isArray(value || []) ?
    (value || []).map(({ value }: Option) => value) : value.value;

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
      {...componentsProps}
      value={selected}
      onChange={handleChange}
      className={cs('user-selector', componentsProps.className || '')}
    />
  );
};

const AllUserPicker = ({ appID, ...otherProps }: AllUserPickerProps): JSX.Element | null => {
  const [options, setOptions] = React.useState<Option[]>([]);
  const [hasNext, setHasNext] = React.useState<boolean>(false);
  const [keyword, setKeyword] = React.useState<string>();
  const [page, setCurrent] = React.useState(1);

  const _setKeyword = React.useCallback((str) => {
    setKeyword(str);
    setOptions([]);
    setCurrent(1);
  }, [setKeyword, setOptions, setCurrent]);

  const params = React.useMemo(() => {
    return {
      userName: keyword,
      page,
      limit: PAGE_SIZE,
    };
  }, [keyword, page]);

  const { isLoading } = useQuery(
    ['query_user_picker', params, appID],
    () => searchUser(appID, params),
    {
      onSuccess(data: Res) {
        if (data) {
          const newOptions = (data.data || []).map((itm) => ({
            label: itm.userName,
            value: itm.id,
          }));
          setOptions((current) => [...current, ...newOptions]);
          setHasNext(data.total_count > page * PAGE_SIZE);
        }
      },
    });

  const componentsProps = Object.assign({}, otherProps, {
    loading: isLoading,
    onSearch: debounce(_setKeyword, 500),
    showSearch: true,
    onPopupScroll(e: any) {
      if (!hasNext) return;
      const dom = e.target;
      const { scrollTop, clientHeight, scrollHeight } = dom as any;
      if (scrollTop + clientHeight == scrollHeight) {
        if (!isLoading) {
          setCurrent((current) => 1 + current);
        }
      }
    },
  });

  if (isLoading && options.length === 0) {
    return null;
  }

  return (
    <Select
      {...componentsProps}
      options={options}
      className={cs('user-selector', componentsProps.className || '')}
    />
  );
};

export default UserPicker;
