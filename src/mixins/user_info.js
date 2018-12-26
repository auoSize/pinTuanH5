import { mapState } from 'vuex'
import { add_form_id } from '@/api/index'
export default {
  data () {
    return {
    }
  },

  computed: {
    ...mapState({
      margin_top: state => state.nav_bar.margin_top,
      user_info: state => state.user_info,
      avatar: state => state.user_info.avatarUrl,
      nickname: state => state.user_info.nickname,
      appid: state => state.appid
    })
  },

  methods: {
    async formSubmit (e) {
      let formId = e.mp.detail.formId
      console.log(formId)
      await add_form_id({
        form_id: formId,
        appId: this.appid
      }).catch(err => {
        Object.assign(this.tips, {isShow: true, text: err})
        this.setTips()
      })
    }
  }
}
