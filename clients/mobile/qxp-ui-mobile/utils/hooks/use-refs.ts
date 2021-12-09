import { useRef } from 'react';

type SetRefs = (index: number) => (el: HTMLDivElement) => void;

export default function useRefs(): [current: HTMLDivElement[], setRefs: SetRefs] {
  const refs = useRef<HTMLDivElement[]>([]);

  const setRefs: SetRefs = (index) => (el) => {
    refs.current[index] = el;
  };

  return [refs.current, setRefs];
}
