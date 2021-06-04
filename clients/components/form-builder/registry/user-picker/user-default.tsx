import React from 'react';
import { useQuery } from 'react-query';
import { Select } from 'antd';
import debounce from 'lodash/debounce';
import { searchUser, Res } from './messy/api';

import { Option } from './messy/enum';
import { StoreContext } from '../../context';

const i = 0;

interface Props {
    value: string | string[];
    onChange: (value: string) => void;
    rangeList: EmployeeOrDepartmentOfRole[];
    multiple: 'signle' | 'multiple';
    optionalRange: 'all' | 'customize';
}

const PAGE_SIZE = 10;

const UserDefault = (props: Props) => {
  const { optionalRange, multiple } = props;
  const isAllRange = optionalRange == 'all';
  const isMultiple = multiple == 'multiple';

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
  return <Select options={Options} mode={multiple} value={value} onChange={onChange} />;
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
      console.log(current.filter((itm) => Array.isArray(value) ? value.includes(itm.value) : itm.value == value));
      return current.filter((itm) => Array.isArray(value) ? value.includes(itm.value) : itm.value == value);
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

  const store = React.useContext(StoreContext)
  const { appID } = store
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
  return (< Select
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
    value={value}
    // @ts-ignore
    filterOption={(input: string, option: any[]) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    // @ts-ignore
    onChange={(selects) => onChange(selects)}
  />);
};

export default UserDefault;
