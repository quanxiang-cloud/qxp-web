import AppDetails from './app-details';
import AppList from './app-list';

class AppManager {
  appDetailsStore: any
  appListStore: any
  constructor() {
    this.appDetailsStore = new AppDetails();
    this.appListStore = new AppList(this);
  }
}

export default new AppManager();
