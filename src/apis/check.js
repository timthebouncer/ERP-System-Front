import request from "./https";

const api= {
  Login:{
    userLogin(formData) {
      return request.post("/api/login", formData)
    },
    loginIdentify(){
      return request.get('session/isAuthenticated')
    },
    logOut(){
      return request.post('/api/logout')
    }
    },
  Commodity:{
    getSalesProduct(params){
      return request.get('/product/getSalesProduct/',{params})
    },
    getCommodityDetail(params){
      return request.get('/product/getProduct',{params})
    },
 },
  Inventory:{
    deleteInventory(data){
      return request.put("/inventory/updateStock/",data);
    },
    getStockDetail(params){
      return request.get('inventory/getStock?', {params})
    },
    getInventoryLogList(data) {
      return request.post("/inventoryLog/list",data);
    },
  },
  Distribute:{
    getDistributeList(params){
      return request.get('deliveryOrder/orderList',{params})
    },
    getDistributeDetail(record){
      return request.get('/deliveryOrder/getDetail?orderId='+ record.orderId)
    },
    deleteOrderList(record) {
      return request.delete('/deliveryOrder/cancelOrder/'+ record.orderId);
    },
    addOrder(data){
      return request.post('/deliveryOrder/addOrder',data)
    },
    getOrderNo(params){
      return request.get('/deliveryOrder/getOrderSerialNo?',{params})
    }
  },
  Customer:{
    getClass() {
      return request.get("/class/classList");
    },
    onlyCustomerList() {
      return request.get('/client/clientList?searchKey=')
    },
  }
}
export default api;
