<template>
  <view class="content">
    <calc-card title="Kingshot 计算器" desc="选择一个工具开始计算">
      <view class="grid">
        <u-grid :border="false" col="2">
          <u-grid-item @click="go('/pages/calculator/building')">
            <u-card :border="true">
              <view class="card-t">建筑计算器</view>
              <view class="card-d">计算升级资源与耗时</view>
            </u-card>
          </u-grid-item>
          <u-grid-item @click="go('/pages/calculator/gear')">
            <u-card :border="true">
              <view class="card-t">领主装备计算器</view>
              <view class="card-d">统计丝绸/金丝/草图/评分</view>
            </u-card>
          </u-grid-item>
          <u-grid-item @click="go('/pages/calculator/charm')">
            <u-card :border="true">
              <view class="card-t">领主宝石计算器</view>
              <view class="card-d">手册/图纸与属性增量</view>
            </u-card>
          </u-grid-item>
          <u-grid-item @click="go('/pages/calculator/training')">
            <u-card :border="true">
              <view class="card-t">训练/升阶计算器</view>
              <view class="card-d">部队数/加速与积分</view>
            </u-card>
          </u-grid-item>
        </u-grid>
      </view>
    </calc-card>
  </view>
</template>

<script setup lang="ts">
import CalcCard from '@/components/CalcCard.vue'
function go(url:string){ uni.navigateTo({ url }) }
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
.grid{ width:100%; max-width:900px }
.card-t{ font-weight:700; font-size:16px; color:#111827 }
.card-d{ font-size:12px; color:#6b7280 }
</style>
