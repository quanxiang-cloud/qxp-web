import { Moment } from 'moment';
declare global {
  type AppInfo = {
    id: string;
    appName: string;
    appIcon: string;
    useStatus: number;
  }

  type fetchPageListRes = {
    count: number;
    menu: PageInfo[];
  }

  type fetchPerGroupFormRes = { formArr: { id: string, authority: number }[] }

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

  type ValueFrom = 'form' | 'fixedValue';

  type Condition = {
    key?: string;
    op?: string;
    value?: FormValue;
    valueFrom?: ValueFrom;
    path?: string;
  }

  type ConditionItemMap = {
    arr: Condition[];
    tag: FilterTag;
  }

  type FormValueArray =
    | Record<string, unknown>[]
    | number[]
    | string[]
    | LabelValue[]
    | Moment[];

  type FormValue = string
    | Record<string, unknown>
    | number
    | FormValueArray
    | Moment;

  type ConditionMap = {
    find?: ConditionItemMap;
    delete?: ConditionItemMap;
    update?: ConditionItemMap;
  }

  type PageInfo = {
    id: string;
    appID?: string;
    name?: string;
    icon?: string;
    describe?: string;
    bindingState?: number;
    groupID?: string;
    child?: PageInfo[] | null;
    childCount?: number;
    menuType?: number;
    sort?: number;
    isHide?: boolean;
  }

  type PerPageInfo = PageInfo & { authority: number };

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
    appID?: string;
    add?: boolean;
    formID?: string;
    sequence?: number;
    createdBy?: string;
    scopes?: DeptAndUser[];
  } & RightsCreate

  type RightsCreate = {
    name?: string;
    description?: string;
    types?: number;
  }

  type RightsCopy = {
    groupID?: string;
    name?: string;
    description?: string;
  }

  type DeptAndUser = {
    type: number;
    id: string;
    name: string;
  }
}
