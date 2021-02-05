import request from "./https";

const api= {
  Commodity:{
    getSalesProduct(params){
      return request.get('/product/getSalesProduct/',{params})
    },
    getCommodityDetail(params){
      return request.get('/product/getProduct',{params})
    },
 },
  Inventory:{
    addInventory(data){
      return request.post("/inventory/stockIn",data);
    },
  }
}
export default api;
