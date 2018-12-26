<template>
  <div class="container join_group_container">
    <nav-bar :navBar="navBar" @custom_back="custom_back"/>

    <ul class="technological_process" v-if="!err_text || err_text == ''" :style="margin_top">
      <li>
        <div class="content process-start">
          <div class="icon">
            <img src="/static/images/index/process-start.png" alt=""/>
          </div>
          <div>团长开团/参团</div>
        </div>
        <div class="arrow">
          <img src="/static/images/process_arrow.png" alt=""/>
        </div>
      </li>
      <li>
        <div class="content process-friends">
          <div class="icon">
            <img src="/static/images/index/process-friends.png" alt=""/>
          </div>
          <div>邀请好友参团</div>
        </div>
        <div class="arrow">
          <img src="/static/images/process_arrow.png" alt=""/>
        </div>
      </li>
      <li>
        <div class="content process-over">
          <div class="icon">
            <img src="/static/images/index/process-over.png" alt=""/>
          </div>
          <div>人满成团</div>
        </div>
      </li>
    </ul>

    <div class="activity" v-if="group_details.goods_info">
      <div class="activity_img">
        <img :src="group_details.goods_info.pic[0].file_path" alt=""/>
      </div>
      <div class="activity_introduce" v-if="group_details.goods_info && group_details.active_info">
        <div class="title bold text-overflow-two">{{group_details.goods_info.name}}</div>
        <div class="original_price">
          <span class="legend">原价</span>
          <div>￥<span>{{group_details.goods_info.price}}</span><span class="goods_unit"></span></div>
        </div>
       <div class="price">
          <span class="legend">{{group_details.group_info.max_num}}人团</span>
          <div>￥<span>{{group_details.active_info.price}}</span><span class="goods_unit"></span></div>
        </div>
      </div>
    </div>

    <div class="status" v-if="group_details.group_info">
      <div class="group_overdue" v-if="group_details.group_info.status_info.status == 2 && isShare == 1">
          <img src="/static/images/index/group_overdue.png" alt=""/> 对不起，拼团已过期
      </div>
      <div class="status_inviting_friends" v-else>
        <div v-if="group_details.group_info.status_info.status == 0" class="open_regiment">
          {{pay_status == 1 ? '成功参团' : '已开团'}}，离成功还差  <span class="group_fail">{{group_details.group_info.max_num - group_details.group_info.num}}</span>  人
        </div>
        <div v-else-if="group_details.group_info.status_info.status == 1 && isShare == 1" class="open_regiment">
          拼团成员已满，请另行开团
        </div>
        <div v-else-if="group_details.group_info.status_info.status == 2" class="open_regiment group_fail">
          很遗憾，拼团人数不够拼团失败
        </div>
        <div v-else-if="group_details.group_info.status_info.status == 1" class="group_success">
          <img src="/static/images/index/group_success.png" alt=""/> 赞，已顺利成团
        </div>
        <div class="count_down" v-if="group_details.group_info.status_info.status == 0 || group_details.group_info.status_info.status == 2">
          <count-down :countDown="{
            end_time: group_details.group_info.end_time,
            now_time: group_details.group_info.now_time,
            count_color: '#fff',
            bg_color: '#959595'
          }"
          @active_end_event="active_end_event"/>
        </div>
        <div class="group_personnel">
          <ul v-if="group_details.group_detail_info">
            <li v-for="(item, i) in group_details.group_detail_info" v-if="(i + 1) < more_num" :key="i">
              <div class="avatar_img">
                <img :src="item.avatar != null ? item.avatar : '/static/images/default-avatar.png'" alt="avatar"/>
              </div>
              <div v-if="i === 0" class="group_head">团长</div>
            </li> 
            <li v-if="group_details.group_info.status_info.status == 1 && group_details.group_detail_info.length < group_details.group_info.max_num && (j + 1) < more_num" v-for="j in (group_details.group_info.max_num - group_details.group_detail_info.length)" :key="j">
              <div class="avatar_img">
                <img src="/static/images/default-avatar.png" alt="avatar"/>
              </div>
            </li> 
            <li @click="more" v-if="group_details.group_detail_info.length > 10">
              <div class="avatar_img">
                <img src="/static/images/more.png" alt="avatar"/>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div :class="['join_group_notes', isIphoneX ? 'x_margin_bottom' : '']" v-if="group_details.show_info">
      <collage-notes :notes="group_details.show_info"/>
    </div>
    
    <div :class="['operation', isIphoneX ? 'fixX' : '']" v-if="group_details.group_info && group_details.group_info.status_info.status != 2">
      <div v-if="isShare * 1 == 1">
        <template v-if="group_details.my_group_id * 1 > 0">
          <button v-if="group_details.group_info.status_info.status == 0" class="operation_btn" @click="go_index">返回主页</button>
        </template>
        <template v-else>
          <!-- <button v-if="group_details.group_info.status_info.status == 0 && group_details.is_join == 1" class="operation_btn" @click="go_index">主页</button> -->
          <!-- <div class="operation_out" v-else-if="group_details.group_info.status_info.status == 0"> -->
          <div class="operation_out" v-if="group_details.group_info.status_info.status == 0">
              <button class="join_group" @click="join_group">我要参团</button>
              <button class="open_group" @click="open_group">自己开团</button>
          </div>
          <button v-else-if="group_details.group_info.status_info.status == 1" class="operation_btn" @click="open_group">自己开团</button>
          <div class="failure" v-else-if="group_details.group_info.status_info.status == 2">
              <button class="go_index" @clcik="go_index">主页</button>
              <button class="" @clcik="open_group">自己开团</button>
          </div>
        </template>
      </div>
      <div v-else>
          <button v-if="group_details.group_info.status_info.status == 0" class="operation_btn" open-type='share'>邀请好友参团</button>
          <button v-else-if="group_details.group_info.status_info.status == 1" class="operation_btn" @click="see_order">查看订单详情</button>
      </div>
    </div>

    <!-- <div class="back_index" @click="go_index" v-if="back_index_show"><img src="/static/images/public/index-active.png" alt=""/>
    </div> -->
    <error-back v-if="err_text && err_text !== ''" :text="err_text"/>
    
    <tips :tips="tips"/>
  </div>
