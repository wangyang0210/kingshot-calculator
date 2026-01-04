<template>
  <view class="container">
    <view class="head"><text class="title">{{ t('waracademy.infantry.title','步兵') }}</text></view>
    <view class="meta" v-if="req">
      <view class="row"><text>{{ t('waracademy.meta.towncenter','主城') }}</text><text>{{ req.building.towncenter }}</text></view>
      <view class="row"><text>{{ t('waracademy.meta.waracademy','战争学院') }}</text><text>{{ req.building.waracademy }}</text></view>
      <view class="row"><text>{{ t('waracademy.meta.total_time','总研究时间') }}</text><text>{{ req.research_time_days }}{{ t('waracademy.meta.days','天') }}</text></view>
      <view class="row"><text>{{ t('waracademy.meta.bread','粮食') }}</text><text>{{ fmt(req.bread) }}</text></view>
      <view class="row"><text>{{ t('waracademy.meta.wood','木材') }}</text><text>{{ fmt(req.wood) }}</text></view>
      <view class="row"><text>{{ t('waracademy.meta.stone','石料') }}</text><text>{{ fmt(req.stone) }}</text></view>
      <view class="row"><text>{{ t('waracademy.meta.iron','铁') }}</text><text>{{ fmt(req.iron) }}</text></view>
      <view class="row"><text>{{ t('waracademy.meta.gold','金币') }}</text><text>{{ fmt(req.gold) }}</text></view>
      <view class="row"><text>{{ t('waracademy.meta.dust','真金粉末') }}</text><text>{{ fmt(req.dust) }}</text></view>
    </view>
    <view class="bonus" v-if="bon">
      <view class="row"><text>{{ t('waracademy.bonuses.squad_capacity') }}</text><text>{{ bon.squad_capacity }}</text></view>
      <view class="row"><text>{{ t('waracademy.bonuses.health') }}</text><text>{{ bon.health }}</text></view>
      <view class="row"><text>{{ t('waracademy.bonuses.lethality') }}</text><text>{{ bon.lethality }}</text></view>
      <view class="row"><text>{{ t('waracademy.bonuses.attack') }}</text><text>{{ bon.attack }}</text></view>
      <view class="row"><text>{{ t('waracademy.bonuses.defense') }}</text><text>{{ bon.defense }}</text></view>
      <view class="row"><text>{{ t('waracademy.bonuses.rally_capacity') }}</text><text>{{ bon.rally_capacity }}</text></view>
    </view>
  </view>
</template>

<script setup>
import { t, setLang, getLang } from '../../../utils/i18n'
import data from '../../../data/waracademy-infantry.json'
const req = data.requirements
const bon = data.bonuses
function fmt(n){ return (n||0).toLocaleString() }
onShow(() => { setLang(getLang()) })
</script>

<style>
.container { padding: 24rpx; }
.head { margin-bottom: 12rpx; }
.title { font-weight: 600; color:#111; }
.meta, .bonus { background:#fff; border-radius:16rpx; padding:24rpx; margin-bottom:16rpx; }
.row { display:flex; justify-content:space-between; padding:8rpx 0; }
</style>
