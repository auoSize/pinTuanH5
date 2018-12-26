import { mapState } from 'vuex'
import { create_group, join_group, get_order_status, make_order } from '@/api/index'

export default {
  data () {
    return {
      payment_info: {},
      is_send: true,
      is_order: false
    }
  },

  computed: {
    ...mapState({
      appid: state => state.appid,
      select_group: state => state.select_group,
      join_group_data: state => state.join_group
    })
  },

  methods: {
    // 加团
    async join_group () {
      let res = await join_group({ group_id: this.join_group_data.group_id, contact_id: this.select_address.id, appId: this.appid }).catch(err => {
        Object.assign(this.tips, {isShow: true, text: err})
        this.setTips()
      })
      if (res.code === 200) {
        if (res.data.status * 1 === 1) {
          this.payment_info = res.data
          this.group_id = this.join_group_data.group_id
          this.place_order()
        } else {
          Object.assign(this.tips, {isShow: true, text: '加入团失败，请稍后再试'})
          this.setTips()
        }
      } else {
        Object.assign(this.tips, {isShow: true, text: res.message})
        this.setTips()
      }
    },
    // 开团
    async open_group () {
      let res = await create_group({ active_id: this.select_group.active_id, contact_id: this.select_address.id, appId: this.appid }).catch(err => {
        Object.assign(this.tips, {isShow: true, text: err})
        this.setTips()
      })
      if (res.code === 200) {
        if (res.data.status * 1 === 1) {
          this.payment_info = res.data
          this.group_id = res.data.id
          this.place_order()
        } else {
          Object.assign(this.tips, {isShow: true, text: '开团失败，请稍后再试'})
          this.setTips()
        }
      } else {
        Object.assign(this.tips, {isShow: true, text: res.message})
        this.setTips()
      }
    },
    // 待支付 - 支付
    async make_order (data) {
      let res = await make_order({orderId: data, appId: this.appid}).catch(err => {
        Object.assign(this.tips, {isShow: true, text: err})
        this.setTips()
      })
      if (res.code === 200) {
        this.payment_info = res.data
        Object.assign(this.payment_info, {order_id: data})
        this.place_order()
      } else {
        if (!this.is_order) {
          Object.assign(this.tips, {isShow: true, text: res.message})
          this.setTips()
        }
      }
    },
    place_order () {
      let that = this
      if (that.payment_info.need_wx_pay * 1 === 0) {
        that.is_send = true
        that.get_order_status()
      } else {
        wx.requestPayment({
          timeStamp: that.payment_info.timeStamp,
          nonceStr: that.payment_info.nonceStr,
          package: that.payment_info.package,
          signType: that.payment_info.signType,
          paySign: that.payment_info.paySign,
          success: res => {
            that.is_pay = false
            that.is_send = true
            that.get_order_status()
          },
          fail: res => {
            that.is_pay = true
            if (!that.is_order) {
              Object.assign(that.tips, {isShow: true, text: '支付失败，请重新支付', mask: true})
              that.setTips()
            }
          }
        })
      }
    },
    // 获取订单状态
    async get_order_status () {
      let res = await get_order_status({
        orderId: this.payment_info.order_id || this.orderId
      }).catch(err => {
        Object.assign(this.tips, {isShow: true, text: err})
        this.setTips()
      })
      if (res.code === 200) {
        if (res.data.pay_status * 1 === 1) {
          if (!this.is_order) {
            Object.assign(this.tips, {isShow: true, text: '支付成功', mask: true})
            this.setTips()
          }
          if (this.is_order) {
            this.order_list = []
            this.page_info.page_index = 1
            setTimeout(() => {
              this.get_order()
            }, 2000)
          } else {
            setTimeout(() => {
              this.$router.push(`/pages/group/details?pay_status=${res.data.pay_status}&id=${this.group_id}`)
            }, 2000)
          }
        } else {
          if (!this.is_order) {
            Object.assign(this.tips, {isShow: true, text: '支付失败'})
            this.setTips()
          }
        }
      } else {
        if (!this.is_order) {
          Object.assign(this.tips, {isShow: true, text: res.message})
          this.setTips()
        }
      }
    },
    setTips () {
      let that = this
      that.tips.isShow = true
      setTimeout(() => {
        that.tips.isShow = false
        that.is_send = true
        this.tips.mask = false
      }, 1500)
    },
    rest_data () {
      this.is_send = true
      this.is_order = false
      this.payment_info = {}
      this.is_pay = false
    }
  },

  onUnload () {
    this.rest_data()
  }
}
