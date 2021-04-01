<template>
  <div class="restore-wrapper">
    <div class="top-wrapper">
      <div class="enter-goods">輸入商品</div>
      <div class="barcode-wrapper">
        <div class="barcodeText">
          商品條碼
        </div>
        <div class="barcode-input">
          <v-text-field
            solo
            v-model="searchBarcode"
            v-on:keyup="updateLen"
            placeholder="可掃條碼 或 手動輸入"
          ></v-text-field>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="enter-goods">取消商品資料</div>
      <v-snackbar
        :timeout="2500"
        v-model="notify"
        :color="'success'"
        absolute
        centered
        elevation="10"
      >
        <h3 class="notification">{{ "取消入庫成功" }}</h3>
      </v-snackbar>
      <v-snackbar
        :timeout="2500"
        v-model="enterNotify"
        :color="'error'"
        absolute
        centered
        elevation="10"
      >
        <h3 class="notification">{{ "請輸入商品條碼" }}</h3>
      </v-snackbar>
      <v-snackbar
        :timeout="2500"
        v-model="amountExceed"
        :color="'error'"
        absolute
        centered
        elevation="10"
      >
        <h3 class="notification">{{ "取消數量不得大於目前庫存量!" }}</h3>
      </v-snackbar>
      <template v-if="searchBarcode !== ''">
        <div class="goods-detail">
          <div>商品名稱
            <span style="margin-left: 100px">{{
              productList.productName
            }}</span>
          </div>
          <div
            class="goods-display"
            v-if="productList.unit === '件' || productList.unit === '包'"
          >
            <div style="margin-left: -11px; width: 75px">數量</div>
            <Index v-on:changeNumber="getChangeNumber" />
          </div>
          <div v-else>
            數量
            <span style="margin-left: 138px">
              {{ productList.weight }}
            </span>
          </div>
        </div>
      </template>
      <template v-else>
        <span class="barcode-message">
          <v-icon>mdi-plus</v-icon>
          請掃條碼添加商品</span
        >
      </template>
    </div>
    <div class="footer">
      <div class="btn-wrapper">
        <v-btn @click="clearData">
          清空
        </v-btn>
        <v-btn @click="deleteInventory" depressed color="primary">
          確定
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import Index from "@/components/plusButton/index";

export default {
  name: "cancelRestore",
  components: { Index },
  data() {
    return {
      searchBarcode: "",
      productList: {},
      totalAmount: 0,
      status: false,
      notify: false,
      enterNotify: false,
      amountExceed:false
    };
  },
  async created() {
    const res = await this.$api.Login.loginIdentify();
    if (res.data === false) {
      this.$router.push("/");
    }
  },
  beforeUpdate: function() {
    if (this.status) {
      this.hide_alert();
    }
  },
  methods: {
    updateLen: _.debounce(function() {
      this.$api.Inventory.getStockDetail({
        barcode: this.searchBarcode
      })
        .then(res => {
          this.productList = res.data;
        })
        .catch(() => {
          this.productList = {};
          this.totalAmount = 0;
        });
    }, 500),
    deleteInventory() {
      if (this.searchBarcode) {
        if (this.totalAmount === 0) {
          this.$api.Inventory.deleteInventory({
            id: this.productList.inventoryId,
            barcode: this.searchBarcode,
            amount: this.productList.amount - 1
          }).then(() => {
            this.status = true;
            this.notify = true;
            this.clearData();
          });
        } else {
          this.$api.Inventory.deleteInventory({
            id: this.productList.inventoryId,
            barcode: this.searchBarcode,
            amount: this.productList.amount - this.totalAmount
          }).then(() => {
            this.status = true;
            this.notify = true;
            this.clearData();
          });
        }
      } else {
        this.enterNotify = true;
      }
    },
    clearData() {
      (this.searchBarcode = ""),
        (this.productList = {}),
        (this.totalAmount = 0);
    },
    getChangeNumber(e) {
      if(parseInt(e) > this.productList.amount){
        this.amountExceed = true
      }
      this.totalAmount = e;
    }
  }
};
</script>
<style scoped>
.restore-wrapper {
  width: 100%;
  height: 100%;
}
.barcode-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.barcodeText{
  width: 64px;
}
.barcode-input {
  position: relative;
  right: 3px;
  top: 15px;
  width: 230px;
}
.enter-goods {
  width: 100%;
  background-color: #ffffff;
}
.notification {
  text-align: center;
}
.goods-display {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px 10px 0px 10px;
}
.btn-wrapper {
  display: flex;
  justify-content: space-evenly;
  margin-top: 60px;
}
.barcode-message {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
</style>
