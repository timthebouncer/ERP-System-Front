import request from "./https";

const api= {
  Commodity:{
    getCommodityDetail(params){
      return request.get('/product/getProduct',{params})
    }
 },
  Inventory:{
    addInventory(data){
      return request.post("/inventory/stockIn",data);
    },
  }
}
export default api;
