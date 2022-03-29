type Colour = {
  name: string,
  colorValues: string[];
}

type BaseColorConfig = {
  colorNos: number[];
  colors: Colour[];
  primaryColorNo: number;
  primaryColor?: string;
}

type ThemeVariable = {
  key: string;
  name: string;
}

type ColorVariables = {
  baseColors: BaseColorConfig;
  theme: ThemeVariable[];
}

declare module '*/css-variables.json' {
  const value: ColorVariables;
  export default value;
}
