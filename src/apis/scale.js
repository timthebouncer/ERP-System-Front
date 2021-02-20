import request from "./https";

const api = {
    Login: {
        //登入
        login(formatData) {
            return request.post("/api/login", formatData);
        }
    },
    Logout: {
        //登出
      logout() {
          return request.post("/api/logout")
      }
    },
    DepotOrder: {
        //取得入料單號
        getNumber() {
            return request.get("/depotOrder/getNumber");
        },
        //新增入料
        addOrder(data) {
            return request.post("/depotOrder/addOrder", data);
        }
    },
    depotOrder: {

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
            return request.get("/product/getProduct?searchKey=&barcode", );
        }
    }
};

export default api;
