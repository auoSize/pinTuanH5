<template>
  <div class="container index">
    <p>index</p>
    <div class="container-content" :style="margin_top">
      <div class="index-container" v-if="!authSetting">
        <ul class="goods-list" v-if="goods_list && goods_list.length !== 0">
          <li v-for="(item, index) in goods_list" :key="index" @click.stop="activity_details(item)">
            <div class="cover_img">
              <img :src="item.pic" alt="" mode="aspectFill"/>
            </div>
            <div class="goods-content">
              <div class="title">
                {{item.active_name}}
                <div class="max_number">{{item.person_num}}人拼团</div>
              </div>
              <div class="describe">{{item.sell_description}}</div>
              <div class="goods_price_operation">
                <div class="price">
                  <span class="price_bold">￥</span>{{item.active_price}}
                  <span class="original_price">￥{{item.goods_price}}</span>
                </div>
                <div class="operation">
                  <form :report-submit="true" @submit="formSubmit" class="from_id_class">
                    <button form-type="submit" @click.stop="start_group(item)">立即开团</button>
                  </form>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <no-content :no_cont="no_cont"/>
      </div>
    </div>
    <tips :tips="tips"/>
  </div>
</template>

<script>
import userInfo from '@/mixins/user_info'
import { mapState } from 'vuex'
import tips from '@/components/tips'
import noContent from '@/components/no_content'
import { activity } from '@/api/index'

export default {
  data () {
    return {
      no_cont: {
        show: false,
        text: '暂时没有活动'
      },
      goods_list: [],
      tips: {
        isShow: false,
        text: '恭喜您注册成功，马上开团！'
      },
      page_info: {
        page_index: 1,
        page_size: 10,
        total_count: 0
      }
    }
  },

  mixins: [userInfo],

  computed: {
    ...mapState({
      token: state => state.token,
      token_state: state => state.token_state,
      isSend: state => state.isSend,
      authSetting: state => state.authSetting
    })
  },

  components: {
    tips,
    noContent
  },

  methods: {
    setTips () {
      let that = this
      that.tips.isShow = true
      setTimeout(() => {
        that.tips.isShow = false
      }, 2000)
    },
    // 开团
    start_group (item) {
      this.$store.commit('SET_KEY_VALUE', {
        key: 'select_goods',
        value: item
      })
      this.$router.push('/pages/index/details')
    },
    activity_details  (itme) {
      this.start_group(itme)
    },
    // 获取活动列表
    async get_activity () {
      this.$loading('加载中...')
      let opstions = {
        page_index: this.page_info.page_index,
        status: 0
      }
      let res = await activity(opstions).catch(err => {
        this.$loading.close()
        if (err === '用户未登录') {
          this.$router.push('/pages/authorize/index')
        } else {
          Object.assign(this.tips, {isShow: true, text: err})
          this.setTips()
        }
      })
      if (res.code === 200) {
        this.$loading.close()
        Object.assign(this.page_info, { total_count: Math.ceil(res.data.totalCount * 1 / res.data.pageSize * 1) })
        this.goods_list = this.goods_list.length === 0 ? res.data.result : this.goods_list.concat(res.data.result)
        this.no_cont.show = res.data.result.length === 0 ? 1 : 0
      } else {
        this.$loading.close()
        Object.assign(this.tips, {isShow: true, text: res.message})
        this.setTips()
      }
    },
    refresh () {
      this.goods_list = []
      this.page_info.page_index = 1
      this.get_activity()
      // wx.stopPullDownRefresh()
    },
    loadmore () {
      if (this.page_info.page_index < Math.ceil(this.page_info.totalCount * 1 / this.page_info.pageSize * 1)) {
        this.page_info.page_index += 1
        this.get_activity()
      }
    },
    rest_data () {
      this.no_cont.show = false
      this.tips.isShow = false
      this.goods_list = []
      this.page_info = {
        page_index: 1
      }
    }
  },

  onPullDownRefresh () {
    this.refresh()
  },

  onReachBottom () {
    this.loadmore()
  },

  onLoad () {
    // if (this.token_state) {
    //   this.get_activity()
    // }
    if (this.token) {
      this.get_activity()
    }
  },

  watch: {
    // token_state () {
    //   this.get_activity()
    // },
    token () {
      this.get_activity()
    }
  },

  onUnload () {
    this.rest_data()
  },

  onShareAppMessage () {
    let path = '/pages/index/index'
    return {
      title: '不二拼团',
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
  @import '../../style/index.scss';
   .power_attorney{
     width: 100%;
     height: 100%;
     background: rgba(0, 0, 0, .3);
     position: fixed;
     z-index: 99;
    .attorney_button{
      width: 256px;
      height: 72px;
      position: absolute;
      left: 50%;
      top: 45%;
      margin-left: - 128px;
      line-height: 72px;
      text-align: center;
      font-size: 34px;
      color: #FFFFFF;
      background: #FF4D20;
    }
  }
</style>
