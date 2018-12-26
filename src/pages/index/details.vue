<template>
  <div class="container">
    <nav-bar :navBar="navBar"/>
    <div class="container-content" v-if="active_dtails_show === 1">
      <div class="banner">

        <div class="banner_img">
          <div class="content" v-if="active_dtails.goods_info">
            <div class="banner_img_conte" v-if="active_dtails.goods_info.pic.length <= 1">
              <swiper  class="banner_ul"  @change="banner_list" :autoplay="active_dtails.goods_info.pic.length > 1 ? true : false" :circular="active_dtails.goods_info.pic.length > 1 ? true : false">
                <swiper-item v-for="(item, index) in active_dtails.goods_info.pic" :key="index" @touchmove.stop>
                  <img :src="item.file_path || ''" mode="aspectFill" alt="banner"/>
                </swiper-item>
              </swiper>
            </div>
            <div class="banner_img_conte" v-else>
              <swiper class="banner_ul"  @change="banner_list" :autoplay="active_dtails.goods_info.pic.length > 1 ? true : false" :circular="active_dtails.goods_info.pic.length > 1 ? true : false">
                <swiper-item v-for="(item, index) in active_dtails.goods_info.pic" :key="index">
                  <img :src="item.file_path || ''" mode="aspectFill" alt="banner"/>
                </swiper-item>
              </swiper>
            </div>
          </div>
        </div>

        <div class="banner_members_group" :style="{top: isIphoneX ? '93px' : '73px'}">
          <swiperPeople/>
        </div>

        <div class="group_members_countDown" v-if="active_dtails.group_detail_info">
          <div class="group_members">
            <ul v-if="active_dtails.group_detail_info">
              <li v-for="(val, i) in active_dtails.group_detail_info" :key="i" v-if="i < 3">
                <img :src="val.avatar" alt=""/>
              </li>
              <li class="more" v-if="active_dtails.group_detail_info.length > 3">
                <img src="/static/images/index/more.png" alt="more"/>
              </li>
            </ul>
          </div>
          <div class="count_down" v-if="active_dtails.active_status && active_dtails.active_status.active_status * 1 !== 3">
            <count-down :countDown="{
              end_time: active_dtails.end_time,
              now_time: active_dtails.now_time,
              count_color: '#fff',
              bg_color: '#1A1A1A'
            }"
            @active_end_event="active_end_event"/>
          </div>
        </div>
        
        <!-- 活动失效 -->
        <div class="active_invalid" v-if="active_dtails.active_status && (active_dtails.active_status.active_status * 1 === 3 || active_dtails.goods_info.sell_num * 1 == active_dtails.goods_info.total_num * 1)">
          <img v-if="active_dtails.active_status.active_status * 1 === 3" src="/static/images/index/invalid.png" alt=""/>
          <img v-if="active_dtails.goods_info.sell_num * 1 == active_dtails.goods_info.total_num * 1" src="/static/images/index/sold-out.png" alt=""/>
        </div>

        <div class="banner_page_index" v-if="active_dtails.goods_info && active_dtails.goods_info.pic.length > 1">
          <span>{{banner_current + 1}}</span>/{{active_dtails.goods_info.pic.length}}
        </div>

      </div>

      <div class="introduce" v-if="active_dtails.goods_info">
        <div class="title_share">
          <div class="title">{{active_dtails.goods_info.name}} <span v-if="active_dtails.active_status && active_dtails.active_status.active_status * 1 === 3" class="max_number">1人拼团</span></div>
          <div class="share" v-if="active_dtails.active_status && active_dtails.active_status.active_status * 1 != 3">
            <button class="share_btn" open-type='share'>
            </button>
            <img src="/static/images/index/share.png" alt="share"/>
          </div>
        </div>
        <div class="describe">{{active_dtails.goods_info.sell_description}}</div>
        <div class="price_number">
          <div class="price">
            ￥<span class="price_text">{{active_dtails.price}}</span>
            <span class="original_price">￥{{active_dtails.goods_info.price}}</span>
          </div>
          <div class="more_actvie" v-if="active_dtails.active_status && active_dtails.active_status.active_status * 1 === 3" @click="go_index">更多活动</div>
          <div v-else class="number">{{active_dtails.group_info.active_success_count}}人正在团</div>
        </div>
      </div>

      <!-- 已有团，凑团 -->
      <div class="group_content" v-if="group && group.length > 0">
        <div class="title">以下小伙伴正在参团，你可以直接参加</div>
        <div class="join_group">
           <swiper class="join_ul"
                  :autoplay="group_swiper.autoplay"
                  :interval="group_swiper.interval"
                  :circular="group_swiper.circular"
                  :vertical="group_swiper.vertical"
                  :display-multiple-items="group.length >= 3 ? 3 : 1"
                  @change="more_group_list"
                  :class="group.length == 1 ? 'num_one' : (group.length == 2 ? 'num_tow' : 'num_there')">
            <swiper-item v-for="(item, j) in group" @touchmove.stop :key="j" :current-item-id="item.id" class="join_li">
              <div class="join_info">
                <div class="avatar">
                    <img :src="item.avatar" alt=""/>
                </div>
                <div class="name_time">
                  <div class="name">{{item.nick_name}}</div>                  
                  <div class="text">还差 <span>{{item.need_num}}</span> 人成团，剩余
                   <groupCountDown :countDown="{
                     id: item.id,
                     end_time: item.end_time,
                     now_time: item.now_time
                   }"
                    @tiem_end_event="tiem_end_event"/>
                   </div>                  
                </div>
              </div>
              <div class="join_operation" @click="join_group(item)">
                <button>去凑团</button>
              </div>
            </swiper-item>
          </swiper>
          <div class="swiper_mask"></div>
        </div>
        <div class="explain" v-if="group.length > 0">开团邀请1人参团，人数不足自退款</div>
      </div>

      <div :class="['group_details', isIphoneX ? 'x_margin_bottom' : '']" v-if="active_dtails.goods_info && active_dtails.show_info">
        <div class="title">活动详情介绍</div>
        <div class="content">
          <div class="list" v-if="active_dtails.show_info.validate_time">
            <div class="name">有效期： <div class="text"> {{active_dtails.show_info.validate_time}}</div></div>
          </div>
          <div class="list" v-if="active_dtails.show_info.left_num">
            <div class="name">商品剩余数量：<div class="text"> {{active_dtails.show_info.left_num}} {{active_dtails.show_info.goods_unit}}</div></div>
          </div>
          <div class="list" v-if="active_dtails.show_info.use_description">
            <div class="name">使用说明：<div class="text">{{active_dtails.show_info.use_description}}</div></div>
          </div>
        </div>
      </div>
    </div>

    <no-content :no_cont="no_cont"/>


    <div v-if="active_dtails.active_status && (active_dtails.active_status.active_status * 1 === 3 || active_dtails.goods_info.sell_num * 1 == active_dtails.goods_info.total_num * 1)">
      <nav-tab/>
    </div>

    <div :class="['operation', isIphoneX ? 'fixX' : '']" v-else>
     
        <div class="to_personal" @click="go_index">
          <img src="/static/images/index/index-normal.png" alt="icon"/>
          <div>主页</div>
        </div>
        <div class="to_personal to_contact" >
          <button class="share_btn" open-type="contact" @contact="handleContact">
            <img src="/static/images/index/contact.png" alt="icon"/>
            客服
         </button>          
        </div>
        <div class="open_group">
          <form :report-submit="true" @submit="formSubmit" class="from_id_class">
            <button form-type="submit" v-if="1 <= active_dtails.group_id * 1" @click="see_group">查看我的团</button>
            <button form-type="submit" v-else @click="open_group">我要开团</button>
           </form>
        </div>
    </div>

     <tips :tips="tips"/>
  </div>
