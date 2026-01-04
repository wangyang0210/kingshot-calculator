<template>
  <view class="container">
    <view class="list">
      <view v-for="b in list" :key="b.slug" class="item" @tap="open(b.slug)">
        <text class="title">{{ b.name }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import data from '../../data/buildings.json'
import { navigate } from '../../utils/platform'
import { t, setLang, getLang } from '../../utils/i18n'
const list = data.map((b) => ({ slug: b.slug || b.name, name: b.name || t('buildings.columns.category') }))
function open(slug){ navigate('/pages/buildings/detail?slug='+encodeURIComponent(slug)) }
onShow(() => { setLang(getLang()) })
</script>

<style>
.container { padding: 24rpx; }
.item { padding: 20rpx; background: #fff; margin-bottom: 16rpx; border-radius: 16rpx; }
.title { color: #111; }
</style>
