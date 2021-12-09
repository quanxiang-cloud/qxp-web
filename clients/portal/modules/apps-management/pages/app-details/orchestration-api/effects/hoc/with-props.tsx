import React, { JSXElementConstructor, forwardRef, ForwardedRef, FC } from 'react';

export default function withProps<T extends Record<string, unknown>, P = any>(
  props: T, Component: JSXElementConstructor<P & T>,
): FC<P> {
  return forwardRef<unknown, P>((_props: P, ref: ForwardedRef<unknown>) => {
    return (
      <Component {..._props} {...props} ref={ref} />
    );
  }) as unknown as FC<P>;
}
