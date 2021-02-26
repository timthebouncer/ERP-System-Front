import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    shipment:{
      shipmentDate: '',
      orderNo: '',
      classItem: {id:'',className:''},
      clientItem: {id: '', name: "", phone: "", code: "", address: ""},
      receiveItem: {id: '', name: "", phone: "", code: "", address: ""},
      discount: 0,
      total: 0,
      payment: 1,
      shipment:1,
      temperatureCategory:1,
      volume: 1,
      shippingFee: 0,
      trackingNo:'',
      remark:'',
      orderItemRequestList:[]
    },
    workDate: '',
    shipmentBacked: false,
    salesDetailed: false
  },
  mutations: {},
  actions: {},
  modules: {}
});
