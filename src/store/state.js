const state = {
  nav_bar: {
    nav_height: 0,
    statusBarHeight: 0,
    margin_top: ''
  },
  isIphoneX: false,
  appid: '',
  status: 2, // 0-未参团 1-参团成功/开团成功 2-满团 3-过期 4-失败 5-成功
  order_menu: 0,
  group_menu: 0,
  user_info: {}, // 用户信息
  program_info: {
    code: null,
    appid: '',
    rawData: null,
    signature: null
  }, // 小程序信息
  token: '',
  token_state: false,
  app_key: '', // 阿拉丁 app_key
  // 修改过的手机号
  personal_info: {
    name: '',
    phone: '',
    code: ''
  },
  address_info: null, // 地址
  // 修改过的手机号
  new_phone_number: null,
  new_verificationCode: null,
  authSetting: false, // 是否授权,
  select_goods: {},
  activity_id: 0,
  share_info: {}, // 分享信息
  choose_goods: {}, // 选购商品
  join_group: {}, // 加入团信息
  payment_info: {},
  select_group: {}, // 1 加入团 0 创建团
  router_info: {
    set_back: false,
    num: 0
  },
  group: null, // 可加入的团
  edit_address: {},
  select_address: null,
  select_address_id: 0
}

export default state
