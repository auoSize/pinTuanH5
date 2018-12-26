<template>
  <div class="tips animated fadeInUp" v-show="tips.isShow">
    <div class="tips_text">{{tips.text}}</div>
    <div v-show="tips.mask" class="tips_mask"></div>
  </div>
</template>

<script>
export default {
  props: ['tips'],
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  @import './../style/compoments.scss';
</style>

