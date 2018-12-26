import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  plugins: [
    // createPersistedState({
    //   storage: {
    //     getItem: key => wx.getStorageSync(key),
    //     setItem: (key, value) => wx.setStorageSync(key, value),
    //     removeItem: key => {}
    //   }
    // })
    createPersistedState({ storage: window.sessionStorage })
  ]
})
