<template>
  <view class="container">
    <view class="head">
      <text class="title">{{ name }}</text>
      <button class="back" @tap="back">{{ t('heroes.detail.back','← 返回') }}</button>
    </view>
    <view class="content">
      <view v-for="s in skills" :key="s.name" class="row">
        <text>{{ s.name }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import all from '../../data/heroes.json'
import { back as goBack } from '../../utils/platform'
import { t, setLang, getLang } from '../../utils/i18n'
const name = ref('')
const skills = ref([])
onLoad((opts) => {
  const slug = decodeURIComponent(opts.slug || '')
  const item = all.find((h) => (h.slug || h.name) === slug)
  name.value = item ? (item.name || slug) : slug
  skills.value = item && item.skills ? item.skills : []
})
function back(){ goBack() }
onShow(() => { setLang(getLang()) })
</script>

<style>
.container { padding: 24rpx; }
.head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx; }
.title { font-weight: 600; color: #111; }
.back { background: #fff; border-radius: 12rpx; padding: 12rpx 20rpx; }
.row { background: #fff; border-radius: 16rpx; padding: 20rpx; margin-bottom: 12rpx; }
</style>
