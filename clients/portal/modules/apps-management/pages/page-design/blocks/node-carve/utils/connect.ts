import { useContext, createElement, FC } from 'react';
import { get } from 'lodash';

import { ConstantProperty, Node } from '@one-for-all/artery';
import { findNodeByID } from '@one-for-all/artery-utils';

import logger from '@lib/logger';
import { ConfigContext } from '../context';
import { isConstantProperty, updateNodeProperty } from './';

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
  Component: FC<T>,
  options?: OptionsType<T>,
): FC<ConnectedProps<T>> {
  const _options = Object.assign(
    {
      valueKey: 'value',
      eventKey: 'onChange',
    },
    options,
  );

  const ConnectedComponent: FC<ConnectedProps<T>> = function(props: ConnectedProps<T>) {
    try {
      const { artery, activeNode, onArteryChange } = useContext(ConfigContext) ?? {};
      const { valueKey, eventKey, defaultProps = {}, getValue } = _options;
      const componentProps = { ...defaultProps, ...props } as T;
      // todo: sync active node
      const realNode = findNodeByID(artery?.node as Node, activeNode?.id as string);
      const property = get(realNode, props.__path, { type: 'constant_property' });
      // @ts-ignore
      componentProps[valueKey] = property.value;
      componentProps[eventKey] = function(...args: any[]) {
        props[eventKey] && props[eventKey](...args);
        if (!activeNode || !artery || !isConstantProperty(property)) {
          return;
        }
        const val = getValue ? getValue(...args) : args[0];
        // TODO: add a nested_property
        const updatePayload: ConstantProperty = {
          type: 'constant_property',
          value: val,
        };
        onArteryChange?.(updateNodeProperty(activeNode, props.__path, updatePayload, artery));
      } as any;
      return createElement(Component, componentProps);
    } catch (e) {
      logger.error('error spec');
      return null;
    }
  };
  return ConnectedComponent;
}
