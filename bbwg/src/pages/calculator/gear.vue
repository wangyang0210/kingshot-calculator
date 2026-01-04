<template>
  <view class="page">
    <calc-card :title="t('calcGear.title')" :desc="t('calcGear.desc')">

      <view class="slots">
        <label v-for="(s, i) in slots" :key="i" class="slot">
          <checkbox :value="s" v-model="checked" />
          <text class="name">{{ t('calcGear.slots.'+baseSlotKeys[i]) }}</text>
          <text class="pill" :class="pillClass(slotClass(s))">{{ slotClass(s) }}</text>
        </label>
      </view>

      <view class="row">
        <view class="label">{{ t('calcGear.cols.current') }}</view>
        <picker mode="selector" :range="tierLabels" @change="e=>{fromIdx=Number(e.detail.value)}">
          <view class="picker">{{ tierLabels[fromIdx] }}</view>
        </picker>
      </view>
      <view class="row">
        <view class="label">{{ t('calcGear.cols.target') }}</view>
        <picker mode="selector" :range="tierLabels" @change="e=>{toIdx=Number(e.detail.value)}">
          <view class="picker">{{ tierLabels[toIdx] }}</view>
        </picker>
      </view>
      <view class="actions">
        <u-button type="primary" @click="run">{{ t('calcGear.actions.calculate') }}</u-button>
      </view>
    </calc-card>

    <calc-card>
      <view class="grid">
        <view class="kpi"><view class="num">{{ fmt(total.satin) }}</view><view>{{ t('calcGear.kpi.satin') }}</view></view>
        <view class="kpi"><view class="num">{{ fmt(total.thread) }}</view><view>{{ t('calcGear.kpi.thread') }}</view></view>
        <view class="kpi"><view class="num">{{ fmt(total.sketch) }}</view><view>{{ t('calcGear.kpi.sketch') }}</view></view>
        <view class="kpi"><view class="num">{{ fmt(total.score) }}</view><view>{{ t('calcGear.kpi.score') }}</view></view>
      </view>
    </calc-card>

    <calc-card v-if="rows.length">
      <view class="table">
        <view class="thead">
          <view class="th">{{ t('calcGear.cols.slot') }}</view>
          <view class="th">{{ t('calcGear.cols.class') }}</view>
          <view class="th">{{ t('calcGear.cols.satin') }}</view>
          <view class="th">{{ t('calcGear.cols.thread') }}</view>
          <view class="th">{{ t('calcGear.cols.sketch') }}</view>
          <view class="th">{{ t('calcGear.cols.score') }}</view>
        </view>
        <view class="tbody">
          <view class="tr" v-for="(r, i) in rows" :key="i">
            <view class="td">{{ r.slot }}</view>
            <view class="td">{{ r.cls }}</view>
            <view class="td">{{ fmt(r.satin) }}</view>
            <view class="td">{{ fmt(r.thread) }}</view>
            <view class="td">{{ fmt(r.sketch) }}</view>
            <view class="td">{{ fmt(r.score) }}</view>
          </view>
          <view class="tr total">
            <view class="td">{{ t('calcGear.cols.total') }}</view>
            <view class="td">{{ t('calcGear.cols.selected').replace('{n}', String(rows.length)) }}</view>
            <view class="td">{{ fmt(total.satin) }}</view>
            <view class="td">{{ fmt(total.thread) }}</view>
            <view class="td">{{ fmt(total.sketch) }}</view>
            <view class="td">{{ fmt(total.score) }}</view>
          </view>
        </view>
      </view>
    </calc-card>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import gear from '@/data/governor-gear.json'
import CalcCard from '@/components/CalcCard.vue'

const { t } = useI18n()
const slots = [t('calcGear.slots.hat'), t('calcGear.slots.necklace'), t('calcGear.slots.armor'), t('calcGear.slots.pants'), t('calcGear.slots.ring'), t('calcGear.slots.staff')]
const baseSlotKeys = ['hat','necklace','armor','pants','ring','staff']
const slotClass = (name:string) => {
  const cav = t('calcGear.classes.cavalry'), inf=t('calcGear.classes.infantry'), rng=t('calcGear.classes.archer')
  const map:any = { [slots[0]]: cav, [slots[1]]: cav, [slots[2]]: inf, [slots[3]]: inf, [slots[4]]: rng, [slots[5]]: rng }
  return map[name] || ''
}
const pillClass = (cls:string) => cls===t('calcGear.classes.cavalry') ? 'pill pill-cav' : cls===t('calcGear.classes.infantry') ? 'pill pill-inf' : 'pill pill-rng'

