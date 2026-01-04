<template>
  <view class="page">
    <calc-card :title="t('calc.title')" :desc="t('calc.desc')">
      <view class="form">
        <view class="row">
          <view class="label">{{ t('calc.form.building.label') }}</view>
          <picker mode="selector" :range="buildingOptions" range-key="label" @change="onBuildingChange">
            <view class="picker">{{ buildingLabel(selectedBuilding) }}</view>
          </picker>
        </view>
        <view class="row">
          <view class="label">{{ t('calc.form.startLevel') }}</view>
          <u-number-box v-model="startLevel" :min="1" />
        </view>
        <view class="row">
          <view class="label">{{ t('calc.form.targetLevel') }}</view>
          <u-number-box v-model="targetLevel" :min="2" />
        </view>
        <view class="row">
          <view class="label">{{ t('calc.form.speedBonus') }}</view>
          <u-input type="number" v-model="speedBonus" placeholder="0" />
        </view>
        <view class="row">
          <view class="label">{{ t('calc.form.saulBonus') }}</view>
          <u-input type="number" v-model="saulBonus" placeholder="0" />
        </view>
        <view class="row">
          <view class="label">{{ t('calc.form.wolfBonus') }}</view>
          <u-input type="number" v-model="wolfBonus" placeholder="0" />
        </view>
        <view class="row">
          <view class="label">{{ t('calc.form.positionBonus') }}</view>
          <u-input type="number" v-model="positionBonus" placeholder="0" />
        </view>
        <view class="row">
          <view class="label">{{ t('calc.form.doubleTime') }}</view>
          <u-switch v-model="doubleTime" />
        </view>
        <view class="row">
          <view class="label">{{ t('calc.form.includePrereq') }}</view>
          <u-switch v-model="includePrereq" />
        </view>
        <view class="actions">
          <u-button type="primary" @click="runCalc">{{ t('calc.form.actions.calculate') }}</u-button>
          <u-button @click="reset">{{ t('calc.form.actions.clear') }}</u-button>
        </view>
      </view>
    </calc-card>

    <calc-card v-if="summary" :title="`${buildingLabel(selectedBuilding)} Lv.${startLevel} → Lv.${targetLevel}`">
      <kpi-grid :items="kpiItems" />
    </calc-card>

    <calc-card v-if="lines.length" :title="includePrereq ? t('calc.table.titleWithPrereq') : t('calc.table.title')">
      <view class="table">
        <view class="thead">
          <view class="th">#</view>
          <view class="th">{{ t('calc.table.col.building') }}</view>
          <view class="th">{{ t('calc.table.col.level') }}</view>
          <view class="th">{{ t('calc.table.col.bread') }}</view>
          <view class="th">{{ t('calc.table.col.wood') }}</view>
          <view class="th">{{ t('calc.table.col.stone') }}</view>
          <view class="th">{{ t('calc.table.col.iron') }}</view>
          <view class="th" v-if="hasGold">{{ t('calc.table.col.truegold') }}</view>
          <view class="th">{{ t('calc.table.col.time') }}</view>
        </view>
        <view class="tbody">
          <view class="tr" v-for="(ln, idx) in lines" :key="idx">
            <view class="td">{{ idx+1 }}</view>
            <view class="td">{{ buildingLabel(ln.bKey) }}</view>
            <view class="td">{{ ln.from }} → {{ ln.to }}</view>
            <view class="td">{{ fmt(ln.meatAdj) }}</view>
            <view class="td">{{ fmt(ln.woodAdj) }}</view>
            <view class="td">{{ fmt(ln.coalAdj) }}</view>
            <view class="td">{{ fmt(ln.ironAdj) }}</view>
            <view class="td" v-if="hasGold">{{ fmt(ln.crystals || 0) }}</view>
            <view class="td">{{ formatTime(ln.timeAdj) }}</view>
          </view>
        </view>
      </view>
    </calc-card>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import dataJson from '@/data/buildings-calc.json'
import CalcCard from '@/components/CalcCard.vue'
import KPIGrid from '@/components/KPIGrid.vue'

const { t } = useI18n()

type Row = { level:number, meat:number, wood:number, coal:number, iron:number, crystals:number, time:number, _req?:string }
type BuildingData = Record<string, Row[]>

