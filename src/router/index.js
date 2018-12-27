import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: resolve => require(['@/pages/index/index'], resolve),
      meta: {
        title: '不二拼团'
      }
    },
    { /* Not Found 路由，必须是最后一个路由 */
      path: '*',
      component: resolve => require(['@/pages/notFound/index'], resolve),
      meta: {
        title: '找不到页面'
      }
    }
  ]
})
