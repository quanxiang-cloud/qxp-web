type GHeaderProps = {
  navButtonRender: (nav: Nav) => JSX.Element
}

type Nav = {
  name: string | JSX.Element;
  icon: string;
  url?: string;
  inside?: boolean;
  active?: boolean;
}
