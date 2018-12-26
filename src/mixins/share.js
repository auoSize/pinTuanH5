import { mapState } from 'vuex'

export default {
  data () {
    return {
      id: 0,
      group_id: 0,
      isShare: 0,
      activityId: 0
    }
  },

  computed: {
    ...mapState({
      share_info: state => state.share_info
    })
  },

  onShareAppMessage: function () {
    let that = this
    let path
    let title = that.share_info.title
    let shareId = 1
    if (that.share_info.status * 1 === 0) {
      path = `/pages/group/details?id=${that.group_id}&activity_id=${that.activity_id}&shareId=${shareId}`
    } else {
      title = '不二拼团'
      path = '/pages/index/index'
    }
    return {
      title,
      path,
      // imageUrl: that.share_info.cover,
      success: res => {
        Object.assign(this.tips, {isShow: true, text: '邀请成功'})
        this.setTips()
      },
      fail: res => {
        Object.assign(this.tips, {isShow: true, text: '邀请失败，请稍后重试'})
        this.setTips()
      }
    }
  },

  methods: {
  },

  onShow () {
    this.isShare = this.$root.$mp.query.shareId * 1
    this.group_id = this.$root.$mp.query.id || this.$store.state.share_info.group_id
    this.activityId = this.$root.$mp.query.activity_id || this.$store.state.activity_id
    if (this.isShare && this.isShare === 1) {
      this.navBar.back_show = false
    } else {
      this.navBar.back_show = true
    }
  }
}
