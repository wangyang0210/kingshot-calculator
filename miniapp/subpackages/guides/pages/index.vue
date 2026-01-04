<template>
  <view class="container">
    <view class="head">
      <text class="title">{{ t('guides.title','游戏攻略') }}</text>
    </view>
    <view class="search">
      <input class="inp" type="text" :placeholder="t('guides.search.placeholder','搜索…')" />
    </view>
    <view class="card" @tap="go('/subpackages/guides/pages/detail')">
      <text class="subtitle">{{ t('ruins.meta.title','失落遗迹总结指南') }}</text>
      <text class="desc">{{ t('ruins.meta.desc','活动与时机总结') }}</text>
    </view>
  </view>
</template>

<script setup>
import { t, setLang, getLang } from '../../../utils/i18n'
import { navigate } from '../../../utils/platform'
onShow(() => { setLang(getLang()) })
function go(url){ navigate(url) }
</script>

<style>
.container { padding: 24rpx; }
.head { margin-bottom: 12rpx; }
.title { font-weight: 600; color:#111; }
.search { margin-bottom: 16rpx; }
.inp { background:#f1f4f8; border-radius:12rpx; padding:12rpx 16rpx; }
.card { background:#fff; border-radius:16rpx; padding:24rpx; }
.subtitle { font-weight:600; margin-bottom: 8rpx; display:block; }
.desc { color:#666; }
</style>
