type AppInfo = {
  id: string;
  appName: string;
  appIcon: string;
  useStatus: number;
}

// todo refactor this
type BgColor =
  'amber' | 'indigo' | 'teal' | 'fuchsia' | 'emerald' | 'cyan' | 'red' | 'orange';
type AppIconInfo = {
  bgColor: BgColor;
  iconName: string;
}

type FilterOption = {
  range?: boolean;
  compareSymbol?: string;
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
  xComponent: string;
  cProps?: ComponentProps;
  isSystem: boolean;
  expand?: boolean;
  filter?: boolean;
  option?: FilterOption;
  enum?: EnumItem[];
}

type FilterField = {
  compareSymbol?: string;
}

type FilterMaps = Record<string, FilterField>;

type Filters = string[];

type Condition = {
  key?: string;
  op?: string;
  value?: Array<string | number | Date | { label: string, value: string }>;
}

type PageInfo = {
  id: string;
  appID?: string;
  name?: string;
  icon?: string;
  describe?: string;
  groupID?: string;
  child?: PageInfo[];
  childCount?: number;
  menuType?: number;
  sort?: number;

}

type AppParams = {
  appID: string
}

type FormDesignParams = {
  pageId: string;
  appID: string;
  pageType: string;
  navType?: string;
}

type Rights = {
  id: string;
  types?: number;
  add?: boolean;
  formID?: string;
  sequence?: number;
  scopes?: DeptAndUser[];
} & RightsCreate

type RightsCreate = {
  name?: string;
  description?: string;
}

type DeptAndUser = {
  type: number;
  id: string;
  name: string;
}

type Fields = ISchema & { id: string, parentField?: string };
