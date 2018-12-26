import fly from './fly'
import { miniConfig } from './../../.postcssrc.js'

/*
  接口地址
*/
const api_address = {
  we_chat_auth: '/v1/base/users',
  address_list: '/v1/base/user/user-contact-list',
  add_edit_address: '/v1/base/user/user-contact',
  address_default: '/v1/base/user/user-contact-default',
  delete_address: '/v1/base/user/user-contact-del',
  my_address: '/v1/base/user/contact',
  edit_address: '/v1/base/user/address',
  get_capcode: '/v1/base/user/verification-code',
  verify_phone: '/v1/base/user/verify-phone',
  activity: '/groupBuy/v1/active/active',
  activity_detail: '/groupBuy/v1/active/active/get-one-detail',
  goods_detail: '/groupBuy/v1/goods/goods/get-one-detail',
  get_group: '/groupBuy/v1/group/group/get-one',
  get_group_detail: '/groupBuy/v1/group/group/get-one-detail',
  create_group: '/groupBuy/v1/group/group/create-group',
  join_group: '/groupBuy/v1/group/group/join-group',
  get_order: '/groupBuy/v1/order/order/my-order-list',
  order_detail: '/groupBuy/v1/order/order/get-one-detail',
  delete_order: '/groupBuy/v1/order/order/delete',
  cancel_order: '/groupBuy/v1/order/order/cancel',
  get_order_status: '/groupBuy/v1/order/order/get-one-status',
  can_join_list: '/groupBuy/v1/group/group/get-can-join-list',
  get_group_people: '/groupBuy/v1/group/group/get-group-success-users',
  get_active_people: '/groupBuy/v1/group/group/get-active-success-users',
  add_view: '/groupBuy/v1/goods/goods/add-view',
  make_order: '/groupBuy/v1/order/order/make-order',
  add_form_id: '/v1/base/form-id/add',
  my_group_list: '/groupBuy/v1/group/group/my-group-list',
  get_ald_app_key: '/v1/base/alds/{app_id}'
}

/*
  请求接口-- 方法
*/

// 使用code 获取 用户信息
function we_chat_auth ({ code, rawData, encryptedData, signature, appId }) {
  return fly
    .post(`${api_address['we_chat_auth']}`,
      {
        code,
        encryptedData,
        rawData,
        signature,
        appId: appId || miniConfig.appid
      },
      {
        headers: {
          'content-type': 'application/json'
        }
      }
    )
    .then(res => {
      // userToken = res.data.token
      return res
    })
}

// 首页活动
function activity (options) {
  return fly.get(`${api_address['activity']}`, options)
}

// 活动详情
function activity_detail (options) {
  return fly.get(`${api_address['activity_detail']}`, options)
}

// 商品详情
function goods_detail (options) {
  return fly.get(`${api_address['goods_detail']}`, options)
}

// 商品浏览量统计
function add_view (options) {
  return fly.get(`${api_address['add_view']}`, options)
}

// 获取团
function get_group (options) {
  return fly.get(`${api_address['get_group']}`, options)
}

// 创建一个团
function create_group (options) {
  return fly.post(`${api_address['create_group']}`, {
    active_id: options.active_id,
    contact_id: options.contact_id,
    appId: options.appId || miniConfig.appid
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 加入团
function join_group (options) {
  return fly.post(`${api_address['join_group']}`, {
    group_id: options.group_id,
    contact_id: options.contact_id,
    appId: options.appId || miniConfig.appid
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 未成团的
function can_join_list (options) {
  return fly.get(`${api_address['can_join_list']}`, options)
}

// 获取团详情
function get_group_detail (options) {
  return fly.get(`${api_address['get_group_detail']}`, options)
}

// 获取一个团最近50条参团信息
function get_group_people (options) {
  return fly.get(`${api_address['get_group_people']}`, options)
}

// 获取一个活动最近50条参团信息
function get_active_people (options) {
  return fly.get(`${api_address['get_active_people']}`, options)
}

// 我的订单
function get_order (options) {
  return fly.get(`${api_address['get_order']}`, options)
}

// 我的团
function my_group_list (options) {
  return fly.get(`${api_address['my_group_list']}`, options)
}

// 获取订单状态
function get_order_status (options) {
  return fly.get(`${api_address['get_order_status']}`, options)
}

// 订单详情
function order_detail (options) {
  return fly.get(`${api_address['order_detail']}`, options)
}
// 取消订单
function cancel_order (options) {
  return fly.post(`${api_address['cancel_order']}`, options)
}

// 去支付
function make_order (options) {
  return fly.get(`${api_address['make_order']}`, {
    orderId: options.orderId,
    appId: options.appId || miniConfig.appid
  })
}

// 删除订单
function delete_order (options) {
  return fly.delete(`${api_address['delete_order']}`, options)
}

// 地址列表
function address_list (options) {
  return fly.get(`${api_address['address_list']}`, options)
}

// 新增，修改地址
function add_edit_address (options) {
  return fly.post(`${api_address['add_edit_address']}`, options)
}

// 修改用户默认联系信息
function address_default (options) {
  return fly.post(`${api_address['address_default']}`, options)
}

// 修改用户默认联系信息
function delete_address (options) {
  return fly.delete(`${api_address['delete_address']}`, options)
}

// 获取验证码
function get_capcode (options) {
  return fly.get(`${api_address['get_capcode']}`, {
    phone: options.phone,
    appId: options.appId || miniConfig.appid
  })
}

// 验证手机号
function verify_phone (options) {
  return fly.post(`${api_address['verify_phone']}`, options, {
    headers: {
      'content-type': 'application/json'
    }
  })
}

//  上传from_id
function add_form_id (options) {
  return fly.get(`${api_address['add_form_id']}`, {
    form_id: options.form_id,
    appId: options.appId || miniConfig.appid
  })
}

function get_ald_app_key (options) {
  return fly.get(`${api_address['get_ald_app_key'].replace('{app_id}', options.appid || miniConfig.appid)}`)
}

/*
export
*/
export {
  we_chat_auth,
  activity,
  activity_detail,
  goods_detail,
  add_view,
  get_group,
  get_group_detail,
  create_group,
  join_group,
  can_join_list,
  get_group_people,
  get_active_people,
  get_order,
  get_order_status,
  order_detail,
  cancel_order,
  delete_order,
  address_list,
  add_edit_address,
  address_default,
  delete_address,
  get_capcode,
  verify_phone,
  make_order,
  add_form_id,
  my_group_list,
  get_ald_app_key
}
