<template>
  <div class="container payment_record">
    <nav-bar :navBar="navBar"/>
    <ul class="payment_record_head" @click="edit_info" :style="margin_top">
      <li v-for="(item, index) in payment_list" :key="index">
        <div class="pay_status">{{item.status === 1 ? '支付成功' : '支付失败'}}</div>
        <div class="pay_info">
          <div class="tiem">{{item.time}}</div>
          <div class="price">- {{item.amount_money}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import userInfo from '@/mixins/user_info'
import navBar from '@/components/nav_bar'

export default {
  data () {
    return {
      navBar: {
        title: '支付记录',
        back_show: true
      },
      payment_list: [
        {
          id: 0,
          status: 1,
          amount_money: '5.00',
          time: '2018-11-14 14:00:03'
        },
        {
          id: 1,
          status: 0,
          amount_money: '5.00',
          time: '2018-11-14 14:00:03'
        }
      ]
    }
  },
  components: {
    navBar
  },
  mixins: [userInfo],
  onLoad () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  @import './../../style/personal.scss';
</style>
