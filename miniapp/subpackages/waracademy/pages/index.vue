<template>
  <view class="container">
    <button class="card" @tap="go('/subpackages/waracademy/pages/infantry')">{{ t('waracademy.infantry.title','步兵') }}</button>
    <button class="card" @tap="go('/subpackages/waracademy/pages/archer')">{{ t('waracademy.archer.title','弓兵') }}</button>
    <button class="card" @tap="go('/subpackages/waracademy/pages/cavalry')">{{ t('waracademy.cavalry.title','骑兵') }}</button>
  </view>
</template>

<script setup>
import { t, setLang, getLang } from '../../../utils/i18n'
import { navigate } from '../../../utils/platform'
function go(url){ navigate(url) }
onShow(() => { setLang(getLang()) })
</script>

<style>
.container { padding: 24rpx; display: grid; grid-template-columns: 1fr 1fr; gap: 16rpx; }
.card { background: #fff; color: #111; border-radius: 16rpx; padding: 24rpx; }
</style>
