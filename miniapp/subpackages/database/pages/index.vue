<template>
  <view class="container">
    <view class="head">
      <text class="title">{{ t('db.serverTimeline.title','服务器时间线') }}</text>
      <text class="desc">{{ t('db.serverTimeline.overview.desc','随着服务器推进逐步解锁功能和英雄。') }}</text>
    </view>
    <view class="card">
      <text class="subtitle">{{ t('db.serverTimeline.timeline.title','服务器天数时间线') }}</text>
      <view class="row" v-for="k in keys" :key="k">
        <text class="when">{{ t('db.serverTimeline.timeline.when.'+k, k) }}</text>
        <text class="what">{{ t('db.serverTimeline.timeline.what.'+k, '-') }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { t, setLang, getLang } from '../../../utils/i18n'
const keys = ['d0','d14','d38','d40_50','d45','d54','d55_60','d70','d75_80','d70_80','d105_110','d105_120','d150','d170_180']
onShow(() => { setLang(getLang()) })
</script>

<style>
.container { padding: 24rpx; }
.head { margin-bottom: 12rpx; }
.title { font-weight: 600; color:#111; }
.desc { display:block; margin-top:6rpx; color:#666; }
.card { background:#fff; border-radius:16rpx; padding:24rpx; }
.subtitle { font-weight:600; margin-bottom: 12rpx; display:block; }
.row { display:flex; justify-content:space-between; padding:8rpx 0; }
.when { color:#555; }
.what { color:#111; }
</style>
