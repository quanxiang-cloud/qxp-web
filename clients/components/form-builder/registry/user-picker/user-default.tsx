import React from 'react';
import { useQuery } from 'react-query';
import { Select } from 'antd';
import debounce from 'lodash/debounce';
import { searchUser, Res } from './messy/api';

import { Option } from './messy/enum';
import { StoreContext } from '../../context';

interface Props {
  value: Option | Option[];
  onChange: (value: Option) => void;
  rangeList: EmployeeOrDepartmentOfRole[];
  multiple: 'signle' | 'multiple';
  optionalRange: 'all' | 'customize';
}

const PAGE_SIZE = 10;

const UserDefault = (props: Props) => {
  const { optionalRange } = props;
  const isAllRange = optionalRange == 'all';

  if (isAllRange) return <AllUserComponent {...props} />;

  return <CustomizeComponent {...props} />;
};

const CustomizeComponent = (props: Props) => {
  const { value, onChange, rangeList, multiple } = props;

  const Options = (rangeList || []).map((itm) => ({
    label: itm.ownerName,
    value: itm.id,
  }));

  // @ts-ignore
  return <Select options={Options} mode={multiple} value={Array.isArray(value) ? value.map(({ value }) => value) : value.value} onChange={onChange} />;
};

const AllUserComponent = (props: Props) => {
  const { value, onChange, rangeList, multiple } = props;

  const [options, setOptions] = React.useState<Option[]>([]);
  const [hasNext, setHasNext] = React.useState<boolean>(false);
  const [keyword, setKeyword] = React.useState<string>();
  const [page, setCurrent] = React.useState(1);

  const _setKeyword = React.useCallback((str) => {
    setKeyword(str);

    setOptions((current) => {
      return current.filter((itm) => Array.isArray(value) ? value.some((_itm) => _itm.value == itm.value) : itm.value == value.value);
    });
    setCurrent(1);
  }, [setKeyword, setOptions, setCurrent, value]);

  const params = React.useMemo(() => {
    return {
      userName: keyword,
      page,
      limit: PAGE_SIZE,
    };
  }, [keyword, page]);

  const store = React.useContext(StoreContext);
  const { appID } = store;
  const { isLoading } = useQuery(['query_user_picker_df', params, appID], () => searchUser(appID, params), {
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
  return (
    <Select
      // @ts-ignore
      mode={multiple}
      showSearch
      loading={isLoading}
      onSearch={debounce(_setKeyword, 300)}
      onPopupScroll={(e) => {
        if (!hasNext) return;
        const dom = e.target;
        const { scrollTop, clientHeight, scrollHeight } = dom as any;
        if (scrollTop + clientHeight == scrollHeight) {
          if (!isLoading) {
            setCurrent((current) => 1 + current);
          }
        }
      }}
      options={options}
      value={Array.isArray(value) ? value.map(({ value }) => value) : value.value}
      // @ts-ignore
      filterOption={(input: string, option: any[]) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      onChange={(_, selects) => {
        return onChange(selects as Option);
      }}
    />
  );
};

export default UserDefault;
