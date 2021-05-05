type AppInfo = {
  id: string;
  appName: string;
  appIcon: string;
  useStatus: number;
}

// todo refactor this
type BgColor =
  'amber' | 'indigo' | 'teal' | 'fuchsia' | 'emerald' | 'cyan' | 'red' | 'orange';
type AppIconInfo = {
  bgColor: BgColor;
  iconName: string;
}
