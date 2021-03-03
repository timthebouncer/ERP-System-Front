<template>
  <div class="restore-wrapper">
    <div class="top-wrapper">
      <div class="enter-goods">輸入商品</div>
      <div class="barcode-wrapper">
        商品條碼
        <div>
          <v-text-field
            solo
            v-model="searchBarcode"
            @input="barcodeChange"
            placeholder="可掃條碼 或 手動輸入"
            class="barcode-input"
          ></v-text-field>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="enter-goods">商品資料</div>
      <v-alert
        :value="status"
        type="info"
        elevation="6"
        style="width: 200px; margin: 0 auto"
      >
        入庫成功
      </v-alert>
      <template v-if="searchBarcode !== ''">
        <div class="goods-detail">
          <div>
            商品名稱
            <span style="margin-left: 100px">{{
              productList.productName
            }}</span>
          </div>
          <div
            class="goods-display"
            v-if="productList.unit === '件' || productList.unit === '包'"
          >
            <div style="margin-left: -32px;">數量</div>
            <div>
              <v-text-field
                v-model="totalAmount"
                @click:prepend="decrement()"
                prepend-icon="mdi-minus"
                @click:append-outer="increment()"
                append-outer-icon="mdi-plus"
                type="number"
                class="input-number"
              >
              </v-text-field>
            </div>
          </div>
          <div v-else>
            數量
            <span style="margin-left: 138px">
            {{productList.weight}}
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
        <v-btn @click="addInventory" depressed color="primary">
          確定
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Restore",
  data() {
    return {
      searchBarcode: "",
      productList: {},
      totalAmount: 0,
      status: false
    };
  },
    // async created() {
    //   const res = await this.$api.Login.loginIdentify()
    //   console.log(res)
    //   if(res.data === false){
    //     this.$router.push('/')
    //   }
    // },
  beforeUpdate: function() {
    if (this.status) {
      this.hide_alert();
    }
  },
  methods: {
    barcodeChange() {
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
    },
    addInventory() {
      if(this.totalAmount === 0){
        this.$api.Inventory.deleteInventory({
          id: this.productList.inventoryId,
          barcode: this.searchBarcode,
          amount: this.productList.amount + 1
        }).then(() => {
          this.status = true;
          this.clearData();
        });
      }else {
        this.$api.Inventory.deleteInventory({
          id: this.productList.inventoryId,
          barcode: this.searchBarcode,
          amount: this.productList.amount + this.totalAmount
        }).then(() => {
          this.status = true;
          this.clearData();
        });
      }
    },
    clearData() {
      (this.searchBarcode = ""),
        (this.productList = {}),
        (this.totalAmount = 0);
    },
    hide_alert() {
      window.setInterval(() => {
        this.status = false;
      }, 6000);
    },
    decrement() {
      if (this.totalAmount > 0) {
        this.totalAmount -= 1;
      }
    },
    increment() {
      this.totalAmount += 1;
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
  display: flex;
  align-items: center;
}
.barcode-input {
  display: flex;
  text-align-all: center;
  margin: 30px 0 0 30px;
  width: 250px;
}
.enter-goods {
  width: 100%;
  background-color: #ffffff;
}
.content-wrapper {
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
  margin: 0 100px 0 110px;
  line-height: 8;
}
.input-number {
  width: 180px;
}
</style>
