<template>
  <view class="page">
    <calc-card :title="t('calcCharm.title')" :desc="t('calcCharm.desc')">

      <view class="row">
        <view class="label">{{ t('calcCharm.form.currentLevel.label') }}</view>
        <picker mode="selector" :range="labels" @change="e=>{fromIdx=Number(e.detail.value)}">
          <view class="picker">{{ labels[fromIdx] }}</view>
        </picker>
      </view>
      <view class="row">
        <view class="label">{{ t('calcCharm.form.targetLevel.label') }}</view>
        <picker mode="selector" :range="labels" @change="e=>{toIdx=Number(e.detail.value)}">
          <view class="picker">{{ labels[toIdx] }}</view>
        </picker>
      </view>

      <view class="row">
        <u-number-box v-model="cav" :min="0" />
        <u-number-box v-model="inf" :min="0" />
        <u-number-box v-model="arc" :min="0" />
        <u-button @click="fill9">{{ t('calcCharm.form.actions.fill9') }}</u-button>
        <u-button @click="clear">{{ t('calcCharm.form.actions.clear') }}</u-button>
        <u-button type="primary" @click="run">{{ t('calcCharm.form.actions.calculate') }}</u-button>
      </view>
    </calc-card>

    <calc-card>
      <view class="grid">
        <view class="kpi"><view class="num">{{ fmt(total.manual) }}</view><view>{{ t('calcCharm.result.manual') }}</view></view>
        <view class="kpi"><view class="num">{{ fmt(total.blueprint) }}</view><view>{{ t('calcCharm.result.blueprint') }}</view></view>
        <view class="kpi"><view class="num">{{ fmt(total.attr) }}%</view><view>{{ t('calcCharm.result.attribute') }}</view></view>
      </view>
    </calc-card>

    <calc-card v-if="rows.length">
      <view class="table">
        <view class="thead">
          <view class="th">{{ t('calcCharm.table.level') }}</view>
          <view class="th">{{ t('calcCharm.table.manual') }}</view>
          <view class="th">{{ t('calcCharm.table.blueprint') }}</view>
          <view class="th">{{ t('calcCharm.table.attr') }}</view>
        </view>
        <view class="tbody">
          <view class="tr" v-for="(r, i) in rows" :key="i">
            <view class="td">{{ r.level }}</view>
            <view class="td">{{ fmt(r.manual) }}</view>
            <view class="td">{{ fmt(r.blueprint) }}</view>
            <view class="td">{{ fmt(r.attr) }}%</view>
          </view>
        </view>
      </view>
    </calc-card>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import charm from '@/data/governor-charm.json'
import CalcCard from '@/components/CalcCard.vue'
const { t } = useI18n()

const keys = Object.keys((charm as any).steps)
const labels = keys
let fromIdx = 0
let toIdx = keys.length-1
const cav = ref(0), inf = ref(0), arc = ref(0)
const rows = ref<any[]>([])
const total = ref({ manual:0, blueprint:0, attr:0 })

function fmt(n:number){ return (n||0).toLocaleString(undefined,{maximumFractionDigits:2}) }
function fill9(){ cav.value=3; inf.value=3; arc.value=3; run() }
function clear(){ cav.value=0; inf.value=0; arc.value=0; run() }
function sumRange(from:number, to:number){
  let manual=0, blueprint=0
  for(let i=from+1;i<=to;i++){
    const s:any = (charm as any).steps[keys[i]] || {}
    manual += +s.manual || 0
    blueprint += +s.blueprint || 0
  }
  return { manual, blueprint }
}
function run(){
  const totalCount = (cav.value||0)+(inf.value||0)+(arc.value||0)
  if (toIdx<=fromIdx || totalCount<=0){ rows.value=[]; total.value={manual:0,blueprint:0,attr:0}; return }
  const cost = sumRange(fromIdx, toIdx)
  const attrTo = +((charm as any).steps[keys[toIdx]].attr||0)
  const attrFrom = +((charm as any).steps[keys[fromIdx]].attr||0)
  const attrDelta = attrTo - attrFrom
  total.value = {
    manual: cost.manual * totalCount,
    blueprint: cost.blueprint * totalCount,
    attr: attrDelta * totalCount
  }
  rows.value = []
  for(let i=fromIdx+1;i<=toIdx;i++){
    const k=keys[i], s:any=(charm as any).steps[k]
    rows.value.push({ level:k, manual:s.manual, blueprint:s.blueprint, attr:s.attr })
  }
}
</script>

<style scoped>
.page{ padding:12px; }
.card{ background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:12px; margin-bottom:12px; }
.title{ font-weight:700; font-size:18px; margin-bottom:6px; }
.desc{ color:#666; font-size:13px; margin-bottom:8px; }
.row{ display:flex; align-items:center; gap:10px; margin:8px 0; }
.label{ width:140px; color:#333; font-size:14px; }
.picker{ padding:8px 10px; border:1px solid #ddd; border-radius:10px; background:#f8f9fb; min-width:200px; }
input{ padding:8px 10px; border:1px solid #ddd; border-radius:10px; background:#f8f9fb; min-width:120px; }
.actions{ display:flex; gap:8px; margin-top:6px; }
button{ padding:8px 10px; border:1px solid #ddd; border-radius:10px; background:#f1f5f9; }
.grid{ display:grid; grid-template-columns: repeat(3,1fr); gap:8px; }
.kpi{ background:#f8fafc; border:1px solid #eee; border-radius:10px; padding:10px; text-align:center; }
.kpi .num{ font-weight:700; font-size:18px; }
.table{ width:100%; overflow:auto; }
.thead, .tr{ display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap:8px; padding:8px 0; align-items:center; }
.thead{ background:#f6f7fb; font-weight:700; border-bottom:1px solid #eee; }
.td, .th{ font-size:13px; text-align:center; }
</style>
