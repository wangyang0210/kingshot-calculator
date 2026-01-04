import App from './App.vue'
export function createApp() {
  const app = Vue.createApp(App)
  return { app }
}
