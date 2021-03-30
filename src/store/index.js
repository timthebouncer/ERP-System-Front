import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    shipment:{
      shipmentDate: '',
      orderNo: '',
      orderId: '',
      classItem: {id:'',className:''},
      clientItem: {id: '', name: "", phone: "", code: "", address: ""},
      receiveItem: {id: '', name: "", phone: "", code: "", address: ""},
      defaultReceiveInfo: 0,
      discount: 0,
      total: 0,
      payment: 1,
      shipment:1,
      temperatureCategory:1,
      volume: 1,
      shippingFee: 0,
      trackingNo:'',
      remark:'',
      orderItemRequestList:[],
      lastOrderItemList:[]
    },
    workDate: '',
    shipmentBacked: false,
    salesDetailed: false,
    shipmentEdited: false,
    successSnackbar: false,
    successMsg: '',
    menuName: ''
  },
  mutations: {},
  actions: {},
  modules: {}
});
