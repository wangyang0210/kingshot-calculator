<template>
  <view class="container">
    <view class="card">
      <picker mode="selector" :range="levels" :value="fromIdx" @change="e=>fromIdx=Number(e.detail.value||0)">
        <view class="picker">当前阶段：{{ levels[fromIdx] }}</view>
      </picker>
      <picker mode="selector" :range="levels" :value="toIdx" @change="e=>toIdx=Number(e.detail.value||0)">
        <view class="picker">目标阶段：{{ levels[toIdx] }}</view>
      </picker>
      <button class="btn" @tap="run">{{ t('calcGear.actions.calculate','计算') }}</button>
    </view>
    <view v-if="out" class="result">
      <view class="row"><text>{{ t('calcGear.kpi.satin','丝绸') }}</text><text>{{ fmt(out.satin) }}</text></view>
      <view class="row"><text>{{ t('calcGear.kpi.thread','金丝') }}</text><text>{{ fmt(out.thread) }}</text></view>
      <view class="row"><text>{{ t('calcGear.kpi.sketch','设计图') }}</text><text>{{ fmt(out.sketch) }}</text></view>
      <view class="row"><text>{{ t('calcGear.kpi.score','装备评分') }}</text><text>{{ fmt(out.score) }}</text></view>
    </view>
  </view>
</template>

<script setup>
import { t, setLang, getLang } from '../../../utils/i18n'
import { keys, calcGear } from '../../../composables/calc/gear'
const levels = keys()
let fromIdx = $ref(0)
let toIdx = $ref(levels.length-1)
const out = ref(null)
function fmt(n){ return Number(n||0).toLocaleString() }
function run(){ out.value = calcGear({ fromIdx, toIdx }) }
onShow(() => { setLang(getLang()) })
</script>

<style>
.container { padding: 24rpx; }
.card { display:grid; grid-template-columns:1fr; gap:16rpx; background:#fff; border-radius:16rpx; padding:24rpx; }
.picker { padding: 16rpx; background: #f1f4f8; border-radius: 12rpx; }
.btn { background:#2b7cff; color:#fff; border-radius:12rpx; padding:12rpx 16rpx; }
.result { margin-top:24rpx; background:#fff; border-radius:16rpx; padding:24rpx; }
.row { display:flex; justify-content:space-between; padding:8rpx 0; color:#111; }
</style>
