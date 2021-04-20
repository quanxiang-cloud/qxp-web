import { observable } from 'mobx';

import AppDetails from './app-details';
import AppList from './app-list';
import AppPages from './app-pages';
import PublishFormStore from './publish-form';

class AppManager {
  appDetailsStore: any;
  appListStore: any;
  appPagesStore: any;
  publishFormStore: any;
  constructor() {
    this.appDetailsStore = new AppDetails(this);
    this.appListStore = new AppList(this);
    this.appPagesStore = new AppPages(this);
    this.publishFormStore = new PublishFormStore(this);
  }

  @observable headerType = 'index';
}

export default new AppManager();
