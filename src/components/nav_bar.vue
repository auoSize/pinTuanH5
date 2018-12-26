<template>
  <div class="nav-bar" id="nav-bar" :style="{background: navBar.background, paddingTop: statusBarHeight + 'px', borderBottom: navBar.background === 'none' ? 'none' : '1px solid #E7E7E7'}">
  <div class="arrow" @click="back" v-if="navBar.back_show">
    <img v-if="navBar.background == 'none'" src="/static/images/public/back.png" mode="aspectFill" alt=""/>
    <img v-else src="/static/images/public/Rectangle.png" mode="aspectFill" alt=""/>
  </div>
  <div class="nav_bar_title">{{navBar.title}}</div>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    navBar: {
      type: Object,
      default: () => [{
        title: '',
        background: '#FFFFFF',
        back_show: false,
        custom_url: false
      }]
    }
  },
  data () {
    return {
      statusBarHeight: 0
    }
  },
  computed: {
    ...mapState({
      nav_bar: state => state.nav_bar
    })
  },
  methods: {
    back () {
      if (this.navBar.custom_url) {
        this.$emit('custom_back')
      } else {
        this.$router.go(-1)
      }
    },
    set_nab_bar () {
      // var query = wx.createSelectorQuery()
      // var that = this
      // query.select('#nav-bar').boundingClientRect(function (rect) {
      //   that.$store.commit('SET_KEY_VALUE', {
      //     key: 'nav_bar',
      //     value: {
      //       nav_height: rect.height + that.statusBarHeight,
      //       statusBarHeight: that.statusBarHeight,
      //       margin_top: `margin-top: ${rect.height + that.statusBarHeight}px`
      //     }
      //   })
      // }).exec()
    }
  },
  created () {
    let that = this
    that.statusBarHeight = that.nav_bar.statusBarHeight
    if (!that.nav_bar || that.nav_bar.nav_height === 0 || that.nav_bar.margin_top === '' || that.nav_bar.statusBarHeight === 0) {
      // wx.getSystemInfo({
      //   success (res) {
      //     that.statusBarHeight = res.statusBarHeight
      //     that.set_nab_bar()
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
  .nav-bar{
    width: 100%;
    height: 88px;
    // border-bottom: 1px solid #E7E7E7;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #FFFFFF;
    overflow: hidden;
    .arrow{
      height: 88px;
      padding: 0 30px;
      position: absolute;
      bottom:0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0;
      img{
        width: 18px;
        height: 34px;
      }
    }
    .nav_bar_title{
      font-size: 36px;
      color: rgba(51,51,51,0.85);
      letter-spacing: 0;
      text-align: center;
      line-height: 50px;
      font-weight: Bold;
      // color: #333333;
    }
  }
</style>
