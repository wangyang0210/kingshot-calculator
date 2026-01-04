<template>
  <view class="container">
    <view class="list">
      <view v-for="h in list" :key="h.slug" class="item" @tap="open(h.slug)">
        <text class="title">{{ h.name }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import heroes from '../../data/heroes.json'
import { navigate } from '../../utils/platform'
import { t, setLang, getLang } from '../../utils/i18n'
const list = heroes.map((h) => ({ slug: h.slug || h.name, name: h.name }))
function open(slug){ navigate('/pages/hero/detail?slug='+encodeURIComponent(slug)) }
onShow(() => { setLang(getLang()) })
</script>

<style>
.container { padding: 24rpx; }
.item { padding: 20rpx; background: #fff; margin-bottom: 16rpx; border-radius: 16rpx; }
.title { color: #111; }
</style>