const buildingOptions = [
  { value: 'towncenter', label: t('calc.form.building.option.towncenter') },
  { value: 'embassy',    label: t('calc.form.building.option.embassy') },
  { value: 'academy',    label: t('calc.form.building.option.academy') },
  { value: 'command',    label: t('calc.form.building.option.command') },
  { value: 'barracks',   label: t('calc.form.building.option.barracks') },
  { value: 'stable',     label: t('calc.form.building.option.stable') },
  { value: 'range',      label: t('calc.form.building.option.range') },
  { value: 'infirmary',  label: t('calc.form.building.option.infirmary') },
  { value: 'war-academy',label: t('calc.form.building.option.war-academy') }
]
const selectedBuilding = ref('towncenter')
const startLevel = ref(1)
const targetLevel = ref(2)
const speedBonus = ref(0)
const saulBonus = ref(0)
const wolfBonus = ref(0)
const positionBonus = ref(0)
const doubleTime = ref(false)
const includePrereq = ref(false)

const summary = ref<{meat:number,wood:number,coal:number,iron:number,crystals:number,timeSec:number}|null>(null)
const lines = ref<any[]>([])
const hasGold = computed(() => lines.value.some(x => (x.crystals||0)>0))

function onBuildingChange(e: any){
  const idx = e?.detail?.value ? Number(e.detail.value) : 0
  selectedBuilding.value = buildingOptions[idx].value
}
function buildingLabel(v:string){
  const m:Record<string,string> = {
    'towncenter': t('calc.form.building.option.towncenter'),
    'embassy': t('calc.form.building.option.embassy'),
    'academy': t('calc.form.building.option.academy'),
    'command': t('calc.form.building.option.command'),
    'barracks': t('calc.form.building.option.barracks'),
    'stable': t('calc.form.building.option.stable'),
    'range': t('calc.form.building.option.range'),
    'infirmary': t('calc.form.building.option.infirmary'),
    'war-academy': t('calc.form.building.option.war-academy')
  }
  return m[v] || v
}

function fmt(n:number){ return (n||0).toLocaleString() }
function formatTime(sec:number){
  sec = Math.floor(sec||0)
  const d = Math.floor(sec/86400); sec%=86400
  const h = Math.floor(sec/3600);  sec%=3600
  const m = Math.floor(sec/60); const s = sec%60
  const arr = []
  if (d) arr.push(d + t('calc.time.daySuffix'))
  if (h) arr.push(h + t('calc.time.hourSuffix'))
  if (m) arr.push(m + t('calc.time.minSuffix'))
  if (s || !arr.length) arr.push(s + t('calc.time.secSuffix'))
  return arr.join(' ')
}

function computeTimeFactor(){
  const speed = (Number(speedBonus.value)||0) + (Number(wolfBonus.value)||0) + (Number(positionBonus.value)||0)
  const law = doubleTime.value ? 0.8 : 1.0
  return law / (1 + speed/100)
}
function applySaul(n:number){ const rate = Math.max(0, 1-(Number(saulBonus.value)||0)/100); return Math.round(n*rate) }

function tableToRows(table:any[]):Row[]{
  if (!Array.isArray(table) || !table.length) return []
  const header = table[0].map(String)
  const body = table.slice(1)
  const idx:any = {
    level: header.findIndex(h => String(h).includes('레벨')),
    meat: header.indexOf('빵'),
    wood: header.indexOf('나무'),
    coal: header.indexOf('석재'),
    iron: header.indexOf('철'),
    gold: header.indexOf('순금')>=0 ? header.indexOf('순금') : header.indexOf('트루골드')>=0 ? header.indexOf('트루골드') : header.indexOf('크리스탈'),
    time: header.findIndex(h => String(h).includes('시간'))
  }
  return body.map((row:any[]) => {
    function num(x:any){ const n = Number(String(x).replace(/,/g,'')); return Number.isFinite(n)? n: 0 }
    function toLevel(x:any){
      const s = String(x).toUpperCase()
      if (/^TG\d+$/.test(s)) return 30 + (+s.slice(2))*5
      if (/^\d+$/.test(s)) return +s
      const m = s.match(/^(\d+)-(\d+)$/); if (m) return (+m[1])+(+m[2])
      return parseInt(s,10) || 0
    }
    return {
      level: toLevel(row[idx.level]),
      meat: num(row[idx.meat]),
      wood: num(row[idx.wood]),
      coal: num(row[idx.coal]),
      iron: num(row[idx.iron]),
      crystals: num(row[idx.gold]),
      time: Math.round(((typeof row[idx.time]==='number')? row[idx.time]*60 : num(row[idx.time]))||0),
      _req: ''
    }
  }).filter(r => r.level>0)
}

