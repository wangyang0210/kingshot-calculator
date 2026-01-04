<template>
  <view class="container">
    <view class="grid">
      <button class="card" @tap="go('/pages/buildings/index')">{{ t('nav.buildings') }}</button>
      <button class="card" @tap="go('/pages/heroes/index')">{{ t('nav.heroes') }}</button>
      <button class="card" @tap="go('/subpackages/calculators/pages/building')">{{ t('nav.calculators') }}</button>
      <button class="card" @tap="go('/subpackages/waracademy/pages/index')">{{ t('home.card.waracademy.title') }}</button>
      <button class="card" @tap="go('/subpackages/database/pages/index')">{{ t('nav.database') }}</button>
      <button class="card" @tap="go('/subpackages/guides/pages/index')">{{ t('nav.guides') }}</button>
    </view>
  </view>
</template>

<script setup>
import { t, setLang, getLang } from '../../utils/i18n'
import { navigate } from '../../utils/platform'
onShow(() => { setLang(getLang()) })
function go(url){ navigate(url) }
</script>

<style>
.container { padding: 24rpx; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16rpx; }
.card { background: #fff; color: #111; border-radius: 16rpx; padding: 24rpx; }
</style>
