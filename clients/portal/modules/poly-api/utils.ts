import type { MutableRefObject, Ref } from 'react';
import { Edge } from 'react-flow-renderer';
import { ifElse } from 'ramda';
import { fromEvent } from 'rxjs/Observable/fromEvent';
import { of } from 'rxjs/Observable/of';
import { map, mergeAll } from 'rxjs/operators';
import type { Subscription } from 'rxjs';

import { POLY_DESIGN_CONFIG } from './constants';

export function buildEdge(source: string, target: string, label?: string): Edge {
  function getEdge(): Edge {
    return {
      id: `e${source}-${target}`, source, target,
      type: POLY_DESIGN_CONFIG.EDGE_TYPE,
      style: { stroke: POLY_DESIGN_CONFIG.EDGE_COLOR },
      arrowHeadType: POLY_DESIGN_CONFIG.ARROW_HEAD_TYPE,
    };
  }
  function getConditionEdge(label: string): Edge {
    return {
      ...getEdge(),
      label,
      labelShowBg: true,
      labelBgStyle: { fill: POLY_DESIGN_CONFIG.BACKGROUND_COLOR },
    };
  }
  const predicate = ifElse(Boolean, getConditionEdge, getEdge);
  return predicate(label);
}

interface SubScribeEventParams {
  els: (HTMLElement | null)[];
  types: string[];
  handler: (e: Event) => void;
}

export function subscribeEvents({ els, types, handler }: SubScribeEventParams): Subscription[] {
  return els.filter(Boolean).map((el: HTMLElement | null) => {
    return of(...types).pipe(
      map((type) => fromEvent(el as HTMLElement, type)),
      mergeAll(),
    ).subscribe(handler);
  });
}

export function unSubscribeSubscriptions(...subs: Subscription[]): void {
  subs.forEach((sub) => sub.unsubscribe());
}

export function isSomeActionShow(el: HTMLElement | null): boolean {
  if (!el) {
    return false;
  }
  const actions = Array.from(el.querySelectorAll('.node-actions'));
  return actions.some((action) => (action as HTMLElement).style.opacity === '1');
}

export function mergeRefs<T>(...refs: Array<MutableRefObject<T> | Ref<T>>): React.Ref<T> {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as MutableRefObject<T>).current = node;
      }
    });
  };
}
