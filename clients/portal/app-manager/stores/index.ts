import AppDetails from './app-details';
import AppList from './app-list';
import AppPages from './app-pages';

class AppManager {
  appDetailsStore: any;
  appListStore: any;
  appPagesStore: any;
  constructor() {
    this.appDetailsStore = new AppDetails(this);
    this.appListStore = new AppList(this);
    this.appPagesStore = new AppPages(this);
  }
}

export default new AppManager();
