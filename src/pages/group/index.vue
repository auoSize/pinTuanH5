<template>
<div class="container order">
    <!-- <nav-bar :navBar="navBar"/> -->

    <div class="order_menu" id="order_menu" :style="{top: nav_height + 'px'}">
      <ul>
        <li v-for="(item, i) in group_menu" :key="i" 
        @click="click_list(item, i)"
        :class="cun === i ? 'active' : ''">
          {{item.name}}
          </li>
      </ul>
    </div>
    <div class="order_content" :style="{marginTop: nav_height + menu_height + 10 + 'px'}">
      <ul v-if="group_list.length > 0">
        <li v-for="(val, j) in group_list" :key="j" class="order_list" @click.stop="go_group_details(val)">
          <div class="title">
            <div class="title_name ellipsis">{{val.active_info.active_name}}</div>
            <div :class="val.group_detail.status_info.status * 1 == 0 ? 'title_status' : 'status_success'">
              {{val.group_detail.status_info.status_name}}
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
            <button @click.stop="go_group_details(val)">团详情</button>
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
// import navBar from '@/components/nav_bar'
import tips from '@/components/tips'
import noContent from '@/components/no_content'
import { my_group_list } from '@/api/index'

export default {
  data () {
    return {
      navBar: {
        title: '我的团',
        back_show: true
      },
      group_menu: [
        {
          id: 0,
          name: '全部'
        },
        {
          id: 1,
          name: '待成团'
        },
        {
          id: 2,
          name: '已成团'
        },
        {
          id: 3,
          name: '团购失败'
        }
      ],
      no_cont: {
        show: false,
        text: '暂无团'
      },
      group_list: [],
      page_info: {
        page_index: 1,
        total_count: 0
      },
      tips: {
        isShow: false,
        text: '恭喜您注册成功，马上开团！'
      },
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
      cun: state => state.group_menu
    })
  },

  components: {
    // navBar,
    tips,
    noContent
  },

  methods: {
    click_list (data, index) {
      if (this.is_click) {
        this.is_click = false
        this.rest_data()
        this.page_info.page_index = 1
        this.$store.commit('SET_KEY_VALUE', {
          key: 'group_menu',
          value: index
        })
        this.get_group()
      }
    },
    // 查看团详情
    go_group_details (item) {
      this.$store.commit('SET_KEY_VALUE', {
        key: 'share_info',
        value: {
          group_id: item.group_detail.group_id,
          cover: item.goods_info.pic[0].file_path
        }
      })
      this.$router.push(`/pages/group/details?id=${item.group_detail.group_id}`)
    },
    async get_group () {
      let option = {
        page_index: this.page_info.page_index,
        status: this.cun
      }
      let res = await my_group_list(option).catch(err => {
        wx.hideLoading()
        this.is_click = true
        Object.assign(this.tips, {isShow: true, text: err})
        this.setTips()
      })
      if (res.code * 1 === 200) {
        wx.hideLoading()
        Object.assign(this.page_info, { total_count: Math.ceil(res.data.totalCount * 1 / res.data.pageSize * 1) })
        this.group_list = this.group_list.length === 0 ? res.data.result : this.group_list.concat(res.data.result)
        this.no_cont.show = res.data.result.length === 0 ? 1 : 0
        this.is_click = true
      } else {
        wx.hideLoading()
        this.is_click = true
        Object.assign(this.tips, {isShow: true, text: res.message})
        this.setTips()
      }
    },
    setTips () {
      let that = this
      that.tips.isShow = true
      setTimeout(() => {
        that.tips.isShow = false
        that.is_send = true
      }, 1500)
    },
    rest_data () {
      this.no_cont.show = false
      this.page_info = {
        page_index: 1,
        total_count: 0
      }
      this.tips.isShow = false
      this.group_list = []
      this.select_order_id = null
      this.is_click = false
    }
  },

  onPullDownRefresh () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.group_list = []
    this.page_info.page_index = 1
    this.get_group()
    wx.stopPullDownRefresh()
  },

  onReachBottom () {
    if (this.page_info.page_index < this.page_info.total_count) {
      this.page_info.page_index += 1
      this.get_group()
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
    this.get_group()
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

