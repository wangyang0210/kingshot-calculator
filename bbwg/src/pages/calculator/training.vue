<template>
  <view class="page">
    <calc-card :title="t('trainCalc.title')" :desc="t('trainCalc.about.p1')">

      <view class="row">
        <view class="label">{{ t('trainCalc.form.mode') }}</view>
        <picker mode="selector" :range="modes" @change="e=>{mode=modes[Number(e.detail.value)]}">
          <view class="picker">{{ mode }}</view>
        </picker>
      </view>
      <view class="row" v-if="mode==='promotion'">
        <view class="label">{{ t('trainCalc.form.fromTier') }}</view>
        <picker mode="selector" :range="froms" @change="e=>{fromTier=Number(froms[Number(e.detail.value)])}">
          <view class="picker">Lv {{ fromTier }}</view>
        </picker>
      </view>
      <view class="row">
        <view class="label">{{ t('trainCalc.form.toTier') }}</view>
        <picker mode="selector" :range="tos" @change="e=>{toTier=Number(tos[Number(e.detail.value)])}">
          <view class="picker">Lv {{ toTier }}</view>
        </picker>
      </view>
      <view class="row">
        <view class="label">{{ t('trainCalc.form.trainSpeed') }}</view>
        <u-input type="number" v-model="trainSpeed" placeholder="0" />
      </view>

      <view class="row pills">
        <button :class="{active: inputMode==='time'}" @click="setMode('time')">{{ t('trainCalc.form.modeTime') }}</button>
        <button :class="{active: inputMode==='troops'}" @click="setMode('troops')">{{ t('trainCalc.form.modeTroops') }}</button>
      </view>

      <view class="row" v-if="inputMode==='time'">
        <view class="label">{{ t('trainCalc.form.speedDays') }}</view>
        <input type="number" v-model.number="speedDays" placeholder="0" />
      </view>
      <view class="row" v-else>
        <view class="label">{{ t('trainCalc.form.count') }}</view>
        <input type="number" v-model.number="count" placeholder="1" />
      </view>

      <view class="actions">
        <u-button type="primary" @click="run">{{ t('trainCalc.actions.calculate') }}</u-button>
      </view>
    </calc-card>

    <calc-card v-if="rows.length">
      <view class="table">
        <view class="thead">
          <view class="th">{{ t('trainCalc.table.metric') }}</view>
          <view class="th">{{ t('trainCalc.table.perOne') }}</view>
          <view class="th">{{ t('trainCalc.table.total') }}</view>
        </view>
        <view class="tbody">
          <view class="tr" v-for="(r, i) in rows" :key="i">
            <view class="td">{{ r.name }}</view>
            <view class="td">{{ r.per1 }}</view>
            <view class="td">{{ r.total }}</view>
          </view>
        </view>
      </view>
    </calc-card>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DATA from '@/data/ks_training_promotion_per_troop.json'
import CalcCard from '@/components/CalcCard.vue'
const { t } = useI18n()

const modes = [t('trainCalc.mode.training'), t('trainCalc.mode.promotion')]
let mode = modes[0]
const trainSpeed = ref(0)
const inputMode = ref<'time'|'troops'>('time')
const speedDays = ref(0)
const count = ref(1)
const fromTier = ref<number|''>('')
const toTier = ref<number>(1)
const rows = ref<any[]>([])

const froms = computed(()=>{
  const set = new Set<number>()
  ;(DATA as any[]).filter(r=>String(r.mode)==='promotion').forEach(r=>{ if (r.fromTier!=null) set.add(Number(r.fromTier)) })
  return Array.from(set).sort((a,b)=>a-b)
})
const tos = computed(()=>{
  const set = new Set<number>()
  ;(DATA as any[]).filter(r=>String(r.mode)===(mode===t('trainCalc.mode.training')?'training':'promotion')).forEach(r=>{ if (r.toTier!=null) set.add(Number(r.toTier)) })
  return Array.from(set).sort((a,b)=>a-b)
})

function setMode(m:'time'|'troops'){ inputMode.value=m }
function fmt(n:number, d=0){ return (n==null || isNaN(n)) ? '-' : Number(n).toLocaleString(undefined,{maximumFractionDigits:d,minimumFractionDigits:d}) }
function secToDHMS(sec:number){
  if (sec==null || isNaN(sec)) return '-'
  sec = Math.round(sec)
  const d = Math.floor(sec/86400); sec%=86400
  const h = Math.floor(sec/3600);  sec%=3600
  const m = Math.floor(sec/60); const s = sec%60
  const arr:any[]=[]
  if (d) arr.push(d + t('trainCalc.units.day'))
  if (h) arr.push(h + t('trainCalc.units.hour'))
  if (m) arr.push(m + t('trainCalc.units.min'))
  if (s || !arr.length) arr.push(s + t('trainCalc.units.sec'))
  return arr.join(' ')
}

