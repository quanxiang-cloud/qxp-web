export enum TokenTypes {
  OTHER = 'other',
  COLOR = 'color',
  BORDER_RADIUS = 'borderRadius',
  SPACING = 'spacing',
  TYPOGRAPHY = 'typography',
  OPACITY = 'opacity',
  BORDER_WIDTH = 'borderWidth',
  BOX_SHADOW = 'boxShadow',
  FONT_FAMILY = 'fontFamily',
  FONT_WEIGHT = 'fontWeight',
  LINE_HEIGHT = 'lineHeight',
  FONT_SIZE = 'fontSize',
  TEXT_DECORATION = 'textDecoration',
}

export enum BoxShadowTypes {
  OUTSET = 'outset',
  INSET = 'inset',
}

export const TYPE_MAPS: Record<string, Record<string, string>> = {
  [TokenTypes.SPACING]: {
    'm-{name}': 'margin: {value}{unit};',
    'my-{name}': 'margin: {value}{unit} 0;',
    'mx-{name}': 'margin: 0 {value}{unit};',
    'ml-{name}': 'margin-left: {value}{unit};',
    'mr-{name}': 'margin-right: {value}{unit};',
    'mt-{name}': 'margin-top: {value}{unit};',
    'mb-{name}': 'margin-bottom: {value}{unit};',
    'p-{name}': 'padding: {value}{unit};',
    'py-{name}': 'padding: {value}{unit} 0;',
    'px-{name}': 'padding: 0 {value}{unit};',
    'pl-{name}': 'padding-left: {value}{unit};',
    'pr-{name}': 'padding-right: {value}{unit};',
    'pt-{name}': 'padding-top: {value}{unit};',
    'pb-{name}': 'padding-bottom: {value}{unit};',
  },
  [TokenTypes.COLOR]: {
    'text-{name}': 'color: {value};',
    'hover__text-{name}:hover': 'color: {value};',
    'focus__text-{name}:focus': 'color: {value};',
    'bg-{name}': 'background-color: {value};',
    'hover__bg-{name}:hover': 'background-color: {value};',
    'focus__bg-{name}:focus': 'background-color: {value};',
  },
};
