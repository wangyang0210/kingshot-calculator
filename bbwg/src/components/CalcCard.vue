<template>
  <view class="ks-card">
    <view v-if="title" class="ks-title">{{ title }}</view>
    <view v-if="desc" class="ks-desc">{{ desc }}</view>
    <slot />
  </view>
</template>
<script setup lang="ts">
defineProps<{ title?: string; desc?: string }>()
</script>
