import { createPortal } from 'react-dom';
import { ReactElement, MutableRefObject } from 'react';
import { isPromise } from '@m/qxp-ui-mobile/utils/index';
export type GetContainer = HTMLElement | (() => HTMLElement) | null;

export function resolveContainer(
  getContainer: HTMLElement | (() => HTMLElement) | undefined,
): HTMLElement {
  const container = typeof getContainer === 'function' ? getContainer() : getContainer;
  return container || document.body;
}

export function renderToContainer(getContainer: GetContainer, node: ReactElement): ReactElement {
  if (getContainer) {
    const container = resolveContainer(getContainer);
    return createPortal(node, container);
  }
  return node;
}

export type Interceptor = (...args: any[]) => Promise<boolean> | boolean;

export function callInterceptor(options: {
  interceptor?: Interceptor;
  args: any[];
  done: () => void;
  canceled?: () => void;
}): void {
  const { interceptor, args, done, canceled } = options;

  if (interceptor) {
    const returnVal = interceptor?.(args || []);

    if (isPromise(returnVal)) {
      returnVal
        .then((value) => {
          if (value) {
            done();
          } else if (canceled) {
            canceled();
          }
        })
        .catch(() => void 0);
    } else if (returnVal) {
      done();
    } else if (canceled) {
      canceled();
    }
  } else {
    done();
  }
}

export type BasicTarget<T = HTMLElement> =
  | (() => T | null)
  | T
  | null
  | MutableRefObject<T | null | undefined>;

export type TargetElement = HTMLElement | Element | Document | Window;

export function getTargetElement(
  target?: BasicTarget<TargetElement>,
  defaultElement?: TargetElement,
): TargetElement | undefined | null {
  if (!target) {
    return defaultElement;
  }

  let targetElement: TargetElement | undefined | null;

  if (typeof target === 'function') {
    targetElement = target();
  } else if ('current' in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
}
