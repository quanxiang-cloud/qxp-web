import AppDetails from './app-details';
import AppList from './app-list';
import AppPages from './app-pages';
import PageSettingStore from './page-setting';

class AppManager {
  appDetailsStore: any;
  appListStore: any;
  appPagesStore: any;
  pageSettingStore: any;
  constructor() {
    this.appDetailsStore = new AppDetails(this);
    this.appListStore = new AppList(this);
    this.appPagesStore = new AppPages(this);
    this.pageSettingStore = new PageSettingStore(this);
  }
}

export default new AppManager();
