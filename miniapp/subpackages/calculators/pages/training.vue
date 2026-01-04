<template>
  <view class="container">
    <view class="card">
      <picker mode="selector" :range="modes" :value="modeIdx" @change="onMode">
        <view class="picker">{{ modes[modeIdx] }}</view>
      </picker>
      <view v-if="mode==='promotion'" class="row">
        <picker mode="selector" :range="froms" :value="fromIdx" @change="e=>fromIdx=Number(e.detail.value||0)">
          <view class="picker">{{ froms[fromIdx] }}</view>
        </picker>
      </view>
      <view class="row">
        <picker mode="selector" :range="tos" :value="toIdx" @change="e=>toIdx=Number(e.detail.value||0)">
          <view class="picker">{{ tos[toIdx] }}</view>
        </picker>
      </view>
      <view class="seg">
        <button :class="['seg-btn', inputMode==='time'?'active':'']" @tap="setInput('time')">{{ t('trainCalc.form.seg.time','按时间') }}</button>
        <button :class="['seg-btn', inputMode==='troops'?'active':'']" @tap="setInput('troops')">{{ t('trainCalc.form.seg.troops','按数量') }}</button>
      </view>
      <input class="inp" type="number" v-model.number="trainSpeed" :placeholder="t('trainCalc.form.trainSpeed','训练速度(%)')" />
      <input v-if="inputMode==='time'" class="inp" type="number" v-model.number="days" :placeholder="t('trainCalc.form.days','加速天数(天)')" />
      <input v-else class="inp" type="number" v-model.number="count" :placeholder="t('trainCalc.form.count','部队数量(个)')" />
      <button class="btn" @tap="calc">{{ t('trainCalc.form.calculate','计算') }}</button>
    </view>
    <view v-if="out" class="result">
      <view class="row"><text>数量</text><text>{{ fmt(out.count) }}</text></view>
      <view class="row"><text>HOG积分/每个</text><text>{{ fmt(out.hogPer,2) }}</text></view>
      <view class="row"><text>HOG积分总计</text><text>{{ fmt(out.hogTotal,0) }}</text></view>
      <view class="row"><text>KVK积分/每个</text><text>{{ fmt(out.kvkPer,2) }}</text></view>
      <view class="row"><text>KVK积分总计</text><text>{{ fmt(out.kvkTotal,0) }}</text></view>
      <view class="row"><text>治理积分/每个</text><text>{{ fmt(out.govPer,2) }}</text></view>
      <view class="row"><text>治理积分总计</text><text>{{ fmt(out.govTotal,0) }}</text></view>
      <view class="row"><text>战力/每个</text><text>{{ fmt(out.powPer,2) }}</text></view>
      <view class="row"><text>战力总计</text><text>{{ fmt(out.powTotal,0) }}</text></view>
      <view class="row"><text>单个用时</text><text>{{ hms(out.timePerOne) }}</text></view>
      <view class="row"><text>总用时</text><text>{{ hms(out.timeTotal) }}</text></view>
    </view>
  </view>
</template>

<script setup>
import { setLang, getLang } from '../../../utils/i18n'
import { getAvailableTiers, calcByTime, calcByTroops } from '../../../composables/calc/training'
const modes = [t('trainCalc.form.mode.training','训练'), t('trainCalc.form.mode.promotion','晋升')]
const modeIdx = ref(0)
const mode = computed(() => modeIdx.value===0 ? 'training' : 'promotion')
const av = getAvailableTiers()
const froms = av.promotionFrom
const tosTraining = av.trainingTo
const tosPromotion = av.promotionTo
const fromIdx = ref(0)
const toIdx = ref(0)
const inputMode = ref('time')
const trainSpeed = ref(0)
const days = ref(1)
const count = ref(1000)
const out = ref(null)
function onMode(e){ modeIdx.value = Number(e.detail.value||0); toIdx.value = 0 }
function setInput(m){ inputMode.value = m }
function fmt(n,d=0){ if(n==null||isNaN(n)) return '-'; return Number(n).toLocaleString(undefined,{maximumFractionDigits:d,minimumFractionDigits:d}) }
function hms(sec){ if(sec==null||isNaN(sec)) return '-'; sec=Math.round(sec); const d=Math.floor(sec/86400); sec%=86400; const h=Math.floor(sec/3600); sec%=3600; const m=Math.floor(sec/60); const s=sec%60; const p=[]; if(d)p.push(d+'天'); if(h)p.push(h+'小时'); if(m)p.push(m+'分'); if(s||!p.length)p.push(s+'秒'); return p.join(' ') }
function calc(){
  const tosList = mode.value==='training' ? tosTraining : tosPromotion
  const toTier = tosList[toIdx.value]
  const fromTier = mode.value==='promotion' ? froms[fromIdx.value] : ''
  out.value = inputMode.value==='time'
    ? calcByTime({ mode: mode.value, fromTier, toTier, trainSpeedPct: trainSpeed.value, days: days.value })
    : calcByTroops({ mode: mode.value, fromTier, toTier, trainSpeedPct: trainSpeed.value, count: count.value })
}
const tos = computed(() => mode.value==='training' ? tosTraining : tosPromotion)
onShow(() => { setLang(getLang()) })
</script>

<style>
.container { padding: 24rpx; }
.card { display:grid; grid-template-columns:1fr; gap:16rpx; background:#fff; border-radius:16rpx; padding:24rpx; }
.picker { padding: 16rpx; background: #f1f4f8; border-radius: 12rpx; }
.seg { display:flex; gap: 12rpx; }
.seg-btn { flex:1; background:#f1f4f8; border-radius:12rpx; padding:12rpx 16rpx; }
.seg-btn.active { background:#2b7cff; color:#fff; }
.inp { background:#f1f4f8; border-radius:12rpx; padding:12rpx 16rpx; }
.btn { background:#2b7cff; color:#fff; border-radius:12rpx; padding:12rpx 16rpx; }
.result { margin-top:24rpx; background:#fff; border-radius:16rpx; padding:24rpx; }
.row { display:flex; justify-content:space-between; padding:8rpx 0; color:#111; }
</style>