const checked = ref<string[]>([])
const keys = Object.keys((gear as any).steps)
function tierLabelByIndex(idx:number){
  const raw = keys[idx]
  const mapKO:Record<string,string> = {
    '고급':'calcGear.tiers.basic',
    '고급 (★1)':'calcGear.tiers.basic_1'
  }
  return t(mapKO[raw] || raw)
}
const tierLabels = keys.map((_,i)=>tierLabelByIndex(i))
let fromIdx = 0
let toIdx = keys.length-1

const rows = ref<any[]>([])
const total = ref({ satin:0, thread:0, sketch:0, score:0 })

function sumRange(from:number, to:number){
  if (from>=to) return { satin:0, thread:0, sketch:0, score:0 }
  let s=0,t=0,sk=0,sc=0
  for(let i=from+1;i<=to;i++){
    const k = keys[i]
    const c:any = (gear as any).steps[k] || {}
    s += +c.satin || 0
    t += +c.thread || 0
    sk+= +c.sketch || 0
    sc+= +c.score || 0
  }
  return { satin:s, thread:t, sketch:sk, score:sc }
}
function fmt(n:number){ return (n||0).toLocaleString() }

function run(){
  if (!checked.value.length){ uni.showToast({ title: t('calcGear.alerts.needSlot'), icon:'none' }); return }
  if (fromIdx>=toIdx){ uni.showToast({ title: t('calcGear.alerts.invalidRange'), icon:'none' }); return }
  rows.value = []
  total.value = { satin:0, thread:0, sketch:0, score:0 }
  checked.value.forEach(slot => {
    const r = sumRange(fromIdx, toIdx)
    total.value.satin += r.satin
    total.value.thread+= r.thread
    total.value.sketch+= r.sketch
    total.value.score += r.score
    rows.value.push({ slot, cls: slotClass(slot), ...r })
  })
}
</script>

<style scoped>
.page{ padding:12px; }
.card{ background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:12px; margin-bottom:12px; }
.title{ font-weight:700; font-size:18px; margin-bottom:6px; }
.desc{ color:#666; font-size:13px; margin-bottom:8px; }
.slots{ display:flex; flex-wrap:wrap; gap:8px; margin-bottom:8px; }
.slot{ display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border:1px solid #ddd; border-radius:10px; background:#f5f5f7; }
.pill{ font-size:11px; padding:3px 8px; border-radius:999px; border:1px solid rgba(0,0,0,.08); background:#fff; color:#222 }
.pill-cav{ box-shadow: inset 0 0 0 999px rgba(59,130,246,.12) }
.pill-inf{ box-shadow: inset 0 0 0 999px rgba(16,185,129,.14) }
.pill-rng{ box-shadow: inset 0 0 0 999px rgba(245,158,11,.16) }
.row{ display:flex; align-items:center; gap:10px; margin:8px 0; }
.label{ width:140px; color:#333; font-size:14px; }
.picker{ padding:8px 10px; border:1px solid #ddd; border-radius:10px; background:#f8f9fb; min-width:200px; }
.actions{ display:flex; gap:8px; margin-top:6px; }
button{ padding:8px 10px; border:1px solid #ddd; border-radius:10px; background:#f1f5f9; }
.grid{ display:grid; grid-template-columns: repeat(4,1fr); gap:8px; }
.kpi{ background:#f8fafc; border:1px solid #eee; border-radius:10px; padding:10px; text-align:center; }
.kpi .num{ font-weight:700; font-size:18px; }
.table{ width:100%; overflow:auto; }
.thead, .tr{ display:grid; grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr 1fr; gap:8px; padding:8px 0; align-items:center; }
.thead{ background:#f6f7fb; font-weight:700; border-bottom:1px solid #eee; }
.td, .th{ font-size:13px; text-align:center; }
.total{ font-weight:700; background:#fbfbfb }
</style>
