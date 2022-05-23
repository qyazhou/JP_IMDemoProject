import router from '../router/index'
import axios from 'axios';
let _api = 'http://localhost:8081/';

const service = axios.create({
  baseURL: '', // api的base_url
  timeout: 5000 // 请求超时时间
})

service.interceptors.request.use(config => {
  config.url = config.url.replace(/^\/_api\/(.+)/, _api + '$1')
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  return config
}, error => {
  Promise.reject(error)
  console.log(error);
})

service.interceptors.response.use(res => {
  console.log('qyz res:', res)
  let data = res.data
  let req = res.config.data || res.config.params
  const code = data.code
  // console.log('req:', req, 'code:', code, 'data:', data)
  if (code === 200) {
    return Promise.resolve(data.data ? data.data : res.data)
  } else if (code && req !== undefined) {
    if (code === 1011002) {
      alert('error')
    } else if (code === 1011006 || code === 1011007 || code === 1011008 || code === 1011009) {
        const token = window.localStorage.getItem('token')
        if (token !== undefined && token !== null) {
          window.localStorage.removeItem("token")
          this.router.push('/login')
        } else {
          console.log('alread remove token, code:', code)
        }
      }
      return Promise.reject()
    }
  return Promise.resolve(data.data ? data.data : res.data);
},
error => {
  console.log('err' + error);
  return Promise.reject(error)
})

let obj = {
  post(url, data) {
    // console.log('post' + url)
    return service({
      method: 'post',
      url,
      data: data
    })
  },
  get(url, data) {
    // console.log('get' + url);
    return service({
      method: 'get',
      url,
      params: data
    })
  },
  delete(url, data) {
    return service({
      methods: 'delete',
      url,
      params: data
    })
  }
}

export default obj;
