<template>
  <div :class="['nab_bar', isIphoneX ? 'fixX' : '']">
    <ul>
      <li v-for="(item, index) in nav_tab" :key="index" @click="go_nav_tab(item, index)" :class="[item.clasName ,cur === index ? 'active' : '']">
        <div class="icon">
          <img class="icon_normal" :src="item.icon" alt=""/>
          <img class="select_icon" :src="item.select_icon" alt=""/>
        </div>
        <div class="text">{{item.text}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      cur: 0,
      nav_tab: [
        {
          id: 0,
          path: '/pages/index/index',
          icon: '/static/images/public/index-normal.png',
          select_icon: '/static/images/public/index-active.png',
          text: '主页',
          clasName: 'index'
        },
        {
          id: 1,
          path: '/pages/personal/index',
          icon: '/static/images/public/personal-normal.png',
          select_icon: '/static/images/public/personal-active.png',
          text: '我的',
          clasName: 'personal'
        }
      ]
    }
  },

  computed: {
    ...mapState({
      isIphoneX: state => state.isIphoneX
    })
  },

  methods: {
    go_nav_tab (item, index) {
      this.cur = index
      this.$router.push({ path: item.path, isTab: true })
    //   this.$router.push({ path: item.path })
    }
  }
}
</script>

<style lang="scss" scoped>
  .nab_bar{
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0 -1px 0 0 #D7D7D7;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 99999;
    ul{
      width: 100%;
      display: flex;
      padding: 10px 0;
      li{
        flex: 1;
        text-align: center;
        .icon{
          width: 38px;
          height: 38px;
          font-size: 0;
          margin: 0 auto 5px;
          img{
            width: 100%;
            height: 100%;
            vertical-align: middle;
          }
        }
        .text{
          font-size: 22px;
          color: #595959;
          text-align: center;
          line-height: 30px;
        }
        .icon_normal{
          display: block
        }
        .select_icon{
          display: none;
        }
        &.active{
          .icon_normal{
            display: none
          }
          .select_icon{
            display: block;
          }
        }
      }
      .index{
        border-right: 2px solid #D8D8D8;
        .icon{
          width: 40px;
          height: 36px;
        }
      }
      .personal{
        .icon{
          width: 38px;
          height: 36px;
        }
      }
    }
  }
</style>

