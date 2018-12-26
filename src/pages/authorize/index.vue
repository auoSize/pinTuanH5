<template>
  <div class="container power_attorney">
    <nav-bar :navBar="navBar"/>
    <div class="power_attorney_content" :style="margin_top">
      <div class="icon">
        <img src="/static/images/author.png" alt=""/>
      </div>
      <div class="title">
        <div class="crude">微信账号一键登录</div>
        <div class="small">可以直接开启团购，轻松选购自己喜欢的商品</div>
      </div>
      <button class="attorney_button" open-type="getUserInfo" hover-class='none' @getuserinfo="get_user_info">一键登录</button>
    </div>
    <tips :tips="tips"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import tips from '@/components/tips'
import navBar from '@/components/nav_bar'
import { we_chat_auth } from '@/api/index'

export default {
  data () {
    return {
      tips: {
        isShow: false,
        text: '恭喜您注册成功，马上开团！'
      },
      navBar: {
        title: '拼团',
        back_show: false
      }
    }
  },

  computed: {
    ...mapState({
      margin_top: state => state.nav_bar.margin_top,
      authSetting: state => state.authSetting
    })
  },

  components: {
    navBar,
    tips
  },

  methods: {
    // 授权
    get_user_info () {
      this.getUserInfoFun()
    },
    getUserInfoFun () {
      let that = this
      let appid, code
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            that.$store.commit('SET_KEY_VALUE', {key: 'authSetting', value: false})
            wx.getExtConfig({
              success: res => {
                appid = res.extConfig.appId
                that.$store.commit('SET_KEY_VALUE', {
                  key: 'appid',
                  value: res.extConfig.appId
                })
                wx.login({
                  success: res => {
                    code = res.code
                    if (res.code) {
                      wx.getUserInfo({
                        success: res => {
                          that.$store.commit('SET_PROGRAM_INFO', {
                            code,
                            appid,
                            encryptedData: res.encryptedData,
                            rawData: res.rawData,
                            signature: res.signature
                          })
                          that.$store.commit('SET_KEY_VALUE', {key: 'user_info', value: res.userInfo})
                          this.send_login({
                            code,
                            appid,
                            encryptedData: res.encryptedData,
                            rawData: res.rawData,
                            signature: res.signature
                          })
                        }
                      })
                    }
                  }
                })
              }
            })
          }
        }
      })
    },
    async send_login (data) {
      let that = this
      let res = await we_chat_auth(data).catch(err => {
        Object.assign(this.tips, {isShow: true, text: err})
        this.setTips()
      })
      if (res.code === 200) {
        that.$store.commit('SET_KEY_VALUE', {
          key: 'token',
          value: res.data.token
        })
        that.$store.commit('SET_KEY_VALUE', {
          key: 'token_state',
          value: true
        })
        // Object.assign(that.tips, {isShow: true, text: '恭喜登录成功，马上开团！'})
        // that.setTips()
        // setTimeout(() => {
        that.$router.back()
        // }, 1300)
      } else {
        Object.assign(that.tips, {isShow: true, text: res.message})
        that.setTips()
      }
    },
    setTips () {
      let that = this
      that.tips.isShow = true
      setTimeout(() => {
        that.tips.isShow = false
      }, 2000)
    }
  },

  onLoad () {
    this.getUserInfoFun()
  }
}
</script>

<style lang="scss" scoped>
  .power_attorney{
    width: 100%;
    height: 100%;
    background:#FFFFFF;
    overflow: hidden;
    .power_attorney_content{
      overflow: hidden;
      .icon{
        width: 198px;
        height: 213px;
        font-size: 0;
        margin: 120px auto 82px; 
        img{
          width: 100%;
          height: 100%;
        }
      }
      .title{
        letter-spacing: 0;
        text-align: center;
        .crude{
          font-size: 30px;
          color: #4A4714;
          line-height: 42px;
        }
        .small{
          font-size: 24px;
          color: #ACACAC;
          line-height: 33px;
        }
      }
    }
    .attorney_button{
      width: 580px;
      height: 88px;
      margin-top: 97px;
      line-height: 88px;
      text-align: center;
      font-size: 34px;
      color: #1A1A1A;
      text-align: center;
      background: #FFF001;
      border-radius: 0;
      &::after{
        border: none;
      }
    }
  }
</style>
