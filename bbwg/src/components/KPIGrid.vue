<template>
  <view class="grid">
    <view class="kpi" v-for="(k,i) in items" :key="i">
      <view class="num">{{ k.value }}</view>
      <view class="lab">{{ k.label }}</view>
    </view>
  </view>
</template>
<script setup lang="ts">
defineProps<{ items: Array<{ label:string; value:string }> }>()
</script>
<style scoped>
.grid{ display:grid; grid-template-columns: repeat(3,1fr); gap:8px }
.kpi{ background:#f8fafc; border:1px solid #eee; border-radius:10px; padding:10px; text-align:center }
.num{ font-weight:700; font-size:18px }
.lab{ color:#6b7280; font-size:12px }
@media(min-width:900px){ .grid{ grid-template-columns: repeat(4,1fr) } }
</style>
