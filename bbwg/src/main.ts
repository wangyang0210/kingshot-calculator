import { createSSRApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import uviewPlus from "uview-plus";
export function createApp() {
  const app = createSSRApp(App);
  app.use(i18n);
  app.use(uviewPlus);
  return {
    app,
  };
}