</template>

<script>
import userInfo from '@/mixins/user_info'
import share from '@/mixins/share'
import { mapState } from 'vuex'
import countDown from '@/components/count_down'
import collageNotes from '@/components/collage_notes'
import navBar from '@/components/nav_bar'
import tips from '@/components/tips'
import errorBack from '@/components/error_back'
import { get_group_detail } from '@/api/index'

export default{
  data () {
    return {
      navBar: {
        title: '',
        back_show: true,
        custom_url: true
      },
      activity: {},
      group_details: {},
      members_group: [],
      tips: {
        isShow: false,
        text: '恭喜您注册成功，马上开团！'
      },
      isShare: 0, // 是否是邀请进来的
      pay_status: 0, // 支付状态
      more_num: 9,
      id: 0,
      group_id: 0,
      activityId: 0,
      back_index_show: false,
      is_back: false,
      err_text: ''
    }
  },
  computed: {
    ...mapState({
      margin_top: state => state.nav_bar.margin_top,
      activity_id: state => state.activity_id,
      isIphoneX: state => state.isIphoneX,
      token_state: state => state.token_state
    })
  },
  mixins: [userInfo, share],
  methods: {
    active_end_event () {
      console.log('团结束')
      this.get_group_detail()
    },
    custom_back () {
      if (this.is_back) {
        this.$router.go(2)
      } else {
        this.$router.go(-1)
      }
    },
    join_group () {
      this.$store.commit('SET_KEY_VALUE', {
        key: 'join_group',
        value: {
          group_id: this.group_id
        }
      })
      this.$store.commit('SET_KEY_VALUE', {
        key: 'select_group',
        value: {
          status: 1
        }
      })
      this.$store.commit('SET_CHOOSE_GOODS', this.group_details)
      setTimeout(() => {
        this.$router.push('/pages/order/place_order')
      }, 500)
    },
    open_group () {
      this.$store.commit('SET_KEY_VALUE', {
        key: 'select_group',
        value: {
          status: 0,
          active_id: this.activityId || this.activity_id
        }
      })
      this.$store.commit('SET_CHOOSE_GOODS', this.group_details)
      setTimeout(() => {
        this.$router.push('/pages/order/place_order')
      }, 500)
    },
    see_order () {
      if (this.group_details.order_info) {
        this.$store.commit('SET_KEY_VALUE', {
          key: 'select_order_id',
          value: this.group_details.order_info.id
        })
      }
      this.$router.push({ path: '/pages/order/details' })
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
    // 团详情
    async get_group_detail () {
      let res = await get_group_detail({id: this.group_id}).catch(err => {
        wx.hideLoading()
        if (err === '用户未登录') {
          this.$router.push('/pages/authorize/index')
        } else if (err === '活动不存在') {
          this.err_text = err
        } else {
          Object.assign(this.tips, {isShow: true, text: err})
          this.setTips()
        }
      })
      if (res.code === 200) {
        this.group_details = res.data
        this.$store.commit('SET_SHARE_INFO', {
          status: this.group_details.group_info.status_info.status,
          cover: this.group_details.goods_info.pic[0].file_path,
          title: this.group_details.active_info.share_desc
        })
        wx.hideLoading()
        // if (this.isShare * 1 === 1 && this.group_details.is_join * 1 !== 1 && (this.group_details.group_info.status_info.status * 1 === 0 || this.group_details.group_info.status_info.status * 1 === 1)) {
        //   this.back_index_show = true
        // }
      } else {
        wx.hideLoading()
        Object.assign(this.tips, {isShow: true, text: res.message})
        this.setTips()
      }
    },
    // 显示更多人
    more () {
      if (this.more_num <= this.group_details.group_detail_info.length) {
        this.more_num += 10
      }
    },
    res_data () {
      this.activity = {}
      this.group_details = {}
      this.members_group = []
      this.tips.isShow = false
      this.pay_status = 0
      this.more_num = 9
      this.id = 0
      this.group_id = 0
      this.activityId = 0
      this.isShare = 0
      this.back_index_show = false
      this.is_back = false
      this.navBar.back_show = true
      this.err_text = ''
    }
  },
  components: {
    countDown,
    collageNotes,
    navBar,
    tips,
    errorBack
  },

  onShow () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this
    that.pay_status = that.$root.$mp.query.pay_status * 1
    if (that.pay_status && that.pay_status === 1) {
      this.is_back = true
    }
    that.get_group_detail()
  },

  onUnload () {
    // if (this.is_back) {
    //   this.$router.go(2)
    // }
    this.res_data()
  }
}
</script>

<style lang="scss" scoped>
  @import './../../style/details.scss'
</style>
