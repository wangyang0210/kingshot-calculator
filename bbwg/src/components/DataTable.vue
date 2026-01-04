<template>
  <view class="table">
    <view class="thead">
      <view class="th" v-for="(h,i) in head" :key="i">{{ h }}</view>
    </view>
    <view class="tbody">
      <view class="tr" v-for="(r,ri) in rows" :key="ri">
        <view class="td" v-for="(c,ci) in r" :key="ci">{{ c }}</view>
      </view>
    </view>
  </view>
  </template>
<script setup lang="ts">
defineProps<{ head: string[]; rows: (string|number)[][] }>()
</script>
<style scoped>
.table{ width:100%; overflow:auto }
.thead,.tr{ display:grid; gap:8px; padding:8px 0; align-items:center }
.thead{ position:sticky; top:0; background:#f6f7fb; border-bottom:1px solid #eee; font-weight:700 }
.tbody .tr:nth-child(odd){ background:#fafafa }
.th,.td{ font-size:13px; text-align:center }
</style>
