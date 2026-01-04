<template>
  <view class="container">
    <view class="card">
      <picker mode="selector" :range="levels" :value="fromIdx" @change="e=>fromIdx=Number(e.detail.value||0)">
        <view class="picker">当前等级：{{ levels[fromIdx] }}</view>
      </picker>
      <picker mode="selector" :range="levels" :value="toIdx" @change="e=>toIdx=Number(e.detail.value||0)">
        <view class="picker">目标等级：{{ levels[toIdx] }}</view>
      </picker>
      <view class="grid">
        <input class="inp" type="number" v-model.number="cav" :placeholder="t('calcCharm.form.counts.cavalry','骑兵')" />
        <input class="inp" type="number" v-model.number="inf" :placeholder="t('calcCharm.form.counts.infantry','步兵')" />
        <input class="inp" type="number" v-model.number="arc" :placeholder="t('calcCharm.form.counts.archer','弓兵')" />
      </view>
      <view class="actions">
        <button class="btn" @tap="run">{{ t('calcCharm.form.actions.calculate','计算') }}</button>
        <button class="btn outline" @tap="clear">{{ t('calcCharm.form.actions.clear','重置') }}</button>
      </view>
    </view>
    <view v-if="out" class="result">
      <view class="row"><text>宝石手册</text><text>{{ fmt(out.manual) }}</text></view>
      <view class="row"><text>宝石图纸</text><text>{{ fmt(out.blueprint) }}</text></view>
      <view class="row"><text>属性提升(%)</text><text>{{ fmt(out.attr,2) }}</text></view>
    </view>
  </view>
</template>

<script setup>
import { setLang, getLang } from '../../../utils/i18n'
import { keys, calcCharm } from '../../../composables/calc/charm'
const levels = keys()
const fromIdx = ref(0)
const toIdx = ref(levels.length-1)
const cav = ref(0), inf = ref(0), arc = ref(0)
const out = ref(null)
function fmt(n,d=0){ return Number(n||0).toLocaleString(undefined,{maximumFractionDigits:d,minimumFractionDigits:d}) }
function run(){ out.value = calcCharm({ fromIdx: fromIdx.value, toIdx: toIdx.value, cav: cav.value, inf: inf.value, arc: arc.value }) }
function clear(){ fromIdx.value = 0; toIdx.value = levels.length - 1; cav.value = 0; inf.value = 0; arc.value = 0; out.value = null }
onShow(() => { setLang(getLang()) })
</script>

<style>
.container { padding: 24rpx; }
.card { display:grid; grid-template-columns:1fr; gap:16rpx; background:#fff; border-radius:16rpx; padding:24rpx; }
.picker { padding: 16rpx; background: #f1f4f8; border-radius: 12rpx; }
.grid { display:grid; grid-template-columns:1fr 1fr; gap:12rpx; }
.inp { background:#f1f4f8; border-radius:12rpx; padding:12rpx 16rpx; }
.btn { background:#2b7cff; color:#fff; border-radius:12rpx; padding:12rpx 16rpx; }
.btn.outline { background:#fff; color:#2b7cff; border:2rpx solid #2b7cff; }
.actions { display:flex; gap:12rpx; }
.result { margin-top:24rpx; background:#fff; border-radius:16rpx; padding:24rpx; }
.row { display:flex; justify-content:space-between; padding:8rpx 0; color:#111; }
</style>
