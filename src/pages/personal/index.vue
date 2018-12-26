<template>
  <div class="container persoan">
    <nav-bar :navBar="navBar"/>
    <div class="persoan_head" @click="edit_info" :style="margin_top">
      <div class="avatar">
         <open-data class="userinfo-avatar-img" type="userAvatarUrl"></open-data>
      </div>
      <div class="name">编辑个人资料</div>
      <div class="arrow-right">
        <img src="/static/images/personal/address-arrow.png" alt=""/>
      </div>
    </div>
    <div class="personal_order">
      <div class="order_title" @click="check_order(0)">
        <div class="title_name bold">我的订单</div>
        <div class="other">查看全部订单<img src="/static/images/personal/arrow-right.png" alt="查看全部订单"/></div>
      </div>
      <div class="order_menu">
        <ul>
          <li v-for="(item, i) in order_menu"
          :style="{marginLeft: i > 0 ? '70rpx' : ''}"
          :key="i" 
          :class="item.className"
           @click="check_order(item.status)">
            <div class="icon">
              <img :src="item.icon" :alt="item.name"/>
            </div>
            <div class="text">{{item.name}}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="personal_order">
      <div class="order_title" @click="check_group(0)">
        <div class="title_name bold">我的团</div>
        <div class="other">全部团购<img src="/static/images/personal/arrow-right.png" alt="查看全部订单"/></div>
      </div>
      <div class="order_menu">
        <ul>
          <li v-for="(item, i) in group_menu" 
          :style="{marginLeft: i > 0 ? '70rpx' : ''}"
          :key="i" 
          :class="item.className" 
          @click="check_group(item.status)">
            <div class="icon">
              <img :src="item.icon" :alt="item.name"/>
            </div>
            <div class="text">{{item.name}}</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- <div class="pay_record" @click="go_payment_record">
      <div class="text">支付记录</div>
      <div class="icon"><img src="/static/images/public/arrow-right.png" alt=""/></div>
    </div> -->
  </div>
</template>

<script>
import userInfo from '@/mixins/user_info'
import navBar from '@/components/nav_bar'

export default {
  data () {
    return {
      navBar: {
        title: '个人中心',
        back_show: false
      },
      order_menu: [
        {
          id: 1,
          name: '待支付',
          icon: '/static/images/personal/personal_pay.png',
          status: 1,
          className: 'personal_pay'
        },
        {
          id: 2,
          name: '已支付',
          icon: '/static/images/personal/personal_received.png',
          status: 2,
          className: 'personal_received'
        },
        {
          id: 3,
          name: '待发货',
          icon: '/static/images/personal/personal_received_goods.png',
          status: 3,
          className: 'personal_received_goods'
        },
        {
          id: 4,
          name: '已发货',
          icon: '/static/images/personal/personal_already.png',
          status: 4,
          className: 'personal_already'
        },
        {
          id: 5,
          name: '已完成',
          icon: '/static/images/personal/completed.png',
          status: 5,
          className: 'completed'
        }
      ],
      group_menu: [
        {
          id: 1,
          name: '待成团',
          icon: '/static/images/personal/remain_group.png',
          status: 1,
          className: 'completed'
        },
        {
          id: 2,
          name: '已成团',
          icon: '/static/images/personal/completed.png',
          status: 2,
          className: 'completed'
        },
        {
          id: 3,
          name: '团购失败',
          icon: '/static/images/personal/group_fail.png',
          status: 3,
          className: 'completed'
        }
      ]
    }
  },
  components: {
    navBar
  },
  mixins: [userInfo],
  methods: {
    check_order (data) {
      this.$store.commit('SET_ORDER_MENU', data)
      this.$router.push({ path: '/pages/order/index' })
    },
    check_group (data) {
      this.$store.commit('SET_KEY_VALUE', {
        key: 'group_menu',
        value: data
      })
      this.$router.push({ path: '/pages/group/index' })
    },
    edit_info () {
      this.$store.commit('SET_ROUTER_INFO', {set_back: false})
      setTimeout(() => {
        this.$router.push('/pages/address/index')
      }, 500)
    },
    go_payment_record () {
      this.$router.push({ path: '/pages/personal/payment_record' })
    }
  },
  beforeMount () {
    Object.assign(this.navBar, { title: this.user_info.nickName })
  }
}
</script>

<style lang="scss" scoped>
  @import './../../style/personal.scss';
</style>
