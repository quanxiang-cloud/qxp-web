import React from 'react';
import { useQuery } from 'react-query';
import { Select } from '@formily/antd-components';
import { FormEffectHooks } from '@formily/antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import debounce from 'lodash/debounce';
import { searchUser, Res } from './messy/api';

import { Option } from './messy/enum';

interface Props {
    predefinedDataset?: string;
    valueSource: 'customized' | 'predefined-dataset';
}

const PAGE_SIZE = 10;

const { } = FormEffectHooks;

const UserPicker = (p: ISchemaFieldComponentProps): JSX.Element => {
  const { props } = p;
  const { optionalRange } = props;

  React.useEffect(() => {
    p.mutators.change(p.props.defaultValues);
  }, []);

  return (optionalRange == 'customize') ? <Select {...p} /> : <AllUserPicker {...p} />;
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

  const params = React.useMemo(() => {
    return {
      userName: keyword,
      page,
      limit: PAGE_SIZE,
    };
  }, [keyword, page]);

  const { isLoading } = useQuery(['query_user_picker', params], () => searchUser(params), {
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

  return <Select {...calcParams} />;
};

UserPicker.isFieldComponent = true;

export default UserPicker;
