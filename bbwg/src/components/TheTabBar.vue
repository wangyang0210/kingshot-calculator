<template>
  <view class="tab-bar-placeholder"></view>
  <view class="tab-bar">
    <view 
      v-for="(item, index) in list" 
      :key="index" 
      class="tab-item"
      :class="{ active: modelValue === index }"
      @click="switchTab(index)"
    >
      <view class="icon-box">
        <wd-icon 
          :name="item.icon" 
          size="24px"
          :color="modelValue === index ? '#F4C63F' : '#C0C4CC'"
        ></wd-icon>
      </view>
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const list = [
  { text: '首页', icon: 'home' },
  { text: '资料库', icon: 'server' },
  { text: '计算器', icon: 'edit' },
  // { text: '我的', icon: 'user' }
]

const switchTab = (index: number) => {
  emit('update:modelValue', index)
  emit('change', index)
}
</script>

<style lang="scss" scoped>
.tab-bar-placeholder {
  height: 100rpx;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #FFFFFF;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 4rpx solid #4A3B32; 
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
  box-shadow: 0 -4rpx 10rpx rgba(0,0,0,0.05);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  
  .tab-text {
    font-size: 22rpx;
    margin-top: 6rpx;
    color: #C0C4CC;
    font-weight: bold;
  }
  
  &.active {
    .tab-text {
      color: #F4C63F;
    }
  }
}
</style>
