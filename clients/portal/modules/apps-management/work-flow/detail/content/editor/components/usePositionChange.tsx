import { useEffect } from 'react';

import { updateElement } from '@flow/detail/content/editor/store';

interface Props {
  xPos: number;
  yPos: number;
  id: string;
}

export default function usePositionChange({ xPos, yPos, id }: Props) {
  useEffect(() => {
    updateElement(id, 'position', () => ({
      x: xPos,
      y: yPos,
    }));
  }, [xPos, yPos]);
}
