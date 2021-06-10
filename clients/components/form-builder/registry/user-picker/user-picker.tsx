import React from 'react';
import { useQuery } from 'react-query';
import { Select } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import debounce from 'lodash/debounce';
import { searchUser, Res } from './messy/api';

import { Option } from './messy/enum';

type OptionalRange = 'customize' | 'all'

const PAGE_SIZE = 10;

const UserPicker = (p: ISchemaFieldComponentProps): JSX.Element => {
  const optionalRange = p.props.optionalRange as OptionalRange;

  React.useEffect(() => {
    p.mutators.change(p.props.defaultValues);
  }, []);
  const value = Array.isArray(p.value || []) ? (p.value || []).map(({ value }: Option) => value) : p.value.value;

  const xComponentsProps = Object.assign({}, p.props['x-component-props'], {
    onChange: (_: any, selects: Option[]) => {
      p.mutators.change(selects);
    },
  });

  const props = Object.assign({}, p, {
    value,
    'x-component-props': xComponentsProps,
  });

  return (optionalRange == 'customize') ? <Select {...props} options={p.props.enum} {...p['x-component-props']} /> : <AllUserPicker {...props} />;
};

const AllUserPicker = (p: ISchemaFieldComponentProps): JSX.Element => {
  const [options, setOptions] = React.useState<Option[]>([]);
  const [hasNext, setHasNext] = React.useState<boolean>(false);
  const [keyword, setKeyword] = React.useState<string>();
  const [page, setCurrent] = React.useState(1);

  const _setKeyword = React.useCallback((str) => {
    setKeyword(str);
    setOptions([]);
    setCurrent(1);
    // setOptions(current => current.filter(({ value }) => Array.isArray(p.value) ? p.value.some(itm => itm == value) : value == p.value))
  }, [setKeyword, setOptions, setCurrent]);

  const appID: string = p.props.appID;

  const params = React.useMemo(() => {
    return {
      userName: keyword,
      page,
      limit: PAGE_SIZE,
    };
  }, [keyword, page]);

  const { isLoading } = useQuery(['query_user_picker', params, appID], () => searchUser(appID, params), {
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

  const calcParams = React.useMemo(() => {
    const xComponentsProps = Object.assign({}, p.props['x-component-props'], {
      loading: isLoading,
      onSearch: debounce(_setKeyword, 500),
      onPopupScroll(e: React.MouseEvent) {
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
    const props = Object.assign({}, p.props, {
      enum: options,
      'x-component-props': xComponentsProps,
    });

    return Object.assign({}, p, { props });
  }, [p, options, hasNext, isLoading]);

  return <Select {...calcParams} {...calcParams['x-component-props']} options={options} />;
};

UserPicker.isFieldComponent = true;

export default UserPicker;
