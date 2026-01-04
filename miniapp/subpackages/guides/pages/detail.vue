<template>
  <view class="container">
    <view class="head">
      <text class="title">{{ t('ruins.meta.title','失落遗迹总结指南') }}</text>
      <text class="desc">{{ t('ruins.meta.desc','活动与时机总结') }}</text>
    </view>
    <view class="card">
      <text class="subtitle">{{ t('ruins.s0.title','基本信息') }}</text>
      <view class="li">{{ t('ruins.s0.l1') }}</view>
      <view class="li">{{ t('ruins.s0.l2') }}</view>
      <view class="li">{{ t('ruins.s0.l3') }}</view>
      <view class="li">{{ t('ruins.s0.l4') }}</view>
    </view>
    <view class="card">
      <text class="subtitle">{{ t('ruins.s1.title','基本策略') }}</text>
      <view class="li">{{ t('ruins.s1.l1') }}</view>
      <view class="li">{{ t('ruins.s1.l2') }}</view>
      <view class="li">{{ t('ruins.s1.l3') }}</view>
      <view class="tip">{{ t('ruins.s1.tip') }}</view>
    </view>
  </view>
</template>

<script setup>
import { t, setLang, getLang } from '../../../utils/i18n'
onShow(() => { setLang(getLang()) })
</script>

<style>
.container { padding: 24rpx; }
.head { margin-bottom: 12rpx; }
.title { font-weight: 600; color:#111; }
.desc { display:block; margin-top:6rpx; color:#666; }
.card { background:#fff; border-radius:16rpx; padding:24rpx; margin-bottom:16rpx; }
.subtitle { font-weight:600; margin-bottom: 8rpx; display:block; }
.li { color:#111; margin: 6rpx 0; }
.tip { color:#2b7cff; margin-top: 8rpx; }
</style>
