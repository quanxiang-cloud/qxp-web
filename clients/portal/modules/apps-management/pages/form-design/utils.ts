export function getAttribute(config: Record<string, any>, index: number) {
  if (!config) {
    return {
      visible: true,
      sort: index,
    };
  }

  return {
    visible: 'visible' in config ? config.visible : true,
    sort: 'sort' in config ? config.sort : index,
  };
}
