<template>
  <div class="container place_order">
    <nav-bar :navBar="navBar"/>
    <div class="place_order_content" :style="margin_top">
        <div class="receiving_address" @click="edit_adders">
          <div class="address_content">
             <div class="address_icon" v-if="select_address || order_address">
              <img src="/static/images/personal/address.png" alt=""/>
            </div>
            <div class="address_cont" v-if="orderId">
                <div class="name_phone" v-if="order_address">
                  <div class="name">
                    <span class="name_text">{{order_address.user_name}}</span>
                    <span>{{order_address.phone}}</span>
                  </div>
                  <div class="address" v-if="orderId">{{order_address.address}}</div>
                </div>
                <div v-else class="address_none">
                  <span class="name">暂无相关信息</span>
                  <span class="phone">请在此填写地址和手机号等方便我们联系</span>
                </div>
            </div>
            <div class="address_cont" v-else>
                <div class="name_phone" v-if="select_address && select_address !== false">
                  <div class="name">
                    <span class="name_text">{{select_address.name}}</span>
                    <span>{{select_address.phone}}</span>
                  </div>
                  <div class="address">{{select_address.province}}{{select_address.city}}{{select_address.zone}}{{select_address.detail}}</div>
                </div>
                <div v-else class="address_none">
                  <span class="name">暂无相关信息</span>
                  <span class="phone">请在此填写地址和手机号等方便我们联系</span>
                </div>
            </div>
            <div class="arrow">
              <img src="/static/images/personal/address-arrow.png" alt=""/>
            </div>
          </div>
          <div class="stamp-line">
            <img src="/static/images/personal/stamp-line.png" alt=""/> 
          </div>
        </div>

        <div class="order_list goods_info" v-if="choose_goods.goods_info">
          <div class="title">
            <div class="title_name ellipsis">{{choose_goods.goods_info.name}}</div>
          </div>
          <div class="content">
            <div class="order_img">
                <img :src="choose_goods.goods_info.pic[0].file_path" alt=""/>
            </div>
            <div class="order_info">
              <div class="order_name">{{choose_goods.goods_info.name}}</div>
               <!-- <div class="type">门票</div> -->
              <div class="order_number_price">
                <div class="order_price" v-if="choose_goods.active_info && choose_goods.active_info.price">￥{{choose_goods.active_info.price}}</div>
                <div class="order_price" v-else>￥{{choose_goods.price}}</div>
                <div class="order_number">X1</div>
              </div>
            </div>
          </div>
          <div class="select_number">
            <div class="text">购买数量</div>
            <div class="select">
              <span class="reduce">-</span>
              <span class="input"><input type="text" value="1"/></span>
              <span class="add">+</span>
            </div>
          </div>
        </div>

        <div :class="['order_operation', isIphoneX ? 'fixX' : '']">
          <div class="total" v-if="choose_goods">
            <span v-if="choose_goods.active_info && choose_goods.active_info.price">￥{{choose_goods.active_info.price}}</span>
            <span v-else>￥{{choose_goods.price}}</span>
          </div>
          <div class="send_button" v-if="orderId" @click="go_pay_order">
             <button>去支付</button>
          </div>
          <div class="send_button" v-else @click="send_order">
             <button>提交订单</button>
          </div>
        </div>
    </div>
    <tips :tips="tips"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import wxPayment from '@/mixins/wx_payment'
import navBar from '@/components/nav_bar'
import tips from '@/components/tips'
import { address_list, order_detail } from '@/api/index'

