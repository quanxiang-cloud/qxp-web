type DataModel = {
  createdAt: number
  creatorID: string
  creatorName: string
  description: string
  fieldLen: number
  id: string
  source: 1 | 2
  tableID: string
  title: string
  updatedAt: number
}

type DataModelParams = {
  page: number,
  size: number,
  title: string,
}
