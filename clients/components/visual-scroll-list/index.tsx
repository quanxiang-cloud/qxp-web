import { add } from 'ramda';
import cs from 'classnames';
import React, {
  useReducer,
  RefObject,
  forwardRef,
  DispatchWithoutAction,
  ForwardedRef,
  useImperativeHandle,
  useRef,
  CSSProperties,
  useEffect,
} from 'react';

export * from './utils';
export * from './hooks';

interface Props<T> {
  containerRef: RefObject<HTMLElement | null>;
  listItemHeight: number;
  viewportHeight: number;
  list: T[];
  className?: string;
  tupleNumber?: number;
  style?: CSSProperties;
  gap?: number;
  itemKey?: (item: T) => string;
  render: (props: ItemRenderProps<T>) => JSX.Element;
}

export interface RefProps extends Partial<HTMLUListElement> {
  forceUpdate: DispatchWithoutAction;
}

export interface ItemRenderProps<T> {
  item: T;
  originIndex: number;
  index: number;
  className: string;
  style: CSSProperties;
}

export function VisualScrollList<T>(props: Props<T>, ref: ForwardedRef<RefProps>): JSX.Element {
  const listRef = useRef<HTMLDivElement>(null);
  const {
    containerRef, listItemHeight, list, viewportHeight, className,
    tupleNumber = 1, style, gap = 0, render: Render, itemKey,
  } = props;
  const forceUpdate = useReducer(add(1), 0)[1];
  useImperativeHandle(ref, () => ({ forceUpdate, domRef: listRef }), []);

  let startIndex = 0;
  let endIndex = 0;
  const container = containerRef.current;
  if (container) {
    const scrollTop = container.scrollTop;
    startIndex = Math.floor(scrollTop / listItemHeight);
    endIndex = startIndex + Math.ceil(viewportHeight / listItemHeight);
    startIndex -= 2;
    endIndex += 2;
    startIndex = startIndex < 0 ? 0 : startIndex;
    endIndex = endIndex > list.length ? list.length : endIndex;
  }

  useEffect(() => {
    if (container) {
      container.style.height = `${viewportHeight}px`;
    }
  }, [container, viewportHeight]);

  const visibleList: Array<{ index: number, origin: T }> = list
    .map((item, index) => ({ origin: item, index }))
    .slice(startIndex * tupleNumber, endIndex * tupleNumber);
  const height = Math.ceil((list.length / tupleNumber) * listItemHeight) + listItemHeight;

  return (
    <div
      ref={listRef}
      className={cs('relative w-full', className)}
      style={{ height, ...style }}
    >
      {visibleList.map((item, index) => {
        const lineNumber = Math.floor(index / tupleNumber);
        const className = 'absolute w-full left-0';
        const top = (Math.floor(item.index / tupleNumber) * listItemHeight) + (gap * lineNumber);
        const style: CSSProperties = { height: listItemHeight, top };
        const key = itemKey?.(item.origin) ?? index;

        return (
          <Render
            key={key}
            item={item.origin}
            originIndex={item.index}
            index={index}
            className={className}
            style={style}
          />
        );
      })}
    </div>
  );
}

export default forwardRef(VisualScrollList);
