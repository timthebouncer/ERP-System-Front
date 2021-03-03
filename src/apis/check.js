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
  }
}
export default api;
