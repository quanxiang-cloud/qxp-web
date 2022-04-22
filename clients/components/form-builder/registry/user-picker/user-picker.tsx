import React, { useState, useCallback, useMemo, useEffect } from 'react';
import cs from 'classnames';
import { Select, SelectProps } from 'antd';
import { debounce, omit } from 'lodash';

import { getNoLabelValues } from '@c/form-builder/utils';
import { labelValueRenderer } from '@c/form-data-value-renderer';
import { buildGraphQLQuery } from '@portal/modules/access-control/departments-employees/utils';

import { searchUser, getUserDetail } from './messy/api';
import { Option } from './messy/enum';

import './index.scss';

type OptionalRange = 'customize' | 'all' | 'currentUser';
type DefaultRange = 'customize' | 'currentUser';

type Props = SelectProps<any> & {
  optionalRange?: OptionalRange;
  defaultRange?: DefaultRange;
  appID?: string;
  value?: LabelValue[];
  editable?: boolean;
  onChange?: (value: LabelValue[]) => void;
  defaultValues?: LabelValue[];
}

type AllUserPickerProps = SelectProps<any> & {
  appID: string;
}

const userGraphQL = '{users{id,email,name},total}';
const PAGE_SIZE = 10;
const { Option: SelectOption } = Select;

const UserPicker = ({
  optionalRange,
  defaultRange,
  appID,
  onChange,
  editable = true,
  defaultValues,
  value,
  ...componentsProps
}: Props): JSX.Element => {
  const currentUser = {
    label: window.USER.name,
    value: window.USER.id,
    email: window.USER.email,
  };

  useEffect(() => {
    const noLabelValues = getNoLabelValues(value);
    if (noLabelValues.length) {
      getUserDetail<{ user: { id: string, name: string }[] }>(noLabelValues).then((res) => {
        const newValue = (value as LabelValue[]).map(({ label, value }) => {
          if (value && !label) {
            const curUser = res.user.find(({ id }) => id === value);
            return { label: curUser?.name ? curUser.name : '', value };
          }
          return { label, value };
        });
        onChange?.(newValue);
      });
    }
  }, []);

  useEffect(() => {
    if (value && value.length) {
      return;
    }

    if (optionalRange === 'currentUser' || defaultRange === 'currentUser') {
      onChange?.([omit(currentUser, 'email')]);
    } else if (defaultValues) {
      onChange?.(defaultValues);
    }
  }, [optionalRange, componentsProps.mode, defaultRange]);

  const handleChange = (_selected: LabelValue | LabelValue[]): void => {
    let selectedValues: LabelValue[] = _selected ? ([] as LabelValue[]).concat(_selected) : [];
    selectedValues = selectedValues.map(({ label, value: selectedValue }) => {
      const oldValue = value?.find((val: LabelValue) => val.value === selectedValue);
      if (oldValue) {
        return oldValue;
      }
      const labelValue = Array.isArray(label) ? label[0] : label;
      return { label: labelValue, value: selectedValue };
    });
    onChange && onChange(selectedValues);
  };

  if (optionalRange === 'currentUser') {
    componentsProps.options = [currentUser];
  }

  if (!editable) {
    return (
      <span>
        {
          value && value.length ?
            labelValueRenderer(value) : '—'
        }
      </span>
    );
  }

  if (optionalRange === 'all') {
    return (
      <AllUserPicker
        {...componentsProps}
        value={value}
        labelInValue
        disabled={!editable}
        onChange={handleChange}
        appID={appID as string}
      />
    );
  }

  const { options } = componentsProps;

  return (
    <Select
      {...componentsProps}
      labelInValue
      allowClear
      value={value}
      options={undefined}
      disabled={!editable}
      onChange={handleChange}
      filterOption={(input, option) => {
        return !!option?.children && option.children.join('').toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }}
      className={cs('user-selector', componentsProps.className || '')}
    >
      {
        options?.map((opt) => (
          <SelectOption key={opt.value} value={opt.value}>
            {opt.label}({opt.email})
          </SelectOption>
        ))
      }
    </Select>
  );
};

const AllUserPicker = ({ appID, value, ...otherProps }: AllUserPickerProps): JSX.Element | null => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>();
  const [isAppend, setIsAppend] = useState(false);
  const [page, setCurrent] = useState(1);

  const params = useMemo(() => ({
    name: keyword || '',
    page,
    size: PAGE_SIZE,
  }), [keyword, page]);

  useEffect(() => {
    setLoading(true);
    const queryGraphQL = buildGraphQLQuery(params);
    searchUser<{
      users: Employee[];
      total: number
    }>({ query: `{${queryGraphQL}${userGraphQL}}` }).then((res) => {
      if (res) {
        const newOptions = (res.users || []).map((itm) => ({
          label: itm.name,
          value: itm.id,
          email: itm.email,
        }));
        let totalOptions = [...newOptions];
        if (isAppend) {
          totalOptions = [...options, ...newOptions];
        }
        setOptions(totalOptions);
        setHasNext(res.total > page * PAGE_SIZE);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, [params]);

  const _setKeyword = useCallback((str) => {
    setKeyword(str);
    setIsAppend(false);
    setCurrent(1);
  }, [setKeyword, setIsAppend, setCurrent]);

  const componentsProps = {
    ...otherProps,
    value: value || undefined,
    loading,
    onSearch: debounce(_setKeyword, 500),
    onClear: () => _setKeyword(''),
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
      options={undefined}
      allowClear
      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
      className={cs('user-selector', componentsProps.className)}
    >
      {
        options.map((opt: Option) => (
          <SelectOption key={opt.value} value={opt.value}>
            {opt.label}({opt.email})
          </SelectOption>
        ))
      }
    </Select>
  );
};

export default UserPicker;
