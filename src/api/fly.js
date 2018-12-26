import Fly from 'flyio/dist/npm/fly'
import store from '@/store'

const fly = new Fly()
// const host = 'https://scrm.buerkongjian.com' // 正式 wx2a9ed5e0e45ff586
const host = 'https://test.scrm.buerkongjian.com' // 测试 wx2a9ed5e0e45ff586
// const host = 'http://scrm2c.com' //  wxc76b67b5e0ab383f
let userTkone = null

fly.interceptors.request.use((request) => {
  request.headers = {
    'X-Tag': 'flyio',
    'content-type': 'application/json'
  }

  if (store.getters.token) {
    request.headers['X-ACCESS-TOKEN'] = store.getters.token
  } else {
    if (userTkone) {
      request.headers['X-ACCESS-TOKEN'] = userTkone
    } else {
      fly.lock()
      store.dispatch('wx_login')
      request.headers['X-ACCESS-TOKEN'] = store.getters.token
      fly.unlock()
    }
  }

  request.body && Object.keys(request.body).forEach((val) => {
    if (request.body[val] === '') {
      delete request.body[val]
    }
  })

  request.body = {
    ...request.body
  }

  return request
})

fly.interceptors.response.use(
  (response) => {
    if (response.data.data.token) {
      userTkone = response.data.data.token
    }
    return response.data
  },
  (err) => {
    if (err) {
      if (err.status === 0) {
        return '网络连接异常'
      } else if (err.status === 1) {
        return '网络连接超时'
      } else if (err.status === 401) {
        return '用户未登录'
      } else {
        if (err.response.data.message) {
          return err.response.data.message
        } else {
          return '请求数据失败,请稍后再试'
        }
      }
    }
  }
)
fly.config.headers = {xx: 5, bb: 6, dd: 7}
fly.config.timeout = 10000
fly.config.baseURL = host

export default fly
