type OptionSetListType = 1;
type OptionSetTreeType = 2;

declare enum OptionSetType {
  OptionSetListType = 1,
  OptionSetTreeType = 2,
}

type OptionSet = {
  id: string;
  name: string;
  tag?: string;
  type: OptionSetType;
  content?: string; // all option-set items serialized into content
}

type OptionSetItem = Pick<OptionSet, 'id' | 'name' | 'tag' | 'type'>;

type OptionSets = {
  name?: string;
  tag?: string;
  type?: OptionSetType;
}

type OptionSetListItem = {
  label: string;
  value: string;
}

type OptionSetTreeItem = {
  label: string;
  value: string;
  children?: Array<OptionSetTreeItem>;
}
