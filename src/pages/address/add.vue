<template>
  <div class="container add">
    <nav-bar :navBar="navBar"/>
    <div class="ovh" :style="margin_top">
      <div class="from_content">
        <!-- <div class="other border_bottom">
          <div class="form_name">
            <div class="from_group border_bottom">
              <input v-model="name" maxlength="25" placeholder-style="color: #cccccc;" placeholder-class="input-placeholder" placeholder="姓名" type="text"/>
              <div v-if="name_tips.show" class="err_tips">{{name_tips.text}}</div>
            </div>
            <div class="from_group">
              <input v-model="phone" maxlength="11" placeholder-style="color: #cccccc;" placeholder-class="input-placeholder" placeholder="手机号码" type="number"/>
              <div v-if="phone_tips.show" class="err_tips">{{phone_tips.text}}</div>
            </div>
          </div>
          <div class="phone_icon" @click="get_contacts">
            <img src="/static/images/personal/select-contacts.png" alt=""/>
            <div>选联系人</div>
          </div>
        </div> -->
        <div class="from_group border_bottom">
              <input v-model="name" maxlength="25" placeholder-style="color: #cccccc;" placeholder-class="input-placeholder" placeholder="姓名" type="text"/>
              <div v-if="name_tips.show" class="err_tips">{{name_tips.text}}</div>
        </div>
        <div class="from_group border_bottom">
          <input v-model="phone" maxlength="11" placeholder-style="color: #cccccc;" placeholder-class="input-placeholder" placeholder="手机号码" type="number"/>
          <div v-if="phone_tips.show" class="err_tips">{{phone_tips.text}}</div>
        </div>
        <!-- <div class="from_code border_bottom">
          <div class="from_group form_name">
            <input v-model="code" placeholder-style="color: #cccccc;" placeholder="手机验证码" placeholder-class="input-placeholder" type="text"/>
            <div v-if="code_tips.show" class="err_tips">{{code_tips.text}}</div>                  
          </div>
           <div :class="['send_code', code_show ? 'normal' : '']" @click="get_code">{{code_down}}</div>
        </div> -->
        <div class="from_group border_bottom">
          <picker class="weui-btn" mode="region" :value="region" @change="CityChange">
            <div :class="['fake-intput', region&&region.length ? '' : 'p-class']">{{computedRegion}}</div>
            <div class="region_arrow">
              <img src="/static/images/process_arrow.png" alt=""/>
            </div>
          </picker>
          <div v-if="region_tips.show" class="err_tips">{{region_tips.text}}</div>        
        </div>
        <div class="from_group from_details">
          <textarea v-model="detail_address" placeholder-style="color: #cccccc;" placeholder="详细地址：如道路、门牌号、小区、楼栋数、单元室等" placeholder-class="input-placeholder" type="text"></textarea>    
          <!-- <input v-model="detail_address" placeholder-style="color: #cccccc;" placeholder="详细地址：如道路、门牌号、小区、楼栋数、单元室等" placeholder-class="input-placeholder" type="text"/> -->
          <div v-if="detail_address_tips.show" class="err_tips">{{detail_address_tips.text}}</div>    
        </div>
      </div>
      <div class="default_address_icon" @click="set_default_address">
        <div class="text">设为默认地址</div>
        <div class="icon">
          <img v-if="default_address || default_address == 1" src="/static/images/personal/active-address.png" alt=""/>
          <img v-else src="/static/images/personal/default-address.png" alt=""/>
        </div>
      </div>
      <div v-if="edit_address.id > 0" class="default_address_icon delete_address" @click="delete_address">
        <div class="text">删除收货地址</div>
      </div>
      <button :class="['btn', 'send_address', isIphoneX ? 'iPhonex_bottom' : '', disabled ? 'disabled' : '']" @click="save">保存并使用</button>
    </div>

    <tips :tips="tips"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import user_info from '@/mixins/user_info'
import navBar from '@/components/nav_bar'
import tips from '@/components/tips'
import { add_edit_address, delete_address } from '@/api/index'

