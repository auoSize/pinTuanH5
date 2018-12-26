<template>
  <div :class="['notes', isOrder === 'true' ? 'notes_order' : '']" v-if="notes && (JSON.stringify(notes) !== '{}' || notes !== undefind || notes !== null)">
    <div class="title">拼团须知</div>
    <ul>
      <li v-if="notes.merchant_name">
        <div class="icon_content">
          <div class="icon_content_title">商户名：{{notes.merchant_name}}</div>
        </div>
      </li>
      <li v-if="notes.merchant_contact_name">
        <div class="icon_content">
          <div class="icon_content_title">商户联系人：{{notes.merchant_contact_name}}</div>
        </div>
      </li>
      <li v-if="notes.merchant_phone">
        <div class="icon_content">
          <div class="icon_content_title">联系电话：{{notes.merchant_phone}}</div>
        </div>
      </li>
      <li v-if="notes.validate_time">
        <div class="icon_content">
          <div class="icon_content_title">时间：{{notes.validate_time}}</div>
        </div>
      </li>
      <li v-if="notes.addresss">
        <div class="icon_content">
          <div class="icon_content_title">地点：{{notes.addresss}}</div>
        </div>
      </li>
      <li v-if="notes.other">
        <div class="icon_content">
          <div class="icon_content_title">退换政策：{{notes.other}}</div>
        </div>
      </li>
      <li v-if="notes.use_description">
        <div class="icon_content">
          <div class="icon_content_title">使用说明：{{notes.use_description}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['notes', 'isOrder']
}
</script>

<style lang="scss" scoped>
  @import './../style/compoments.scss';
</style>

