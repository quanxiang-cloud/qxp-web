const sleep = (ms = 300) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/*
 * mock api data
 */
export const mockAPI = async (apiName: string, data: any, timeout?: number) => {
  await sleep(timeout);
  console.log('--mock api-- ', apiName, data);
  return {
    apiName,
    data,
  };
};

export const mockGetApiGroups = () => {
  return import('./api-groups').then(({ default: groups }) => {
    return mockAPI('get-api-groups', groups);
  });
};
