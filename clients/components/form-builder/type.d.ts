type ValidationFormula = {
  id: string;
  type: 'formula';
  formula: string;
  name: string;
  message: string;
}

type ISchema = import('@formily/react-schema-renderer').ISchema & {
  isLayoutComponent?: boolean;
  'x-internal'?: {
    version?: string;
    sortable?: boolean;
    permission?: number;
    validations?: Array<ValidationFormula>;
    defaultValueFrom?: FormBuilder.DefaultValueFrom;
    defaultValueLinkage?: FormBuilder.DefaultValueLinkage;
    calculationFormula?: string;
    [key: string]: any;
  };
};

type FilterConfig = {
  condition: Condition[];
  tag: 'or' | 'and';
}

type IteratISchema = ISchema & { id: string; }

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
    isLayoutComponent?: boolean;
    editComponent?: React.JSXElementConstructor<any>;
    effects?: () => void;
  };

  type DropPosition = 'upper' | 'below';

  type DropResult = {
    id: string;
    item: any;
    index: number;
    dropPosition: DropPosition;
  }

  type DisplayModifier = 'normal' | 'readonly' | 'hidden';

  type DefaultValueFrom = 'customized' | 'linkage' | 'formula' | 'now';

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
}

type SchemaFieldItem = ISchema & {
  id: string;
  fieldName: string;
  componentName: string;
  isLayoutComponent?: boolean;
  parentField?: string;
  tabIndex?: number;
}

// a copy of formily Schema type definition for reference
// interface Schema {
//   title: string;
//   type: 'string' | 'object' | 'array' | 'number' | 'datetime';
//   properties?: {
//     [key: string]: Schema
//   },
//   item?: Schema;
// }

// export interface ISchema {
//   title?: SchemaMessage;
//   description?: SchemaMessage;
//   default?: any;
//   readOnly?: boolean;
//   writeOnly?: boolean;
//   type?: 'string' | 'object' | 'array' | 'number' | 'boolean' | string;
//   enum?: Array<string | number | {
//     label: SchemaMessage;
//     value: any;
//     [key: string]: any;
//   } | {
//     key: any;
//     title: SchemaMessage;
//     [key: string]: any;
//   }>;
//   const?: any;
//   multipleOf?: number;
//   maximum?: number;
//   exclusiveMaximum?: number;
//   minimum?: number;
//   exclusiveMinimum?: number;
//   maxLength?: number;
//   minLength?: number;
//   pattern?: string | RegExp;
//   maxItems?: number;
//   minItems?: number;
//   uniqueItems?: boolean;
//   maxProperties?: number;
//   minProperties?: number;
//   required?: string[] | boolean | string;
//   format?: string;
//   properties?: {
//     [key: string]: ISchema;
//   };
//   items?: ISchema | ISchema[];
//   additionalItems?: ISchema;
//   patternProperties?: {
//     [key: string]: ISchema;
//   };
//   additionalProperties?: ISchema;
//   editable?: boolean;
//   visible?: boolean | string;
//   display?: boolean | string;
//   triggerType?: 'onBlur' | 'onChange';
//   ['x-props']?: {
//     [name: string]: any;
//   };
//   ['x-index']?: number;
//   ['x-rules']?: ValidatePatternRules;
//   ['x-linkages']?: Array<{
//     target: FormPathPattern;
//     type: string;
//     [key: string]: any;
//   }>;
//   ['x-mega-props']?: {
//     [name: string]: any;
//   };
//   ['x-item-props']?: {
//     [name: string]: any;
//   };
//   ['x-component']?: string;
//   ['x-component-props']?: {
//     [name: string]: any;
//   };
//   ['x-render']?: <T = ISchemaFieldComponentProps>(props: T & {
//     renderComponent: () => React.ReactElement;
//   }) => React.ReactElement;
//   ['x-effect']?: (dispatch: (type: string, payload: any) => void, option?: object) => {
//     [key: string]: any;
//   };
// }
