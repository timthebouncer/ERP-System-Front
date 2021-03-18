<template>
  <v-container class="container">
    <v-snackbar v-model="snackbar" centered color="red" timeout="2000">
      <span>{{ messageText }}</span>
    </v-snackbar>
    <div class="text-h4 text-center">
      <span>出貨單</span><v-divider class="mb-1"></v-divider>
    </div>
    <div style="font-size: large;">
      <v-row>
        <v-col class="col-3 pr-0">工作日期:</v-col>
        <v-col>{{ workDate }}</v-col>
      </v-row>
      <v-row>
        <v-col class="col-3 pr-0">出貨日期:</v-col>
        <v-col>{{ shipmentData.shipmentDate }}</v-col>
      </v-row>
      <v-row>
        <v-col class="col-3 pr-0">出貨單號:</v-col>
        <v-col>{{ shipmentData.orderNo }}</v-col>
      </v-row>
      <v-row>
        <v-col class="col-3 pr-0">客戶類別:</v-col>
        <v-col>{{ shipmentData.classItem.className }}</v-col>
      </v-row>
      <v-row>
        <v-col class="col-3 pr-0">客戶資料:</v-col>
        <v-col>
          <p>{{ shipmentData.clientItem.name }}</p>
          <p>{{ shipmentData.clientItem.phone }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="col-3 pr-0">收件資料:</v-col>
        <v-col>
          <p>{{ shipmentData.receiveItem.name }}</p>
          <p>{{ shipmentData.receiveItem.phone }}</p>
          <p>
            {{ shipmentData.receiveItem.code }}
            {{ shipmentData.receiveItem.address }}
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="col-3 pr-0">付款方式:</v-col>
        <v-col v-if="shipmentData.payment == 1">貨到付款</v-col>
        <v-col v-else-if="shipmentData.payment == 2">匯款</v-col>
        <v-col v-else>現金</v-col>
      </v-row>
      <v-row>
        <v-col class="col-3 pr-0">出貨方式:</v-col>
        <v-col>
          <p>
            <span v-if="shipmentData.shipment == 1">親送</span>
            <span v-if="shipmentData.shipment == 2">黑貓宅配</span>
            <span v-if="shipmentData.shipment == 3">自取</span>
            <span>/</span>
            <span v-if="shipmentData.temperatureCategory == 1">常溫</span>
            <span v-if="shipmentData.temperatureCategory == 2">冷藏</span>
            <span v-if="shipmentData.temperatureCategory == 3">冷凍</span>
            <span>/</span>
            <span v-if="shipmentData.volume == 1">60公分</span>
            <span v-if="shipmentData.volume == 2">90公分</span>
            <span v-if="shipmentData.volume == 3">120公分</span>
            <span v-if="shipmentData.volume == 4">150公分</span>
          </p>
        </v-col>
      </v-row>
      <v-row v-if="shipmentData.shipment == 2">
        <v-col class="col-3 pr-0">物流編號:</v-col>
        <v-col>{{ shipmentData.trackingNo }}</v-col>
      </v-row>
      <v-row>
        <v-col class="col-3 pr-0">運費金額:</v-col>
        <v-col>{{ shipmentData.shippingFee }}</v-col>
      </v-row>
      <v-row>
        <v-col class="col-2 pr-0">備註:</v-col>
        <v-col
          ><v-textarea
            rows="3"
            filled
            no-resize
            readonly
            v-model="shipmentData.remark"
            class="mt-0 pt-0"
          ></v-textarea
        ></v-col>
      </v-row>
    </div>
    <div class="title-wrapper rounded">
      商品資料
    </div>
    <v-list class="rounded elevation-10">
      <v-list-item
        v-for="item in shipmentData.orderItemRequestList"
        :key="item.id"
        no-action
        style="border-bottom: 2px solid lightgray; padding-top: 5px;"
      >
        <template>
          <v-row>
            <v-col class="col-7">
              <div class="productList-content">
                <p>{{ item.name }}</p>
                <p>
                  <span>{{ item.unit }}</span>
                </p>
                <p>
                  <span>出貨售價:</span
                  ><span>{{
                    item.salesPrice === 0
                      ? item.listPrice * item.quantity
                      : item.salesPrice * item.quantity
                  }}</span>
                </p>
                <p>
                  <span>備註</span><span>{{ item.description }}</span>
                </p>
              </div>
            </v-col>
            <v-col class="col-5 align-self-center pl-0">
              <p>數量</p>
              <p>{{ item.quantity }}</p>
              <p>${{ item.money }}</p>
            </v-col>
          </v-row>
        </template>
      </v-list-item>
    </v-list>
    <div class="pa-2" style="font-size: 26px; font-weight:bold;">
      <v-row>
        <v-col><span>折讓</span></v-col
        ><v-col class="text-end"
          ><span>${{ discount }}</span></v-col
        >
      </v-row>
      <v-row>
        <v-col><span>合計</span></v-col
        ><v-col class="text-end"
          ><span style="color: red;">${{ total }}</span></v-col
        >
      </v-row>
    </div>
    <div class="title-wrapper rounded">
      列印資料
    </div>
    <div>
      <v-radio-group :value="1">
        <v-row>
          <v-col class="col-1"> <span>1.</span></v-col
          ><v-col><v-radio label="商用格式" :value="1"></v-radio></v-col>
          <v-col> <v-radio label="零售格式" :value="2"></v-radio></v-col>
        </v-row>
      </v-radio-group>
      <v-radio-group :value="1">
        <v-row>
          <v-col class="col-1"> <span>2.</span></v-col
          ><v-col
            ><v-radio label="有價格+無價格(各一份)" :value="1"></v-radio
          ></v-col>
          <v-col>
            <v-radio label="無價格(一式兩份)" :value="2"></v-radio
          ></v-col>
        </v-row>
      </v-radio-group>
    </div>
    <div class="text-center">
      <v-btn
        class="text-h6"
        color="primary"
        style="width: 70%;height: 50px;"
        @click="submit(1)"
      >
        列印出貨單/貼箱標籤
      </v-btn>
    </div>
    <div class="mt-3">
      <v-row>
        <v-col>
          <v-btn
            style="width: 100%;"
            @click="back"
            v-if="$store.state.shipmentEdited"
          >
            修改
          </v-btn>
          <v-btn style="width: 100%;" @click="back" v-else>
            返回修改
          </v-btn>
        </v-col>
        <v-col>
          <v-btn style="width: 100%;" @click="submit(2)">
            只列印貼箱標籤
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "SalesDetail",
  data() {
    return {
      shipmentData: {},
      workDate: "",
      discount: 0,
      total: 0,
      messageText: "",
      snackbar: false
    };
  },
  created() {
    this.shipmentData = this.$store.state.shipment;
    this.workDate = this.$store.state.workDate;
    this.discount = this.$store.state.shipment.discount;
    this.total = this.$store.state.shipment.total + this.$store.state.shipment.shippingFee;
  },
  methods: {
    back() {
      this.$store.state.shipmentBacked = true;
      this.$router.push("/sales");
    },
    submit(value) {
      let recipientId = this.$store.state.shipment.receiveItem.id;
      if (recipientId == "1") {
        recipientId = "0";
      } else if (recipientId == "2") {
        recipientId = "1";
      }
      if (this.$store.state.shipmentEdited) {
        this.$api.Distribute.editOrder({
          orderId: this.$store.state.shipment.orderId,
          recipientId: recipientId,
          defaultReceiveInfo: this.$store.state.shipment.defaultReceiveInfo,
          remark: this.$store.state.shipment.remark,
          payment: this.$store.state.shipment.payment,
          shipment: this.$store.state.shipment.shipment,
          temperatureCategory: this.$store.state.shipment.temperatureCategory,
          volume: this.$store.state.shipment.volume,
          orderNo: this.$store.state.shipment.orderNo,
          stockOutDate: this.$store.state.shipment.shipmentDate,
          trackingNo: this.$store.state.shipment.trackingNo,
          shippingFee: this.$store.state.shipment.shippingFee,
          orderItemRequestList: this.$store.state.shipment.orderItemRequestList.map(
            item => {
              return {
                id: item.productId,
                barcode: item.barcode,
                amount: item.quantity,
                discount: (item.salesPrice === 0 ? item.listPrice : item.salesPrice) * item.quantity - item.money,
                price: item.money,
                remark: item.remark
              };
            }
          )
        })
          .then(() => {
            if (value == 1) {
              this.$store.state.successMsg =
                "出貨確認成功，已列印出貨單/貼箱標籤";
            } else if (value == 2) {
              this.$store.state.successMsg = "出貨確認成功，已列印貼箱標籤";
            }
            this.$store.state.successSnackbar = true;
            this.$store.state.salesDetailed = false;
            this.$router.push("/salesLog");
          })
          .catch(err => {
            this.messageText = err.response.data.message;
            this.snackbar = true;
          });
      } else {
        console.log(this.$store.state.shipment.orderItemRequestList);
        this.$api.Distribute.addOrder({
          recipientId: recipientId,
          clientId: this.$store.state.shipment.clientItem.id,
          remark: this.$store.state.shipment.remark,
          payment: this.$store.state.shipment.payment,
          shipment: this.$store.state.shipment.shipment,
          temperatureCategory: this.$store.state.shipment.temperatureCategory,
          volume: this.$store.state.shipment.volume,
          orderNo: this.$store.state.shipment.orderNo,
          stockOutDate: this.$store.state.shipment.shipmentDate,
          trackingNo: this.$store.state.shipment.trackingNo,
          shippingFee: this.$store.state.shipment.shippingFee,
          defaultReceiveInfo: this.$store.state.shipment.defaultReceiveInfo,
          orderItemRequestList: this.$store.state.shipment.orderItemRequestList.map(
            item => {
              return {
                barcode: item.barcode,
                amount: item.quantity,
                discount: (item.salesPrice === 0 ? item.listPrice : item.salesPrice) * item.quantity - item.money,
                price: item.money,
                remark: item.remark
              };
            }
          )
        })
          .then(() => {
            console.log(this.$store.state.shipment.orderItemRequestList);
            if (value == 1) {
              this.$store.state.successMsg =
                "出貨確認成功，已列印出貨單/貼箱標籤";
            } else if (value == 2) {
              this.$store.state.successMsg = "出貨確認成功，已列印貼箱標籤";
            }
            this.$store.state.successSnackbar = true;
            this.$store.state.salesDetailed = false;
            this.$router.push("/salesLog");
          })
          .catch(err => {
            this.messageText = err.response.data.message;
            this.snackbar = true;
          });
      }

      // if(value == 1){
      //   this.$store.state.successMsg = "出貨確認成功，已列印出貨單/貼箱標籤";
      // }
      // else if(value == 2){
      //   this.$store.state.successMsg = "出貨確認成功，已列印貼箱標籤";
      // }
      // this.$store.state.successSnackbar = true;
      // this.$router.push("/salesLog");
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.container {
  padding: 12px 5px 12px 5px;
}
.title-wrapper {
  background-color: #c2c2c2;
}
</style>
