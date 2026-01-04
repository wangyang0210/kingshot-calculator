<template>
  <view class="container">
    <view class="form">
      <picker mode="selector" :range="options" :value="idx" @change="onPick">
        <view class="picker">{{ options[idx] }}</view>
      </picker>
      <input class="inp" type="number" v-model.number="start" :placeholder="t('calc.form.startLevel.placeholder','当前等级')" />
      <input class="inp" type="number" v-model.number="target" :placeholder="t('calc.form.targetLevel.placeholder','目标等级')" />
      <input class="inp" type="number" v-model.number="speedBonus" :placeholder="t('calc.form.speedBonus.label','建造速度(%)')" />
      <input class="inp" type="number" v-model.number="saulBonus" :placeholder="t('calc.form.saulBonus.label','萨乌尔折扣(%)')" />
      <switch :checked="doubleTime" @change="e=>doubleTime.value=e.detail.value"></switch>
      <view class="actions">
        <button class="btn" @tap="calc">{{ t('calc.form.actions.calculate','计算') }}</button>
        <button class="btn outline" @tap="clear">{{ t('calc.form.actions.clear','清空') }}</button>
      </view>
    </view>
    <view class="result" v-if="out">
      <view class="row"><text>{{ t('calc.table.col.bread','面包') }}</text><text>{{ out.meat }}</text></view>
      <view class="row"><text>{{ t('calc.table.col.wood','木材') }}</text><text>{{ out.wood }}</text></view>
      <view class="row"><text>{{ t('calc.table.col.stone','石材') }}</text><text>{{ out.coal }}</text></view>
      <view class="row"><text>{{ t('calc.table.col.iron','铁矿') }}</text><text>{{ out.iron }}</text></view>
      <view class="row"><text>{{ t('calc.table.col.truegold','黄金') }}</text><text>{{ out.crystals }}</text></view>
      <view class="row"><text>{{ t('calc.table.col.time','建造时间') }}</text><text>{{ out.timeSec }}</text></view>
    </view>
  </view>
</template>

<script setup>
import { t, setLang, getLang } from '../../../utils/i18n'
import { calculate } from '../../../composables/calc/building'
const keys = ['towncenter','embassy','academy','command','barracks','stable','range','infirmary','war-academy']
const options = keys.map(k => t('calc.form.building.option.'+k, k))
const idx = ref(0)
const start = ref(1)
const target = ref(5)
const speedBonus = ref(0)
const saulBonus = ref(0)
const doubleTime = ref(false)
const out = ref(null)
function onPick(e){ idx.value = Number(e.detail.value || 0) }
function calc(){
  const buildingKey = keys[idx.value]
  out.value = calculate({
    buildingKey,
    startLevel: start.value,
    targetLevel: target.value,
    speedBonus: speedBonus.value,
    saulBonus: saulBonus.value,
    doubleTime: doubleTime.value
  })
}
function clear(){ start.value = 1; target.value = 5; speedBonus.value = 0; saulBonus.value = 0; doubleTime.value = false; out.value = null }
onShow(() => { setLang(getLang()) })
</script>

<style>
.container { padding: 24rpx; }
.form { display: grid; grid-template-columns: 1fr; gap: 16rpx; background:#fff; border-radius: 16rpx; padding: 24rpx; }
.picker { padding: 16rpx; background: #f1f4f8; border-radius: 12rpx; }
.inp { background: #f1f4f8; border-radius: 12rpx; padding: 12rpx 16rpx; }
.btn { background: #2b7cff; color: #fff; border-radius: 12rpx; padding: 12rpx 16rpx; }
.btn.outline { background:#fff; color:#2b7cff; border:2rpx solid #2b7cff; }
.actions { display:flex; gap:12rpx; }
.result { margin-top: 24rpx; background:#fff; border-radius:16rpx; padding: 24rpx; }
.row { display:flex; justify-content:space-between; padding: 8rpx 0; color:#111; }
</style>
