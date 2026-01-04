<template>
  <view class="row">
    <view class="label">{{ label }}</view>
    <slot />
    <view v-if="help" class="help">{{ help }}</view>
  </view>
</template>
<script setup lang="ts">
defineProps<{ label: string; help?: string }>()
</script>
<style scoped>
.row{ display:flex; align-items:center; gap:10px; margin:8px 0; flex-wrap:wrap }
.label{ width:140px; color:#333; font-size:14px }
.help{ color:#6b7280; font-size:12px }
</style>
