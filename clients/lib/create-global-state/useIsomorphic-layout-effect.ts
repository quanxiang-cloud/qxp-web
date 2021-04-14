import { useEffect, useLayoutEffect } from 'react';
import { isBrowser } from './util';

const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
