<template>
  <u-switch v-model="on" @change="toggle" />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const on = ref(false)
function applyDark(d:boolean){
  const html = document.documentElement
  if (d) html.setAttribute('data-theme','dark')
  else html.removeAttribute('data-theme')
}
function toggle(){
  applyDark(on.value)
  try{ localStorage.setItem('theme-dark', on.value ? '1' : '0') }catch{}
}
onMounted(()=>{
  try{ on.value = localStorage.getItem('theme-dark') === '1' }catch{}
  applyDark(on.value)
})
</script>