export default {
  data () {
    return {
      navBar: {
        title: '添加收货地址',
        back_show: true
      },
      tips: {
        isShow: false,
        text: '请输入手机号码！'
      },
      name: '',
      name_tips: {
        show: false,
        text: '收货人姓名长度需要在2-25个字符之间'
      },
      phone: '',
      phone_tips: {
        show: false,
        text: '请输入正确的手机号'
      },
      region: '',
      region_tips: {
        show: false,
        text: '请选择所在区域'
      },
      detail_address: '',
      detail_address_tips: {
        show: false,
        text: '详细地址：如道路、门牌号、小区、楼栋数、单元室等'
      },
      region_default: true,
      default_address: false,
      code: '',
      code_tips: {
        show: false,
        text: '请输入验证码'
      },
      code_down: '获取验证码',
      times_down: null,
      times: 60
    }
  },
  components: {
    navBar,
    tips
  },
  mixins: [user_info],
  computed: {
    ...mapState({
      appid: state => state.appid,
      router_info: state => state.router_info,
      edit_address: state => state.edit_address,
      select_address: state => state.select_address,
      isIphoneX: state => state.isIphoneX,
      select_address_id: state => state.select_address_id
    }),
    disabled () {
      if (this.name && this.phone && this.detail_address && this.region && this.region.length) {
        return false
      } else {
        return true
      }
    },
    code_show () {
      return this.phone
    },
    computedRegion () {
      if (this.region && this.region.length > 0) {
        if (this.region[0] === this.region[1]) {
          return `${this.region[1]} ${this.region[2]}`
        } else {
          return this.region.join(' ')
        }
      } else {
        return '所在区域'
      }
    }
  },
  watch: {
    name (val) {
      if (val !== '') {
        Object.assign(this.name_tips, {show: false})
      }
    },
    phone (val) {
      if (val !== '') {
        Object.assign(this.phone_tips, {show: false})
      }
    },
    region (val) {
      if (val !== '') {
        Object.assign(this.region_tips, {show: false})
      }
    },
    detail_address (val) {
      if (val !== '') {
        Object.assign(this.detail_address_tips, {show: false})
      }
    },
    code (val) {
      if (val !== '') {
        Object.assign(this.code_tips, {show: false})
      }
    }
  },
  methods: {
    set_default_address () {
      this.default_address = !this.default_address
    },
    get_code () {
      if (this.code_show) {
        this.$store.dispatch('get_capcode', { phone: this.phone, appId: this.appid }).then(res => {
          if (res.data.success === true) {
            this.count_down_code()
          } else {
            Object.assign(this.tips, {isShow: true, text: '获取验证码失败，请再试'})
            this.setTips()
          }
        }).catch(() => {
          Object.assign(this.tips, {isShow: true, text: '获取验证码失败，请再试'})
          this.setTips()
        })
      }
    },
    save () {
      if (this.name.length < 2 || this.name.length > 25) {
        Object.assign(this.name_tips, {show: true})
      } else if (!this.phone.match(/^(1\d{10})$/)) {
        Object.assign(this.name_tips, {show: false})
        Object.assign(this.phone_tips, {show: true})
      // } else if (this.code === '') {
      //   Object.assign(this.phone_tips, {show: false})
      //   Object.assign(this.code_tips, {show: true})
      } else if (this.region === '') {
        // Object.assign(this.code_tips, {show: false})
        Object.assign(this.phone_tips, {show: false})
        Object.assign(this.region_tips, {show: true})
      } else if (this.detail_address === '') {
        Object.assign(this.region_tips, {show: false})
        Object.assign(this.detail_address_tips, {show: true})
      } else {
        Object.assign(this.detail_address_tips, {show: false})
        this.send_address()
      }
    },
    async send_address () {
      let options = {
        id: this.edit_address.id,
        name: this.name,
        phone: this.phone,
        // verificationCode: this.code,
        province: this.region[0] || '',
        city: this.region[1] || '',
        zone: this.region[2] || '',
        detail: this.detail_address,
        default: this.default_address ? 1 : 0
      }
      let res = await add_edit_address(options).catch(err => {
        Object.assign(this.tips, {isShow: true, text: err})
        this.setTips()
      })
      if (res.code === 200) {
        Object.assign(this.tips, {isShow: true, text: '用户地址提交成功'})
        this.setTips()
        options.id = res.data.id
        if (this.router_info.set_back) {
          this.$store.commit('SET_KEY_VALUE', {
            key: 'select_address',
            value: options
          })
        }
        setTimeout(() => {
          this.$store.commit('SET_ROUTER_INFO', {set_back: false})
          this.$router.go(-1)
        }, 1000)
      } else {
        Object.assign(this.tips, {isShow: true, text: res.message})
        this.setTips()
      }
    },
    delete_address () {
      let that = this
      wx.showModal({
        title: '是否删除收货地址？',
        content: '删除之后将不会有该条收货地址',
        cancelColor: '#595959',
        confirmColor: '#d44950',
        success (res) {
          if (res.confirm) {
            that.send_delette_address()
          }
        }
      })
    },
    async send_delette_address () {
      let res = await delete_address({id: this.edit_address.id}).catch(err => {
        Object.assign(this.tips, {isShow: true, text: err})
        this.setTips()
      })
      if (res.code === 200) {
        if (this.select_address.id === this.edit_address.id) {
          this.$store.commit('SET_KEY_VALUE', {
            key: 'select_address',
            value: null
          })
        }
        Object.assign(this.tips, {isShow: true, text: '删除地址成功！'})
        this.setTips()
        setTimeout(() => {
          this.$router.go(-1)
        }, 1500)
      } else {
        Object.assign(this.tips, {isShow: true, text: res.message})
        this.setTips()
      }
    },
    count_down_code () {
      let that = this
      let times = that.times
      that.times_down = setInterval(() => {
        times--
        that.code_down = `剩余${times}s`
        if (times <= 0) {
          that.count_down = '获取验证码'
          clearInterval(that.times_down)
        }
      }, 1000)
    },
    get_contacts () {
    },
    CityChange (e) {
      this.region = e.mp.detail.value
    },
    setTips () {
      let that = this
      that.tips.isShow = true
      setTimeout(() => {
        that.tips.isShow = false
      }, 2000)
    },
    rest_data () {
      this.name = ''
      this.phone = ''
      this.region = ''
      this.detail_address = ''
      this.region_default = false
      this.default_address = false
      this.disabled = true
      this.code_down = '获取验证码'
      this.times = 60
      this.times_down = null
      this.code = ''
      this.tips.isShow = false
      this.region_tips.show = false
      this.phone_tips.show = false
      this.detail_address_tips.show = false
      this.code_tips.show = false
      clearInterval(this.times_down)
    }
  },
  beforeMount () {
    if (this.edit_address && this.edit_address.id * 1 !== 0) {
      this.navBar.title = '添加收货地址'
      let address = this.edit_address
      this.name = address.name
      this.phone = address.phone
      this.default_address = address.default * 1
      let region = []
      if (address.province) {
        region.push(address.province)
      }
      if (address.city) {
        region.push(address.city)
      }
      if (address.zone) {
        region.push(address.zone)
      }
      this.region = region
      this.detail_address = address.detail
    } else {
      this.navBar.title = '编辑收货地址'
    }
  },
  onUnload () {
    this.rest_data()
  }
}
</script>

<style lang="scss" scoped>
@import './../../style/address.scss';
</style>
