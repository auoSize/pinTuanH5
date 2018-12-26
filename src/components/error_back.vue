<template>
  <div class="err_content">
    <div class="err_title">{{text}}</div>
    <div class="err_count"><span>{{times}}</span>s后将返回上一步</div>
  </div>
</template>

<script>
export default {
  props: ['text'],
  data () {
    return {
      times: 5,
      times_fun: null
    }
  },

  onLoad () {
    this.count_down()
  },

  methods: {
    count_down () {
      this.times_fun = setInterval(() => {
        this.times--
        if (this.times <= 0) {
          clearInterval(this.times_fun)
          this.back()
        }
      }, 1000)
    },
    back () {
      this.$router.back()
    }
  },

  onHide () {
    clearInterval(this.times_fun)
  },

  onUnload () {
    this.times = 5
  }
}
</script>

<style lang="scss" scoped>
.err_content{
  text-align: center;
  margin-top: 350px;
  .err_title{
    font-size: 30px;
    color: #1A1A1A;
    letter-spacing: 0;
    text-align: center;
    margin-bottom: 10px;
  }
  .err_count{
    font-size: 24px;
    color: #ACACAC;
    letter-spacing: 0;
    text-align: center;
  }
}
</style>
