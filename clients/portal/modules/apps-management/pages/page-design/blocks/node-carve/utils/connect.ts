import { useContext, JSXElementConstructor, createElement } from 'react';
import { get } from 'lodash';

import { ConfigContext } from '../context';
import { isConstantProperty, updateNodeProperty } from './';
import logger from '@lib/logger';

export interface ConnectedProps<T> {
  path: string;
  initValue?: T;
  [key: string]: any
}

interface OptionsType {
  valueKey?: string;
  eventKey?: string;
  defaultProps?: any;
  getValue?: (...args: any[]) => any;
}

export function connect(
  Component: JSXElementConstructor<any>,
  options?: OptionsType,
): JSXElementConstructor<any> {
  const _options = Object.assign(
    {
      valueKey: 'value',
      eventKey: 'onChange',
    },
    options,
  );

  const ConnectedComponent: JSXElementConstructor<any> = function({
    initValue, // ？
    path,
    ...restProps
  }: ConnectedProps<any>) {
    try {
      const { artery, activeNode, onArteryChange } = useContext(ConfigContext) ?? {};
      const { valueKey, eventKey, getValue, defaultProps } = _options;
      const componentProps: Record<string, any> = { ...defaultProps, ...restProps };
      const _path = `props.${path}`;
      const property = get(activeNode, _path, { type: 'constant_property' });
      if (isConstantProperty(property)) {
        componentProps[valueKey] = property.value;
      }
      componentProps[eventKey] = function(...args: any[]) {
        restProps[eventKey] && restProps[eventKey](...args);
        if (!activeNode || !artery || !isConstantProperty(property)) {
          return;
        }

        const val = getValue ? getValue(...args) : args[0];
        const newArtery = updateNodeProperty(activeNode, _path, {
          type: 'constant_property',
          value: val,
        }, artery);
        onArteryChange?.(newArtery);
      };
      return createElement(Component, componentProps);
    } catch (e) {
      logger.error('error spec');
      return null;
    }
  };
  return ConnectedComponent;
}

