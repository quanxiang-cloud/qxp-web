declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module 'draftjs-to-html';
declare module 'html-to-draftjs';
declare module 'react-highlight';

type UserDepartment = {
  id: string;
  departmentName: string;
  departmentLeaderID: string;
  pid: string;
  superID: string;
  grade: number;
  child: UserDepartment;
}
type CurrentUser = {
  id: string;
  userName: string;
  status: number;
  email: string;
  phone: string;
  depIds: string[]
  dep: UserDepartment;
}

interface Window {
  USER: CurrentUser;
  USER_ADMIN_ROLES: Role[];
  ADMIN_USER_FUNC_TAGS: string[];
  CONFIG: { [key: string]: any; }
  SIDE: 'portal' | 'home';
  [key: string]: any;
}

interface Pagination {
  current: number;
  pageSize: number;
}

type CheckboxValueType = string | number | boolean;

type ErrorWithData<T> = Error & T;

type PartialTuple<
  TUPLE extends any[],
  EXTRACTED extends any[] = []
> = TUPLE extends [infer NEXT_PARAM, ...infer REMAINING] ?
    PartialTuple<REMAINING, [...EXTRACTED, NEXT_PARAM?]> :
    [...EXTRACTED, ...TUPLE]

type RemainingParameters<
  PROVIDED extends any[],
  EXPECTED extends any[]
> = EXPECTED extends [infer _, ...infer EX] ?
    PROVIDED extends [infer _, ...infer PX] ? RemainingParameters<PX, EX> : EXPECTED : []

type CurriedFunctionOrReturnValue<
  PROVIDED extends any[],
  FN extends (...args: any[]) => any
> = RemainingParameters<PROVIDED, Parameters<FN>> extends [any, ...any[]] ? Curried<FN, PROVIDED> :
  ReturnType<FN>

type Curried<FN extends (...args: any[]) => any, PROVIDED extends any[] = []> =
<NEW_ARGS extends PartialTuple<
  RemainingParameters<PROVIDED, Parameters<FN>>
>>(...args: NEW_ARGS) => CurriedFunctionOrReturnValue<[...PROVIDED, ...NEW_ARGS], FN>
