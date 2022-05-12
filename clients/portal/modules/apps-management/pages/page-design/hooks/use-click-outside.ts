import { useCallback, useEffect, RefObject } from 'react';
import { when, and } from 'ramda';
import { debounce } from 'lodash';

interface Props {
  when: (target: HTMLElement, currentTarget: HTMLElement) => boolean;
  container: RefObject<HTMLElement | null>;
  callback: () => void;
}

export function useClickOutSide({ when: whenFn, container, callback }: Props): void {
  const handleClickOutside = useCallback((ev: MouseEvent): void => {
    const { target } = ev;
    const currentTarget = ev.currentTarget as HTMLElement;
    const notClickInContainer = (el: HTMLElement | null): boolean => !el?.contains(target as Node);
    const extractCondition = (): boolean => whenFn(target as HTMLElement, currentTarget);
    when(
      (el: HTMLElement | null) => and(notClickInContainer(el), extractCondition()),
      callback,
    )(container?.current);
  }, [whenFn, callback, container]);

  useEffect(() => {
    const onClickOut = debounce(handleClickOutside, 100);
    document.addEventListener('click', onClickOut);
    return () => {
      document.removeEventListener('click', onClickOut);
    };
  }, [handleClickOutside]);
}
