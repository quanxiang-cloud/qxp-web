import { ReactElement, MutableRefObject } from 'react';
import { createPortal } from 'react-dom';

import { isPromise } from '.';

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

export function isHidden(elementRef?: HTMLElement): boolean {
  const el = elementRef;
  if (!el) {
    return false;
  }

  const style = window.getComputedStyle(el);
  const hidden = style.display === 'none';

  // offsetParent returns null in the following situations:
  // 1. The element or its parent element has the display property set to none.
  // 2. The element has the position property set to fixed
  const parentHidden = el.offsetParent === null && style.position !== 'fixed';
  return hidden || parentHidden;
}
