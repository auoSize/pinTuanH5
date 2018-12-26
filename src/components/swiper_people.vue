<template>
  <div class="get_people_group" v-if="group_people">
    <swiper class="swiper_ul" 
            :autoplay="swiper.autoplay"
            :interval="swiper.interval"
            :circular="swiper.circular"
            display-multiple-items="2"
            :vertical="swiper.vertical">
      <swiper-item v-for="(item, j) in group_people" :key="j" :current="j"  @touchmove.stop class="swiper_li">
        <div class="avatar">
          <img :src="item.avatar" alt="头像"/>
        </div>
        <div class="name">
          <span class="nickname">{{item.nickname}}刚刚拼团成功 {{item.join_time}} 前
          </span>
        </div>
      </swiper-item>
    </swiper> 
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { get_active_people } from '@/api/index'

export default {
  data () {
    return {
      swiper: {
        autoplay: false,
        vertical: true,
        interval: 3000,
        circular: true
      },
      group_people: [],
      get_peoples: null
    }
  },

  computed: {
    ...mapState({
      select_goods: state => state.select_goods
    })
  },

  methods: {
    // 轮询请求已参团用户
    async get_active_people () {
      let that = this
      await get_active_people({active_id: that.select_goods.id}).then(res => {
        if (res.code === 200) {
          that.group_people = []
          that.group_people = res.data.list
          if (that.group_people.length > 3) {
            that.swiper.autoplay = true
          }
        }
        wx.hideLoading()
      }).catch(err => {
        wx.hideLoading()
        Object.assign(that.tips, {isShow: true, text: err})
        that.setTips()
      })
    },
    get_active_people_new () {
      let that = this
      that.get_active_people()
      that.get_peoples = setTimeout(() => {
        that.get_active_people_new()
      }, 1000 * 5)
    },
    rest_data () {
      this.group_people = []
      clearTimeout(this.get_peoples)
    }
  },

  onLoad () {
    this.group_people = []
    setTimeout(() => {
      this.get_active_people_new()
    }, 1000)
  },

  // onShow () {
  //   setTimeout(() => {
  //     this.get_active_people_new()
  //   }, 1000)
  // },

  onHide () {
    clearTimeout(this.get_peoples)
  },

  onUnload () {
    this.rest_data()
  }
}
</script>

<style lang="scss" scoped>
  @import './../style/common.scss';
  .get_people_group{
    width: $width;
  }
  .swiper_ul{
      width: $width;
      height: 110px;
    }
    .swiper_li{
      height: auto !important;
      // height: 48px !important;
      list-style: none;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-bottom: 10px;
      .avatar{
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 24px;
        overflow: hidden;
        background: $bg_color;
        position: relative;
        z-index: 9;
        img{
          width: $width;
          height: $width;
        }
      }
      .name{
        display: inline-block;
        margin-left: -20px;
        font-family: $font-family-PingFangSC-Regular;
        font-size: $font-size-24;
        color: $color;
        background: rgba(0,0,0,0.2);
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        span{
          display: inline-block;
          padding: 6px 16px 6px 32px;
        }
      }
    }
</style>
