type ISchema = import('@formily/react-schema-renderer').ISchema;

type DropPosition = {
  id: string;
  index: number;
  path: string;
  dropPosition: string;
}

type DropResult = {
  id: string;
  item: any;
  index: number;
  path: string;
  dropPosition: string;
}

type Source = Partial<{
  item: any;
  path: string;
  index: number;
}>;

type TargetItem = {
  id: string;
  index: number;
  path: string;
}

type EditComponentProps = any;

type ElementCategory = 'basic' | 'advance' | 'layout';

type FormItem<T> = {
  itemName: string;
  icon: string;
  type: string;
  category: ElementCategory;
  configuration: ISchema;
  defaultConfig: T;
  // transform form field settings to SchemaForm render schema
  configToSchema: (value: T) => ISchema;
  component: React.JSXElementConstructor<any>;
  editComponent?: React.Component<EditComponentProps>;
  displayOrder: number;
};

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
