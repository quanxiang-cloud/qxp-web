type ValidationFormula = {
  id: string;
  type: 'formula';
  formula: string;
  name: string;
  message: string;
}

type XInternal = {
  fieldId?: string;
  parentFieldId?: string;
  version?: string;
  sortable?: boolean;
  permission?: import('./constants').PERMISSION;
  validations?: Array<ValidationFormula>;
  defaultValueFrom?: FormBuilder.DefaultValueFrom;
  defaultValueLinkage?: FormBuilder.DefaultValueLinkage;
  calculationFormula?: string;
  isLayoutComponent?: boolean;
  isSystem?: boolean;
  fieldPath?: string;
  [key: string]: any;
}

type ISchema = import('@formily/react-schema-renderer').ISchema & {
  'x-internal'?: XInternal;
  properties?: {
    [key: string]: ISchema;
  };
};

type SchemaWithId = ISchema & { id: string }

type DragPosition = 'up' | 'down' | 'left' | 'right';

type FilterConfig = {
  condition: Condition[];
  tag: 'or' | 'and';
}

type IteratISchema = ISchema & { id: string; componentName?: string; }

type LabelValue = {
  label: string;
  value: string;
}

type FormDataValue =
  | string
  | string[]
  | number
  | number[]
  | FormBuilder.Option
  | FormBuilder.Option[]
  | LabelValue
  | Record<string, unknown>
  | Record<string, unknown>[];

declare type SchemaProperties<T = ISchema> = {
  [key: string]: T;
};

declare namespace FormBuilder {
  type LayoutComponent = 'LayoutCard' | 'LayoutGrid' | 'LayoutTabs'

  type ElementCategory = 'basic' | 'advance' | 'layout';

  type Subordination = 'foreign_table' | 'sub_table';

  type SourceElement<T> = {
    displayName: string;
    displayOrder: number;
    category: ElementCategory;
    icon: string;
    // use this as sourceElement key
    componentName: string;
    component: React.JSXElementConstructor<any>;
    configSchema?: ISchema;
    configForm?: React.JSXElementConstructor<any>;
    defaultConfig: T;
    // transform configuration to the node of schema used by SchemaForm
    toSchema: (value: T) => ISchema;
    toConfig: (schema: ISchema) => T;
    configDependencies?: Record<string, React.JSXElementConstructor<any>>;
    compareOperators?: CompareOperator[];
    placeholderComponent?: React.JSXElementConstructor<any>;
    isLayoutComponent?: boolean;
    editComponent?: React.JSXElementConstructor<any>;
    effects?: () => void;
    validate?: (value: T, tableSchema?: ISchema) => boolean;
  };

  type DropPosition = 'upper' | 'below';

  type DropResult = {
    id: string;
    item: any;
    index: number;
    dropPosition: DropPosition;
  }

  type DisplayModifier = 'normal' | 'readonly' | 'hidden';

  type DefaultValueFrom = 'customized' | 'linkage' | 'formula' | 'now' | 'dataset';

  type DragObject = SourceElement<any>;

  // eq in lt lte gt gte like between
  type CompareOperator = '==' | '!=' | '>' | '>=' | '<=' | '<' | '∈' | '∉' | '⊇' | '⊋' | '∩' | '~' | '()';

  type CompareRule = {
    sourceKey: string;
    compareOperator: CompareOperator;
    compareValue: string | number | string[] | number[];
  }

  type VisibleHiddenLinkage = {
    key: string;
    ruleJoinOperator: 'every' | 'some';
    rules: CompareRule[];
    targetKeys: string[];
    isShow: boolean;
  }

  type Comparator = (values: Record<string, any>) => boolean;

  // todo move this to global.d.ts
  type Option = {
    label: string;
    value: string;
  }

  interface CascadeOption {
    value: string;
    label: string;
    children?: CascadeOption[];
  }

  type FormDataFilterRule = {
    fieldName: string;
    compareOperator: CompareOperator;
    compareTo: 'fixedValue';
    compareValue: string | number | Array<string | number>;
  } | {
    fieldName: string;
    compareOperator: CompareOperator;
    compareTo: 'currentFormValue';
    compareValue: string;
  }

  type DefaultValueLinkage = {
    linkedAppID: string;
    linkedTable: { id: string; name: string };
    linkedTableSortRules: string[];
    linkedField: string;
    targetField: string;
    ruleJoinOperator: 'every' | 'some';
    rules: Array<FormDataFilterRule>;
  }

  type DataAssignment = {
    dataSource: string,
    match: string,
    dataTarget: string,
  }
}

type SchemaFieldItem = ISchema & {
  id: string;
  fieldName: string;
  componentName: string;
  tabIndex?: number;
}

type FormItem = {
  componentName: string;
  configValue: any;
  fieldName?: string;
  'x-index'?: number;
  tabIndex?: string;
  'x-internal'?: XInternal;
  isLayoutComponent?: boolean,
  children?: FormItem[];
};
