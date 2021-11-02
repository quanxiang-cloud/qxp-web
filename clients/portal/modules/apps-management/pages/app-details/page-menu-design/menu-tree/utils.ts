import { omit } from 'lodash';
import { MenuType } from '@portal/modules/apps-management/pages/app-details/type';
import { Menu } from './type';

export function css(
  el: HTMLElement,
  cssProps: Record<string, string>): void {
  const style: CSSStyleDeclaration = el && el.style;

  Object.entries(cssProps).forEach(([prop, val]: [string, string]) => {
    if (prop in style) {
      // @ts-ignore
      style[prop] = val + (typeof val === 'string' ? '' : 'px');
    }
  });
}

export function animate(prevRect: any, target: any, ms?: number, animation?: boolean): void {
  let cachePrevRect = prevRect;
  if (ms) {
    const currentRect = target.getBoundingClientRect();

    if (cachePrevRect.nodeType === Node.ELEMENT_NODE) {
      cachePrevRect = cachePrevRect.getBoundingClientRect();
    }
    if (animation) {
      css(target, {
        transition: 'none',
        transform: `translate3d(${cachePrevRect.left - currentRect.left}px,${cachePrevRect.top - currentRect.top}px,0)`,
      });
      target.offsetWidth; // for rerender
      css(target, {
        transition: `all ${ms}ms`,
        transform: 'translate3d(0,0,0)',
      });
    }

    clearTimeout(target.animated);
    target.animated = setTimeout(() => {
      css(target, {
        transition: '',
        transform: '',
      });

      target.animated = false;
    }, ms);
  }
}

export function getAttribute(node: HTMLElement | null, prop: string): any {
  if (!node || !prop) return '';
  return node.getAttribute(prop);
}

export function getLastChild(node: HTMLElement): ChildNode | null {
  return node?.lastChild;
}

export function getNode(nodeId: string): HTMLElement | null {
  return document?.querySelector(`[data-id='${nodeId}']`) || null;
}

export function getLITarget(node: HTMLElement): HTMLElement | null {
  if (!node) return null;
  if (node?.tagName === 'LI') return node;

  return getLITarget(<HTMLElement>node?.parentNode);
}

export function getEleIndex(el: Element | null): number {
  let cacheEl = el;
  let index = 0;
  if (!cacheEl || !cacheEl.parentNode) {
    return -1;
  }
  while (cacheEl && (cacheEl = cacheEl.previousElementSibling)) {
    index += 1;
  }
  return index;
}

export function flatMnues(lists: Menu[], arr: Menu[] = []): Record<string, Menu> {
  const res: Menu[] = arr;
  lists.forEach((item: Menu) => {
    if (item.child?.length) {
      flatMnues(item.child, res);
    }
    res.push(omit(item, ['child']) as Menu);
  });

  return res.reduce((acc: Record<string, Menu>, item: Menu) => {
    acc[item.id] = item;
    return acc;
  }, {});
}

export function getFirstMenu(menus: Menu[] = []): Menu {
  if (!menus.length) return { id: '' };
  if (menus[0]?.menuType !== MenuType.group) {
    return menus?.[0] || { id: '' };
  }
  if (menus[0]?.menuType === MenuType.group && !menus[0].child?.length) {
    return getFirstMenu(menus.slice(1));
  }
  return menus[0]?.child?.[0] || { id: '' };
}
