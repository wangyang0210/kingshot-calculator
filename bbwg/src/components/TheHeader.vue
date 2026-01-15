<template>
   <wd-navbar
    v-if="!showCapsule"
    fixed
    placeholder
    safeAreaInsetTop
    :title="title"
    :left-text="leftText"
    custom-style="background-color: #FDFBF7 !important;"
    :left-arrow="showBack"
    @click-left="handleBack"
  >
  </wd-navbar>
  <wd-navbar
    v-if="showCapsule"
    fixed
    placeholder
    safeAreaInsetTop
    :title="title"
    :left-text="leftText"
    custom-style="background-color: #FDFBF7 !important;"
    @click-left="handleBack"
  >
    <template #capsule>
      <wd-navbar-capsule @back="handleBack" @back-home="handleBackHome" />
    </template>
  </wd-navbar>
</template>

<script setup lang="ts">

interface Props {
  title?: string
  leftText?: string
  showBack?: boolean // 是否显示返回按钮
  showCapsule?: boolean // 是否显示胶囊按钮（返回 + 回首页）
}

const props = withDefaults(defineProps<Props>(), {
  title: '奔奔小精灵',
  showBack: false,
  leftText: '',
  showCapsule: false
})

const handleBack = () => {
  // 如果页面栈只有一层（例如 Tab 页刷新后），返回可能失效，此时可以选择回首页
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    // 可选：如果无法返回，则跳转首页
    uni.reLaunch({ url: '/pages/index/index' })
  }
}

const handleBackHome = () => {
  uni.reLaunch({ url: '/pages/index/index' })
}
</script>

<style lang="scss" scoped>
:deep(.wd-navbar) {
  background-color: #FDFBF7 !important;
}

:deep(.wd-navbar__title) {
  font-weight: 900 !important;
  color: #4A3B32 !important;
}

.header-left {
  display: flex;
  align-items: center;
  padding-left: 16rpx;
  height: 100%; // 确保点击区域垂直居中
}
</style>
