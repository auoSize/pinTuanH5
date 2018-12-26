import { add_view } from '@/api/index'

export default {
  data () {
    return {}
  },
  methods: {
    async goods_count (options) {
      let res = await add_view(options)
      if (res.code === 200) {
      }
    }
  }
}
