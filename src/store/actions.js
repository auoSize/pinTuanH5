import {
  we_chat_auth,
  get_capcode,
  verify_phone
} from '@/api/index'

export default {
  // 登录 - 授权
  wx_login: ({state, dispatch, commit}) => {
    let appid, code
    wx.getExtConfig({
      success: res => {
        appid = res.extConfig.appId
        commit('SET_KEY_VALUE', {
          key: 'appid',
          value: res.extConfig.appId
        })
        wx.login({
          success: res => {
            code = res.code
            if (res.code) {
              wx.getUserInfo({
                success: res => {
                  commit('SET_PROGRAM_INFO', {
                    code,
                    appid,
                    encryptedData: res.encryptedData,
                    rawData: res.rawData,
                    signature: res.signature
                  })
                  commit('SET_KEY_VALUE', {key: 'user_info', value: res.userInfo})
                  dispatch('we_chat_auth')
                }
              })
            }
          },
          fail: () => {}
        })
      }
    })
  },

  // 查询是否已经登陆过
  wx_get_check_session: ({state, dispatch, commit}, roots) => {
    wx.checkSession({
      success: (res) => {
        dispatch('wx_login')
      },
      fail: () => {
        roots.$router.push('/pages/authorize/index')
      }
    })
  },

  // 获取用户信息
  get_user_info: ({dispatch, commit}) => {
    wx.getUserInfo({
      success: res => {
        commit('SET_USER_INFO', res.userinfo)
        return res
      }
    })
  },

  /*
  接口请求
  */

  // 授权
  we_chat_auth: ({state, commit, dispatch, payload}) => {
    we_chat_auth({
      code: state.program_info.code,
      encryptedData: state.program_info.encryptedData,
      rawData: state.program_info.rawData,
      signature: state.program_info.signature,
      appId: state.program_info.appid
    }).then(res => {
      if (res.code) {
        commit('SET_TKONE', res.data.token)
        commit('SET_KEY_VALUE', {
          key: 'token_state',
          value: true
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          wx.hideToast()
        }, 1500)
      }
    }).catch(err => {
      wx.showToast({
        title: err.message,
        icon: 'success',
        duration: 2000
      })
      setTimeout(() => {
        wx.hideToast()
      }, 1500)
    })
  },

  // 获取验证码
  get_capcode ({ commit, state, dispatch }, options) {
    return get_capcode(options)
  },
  // 验证手机号
  verify_phone ({ commit, state, dispatch }, options) {
    return verify_phone(options)
  }
}
