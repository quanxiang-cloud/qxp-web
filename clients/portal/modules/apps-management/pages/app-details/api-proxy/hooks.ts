import { useLocation } from 'react-router-dom';

import store from './store';

export function useQueryString() {
  return new URLSearchParams(useLocation().search);
}

export function useNamespace() {
  const qs = useQueryString();
  return qs.get('ns') || store.currentNs?.id || '';
}
