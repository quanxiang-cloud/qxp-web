import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select as AntSelect } from 'antd';
import useDeepCompareEffect from 'use-deep-compare-effect';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import { useFormBuilderContext } from '../../context';

const Select = props => {
  const getAttrFromProps = () => {
    if (props.props) {
      const { name, value, mutators, props: componentProps } = props;
      const {
        optionType,
        placeholder,
        mode,
        remoteFunc,
        options: dataSource = [],
        ...restProps
      } = componentProps['x-component-props'];
      return {
        name,
        value,
        placeholder,
        mode,
        optionType,
        remoteFunc,
        dataSource,
        mutators,
        restProps,
      };
    }
    const {
      name,
      value,
      placeholder,
      mode,
      options: dataSource = [],
      optionType,
      remoteFunc,
      ...restProps
    } = props;
    return { name, value, mode, placeholder, optionType, remoteFunc, dataSource, restProps };
  };
  const {
    name,
    value,
    placeholder,
    mode,
    optionType,
    remoteFunc,
    dataSource,
    mutators,
    restProps,
  } = getAttrFromProps();
  const [options, setOptions] = useState([]);
  const [defaultValue, setDefaultValue] = useState(value);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const { registry } = useFormBuilderContext();

  const setStaticOptions = () => {
    if (props.props && props.props.default) {
      setOptions(dataSource);
      setDefaultValue(props.props.default);
    } else {
      let initialValue = mode === 'multiple' ? [] : null;
      const opts = [];
      dataSource.forEach(item => {
        if (item.checked) {
          if (mode === 'multiple') {
            initialValue.push(item.value);
          } else {
            initialValue = item.value;
          }
        }
        opts.push({ label: item.label, value: item.value });
      });
      setOptions(opts);
      setDefaultValue(initialValue);
    }
  };

  async function setRemoteOptions(crtPage, crtKeyword) {
    if (loading) return;
    if (!remoteFunc) {
      setOptions([]);
      return;
    }
    const { func } = registry.getRemoteFunc(remoteFunc);
    setLoading(true);
    const realPage = crtPage || page;
    const realKeyword = crtKeyword || keyword;
    try {
      if (remoteFunc === 'common') {
        const { url, labelKey, valueKey } = restProps;
        if (!url || !labelKey || !valueKey) {
          setOptions([]);
          return;
        }
        const data = await func({
          url,
          page: realPage,
          keyword: realKeyword,
          formType: 'select',
          formName: name,
        });
        setPage(realPage + 1);
        const opts = data
          ? data.map(item => {
              return { label: item[labelKey], value: item[valueKey] };
            })
          : [];
        setOptions(uniqBy(options.concat(opts), 'value'));
      } else {
        const opts = await func({
          page: realPage,
          keyword: realKeyword,
          formType: 'select',
          formName: name,
        });
        setPage(realPage + 1);
        setOptions(uniqBy(options.concat(opts), 'value'));
      }
    } catch (e) {
      // console.warn(e);
    }
    setLoading(false);
  }

  const debouncedSetRemoteOpts = debounce(setRemoteOptions, 1000);

  const handlePopupScroll = e => {
    if (optionType !== 'remote') return;
    e.persist();
    const { target } = e;
    if (target.scrollTop + target.offsetHeight > target.scrollHeight - 5) {
      debouncedSetRemoteOpts();
    }
  };

  const handleSearch = debounce(v => {
    setPage(1);
    setKeyword(v);
    if (!v) return;
    setRemoteOptions(1, v);
  }, 1000);

  useDeepCompareEffect(() => {
    if (optionType === 'remote') {
      setRemoteOptions();
    } else {
      setStaticOptions();
    }
  }, [optionType, dataSource, remoteFunc]);

  const onChange = mutators ? mutators.change : restProps.onChange;

  return (
    <AntSelect
      options={options}
      name={name}
      value={value}
      mode={mode}
      defaultValue={defaultValue}
      onChange={onChange}
      placeholder={placeholder}
      allowClear
      showSearch
      optionFilterProp="label"
      onPopupScroll={handlePopupScroll}
      loading={loading}
      onSearch={handleSearch}
    />
  );
};

Select.isFieldComponent = true;

Select.propTypes = {
  type: PropTypes.string,
  enum: PropTypes.array,
};

export default Select;
