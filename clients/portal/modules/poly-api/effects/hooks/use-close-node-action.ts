import { useEffect, useRef, useCallback } from 'react';

export default function useCloseNodeAction(): void {
  const tids = useRef<NodeJS.Timeout[]>([]);

  const dissNodeAction = useCallback(() => {
    const triggers = Array.from(document.querySelectorAll('.node-action-trigger')) as HTMLDivElement[];
    triggers.forEach((trigger) => {
      trigger.classList.remove('active');
      const action = trigger.querySelector('.node-actions') as HTMLDivElement;
      action.style.opacity = '0';
      action.style.pointerEvents = 'none';
      const tid = setTimeout(() => {
        trigger.style.opacity = '0';
      }, 240);
      tids.current.push(tid);
    });
  }, []);

  useEffect(() => {
    const el = document.querySelector('.react-flow__pane');
    el?.addEventListener('click', dissNodeAction);
    return () => {
      el?.removeEventListener('click', dissNodeAction);
      tids.current.forEach((id) => clearTimeout(id));
    };
  });
}