function findRecord(modeName:string, from:any, to:number){
  return (DATA as any[]).find(r =>
    String(r.mode)===modeName &&
    String(r.fromTier??'')===String(from??'') &&
    Number(r.toTier)===to
  )
}

function run(){
  const modeName = (mode===t('trainCalc.mode.training')) ? 'training' : 'promotion'
  const rec:any = findRecord(modeName, (modeName==='promotion'?fromTier.value:''), toTier.value)
  if (!rec || rec.time_sec_per_troop==null){
    rows.value = []
    uni.showToast({ title: t('trainCalc.warn.noData'), icon:'none' })
    return
  }
  const speedPct = Math.max(0, Number(trainSpeed.value||0))
  const mult = 1 + (speedPct/100)
  const t1 = Number(rec.time_sec_per_troop)/mult
  rows.value = []
  if (inputMode.value==='time'){
    const days = Math.max(0, Number(speedDays.value||0))
    const totalSec = days * 86400
    const n = Math.floor(totalSec / t1)
    const tN = t1 * n
    rows.value.push({ name: t('trainCalc.rows.possibleTroops'), per1: '-', total: fmt(n,0) })
    rows.value.push({ name: t('trainCalc.rows.hogPoints'), per1: fmt(rec.hog_points_per_troop,2), total: fmt((rec.hog_points_per_troop||0)*n,0) })
    rows.value.push({ name: t('trainCalc.rows.kvkPoints'), per1: fmt(rec.kvk_points_per_troop,2), total: fmt((rec.kvk_points_per_troop||0)*n,0) })
    rows.value.push({ name: t('trainCalc.rows.govPoints'), per1: fmt(rec.governor_points_per_troop,2), total: fmt((rec.governor_points_per_troop||0)*n,0) })
    rows.value.push({ name: t('trainCalc.rows.powerInc'), per1: fmt((rec.power_increase||0)/Number(rec.amount||1),2), total: fmt(((rec.power_increase||0)/Number(rec.amount||1))*n,0) })
    rows.value.push({ name: t('trainCalc.rows.timePerOneApplied'), per1: secToDHMS(t1), total: secToDHMS(tN) })
  } else {
    const n = Math.max(1, Number(count.value||1))
    const tN = t1 * n
    rows.value.push({ name: t('trainCalc.rows.inputTroops'), per1: '-', total: fmt(n,0) })
    rows.value.push({ name: t('trainCalc.rows.hogPoints'), per1: fmt(rec.hog_points_per_troop,2), total: fmt((rec.hog_points_per_troop||0)*n,0) })
    rows.value.push({ name: t('trainCalc.rows.kvkPoints'), per1: fmt(rec.kvk_points_per_troop,2), total: fmt((rec.kvk_points_per_troop||0)*n,0) })
    rows.value.push({ name: t('trainCalc.rows.govPoints'), per1: fmt(rec.governor_points_per_troop,2), total: fmt((rec.governor_points_per_troop||0)*n,0) })
    rows.value.push({ name: t('trainCalc.rows.powerInc'), per1: fmt((rec.power_increase||0)/Number(rec.amount||1),2), total: fmt(((rec.power_increase||0)/Number(rec.amount||1))*n,0) })
    rows.value.push({ name: t('trainCalc.rows.timePerOneApplied'), per1: secToDHMS(t1), total: secToDHMS(tN) })
    rows.value.push({ name: t('trainCalc.rows.needAccelTime'), per1: '-', total: secToDHMS(tN) })
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
input{ padding:8px 10px; border:1px solid #ddd; border-radius:10px; background:#f8f9fb; min-width:140px; }
.pills{ gap:6px }
.pills button.active{ background:#dbeafe }
.actions{ display:flex; gap:8px; margin-top:6px; }
button{ padding:8px 10px; border:1px solid #ddd; border-radius:10px; background:#f1f5f9; }
.table{ width:100%; overflow:auto; }
.thead, .tr{ display:grid; grid-template-columns: 1.4fr 1fr 1fr; gap:8px; padding:8px 0; align-items:center; }
.thead{ background:#f6f7fb; font-weight:700; border-bottom:1px solid #eee; }
.td, .th{ font-size:13px; text-align:center; }
</style>
