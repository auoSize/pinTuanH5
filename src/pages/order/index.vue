<template>
  <div class="container order">
    <nav-bar :navBar="navBar"/>

    <div class="order_menu" id="order_menu" :style="{top: nav_height + 'px'}">
      <ul>
        <li v-for="(item, i) in order_menu" :key="i" 
        @click="click_list(item)"
        :class="cun === item.id ? 'active' : ''">
          {{item.name}}
          </li>
      </ul>
    </div>
    <div class="order_content" :style="{marginTop: nav_height + menu_height + 10 + 'px'}">
      <ul v-if="order_list.length > 0">
        <li v-for="(val, j) in order_list" :key="j" class="order_list" @click.stop="order_details(val)">
          <div class="title">
            <div class="title_name ellipsis">{{val.active_info.active_name}}</div>
            <div :class="val.status * 1 == 8 ? 'title_status' : 'status_success'">
              {{val.status_name}}
            </div>
          </div>
          <div class="content">
            <div class="order_img" v-if="val.goods_info">
                <img :src="val.goods_info.pic[0].file_path" alt=""/>
            </div>
            <div class="order_info" v-if="val.goods_info">
              <div class="order_name text-overflow-two">{{val.goods_info.name}}</div>
              <!-- <div class="type">门票</div> -->
              <div class="order_number_price">
                <div class="order_price">￥{{val.order_goods_info.price}}</div>
                <div class="order_number">X{{val.order_goods_info.num}}</div>
              </div>
            </div>
          </div>
          <div class="operation">
            <button v-if="val.status * 1 == 3 || val.status * 1 == 4 || val.status * 1 == 5 || val.status * 1 == 9" @click.stop="delete_order_val(val, j)">删除订单</button>
            <button @click.stop="go_pay(val)" v-if="val.pay_status * 1 == 0 && val.status * 1 == 3">去支付</button>
            <button @click.stop="order_cancel_operation(val, j)" v-if="val.pay_status * 1 == 0 &&val.status * 1 == 0">取消订单</button>
            <button @click.stop="order_details(val)" v-if="val.pay_status * 1 !== 0">订单详情</button>
          </div>
        </li>
      </ul>
      <no-content :no_cont="no_cont"/>  
    </div>
    <tips :tips="tips"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import navBar from '@/components/nav_bar'
import wxPayment from '@/mixins/wx_payment'
import tips from '@/components/tips'
import noContent from '@/components/no_content'
import { get_order, delete_order, cancel_order } from '@/api/index'

