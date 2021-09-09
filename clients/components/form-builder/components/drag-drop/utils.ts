/* eslint-disable indent */
type DraggingStyleParam = {
  isActive: boolean;
  isDragging: boolean;
  position: string;
  dropId: string;
}
export function draggingStyle({
  isActive = false,
  position = '',
  dropId = '',
}: DraggingStyleParam): typeof overwriteStyle {
  const overwriteStyle = {
    boxShadow: 'none',
  };
  let hoverStyle = {};
  if (isActive && dropId !== 'root') {
    switch (position) {
      case 'up': hoverStyle = { boxShadow: '0 -3px 0 var(--blue-600)' };
        break;
      case 'down': hoverStyle = { boxShadow: '0 3px 0 var(--red-600)' };
        break;
      case 'left': hoverStyle = { boxShadow: '-3px 0 0 var(--blue-600)' };
        break;
      case 'right': hoverStyle = { boxShadow: '3px 0 0 var(--red-600)' };
        break;
    }
  }

  return {
    ...overwriteStyle,
    ...hoverStyle,
  };
}