const allData:BuildingData = {}
;(dataJson as any).buildings.forEach((b:any) => {
  const slug = String(b.slug||'').toLowerCase()
  if (!slug) return
  if (Array.isArray(b.table) && b.table.length){
    allData[slug] = tableToRows(b.table)
  }
  if (Array.isArray(b.variants)){
    b.variants.forEach((v:any) => {
      const key = `${slug}:${String(v.key||'').toLowerCase()}`
      if (Array.isArray(v.table) && v.table.length) allData[key] = tableToRows(v.table)
    })
  }
})

function mapKey(uiKey:string){
  const m:any = { towncenter:{slug:'towncenter'}, embassy:{slug:'embassy'}, academy:{slug:'academy'}, command:{slug:'command'},
    barracks:{slug:'camp', variant:'infantry'}, stable:{slug:'camp',variant:'cavalry'}, range:{slug:'camp',variant:'archer'}, infirmary:{slug:'infirmary'}, 'war-academy':{slug:'war-academy'} }
  const mm = m[uiKey] || { slug: uiKey }
  return mm.variant ? `${mm.slug}:${mm.variant}` : mm.slug
}

function reset(){
  selectedBuilding.value = 'towncenter'
  startLevel.value = 1
  targetLevel.value = 2
  speedBonus.value = 0
  saulBonus.value = 0
  wolfBonus.value = 0
  positionBonus.value = 0
  doubleTime.value = false
  includePrereq.value = false
  summary.value = null
  lines.value = []
}

function runCalc(){
  const dataKey = mapKey(selectedBuilding.value)
  const rows = allData[dataKey] || []
  if (!rows.length){ uni.showToast({ title: t('calc.alert.noData'), icon:'none' }); return }
  const from = Math.max(1, Number(startLevel.value)||1)
  const to = Math.max(from+1, Number(targetLevel.value)||from+1)
  const tf = computeTimeFactor()
  let total = { meat:0, wood:0, coal:0, iron:0, crystals:0, time:0 }
  const out:any[] = []
  for (let lv=from+1; lv<=to; lv++){
    const r = rows.find(x => x.level===lv)
    if (!r) continue
    total.meat += r.meat||0
    total.wood += r.wood||0
    total.coal += r.coal||0
    total.iron += r.iron||0
    total.crystals += r.crystals||0
    total.time += r.time||0
    out.push({
      bKey: selectedBuilding.value,
      from: lv-1, to: lv,
      meatAdj: applySaul(r.meat||0),
      woodAdj: applySaul(r.wood||0),
      coalAdj: applySaul(r.coal||0),
      ironAdj: applySaul(r.iron||0),
      crystals: r.crystals||0,
      timeAdj: Math.round((r.time||0)*tf)
    })
  }
  summary.value = {
    meat: applySaul(total.meat),
    wood: applySaul(total.wood),
    coal: applySaul(total.coal),
    iron: applySaul(total.iron),
    crystals: total.crystals,
    timeSec: Math.round(total.time*tf)
  }
  lines.value = out
}
const kpiItems = computed(()=>[
  { label: t('calc.table.col.bread'), value: fmt(summary.value?.meat||0) },
  { label: t('calc.table.col.wood'), value: fmt(summary.value?.wood||0) },
  { label: t('calc.table.col.stone'), value: fmt(summary.value?.coal||0) },
  { label: t('calc.table.col.iron'), value: fmt(summary.value?.iron||0) },
  ...(summary.value?.crystals ? [{ label: t('calc.table.col.truegold'), value: fmt(summary.value?.crystals||0) }] : []),
  { label: t('calc.table.col.time'), value: formatTime(summary.value?.timeSec||0) }
])
</script>

<style scoped>
.page{ padding:12px; display:flex; flex-direction:column; gap:12px }
.form .row{ display:flex; align-items:center; gap:10px; margin:8px 0; }
.form .label{ width:140px; color:#333; font-size:14px; }
.picker{ padding:8px 10px; border:1px solid #ddd; border-radius:10px; background:#f8f9fb; min-width:200px; }
.actions{ display:flex; gap:8px; margin-top:6px; }
.table{ width:100%; overflow:auto; }
.thead, .tr{ display:grid; grid-template-columns: 40px 1.4fr 140px 1fr 1fr 1fr 1fr 1fr 140px; gap:8px; padding:8px 0; align-items:center; }
.thead{ background:#f6f7fb; font-weight:700; border-bottom:1px solid #eee; }
.td, .th{ font-size:13px; text-align:center; }
</style>
