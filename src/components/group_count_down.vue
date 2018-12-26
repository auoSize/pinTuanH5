<template>
  <div class="join_group_down">
    <span v-if="day > 0">{{day}}天</span><span>{{hour}}时</span><span>{{minute}}分</span><span>{{second}}秒</span>
  </div>
</template>

<script>
export default {
  props: {
    countDown: {
      type: Object,
      defaule: {
        id: 0,
        end_time: 0,
        now_tiem: 0
      }
    }
  },
  data () {
    return {
      timer_out: null,
      day: '00',
      hour: '00',
      minute: '00',
      second: '00',
      down_times: ''
    }
  },
  onLoad () {
    this.count_down_start()
  },
  methods: {
    count_down_start () {
      let that = this
      let times = this.countDown.end_time * 1 - this.countDown.now_time * 1
      let day, hour, minute, second
      that.timer_out = setInterval(() => {
        if (times > 0) {
          day = Math.floor(times / (60 * 60 * 24))
          hour = Math.floor(times / (60 * 60)) - (day * 24)
          minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60)
          second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
        }
        that.day = that.time_format(day)
        that.hour = that.time_format(hour)
        that.minute = that.time_format(minute)
        that.second = that.time_format(second)
        times--
        if (times <= 0) {
          clearInterval(that.timer_out)
          that.day = '00'
          that.hour = '00'
          that.minute = '00'
          that.second = '00'
          this.$emit('tiem_end_event', this.countDown.id)
        }
      }, 1000)
    },
    time_format (param) {
      return param < 10 ? '0' + param : param
    }
  }
}
</script>

<style lang="scss" scoped>
  .join_group_down{
    display:inline-block;
    font-size: 22px;
    color: #7D7D7D;
    span{
      display:inline-block;
      text-align: center;
      font-size: 22px;
      color: #7D7D7D;
      letter-spacing:4px;
    }
  }
</style>

