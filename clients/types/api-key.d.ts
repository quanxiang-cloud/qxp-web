type ApiKey = {
  keyID: string,
  keySecret: string,
}

type ApiKeyList = {
  title: string,
  description: string,
  keyID: string,
  active: number,
  createAt: string,
}

type keyListData = {
  total: number,
  keys: ApiKeyList[],
}

type MsgApiKey = {
  title: string,
  description: string,
}
