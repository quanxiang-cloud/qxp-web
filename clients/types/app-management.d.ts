import { Moment } from 'moment';

import { RawApiDetail } from '@portal/modules/poly-api/effects/api/raw';
import type { Schema } from '@lib/api-adapter/swagger-schema-official';

declare global {
  type AppInfo = {
    id: string;
    appName: string;
    appIcon: string;
    useStatus: number;
    appSign: string;
    perPoly: boolean;
    appZipInfo?: any;
    createdBy?: string;
    template?: string;
    accessURL?: string;
    extension?: Record<string, any>
  }

  type TemplateInfo = {
    id: string;
    name: string;
    appID: string;
    appIcon: string;
    appName?: string;
    version?: string;
    groupID?: string;
    description?: string;
  }

  type AppZipInfo = {
    addr: string;
    opt: string;
    size: number;
    title: string;
    value?: { appID: string }
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

  type ValueFrom = 'form' | 'fixedValue' | 'parentForm';

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

  type Property = {
    type: string,
    properties?: Record<string, Property>
  }

  type SwagSchema = Schema;
  type SwagField = SwagSchema & { acceptable?: boolean, in?: string, must?: boolean, id?: string };

  type APIAuth = {
    path?: string,
    method?: string,
    params?: { [propertyName: string]: SwagSchema },
    response?: { [propertyName: string]: SwagSchema },
    condition?: { type: string, query: Record<string, any> },
    roleID?: string,
    id?: string,
    uri?: string,
    paramsAll?: boolean,
    responseAll?: boolean,
  }

  type RoleRight = {
    id: string;
    appID?: string;
  } & RoleCreate

  type RoleCreate = {
    type?: number;
    name?: string;
    description?: string;
  }

  type UserOrDept = {
    id: string,
    ownerID: string,
    type: number,
    ownerName: string,
  }

  type UserDetail = {
    id: string,
    email: string,
    phone: string,
    name: string,
    departments: {
      id: string,
      name: string
    }
  }
  type DepDetail = {
    id: string;
    name: string;
    pid: string;
  }

  type DeptAndUser = {
    type: number;
    id: string;
    name: string;
    roleID?: string;
  }

  type APIDetailAuth = RawApiDetail & {
    auth?: APIAuth | null;
    isChanging?: boolean;
  }

}
