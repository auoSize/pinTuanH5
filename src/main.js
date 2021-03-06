// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'vue2-toast/lib/toast.css'
import Toast from 'vue2-toast'
import 'lib-flexible/flexible.js'

Vue.config.productionTip = false

Vue.use(Toast, {
  type: 'center',
  duration: 3000,
  wordWrap: true,
  width: '150px'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
