import { useContext, JSXElementConstructor, createElement } from 'react';
import { get } from 'lodash';

import { ConfigContext } from '../context';
import { isConstantProperty, updateNodeProperty } from './';
import logger from '@lib/logger';

export type ConnectedProps<T extends Record<string, any>> = T & {
  __path: string;
};

interface OptionsType<T> {
  valueKey?: keyof T;
  eventKey?: keyof T;
  defaultProps?: Partial<T>;
  getValue?: (...args: any[]) => any;
}

export function connect<T extends Record<string, any> = Record<string, any>>(
  Component: JSXElementConstructor<T>,
  options?: OptionsType<T>,
): JSXElementConstructor<ConnectedProps<T>> {
  const _options = Object.assign(
    {
      valueKey: 'value',
      eventKey: 'onChange',
    },
    options,
  );

  const ConnectedComponent: JSXElementConstructor<ConnectedProps<T>> = function(props: ConnectedProps<T>) {
    try {
      const { artery, activeNode, onArteryChange } = useContext(ConfigContext) ?? {};
      const { valueKey, eventKey, getValue, defaultProps = {} } = _options;
      const componentProps = { ...defaultProps, ...props } as T;
      const property = get(activeNode, props.__path, { type: 'constant_property' });
      if (isConstantProperty(property)) {
        componentProps[valueKey] = property.value;
      }
      componentProps[eventKey] = function(...args: any[]) {
        props[eventKey] && props[eventKey](...args);
        if (!activeNode || !artery || !isConstantProperty(property)) {
          return;
        }

        const val = getValue ? getValue(...args) : args[0];
        const newArtery = updateNodeProperty(
          activeNode,
          props.__path,
          {
            type: 'constant_property',
            value: val,
          },
          artery,
        );
        onArteryChange?.(newArtery);
      } as any;
      return createElement(Component, componentProps);
    } catch (e) {
      logger.error('error spec');
      return null;
    }
  };
  return ConnectedComponent;
}
