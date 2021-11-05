export type FuncField = {
  name: string,
  id: string,
  state: string,
  description: string,
  creator: string,
  createdAt: string,
}

export type FuncListParams = {
  appID: string,
  size: string,
  page: string,
  alias?: string,
}
