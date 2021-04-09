import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox as AntCheckbox, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { get, template } from 'lodash';
import { useFormBuilderContext } from '../../context';
import { string2Json } from '../../utils';

const CheckboxGroup = AntCheckbox.Group;
const antIcon = <LoadingOutlined style={{ fontSize: 18 }} spin />;

const Checkbox = props => {
  const getAttrFromProps = () => {
    if (props.props) {
      const { name, value, mutators, props: componentProps } = props;
      const { optionType, remoteFunc, options: dataSource = [], ...restProps } = componentProps[
        'x-component-props'
      ];
      return { name, value, optionType, remoteFunc, dataSource, mutators, restProps };
    }
    const { name, value, options: dataSource = [], optionType, remoteFunc, ...restProps } = props;
    return { name, value, optionType, remoteFunc, dataSource, restProps };
  };
  const {
    name,
    value,
    optionType,
    remoteFunc,
    dataSource,
    mutators,
    restProps,
  } = getAttrFromProps();
  const [options, setOptions] = useState([]);
  const [defaultValue, setDefaultValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { registry } = useFormBuilderContext();

  const setStaticOptions = () => {
    if (props.props && props.props.default) {
      setOptions(dataSource);
      setDefaultValue(props.props.default);
    }
    const initialValues = [];
    const opts = [];
    dataSource.forEach(item => {
      if (item.checked) {
        initialValues.push(item.value);
      }
      opts.push({ label: item.label, value: item.value });
    });
    setOptions(opts);
    setDefaultValue(initialValues);
  };

  async function setRemoteOptions() {
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
          formType: 'checkbox',
          formName: name,
        });
        const data = dataPath ? get(remoteData, dataPath) : remoteData;
        const getLabel = labelKey.indexOf('$') >= 0 ? template(labelKey) : obj => obj[labelKey];
        const getValue = valueKey.indexOf('$') >= 0 ? template(valueKey) : obj => obj[valueKey];
        const opts = data
          ? data.map(item => {
              return { label: getLabel(item), value: getValue(item) };
            })
          : [];
        setOptions(opts);
      } else {
        const opts = await func({ page: 1, formType: 'checkbox', formName: name });
        setOptions(opts);
      }
    } catch (e) {
      // console.warn(e);
      setHasError(true);
    }
    setLoading(false);
  }

  useDeepCompareEffect(() => {
    if (optionType === 'remote') {
      setRemoteOptions();
    } else {
      setStaticOptions();
    }
  }, [optionType, dataSource, remoteFunc, restProps.remoteSettingUpdater]);

  const onChange = mutators ? mutators.change : restProps.onChange;

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

  return (
    <CheckboxGroup
      options={options}
      name={name}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  );
};

Checkbox.isFieldComponent = true;

Checkbox.propTypes = {
  type: PropTypes.string,
  enum: PropTypes.array,
};

export default Checkbox;