export default {
  data () {
    return {
      navBar: {
        title: '确认订单',
        back_show: true
      },
      tips: {
        isShow: false,
        text: '请填写收货地址',
        mask: false
      },
      orderId: null,
      order_address: null,
      group_id: 0,
      is_pay: false
    }
  },

  mixins: [wxPayment],

  computed: {
    ...mapState({
      margin_top: state => state.nav_bar.margin_top,
      appid: state => state.appid,
      choose_goods: state => state.choose_goods,
      select_group: state => state.select_group,
      join_group_data: state => state.join_group,
      isIphoneX: state => state.isIphoneX,
      select_address: state => state.select_address
    })
  },

  components: {
    navBar,
    tips
  },

  methods: {
    edit_adders () {
      if (!this.orderId || this.orderId === null || this.orderId === undefined || this.orderId === '') {
        if (this.select_address === false) {
          this.$store.commit('SET_KEY_VALUE', {
            key: 'edit_address',
            value: {id: 0}
          })
          this.$store.commit('SET_KEY_VALUE', {
            key: 'select_address_id',
            value: 0
          })
          this.$store.commit('SET_ROUTER_INFO', {set_back: true})
          this.$router.push('/pages/address/add')
        } else {
          this.$store.commit('SET_KEY_VALUE', {
            key: 'select_address_id',
            value: this.select_address.id
          })
          this.$store.commit('SET_ROUTER_INFO', {set_back: true})
          this.$router.push('/pages/address/index')
        }
      }
    },
    // 创团or加入 提交订单
    send_order () {
      if (this.is_send) {
        this.is_send = false
        if (this.select_address) {
          if (this.is_pay) {
            this.place_order()
          } else {
            if (this.select_group.status === 1) {
              this.join_group()
            } else {
              this.open_group()
            }
          }
        } else {
          Object.assign(this.tips, {isShow: true, text: '请完善地址'})
          this.setTips()
        }
      }
    },
    // 待支付订单支付
    go_pay_order () {
      if (this.is_send) {
        this.is_send = false
        if (this.order_address) {
          this.is_order = false
          this.make_order(this.orderId)
        } else {
          Object.assign(this.tips, {isShow: true, text: '请完善地址'})
          this.setTips()
        }
      }
    },
    // 创团 or 加团 获取地址
    async get_address_list () {
      let options = {
        page_index: 1
      }
      let res = await address_list(options).catch(err => {
        wx.hideLoading()
        Object.assign(this.tips, {isShow: true, text: err})
        this.setTips()
      })
      if (res.code === 200) {
        wx.hideLoading()
        if (res.data.result.length === 0) {
          this.$store.commit('SET_KEY_VALUE', {
            key: 'select_address',
            value: false
          })
          this.select_address = false
        } else {
          res.data.result.map((item) => {
            if (item.default * 1 === 1) {
              this.$store.commit('SET_KEY_VALUE', {
                key: 'select_address',
                value: item
              })
              this.select_address = item
            } else {
              this.$store.commit('SET_KEY_VALUE', {
                key: 'select_address',
                value: res.data.result[0]
              })
              this.select_address = res.data.result[0]
            }
          })
        }
      } else {
        wx.hideLoading()
        Object.assign(this.tips, {isShow: true, text: res.message})
        this.setTips()
      }
    },
    // 支付订单 获取地址
    async get_order_details (data) {
      let res = await order_detail({id: data}).catch(err => {
        wx.hideLoading()
        Object.assign(this.tips, {isShow: true, text: err})
        this.setTips()
      })
      if (res.code === 200) {
        this.order_address = res.data.order_info
      } else {
        wx.hideLoading()
        Object.assign(this.tips, {isShow: true, text: res.message})
        this.setTips()
      }
    },
    rest_data () {
      this.tips.isShow = false
      this.orderId = null
      this.select_address = null
      this.order_address = null
      this.group_id = 0
      this.is_pay = false
      this.$store.commit('SET_KEY_VALUE', {
        key: 'select_address',
        value: null
      })
    }
  },

  onLoad () {
    this.rest_data()
    let that = this
    that.orderId = this.$root.$mp.query.orderId
    that.group_id = this.$root.$mp.query.group_id
    if (that.orderId) {
      this.get_order_details(that.orderId)
    } else {
      this.get_address_list()
    }
  },

  onUnload () {
    this.rest_data()
  }
}
</script>

<style lang="scss" scoped>
  @import './../../style/order.scss';
</style>
