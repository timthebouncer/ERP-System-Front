import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import api from './apis/check'
import '@mdi/font/css/materialdesignicons.css'
import vuetify from "@/plugins/vuetify"
import scale from "./apis/scale";

Vue.config.productionTip = false;
Vue.prototype.$scale = scale;
Vue.prototype.$api = api

new Vue({
  router,
  store,
  icons: {
    iconfont: 'mdi'
  },
  vuetify,
  render: h => h(App)
}).$mount("#app");
