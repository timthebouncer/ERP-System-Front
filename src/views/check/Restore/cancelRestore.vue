<template>
  <div class="restore-wrapper">
    <div class="top-wrapper">
      <div class="enter-goods">輸入商品</div>
      <div class="barcode-wrapper">
        商品條碼
        <div>
          <v-text-field
            solo
            v-model="barCode"
            @input="barcodeChange"
            placeholder="可掃條碼 或 手動輸入"
            class="barcode-input"
          ></v-text-field>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="enter-goods">取消商品資料</div>
      <template v-if="barCode !== ''">
        <div
          class="goods-detail"
          v-for="item in barCodeSelection"
          :key="item.id"
        >
          <div>
            商品名稱
            <span style="margin-left: 100px">{{ item.name }}</span>
          </div>
          <div
            class="goods-display"
            v-if="item.unit === 'PIECE' || item.unit === 'PACK'"
          >
            <div style="margin-left: -32px;">數量</div>
            <div>
              <v-text-field
                v-model="item.stockAmount"
                @click:prepend="decrement(item)"
                prepend-icon="mdi-minus"
                @click:append-outer="increment(item)"
                append-outer-icon="mdi-plus"
                type="number"
                class="input-number"
              >
              </v-text-field>
            </div>
          </div>
          <div v-else>
            重量
            {{ item.weight }}
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
        <v-btn>
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
  name: "cancelRestore"
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
