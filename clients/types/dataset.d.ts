type DatasetListType = 1;
type DatasetTreeType = 2;
type DatasetType = DatasetListType | DatasetTreeType;

type Dataset = {
  id: string;
  name: string;
  tag?: string;
  type: DatasetType;
  content?: string; // all dataset items serialized into content
}

type DatasetName = Pick<Dataset, 'id' | 'name' | 'tag'>;

type DatasetListItem = {
  label: string;
  value: string;
}

type DatasetTreeItem = {
  label: string;
  value: string;
  items: Array<DatasetTreeItem>;
}
