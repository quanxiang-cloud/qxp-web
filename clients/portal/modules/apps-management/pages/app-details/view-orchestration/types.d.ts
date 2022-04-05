
export enum LayoutType {
  HeaderContent = 'header-content',
  LeftSidebarContent = 'left-sidebar-content',
  RightSidebarContent = 'right-sidebar-content',
}

export interface Layout {
  id: string;
  name: string;
  type: LayoutType;
  description: string;
  subViews: Array<{ name: string; id: string; }>;
  refSchemaID: string;
}

export enum ViewType {
  TableSchemaView = 'table_schema_view',
  SchemaView = 'schema_view',
  StaticView = 'static_view',
  ExternalView = 'external_view',
}

export interface BaseView {
  id: string;
  type: ViewType;
  name: string;
  url: string;

  // group: string; tag?
  // description: string;
  // createdAt: string;
  // createdBy: string;
  // latestModifiedAt: string;
  // latestModifiedBy: string;
  // [key: string]: unknown;
}

export interface TableSchemaView extends BaseView {
  type: ViewType.TableSchemaView;
  tableID: string;
  appID: string;
}

export interface SchemaView extends BaseView {
  type: ViewType.SchemaView;
  arteryID: string;
}

export interface StaticView extends BaseView {
  type: ViewType.StaticView;
  fileUrl: string;
}

export interface ExternalView extends BaseView {
  type: ViewType.ExternalView;
  link: string;
  appID: string;
}

export type CardListInfo = {
  id: string,
  name: string,
  status?: string
}

export type CardInfo = {
  id: string,
  title: string,
  list: CardListInfo[],
}

export type View = TableSchemaView | SchemaView | StaticView | ExternalView;
export type ViewGroup = { name: string; views: Array<View>; }

export type CreateViewParams<T> = T & { layoutID?: string }
