import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "@/plugins/vuetify"
import scale from "./apis/scale";

Vue.config.productionTip = false;
Vue.prototype.$scale = scale;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
