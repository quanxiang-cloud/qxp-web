import { TokenTypes, BoxShadowTypes } from '../constants/constants-types';
import { TokenTypeSchema } from '../types/token';

const tokenTypes: Record<TokenTypes, TokenTypeSchema> = {
  color: {
    label: 'Color',
    property: 'Color',
    type: TokenTypes.COLOR,
    schema: {
      options: {
        description: '',
      },
    },
  },
  spacing: {
    label: 'Space',
    property: 'Value',
    type: TokenTypes.SPACING,
    schema: {
      options: {
        description: '',
      },
      unit: 'px',
    },
  },
  borderRadius: {
    label: 'Border Radius',
    property: 'Border Radius',
    type: TokenTypes.BORDER_RADIUS,
    schema: {
      options: {
        description: '',
      },
      unit: 'px',
    },

  },
  borderWidth: {
    label: 'Border Width',
    property: 'Border Width',
    type: TokenTypes.BORDER_WIDTH,
    explainer: '输入一个数字，比如 4',
    schema: {
      options: {
        description: '',
      },
      unit: 'px',
    },
  },
  opacity: {
    label: 'Opacity',
    property: 'Opacity',
    type: TokenTypes.OPACITY,
    explainer: '输入 50% 或 0.5',
    schema: {
      options: {
        description: '',
      },
      unit: 'px',
    },
  },
  boxShadow: {
    label: 'Box Shadow',
    property: 'Box Shadow',
    type: TokenTypes.BOX_SHADOW,
    schema: {
      value: {
        x: '0',
        y: '0',
        blur: '0',
        spread: '0',
        color: '#000000',
        type: BoxShadowTypes.OUTSET,
      },
      options: {
        description: '',
      },
      unit: {
        x: 'px',
        y: 'px',
        blur: 'px',
        spread: 'px',
      },
    },
  },
  typography: {
    label: 'Typography',
    property: 'Typography',
    type: TokenTypes.TYPOGRAPHY,
    schema: {
      value: {
        fontFamily: 'sans-serif',
        fontWeight: '500',
        lineHeight: '100',
        fontSize: '16',
        textDecoration: 'none',
      },
      options: {
        description: '',
      },
      unit: {
        fontSize: 'px',
        lineHeight: '%',
      },
    },
  },
  fontFamily: {
    label: 'Font Family',
    property: 'Font Family',
    type: TokenTypes.FONT_FAMILY,
    schema: {
      options: {
        description: '',
      },
    },
  },
  fontWeight: {
    label: 'Font Weight',
    property: 'Font Weight',
    type: TokenTypes.FONT_WEIGHT,
    schema: {
      options: {
        description: '',
      },
    },
  },
  lineHeight: {
    label: 'Line Height',
    explainer: '比如 100% 或者 1',
    property: 'Line Height',
    type: TokenTypes.LINE_HEIGHT,
    schema: {
      options: {
        description: '',
      },
      unit: 'px',
    },
  },
  fontSize: {
    label: 'Font Size',
    property: 'Font Size',
    type: TokenTypes.FONT_SIZE,
    schema: {
      options: {
        description: '',
      },
      unit: 'px',
    },
  },
  textDecoration: {
    label: 'Text Decoration',
    property: 'TextDecoration',
    type: TokenTypes.TEXT_DECORATION,
    schema: {
      options: {
        description: '',
      },
    },
    explainer: '可以输入的值有 none | underline | line-through',
  },
  other: {
    label: 'Other',
    property: 'other',
    type: TokenTypes.OTHER,
    schema: {
      options: {
        description: '',
      },
    },
  },
};
export default tokenTypes;
