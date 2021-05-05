type FilterOption = {
  range: boolean;
  compareSymbol: string;
}

type EnumItem = {
  label: string;
  name: string;
  title: string;
  value: string;
}

type ComponentProps = {
  placeholder?: string;
  precision?: number;
  step?: number;
}

type PageField = {
  id: string;
  label: string;
  type: string,
  cProps: ComponentProps;
  isSystem: boolean;
  expand?: boolean;
  filter?: boolean;
  visible?: boolean;
  sort: number;
  option?: FilterOption;
  enum?: EnumItem[];
}

type FilterField = {
  id: string;
  label: string;
  type: string,
  placeholder: string;
  multiple?: boolean;
  compareSymbol?: string;
  step?: number;
  precision?: number;
  enum?: EnumItem[];
}

type Condition = {
  key?: string;
  op?: string;
  value?: any;
}
