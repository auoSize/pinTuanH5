<template>
  <div class="container address-list">
    <nav-bar :navBar="navBar"/>
    <div class="lsit-content" :style="margin_top">
      <ul :class="isIphoneX ? 'iPhonex_padding_bottom' : ''">
        <li v-for="(item, index) in address_list" :key="index" @click.stop="go_details(item, index)" :class="cun == index ? 'active' : ''">
          <div class="default_address" >
            <img class="normal" src="/static/images/personal/selected.png" alt=""/>
            <img class="default" src="/static/images/personal/no-select.png" alt=""/>
          </div>
          <div class="address_content">
            <div class="name-phone">
              <div class="name">{{item.name}}</div>
              <div class="phone">{{item.phone}}</div>
            </div>
            <div class="address">{{item.province}}{{item.city}}{{item.zone}}{{item.detail}}</div>
          </div>
          <div class="arrow" @click.stop="edit(item)">
            <img src="/static/images/personal/edit.png" alt=""/>
          </div>
        </li>
      </ul>
      <no-content :no_cont="no_cont"/>
      <button :class="[ 'btn', 'add_address', isIphoneX ? 'iPhonex_bottom' : '']" @click="add">+ 新建收货地址</button>
    </div>
    <tips :tips="tips"/>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import user_info from '@/mixins/user_info'
import navBar from '@/components/nav_bar'
import noContent from '@/components/no_content'
import { address_list } from '@/api/index'
import tips from '@/components/tips'

export default {
  mixins: [user_info],
  data () {
    return {
      cun: null,
      navBar: {
        title: '收货地址',
        back_show: true
      },
      no_cont: {
        show: false,
        text: '暂无收货地址，快去添加吧'
      },
      tips: {
        isShow: false,
        text: ''
      },
      address_list: [],
      page_info: {
        page_index: 1,
        page_size: 10,
        total_count: 1
      },
      isTrue: true
    }
  },
  computed: {
    ...mapState({
      router_info: state => state.router_info,
      isIphoneX: state => state.isIphoneX,
      select_address_id: state => state.select_address_id
    })
  },
  components: {
    navBar,
    tips,
    noContent
  },
  methods: {
    go_details (item, index) {
      let that = this
      if (that.isTrue) {
        that.isTrue = false
        that.cun = index
        if (that.router_info.set_back) {
          that.$store.commit('SET_KEY_VALUE', {
            key: 'select_address',
            value: item
          })
          that.$store.commit('SET_ROUTER_INFO', {set_back: false})
          setTimeout(() => {
            that.$router.go(-1)
          }, 500)
        }
        that.isTrue = true
      }
    },
    add () {
      this.$store.commit('SET_KEY_VALUE', {
        key: 'edit_address',
        value: {id: 0}
      })
      this.$router.push('/pages/address/add')
    },
    edit (item) {
      this.$store.commit('SET_KEY_VALUE', {
        key: 'edit_address',
        value: item
      })
      this.$router.push('/pages/address/add')
    },
    async get_address_list () {
      let options = {
        page_index: this.page_info.page_index
      }
      let res = await address_list(options).catch(err => {
        wx.hideLoading()
        Object.assign(this.tips, {isShow: true, text: err})
        this.setTips()
      })
      if (res.code === 200) {
        wx.hideLoading()
        Object.assign(this.page_info, {total_count: res.data.totalCount * 1, page_size: res.data.page_size})
        this.address_list = res.data.result
        this.set_cun(res.data.result)
        this.no_cont.show = res.data.result.length === 0 ? 1 : 0
      } else {
        wx.hideLoading()
        Object.assign(this.tips, {isShow: true, text: res.message})
        this.setTips()
      }
    },
    set_cun (data) {
      data.map((item, index) => {
        if (this.router_info.set_back) {
          if (item.id * 1 === this.select_address_id * 1) {
            this.cun = index
          }
        } else {
          if (item.default * 1 === 1) {
            this.cun = index
          }
        }
      })
    },
    setTips () {
      let that = this
      that.tips.isShow = true
      setTimeout(() => {
        that.tips.isShow = false
      }, 2000)
    },
    rest_data () {
      this.address_list = []
      this.page_index = 1
      this.cun = null
      this.isTrue = true
      this.tips.isShow = false
      this.page_info = {
        page_index: 1,
        page_size: 10,
        total_count: 1
      }
    }
  },
  onReachBottom () {
    if (this.page_info.page_index < Math.ceil(this.page_info.total_count * 1 / this.page_info.page_size * 1)) {
      this.page_info.page_index += 1
      this.get_address_list()
    }
  },
  onLoad () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
  },
  onShow () {
    this.get_address_list()
  },
  onUnload () {
    this.rest_data()
  }
}
</script>
<style lang="scss" scoped>
@import './../../style/address.scss';
.personal_info{
  height: 100%;
  background: #ffffff;
}
</style>

