import React, { useState, useCallback, useMemo, useEffect } from 'react';
import cs from 'classnames';
import { Select, SelectProps } from 'antd';
import { debounce } from 'lodash';

import { searchUser } from './messy/api';
import { Option } from './messy/enum';

import './index.scss';

type OptionalRange = 'customize' | 'all' | 'currentUser';
type DefaultRange = 'customize' | 'currentUser';

type Props = SelectProps<any> & {
  optionalRange?: OptionalRange;
  defaultRange?: DefaultRange;
  appID?: string;
  editable?: boolean;
  onChange?: (value: LabelValue[]) => void;
  defaultValues?: LabelValue[];
}

type AllUserPickerProps = SelectProps<any> & {
  appID: string;
}

const PAGE_SIZE = 10;

const UserPicker = ({
  optionalRange,
  defaultRange,
  appID,
  onChange,
  editable = true,
  defaultValues,
  ...componentsProps
}: Props): JSX.Element => {
  const currentUser = [{
    label: window.USER.userName,
    value: window.USER.id,
  }];

  useEffect(() => {
    if (componentsProps.value && componentsProps.value.length) {
      return;
    }

    if (optionalRange === 'currentUser' || defaultRange === 'currentUser') {
      onChange?.(currentUser);
    } else {
      onChange?.(defaultValues || []);
    }
  }, [optionalRange, componentsProps.mode, defaultRange]);

  const handleChange = (_selected: LabelValue | LabelValue[]): void => {
    onChange && onChange(_selected ? ([] as LabelValue[]).concat(_selected) : []);
  };

  if (optionalRange === 'currentUser') {
    componentsProps.options = currentUser;
  }

  if (optionalRange === 'all') {
    return (
      <AllUserPicker
        {...componentsProps}
        labelInValue
        disabled={!editable}
        onChange={handleChange}
        appID={appID as string}
      />
    );
  }

  return (
    <Select
      {...componentsProps}
      labelInValue
      allowClear
      disabled={!editable}
      onChange={handleChange}
      className={cs('user-selector', componentsProps.className || '')}
    />
  );
};

const AllUserPicker = ({ appID, ...otherProps }: AllUserPickerProps): JSX.Element | null => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>();
  const [isAppend, setIsAppend] = useState(false);
  const [page, setCurrent] = useState(1);

  const params = useMemo(() => ({
    userName: keyword,
    page,
    limit: PAGE_SIZE,
  }), [keyword, page]);

  useEffect(() => {
    setLoading(true);
    searchUser(appID, params).then((res) => {
      if (res) {
        const newOptions = (res.data || []).map((itm) => ({
          label: itm.userName,
          value: itm.id,
        }));
        let totalOptions = [...newOptions];
        if (isAppend) {
          totalOptions = [...options, ...newOptions];
        }
        setOptions(totalOptions);
        setHasNext(res.total_count > page * PAGE_SIZE);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, [params, appID]);

  const _setKeyword = useCallback((str) => {
    setKeyword(str);
    setIsAppend(false);
    setCurrent(1);
  }, [setKeyword, setIsAppend, setCurrent]);

  const componentsProps = {
    ...otherProps,
    loading,
    onSearch: debounce(_setKeyword, 500),
    showSearch: true,
    notFoundContent: '暂无人员',
    filterOption: false,
    onPopupScroll: (e: React.UIEvent<HTMLDivElement, globalThis.UIEvent>): void => {
      if (!hasNext) return;
      const dom = e.target;
      const { scrollTop, clientHeight, scrollHeight } = dom as Element;
      if ((scrollTop + clientHeight === scrollHeight) && !loading) {
        setIsAppend(true);
        setCurrent((current) => 1 + current);
      }
    },
  };

  return (
    <Select
      {...componentsProps}
      allowClear
      options={options}
      className={cs('user-selector', componentsProps.className)}
    />
  );
};

export default UserPicker;
