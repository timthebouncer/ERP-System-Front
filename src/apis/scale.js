import request from "./https";

const api = {
    Login: {
        //登入
        login(formatData) {
            return request.post("/login", formatData);
        }
    },
    Logout: {
        //登出
      logout() {
          return request.post("/logout")
      }
    },
    Inventory: {
        //新增庫存
        stockIn(formatData) {
            return request.post("/inventory/stockIn", formatData);
        },
        //編輯庫存
        updateStock(params) {
            return request.put("/inventory/updateStock", params);
        },
        print(data){
            return request.post('/printTask',data)
        }
    },
    ProductDepot: {
        //取得物料倉庫
        productDepotList() {
            return request.get("/productDepot/productDepotList?depotName");
        },
    },
    DepotOrder: {
        //取得入料單號
        getNumber() {
            return request.get("/materialDepotOrder/getNumber");
        },
        //新增入料
        addOrder(data) {
            return request.post("/materialDepotOrder/addOrder", data);
        },
        //未使用入料列表
        getUnusedList() {
            return request.get("/materialDepotOrder/getUnusedList");
        }
    },
    Material: {
        //取得物料名稱
        getList() {
            return request.get("/material/getList");
        }
    },
    Product: {
        //取得所有商品資料
        getProduct() {
            return request.get("/product/getProduct?searchKey=&barcode");
        }
    }
};

export default api;
