exports.getLocation = false // 默认不获取用户坐标位置
exports.plugin = false // 您的小程序中是否使用了插件。根据是否启用插件会有不同的接入方式，请参考文档文档。
let key = ''
exports.app_key = key // 请在此行填写从阿拉丁后台获取的appkey
exports.set_app_key = function (data) {
  key = data
  exports.app_key = key // 请在此行填写从阿拉丁后台获取的appkey
}