</template>

<script>
import userInfo from '@/mixins/user_info'
import countGoods from '@/mixins/count_goods'
import countDown from '@/components/count_down'
import navBar from '@/components/nav_bar'
import tips from '@/components/tips'
import navTab from '@/components/nav_tab'
import noContent from '@/components/no_content'
import groupCountDown from '@/components/group_count_down'
import swiperPeople from '@/components/swiper_people'
import { mapState } from 'vuex'
import { activity_detail, can_join_list } from '@/api/index'

export default {
  data () {
    return {
      navBar: {
        title: '',
        background: 'none',
        back_show: true
      },
      active_id: 0,
      active_dtails: {},
      active_dtails_show: 1,
      swiper: {
        autoplay: false,
        vertical: true,
        interval: 3000,
        circular: true
      },
      group_swiper: {
        autoplay: false,
        vertical: true,
        interval: 3000,
        circular: false
      },
      group: [],
      group_people: [],
      tips: {
        isShow: false,
        text: '恭喜您注册成功，马上开团！'
      },
      no_cont: {
        show: false,
        text: '活动已结束'
      },
      group_page_info: {
        page_index: 1,
        current_index: 0
      },
      banner_current: 0
    }
  },

  mixins: [userInfo, countGoods],

  computed: {
    ...mapState({
      select_goods: state => state.select_goods,
      appid: state => state.appid,
      isIphoneX: state => state.isIphoneX,
      share_info: state => state.share_info
    })
  },

  components: {
    countDown,
    tips,
    navBar,
    navTab,
    noContent,
    groupCountDown,
    swiperPeople
  },

  methods: {
    // 客服
    handleContact (e) {
      console.log(e.mp.detail.path)
      console.log(e.mp.detail.query)
    },
    active_end_event () {
      this.get_activity_detail()
    },
    tiem_end_event (data) {
      this.group.map((item, index) => {
        if (item.id * 1 === data * 1) {
          this.group.splice(index, index)
        }
      })
    },
    // 加团
    join_group (item) {
      if (this.active_dtails.group_id * 1 < 1) {
        this.$store.commit('SET_KEY_VALUE', {
          key: 'join_group',
          value: {
            group_id: item.id
          }
        })
        this.$store.commit('SET_KEY_VALUE', {
          key: 'select_group',
          value: {
            status: 1
          }
        })
        this.$store.commit('SET_CHOOSE_GOODS', this.active_dtails)
        setTimeout(() => {
          this.$router.push('/pages/order/place_order')
        }, 500)
      } else {
        Object.assign(this.tips, {isShow: true, text: '该活动你已经开团或加团'})
        this.setTips()
      }
    },
    // 开团
    open_group () {
      if (this.active_dtails.active_status) {
        this.$store.commit('SET_ACTIVITY_ID', this.active_dtails.id)
        this.$store.commit('SET_CHOOSE_GOODS', this.active_dtails)
        this.$store.commit('SET_KEY_VALUE', {
          key: 'select_group',
          value: {
            status: 0,
            active_id: this.active_dtails.id
          }
        })
        setTimeout(() => {
          this.$router.push('/pages/order/place_order')
        }, 100)
      }
    },
    // 查看团
    see_group () {
      if (this.active_dtails.active_status) {
        this.$store.commit('SET_ACTIVITY_ID', this.active_dtails.id)
        this.$store.commit('SET_SHARE_INFO', {
          status: null,
          id: this.active_dtails.id,
          group_id: this.active_dtails.group_id,
          cover: this.active_dtails.goods_info.pic[0].file_path
        })
        setTimeout(() => {
          this.$router.push({ path: `/pages/group/details?id=${this.active_dtails.group_id}` })
        }, 100)
      }
    },
    go_index () {
      this.$router.push({ path: '/pages/index/index', isTab: true })
    },
    setTips () {
      let that = this
      that.tips.isShow = true
      setTimeout(() => {
        that.tips.isShow = false
      }, 2000)
    },
    async get_activity_detail () {
      let res = await activity_detail({id: this.active_id}).catch(err => {
        wx.hideLoading()
        if (err === '用户未登录') {
          this.$router.push('/pages/authorize/index')
        } else {
          Object.assign(this.tips, {isShow: true, text: err})
          this.setTips()
        }
      })
      if (res.code === 200) {
        this.active_dtails = res.data
        this.goods_count({goods_id: this.active_dtails.goods_info.id, active_id: this.active_dtails.id})
        this.$store.commit('SET_SHARE_INFO', {
          status: null,
          id: this.active_dtails.id,
          cover: this.active_dtails.goods_info.pic[0].file_path,
          title: this.active_dtails.share_desc
        })
        this.no_cont.show = res.active_status.active_status * 1 === 3 ? 1 : 0
        this.active_dtails_show = res.active_status.active_status * 1 === 3 ? 1 : 0
        // wx.hideLoading()
      } else {
        wx.hideLoading()
        Object.assign(this.tips, {isShow: true, text: res.message})
        this.setTips()
      }
    },
    async can_join_list () {
      let options = {
        page_index: this.group_page_info.page_index,
        active_id: this.active_id
      }
      let res = await can_join_list(options).catch(err => {
        wx.hideLoading()
        Object.assign(this.tips, {isShow: true, text: err})
        this.setTips()
      })
      if (res.code === 200) {
        Object.assign(this.group_page_info, {total_count: res.data.totalCount})
        this.group = this.group.length === 0 ? res.data.result : this.group.concat(res.data.result)
        if (this.group.length > 3) {
          this.group_swiper.autoplay = true
          this.group_swiper.circular = true
        }
        wx.hideLoading()
      } else {
        wx.hideLoading()
        Object.assign(this.tips, {isShow: true, text: res.message})
        this.setTips()
      }
    },
    more_group_list (e) {
      let current = e.mp.detail.current
      this.group_page_info.current_index = current
      if (current >= (this.group.length - 1) && this.group_page_info.page_index <= this.group_page_info.total_count) {
        this.group_page_info.page_index += 1
        this.can_join_list()
      }
    },
    banner_list (e) {
      this.banner_current = e.mp.detail.current
    },
    rest_data () {
      this.active_dtails = {}
      this.active_dtails_show = 1
      this.active_id = 0
      this.group = []
      this.group_people = []
      this.tips.isShow = false
      this.no_cont.show = false
      this.group_page_info.page_index = 1
      this.group_page_info.current_index = 0
      this.navBar.back_show = true
      this.banner_current = 0
    }
  },

  onLoad () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
  },

  onShow () {
    this.active_id = this.$root.$mp.query.id || this.select_goods.id
    this.get_activity_detail()
    this.can_join_list()
    if (this.$root.$mp.query.id) {
      this.navBar.back_show = false
    }
  },

  onHide () {
    this.group = []
  },

  onUnload () {
    this.rest_data()
  },

  onShareAppMessage () {
    let path = `/pages/index/details?id=${this.active_id}`
    return {
      title: this.active_dtails.goods_info.sell_description,
      path,
      success: res => {
        Object.assign(this.tips, {isShow: true, text: '分享成功'})
        this.setTips()
      },
      fail: res => {
        Object.assign(this.tips, {isShow: true, text: '分享失败，请稍后重试'})
        this.setTips()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './../../style/group_details.scss';
</style>
