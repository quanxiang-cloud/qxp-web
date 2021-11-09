export type CardItem = {
  id: string;
  render: () => JSX.Element;
  forbidden?: boolean;
}
