import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TreeSelect as AntTreeSelect, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
// import useDeepCompareEffect from 'use-deep-compare-effect';
import { get, template } from 'lodash';
import { useFormBuilderContext } from '../../context';
import { string2Json } from '../../utils';

const { SHOW_PARENT } = AntTreeSelect;
const antIcon = <LoadingOutlined style={{ fontSize: 18 }} spin />;

const formatData = (data, labelKey, valueKey) => {
  const ret = [];
  const getLabel = labelKey.indexOf('$') >= 0 ? template(labelKey) : obj => obj[labelKey];
  const getValue = valueKey.indexOf('$') >= 0 ? template(valueKey) : obj => obj[valueKey];
  data.forEach(item => {
    const formated = { title: getLabel(item), value: getValue(item) };
    if (item.children) {
      formated.children = formatData(item.children, valueKey, labelKey);
    }

    ret.push(formated);
  });

  return ret;
};

const getValue = (value, multiple) => {
  if (!value) return null;
  if (!multiple) return value;
  if (multiple && value.indexOf(',') > -1) {
    return value.split(',');
  }
};

const TreeSelect = props => {
  const getAttrFromProps = () => {
    if (props.props) {
      const { name, value, mutators, props: componentProps } = props;
      const {
        optionType,
        remoteFunc,
        treeData: dataSource = [],
        multiple,
        placeholder,
        ...restProps
      } = componentProps['x-component-props'];
      return {
        name,
        value,
        optionType,
        remoteFunc,
        dataSource,
        mutators,
        multiple,
        placeholder,
        restProps,
      };
    }
    const {
      name,
      value,
      treeData: dataSource = [],
      optionType,
      remoteFunc,
      multiple,
      placeholder,
      ...restProps
    } = props;
    return { name, value, optionType, remoteFunc, dataSource, multiple, placeholder, restProps };
  };
  const {
    name,
    value,
    optionType,
    remoteFunc,
    dataSource = [],
    mutators,
    multiple,
    placeholder,
    restProps,
  } = getAttrFromProps();
  const [options, setOptions] = useState([]);
  const [defaultValue, setDefaultValue] = useState(getValue(value, multiple));
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { registry } = useFormBuilderContext();

  const setStaticOptions = () => {
    if (props.props && props.props.default) {
      setOptions(dataSource);
      setDefaultValue(getValue(props.props.default, multiple));
    } else {
      try {
        const treeJson = string2Json(dataSource);
        setOptions(treeJson);
      } catch (e) {
        // console.warn(e);
      }
      // setDefaultValue(initialValue);
    }
  };

  async function setRemoteOptions() {
    // if (loading) return;
    if (!remoteFunc) {
      setOptions([]);
      return;
    }
    const { func } = registry.getRemoteFunc(remoteFunc);
    setLoading(true);
    setHasError(false);
    try {
      if (remoteFunc === 'common') {
        const { url, labelKey, valueKey, dataPath, params, method } = restProps;
        if (!url || !labelKey || !valueKey) {
          setOptions([]);
          setLoading(false);
          return;
        }
        const remoteData = await func({
          url,
          params: string2Json(params),
          method,
          page: 1,
          formType: 'treeSelect',
          formName: name,
        });
        const data = dataPath ? get(remoteData, dataPath) : remoteData;
        const opts = formatData(data, labelKey, valueKey);
        setOptions(opts);
      } else {
        const opts = await func({ page: 1, formType: 'treeSelect', formName: name });
        setOptions(opts);
      }
    } catch (e) {
      // console.warn(e);
      setHasError(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (optionType === 'remote') {
      setRemoteOptions();
    } else {
      setStaticOptions();
    }
  }, [optionType, dataSource, remoteFunc, restProps.remoteSettingUpdater]);

  useEffect(() => {
    setDefaultValue(getValue(value, multiple));
  }, [value]);

  if (loading) {
    return <Spin indicator={antIcon} />;
  }

  if (hasError) {
    return (
      <div style={{ fontSize: '12px' }}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        系统错误，<a onClick={setRemoteOptions}>点击重新获取</a>
      </div>
    );
  }

  if (!options || options.length === 0) {
    return <div style={{ fontSize: '12px' }}>暂无选项</div>;
  }

  const otherProps = {};
  if (restProps.treeCheckable) {
    otherProps.treeCheckable = true;
    otherProps.showCheckedStrategy = SHOW_PARENT;
  }
  const onChange = v => {
    setDefaultValue(v);
    return mutators ? mutators.change : restProps.onChange;
  };

  return (
    <AntTreeSelect
      treeData={options}
      name={name}
      value={defaultValue}
      onChange={onChange}
      multiple={multiple}
      placeholder={placeholder}
      {...otherProps}
    />
  );
};

TreeSelect.isFieldComponent = true;

TreeSelect.propTypes = {
  type: PropTypes.string,
  enum: PropTypes.array,
};

export default TreeSelect;
