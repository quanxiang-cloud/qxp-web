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
    // boxShadow: 'none',
  };
  let hoverStyle = {};
  if (isActive) {
    hoverStyle = {
      outline: '1px var(--blue-600) dashed',
    };
  }
  if (isActive && dropId !== 'root') {
    switch (position) {
      case 'up':
        hoverStyle = {
          // boxShadow: '0 -3px 0 var(--blue-600)',
          outline: '1px var(--blue-600) dashed',
        };
        break;
      case 'down':
        hoverStyle = {
          // boxShadow: '0 3px 0 var(--blue-600)',
          outline: '1px var(--blue-600) dashed',
        };
        break;
      case 'left':
        hoverStyle = {
          // boxShadow: '-3px 0 0 var(--blue-600)',
          outline: '1px var(--blue-600) dashed',
        };
        break;
      case 'right':
        hoverStyle = {
          // boxShadow: '3px 0 0 var(--blue-600)',
          outline: '1px var(--blue-600) dashed',
        };
        break;
    }
  }

  return {
    ...overwriteStyle,
    ...hoverStyle,
  };
}
