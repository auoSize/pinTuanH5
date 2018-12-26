<template>
  <div class="no_goods" v-if="no_cont.show || no_cont.show  == 1" :style="{height: height + 'px'}">
    <div class="no_goods_img">
      <img src="/static/images/public/no-activity.png" alt=""/>
    </div>
    <div class="no_goods_text">{{no_cont.text}}</div>
  </div>
</template>

<script>
export default {
  props: ['no_cont'],
  data () {
    return {
      height: wx.getSystemInfoSync().screenHeight
    }
  },
  onUnload () {
    this.no_cont.show = 0
  },
  watch: {
    no_cont: {
      immediate: true,
      handler: (val) => {
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './../style/compoments.scss';
</style>

