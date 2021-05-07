import axios from 'axios';

const inst = axios.create({
  // baseURL: 'http://keeper.test',
});

inst.defaults.headers.common['X-Proxy'] = 'API';
inst.defaults.headers.post['Content-Type'] = 'application/json';

export default inst;
