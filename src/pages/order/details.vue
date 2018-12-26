<template>
  <div class="container order_details">
    <nav-bar :navBar="navBar"/>
    <div class="order_details_content" :style="margin_top">

      <div class="header" v-if="order_details.user_info">
        <div class="heaer_info">
          <p>{{order_details.user_info.nickname}}  {{order_details.order_info.phone}}</p>
        </div>
        <div class="order_details_avatar">
          <div class="order_details_avatar_img">
            <!-- <open-data class="userinfo-avatar-img" type="userAvatarUrl"></open-data> -->
            <img class="userinfo-avatar-img" :src="order_details.user_info.avatar" alt=""/>
          </div>
        </div>
      </div>

      <div class="order_details_info" v-if="order_details.goods_info">
        <div class="order_img">
          <img :src="order_details.goods_info.pic[0].file_path" alt=""/>
        </div>
        <div class="oder_info">
          <div class="order_info_name text-overflow-two">{{order_details.goods_info.name}}</div>
          <div class="order_info_price">拼团价:<span class="price_left">￥</span><span class="number">{{order_details.order_goods_info.price}}</span>
          </div>
          <div class="order_info_origin_price"><span>单买价:</span><span class="number price_left">￥{{order_details.goods_info.price}}</span></div>
        </div>
      </div>

      <div class="segmenting_line" v-if="order_details.goods_info">
        <div class="semicircle semicircle_left"></div>
        <div class="content"></div>
        <div class="semicircle semicircle_right"></div>
      </div>

      <div class="order_details_code" v-if="order_details.card_detail_info && order_details.card_detail_info.card_number">
        <div class="code_title">取票二维码</div>
        <div class="term_validity">有效期： {{order_details.card_detail_info.validate_time}}</div>
        <div class="code_img">
          <!-- <img :src="order.code_img" alt=""/> -->
          <canvas class='my_canvas' canvas-id='canvas'></canvas>
        </div>
        <div class="serial_number">序列号： <span>{{order_details.card_detail_info.card_number}}</span>
        </div>
        <div class="prompt">凭二维码取票更方便，请现场联系工作人员取票</div>
      </div>
     
    </div>

    <div class="order_details_notes" v-if="order_details">
       <collage-notes :notes="order_details.show_info" isOrder="true"/>
    </div>

    <error-back v-if="err_text && err_text !== ''" :text="err_text"/>
    
    <tips :tips="tips"/>
  </div>
</template>

<script>
import collageNotes from '@/components/collage_notes'
import navBar from '@/components/nav_bar'
import tips from '@/components/tips'
import errorBack from '@/components/error_back'
import { mapState } from 'vuex'
import { order_detail } from '@/api/index'
let QRCode = require('../../../static/weapp-qrcode.js')

export default {
  data () {
    return {
      navBar: {
        title: '订单详情',
        back_show: true
      },
      order_details: {},
      tips: {
        isShow: false,
        text: ''
      },
      qrcode: null,
      err_text: ''
    }
  },
  onLoad () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.get_order_details()
    this.set_canvas_code()
  },
  onUnload () {
    this.rest_data()
  },
  methods: {
    async get_order_details () {
      let res = await order_detail({id: this.select_order_id}).catch(err => {
        if (err === '活动不存在') {
          this.err_text = err
        }
        wx.hideLoading()
        Object.assign(this.tips, {isShow: true, text: err})
        this.setTips()
      })
      if (res.code === 200) {
        this.order_details = res.data
        let numbers = res.data.card_detail_info.card_number || 'www.baidu.com'
        this.qrcode.makeCode(numbers)
        setTimeout(() => {
          wx.hideLoading()
        }, 1000)
      } else {
        wx.hideLoading()
        Object.assign(this.tips, {isShow: true, text: res.message})
        this.setTips()
      }
    },
    setTips () {
      let that = this
      that.tips.isShow = true
      setTimeout(() => {
        that.tips.isShow = false
      }, 2000)
    },
    set_canvas_code () {
      this.qrcode = new QRCode('canvas', {
        text: '',
        width: 150,
        height: 150,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
    },
    rest_data () {
      this.order_details = {}
      this.tips.isShow = false
      this.qrcode = null
      this.err_text = ''
    }
  },
  computed: {
    ...mapState({
      margin_top: state => state.nav_bar.margin_top,
      select_order_id: state => state.select_order_id
    })
  },
  components: {
    collageNotes,
    navBar,
    tips,
    errorBack
  }
}
</script>

<style lang="scss" scoped>
  @import './../../style/order.scss';
</style>
