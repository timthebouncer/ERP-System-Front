import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import api from './apis/check'
import vuetify from "@/plugins/vuetify"
import scale from "./apis/scale";
import { VueMaskDirective } from 'v-mask'


Vue.directive('mask', VueMaskDirective);
Vue.config.productionTip = false;
Vue.prototype.$scale = scale;
Vue.prototype.$api = api;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");

// function handleOrientation(event){
//   store.state.testO = screen.orientation.angle
//   window.location.reload()
// }
// window.addEventListener('orientationchange',handleOrientation)