export default {
  data () {
    return {
      navBar: {
        title: '我的订单',
        back_show: true
      },
      order_menu: [
        {
          id: 0,
          name: '全部'
        },
        {
          id: 1,
          name: '待支付'
        },
        {
          id: 2,
          name: '已支付'
        },
        {
          id: 3,
          name: '待发货'
        },
        {
          id: 4,
          name: '已发货'
        },
        {
          id: 5,
          name: '已完成'
        }
      ],
      no_cont: {
        show: false,
        text: '暂无订单'
      },
      order_list: [],
      page_info: {
        page_index: 1,
        total_count: 0
      },
      tips: {
        isShow: false,
        text: '恭喜您注册成功，马上开团！'
      },
      is_show: 1,
      menu_height: 0,
      is_click: true,
      select_order_id: null
    }
  },

  computed: {
    ...mapState({
      margin_top: state => state.nav_bar.margin_top,
      nav_height: state => state.nav_bar.nav_height,
      appid: state => state.appid,
      cun: state => state.order_menu
    })
  },

  mixins: [wxPayment],

  components: {
    navBar,
    tips,
    noContent
  },

  methods: {
    // 取消订单
    order_cancel_operation (data, index) {
      let that = this
      wx.showModal({
        title: '是否取消订单？',
        content: '取消之后该条订单将无法支付',
        cancelColor: '#595959',
        confirmColor: '#d44950',
        success (res) {
          if (res.confirm) {
            that.order_cancel(data, index)
          }
        }
      })
    },
    async order_cancel (data, index) {
      let res = await cancel_order({order_id: data.id}).catch(err => {
        Object.assign(this.tips, {isShow: true, text: err})
        this.setTips()
      })
      if (res.code === 200) {
        Object.assign(this.tips, {isShow: true, text: '取消订单成功！'})
        this.setTips()
        this.order_list.splice(index, 1)
        if (this.order_details.length === 0) {
          this.no_cont.show = 1
        }
      } else {
        Object.assign(this.tips, {isShow: true, text: res.message})
        this.setTips()
      }
    },
    go_pay (data) {
      this.select_order_id = data.id
      this.is_order = true
      this.make_order(data.id)
    },
    click_list (data) {
      if (this.is_click) {
        this.is_click = false
        this.rest_data()
        this.page_info.page_index = 1
        this.$store.commit('SET_ORDER_MENU', data.id)
        this.get_order()
      }
    },
    order_details (data) {
      this.$store.commit('SET_KEY_VALUE', {
        key: 'select_order_id',
        value: data.id
      })
      if (data.pay_status * 1 === 0 && data.status * 1 === 0) {
        this.$store.commit('SET_CHOOSE_GOODS', data)
        this.$router.push(`/pages/order/place_order?orderId=${data.id}&group_id=${data.group_id}`)
      } else {
        this.$router.push({ path: '/pages/order/details' })
      }
    },
    delete_order_val (data, index) {
      let that = this
      wx.showModal({
        title: '是否删除订单？',
        content: '删除之后将不会有该条订单',
        cancelColor: '#595959',
        confirmColor: '#d44950',
        success (res) {
          if (res.confirm) {
            that.delete_order(data, index)
          }
        }
      })
    },
    async delete_order (data, index) {
      let res = await delete_order({id: data.id}).catch(err => {
        Object.assign(this.tips, {isShow: true, text: err})
        this.setTips()
      })
      if (res.code === 200) {
        Object.assign(this.tips, {isShow: true, text: '删除订单成功！'})
        this.setTips()
        this.order_list.splice(index, 1)
        if (this.order_details.length === 0) {
          this.no_cont.show = 1
        }
      } else {
        Object.assign(this.tips, {isShow: true, text: res.message})
        this.setTips()
      }
    },
    async get_order () {
      let option = {
        page_index: this.page_info.page_index,
        status: this.cun
      }
      let res = await get_order(option).catch(err => {
        wx.hideLoading()
        this.is_click = true
        Object.assign(this.tips, {isShow: true, text: err})
        this.setTips()
      })
      if (res.code * 1 === 200) {
        wx.hideLoading()
        Object.assign(this.page_info, { total_count: Math.ceil(res.data.totalCount * 1 / res.data.pageSize * 1) })
        this.order_list = this.order_list.length === 0 ? res.data.result : this.order_list.concat(res.data.result)
        this.no_cont.show = res.data.result.length === 0 ? 1 : 0
        this.is_click = true
      } else {
        wx.hideLoading()
        this.is_click = true
        Object.assign(this.tips, {isShow: true, text: res.message})
        this.setTips()
      }
    },
    rest_data () {
      this.no_cont.show = false
      this.page_info = {
        page_index: 1,
        total_count: 0
      }
      this.tips.isShow = false
      this.is_show = 1
      this.order_list = []
      this.select_order_id = null
      this.is_click = false
    }
  },

  onPullDownRefresh () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.order_list = []
    this.page_info.page_index = 1
    this.get_order()
    wx.stopPullDownRefresh()
  },

  onReachBottom () {
    if (this.page_info.page_index < this.page_info.total_count) {
      this.page_info.page_index += 1
      this.get_order()
    }
  },

  beforeMount () {
    let query = wx.createSelectorQuery()
    let that = this
    query.select('#order_menu').boundingClientRect(function (rect) {
      that.menu_height = rect.height
    }).exec()
  },

  onLoad () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.get_order()
  },

  onUnload () {
    this.rest_data()
    this.is_click = true
  }
}
</script>

<style lang="scss" scoped>
  @import './../../style/order.scss';
</style>
