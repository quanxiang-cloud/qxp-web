type PageInfo = {
  id: string;
  appID?: string;
  name?: string;
  icon?: string;
  describe?: string;
  groupID?: string;
  child?: PageInfo[];
  menuType?: number;
  sort?: number;

}

type AppParams = {
  appId: string
}

type FormDesignParams = {
  pageId: string;
  appID: string;
  pageType: string;
}
