type BgColor = 'amber' | 'indigo' | 'teal' | 'fuchsia' | 'emerald' | 'cyan' | 'red' | 'orange';

type AppInfo = {
  id: string;
  appName: string;
  appIcon: string;
  useStatus: number;
}

type AppIcon = {
  bgColor: BgColor;
  iconName: string;
}

type InitialState = {
  visibleAppManager:boolean;
  appList: AppInfo[];
}
