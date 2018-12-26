<template>
  <div :class="['count_down_content', countDown.bg_color == '#959595' ? 'group_count_down' : '']">
    活动还有 
    <span><span class="times" :style="{background: countDown.bg_color, color: countDown.count_color}" v-if="day_show">{{day}}</span> : </span>
    <span><span class="times" :style="{background: countDown.bg_color, color: countDown.count_color}">{{hour}}</span> : </span>
    <span><span class="times" :style="{background: countDown.bg_color, color: countDown.count_color}">{{minute}}</span> : </span>
    <span class="times" :style="{background: countDown.bg_color, color: countDown.count_color}">{{second}}</span> {{countDown.bg_color == '#959595' ? '自动结束' : '结束'}}
  </div>
</template>

<script>
export default {
  props: {
    countDown: {
      type: Object,
      defaule: {
        end_time: 0,
        now_tiem: 0,
        count_color: '#fff',
        bg_color: '#1A1A1A'
      }
    }
  },
  data () {
    return {
      timer: null,
      day: '00',
      hour: '00',
      minute: '00',
      second: '00',
      down_times: '',
      day_show: true
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
      that.timer = setInterval(() => {
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
        if (day <= 0) {
          that.day_show = false
        }
        if (times <= 0) {
          clearInterval(that.timer)
          that.day = '00'
          that.hour = '00'
          that.minute = '00'
          that.second = '00'
          that.day_show = false
          that.$emit('active_end_event')
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
  @import './../style/compoments.scss';
</style>

