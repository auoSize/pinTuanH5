import {
  SET_TKONE,
  SET_KEY_VALUE,
  SET_STATUS,
  SET_ORDER_MENU,
  SET_USER_INFO,
  SET_PROGRAM_INFO,
  SET_NAV_BAR,
  SET_ACTIVITY_ID,
  SET_CHOOSE_GOODS,
  SET_SHARE_INFO,
  SET_ROUTER_INFO
} from './mutation-types'

export default {
  [SET_TKONE] (state, data) {
    state.token = data
  },
  [SET_STATUS] (state, data) {
    state.status = data
  },
  [SET_ORDER_MENU] (state, data) {
    state.order_menu = data
  },
  [SET_USER_INFO] (state, data) {
    Object.assign(state.user_info, data)
  },
  [SET_PROGRAM_INFO] (state, data) {
    Object.assign(state.program_info, data)
  },
  [SET_KEY_VALUE] (state, { key, value }) {
    state[key] = value
  },
  [SET_NAV_BAR] (state, data) {
    Object.assign(state.nav_bar, data)
  },
  [SET_ACTIVITY_ID] (state, data) {
    state.activity_id = data
  },
  [SET_CHOOSE_GOODS] (state, data) {
    Object.assign(state.choose_goods, data)
  },
  [SET_SHARE_INFO] (state, data) {
    Object.assign(state.share_info, data)
  },
  [SET_ROUTER_INFO] (state, data) {
    Object.assign(state.router_info, data)
  }
}
