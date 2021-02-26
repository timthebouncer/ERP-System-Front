<template>
  <v-container class="container">
    <div class="text-h4 text-center">
      <span>出貨單</span><v-divider class="mb-1"></v-divider>
    </div>
    <div style="font-size: large;">
      <v-row>
        <v-col class="col-3">工作日期:</v-col>
        <v-col>{{ workDate }}</v-col>
      </v-row>
      <v-row>
        <v-col class="col-3">出貨日期:</v-col>
        <v-col>{{ shipmentData.shipmentDate }}</v-col>
      </v-row>
      <v-row>
        <v-col class="col-3">出貨單號:</v-col>
        <v-col>{{ shipmentData.orderNo }}</v-col>
      </v-row>
      <v-row>
        <v-col class="col-3">客戶類別:</v-col>
        <v-col>{{ shipmentData.classItem.className }}</v-col>
      </v-row>
      <v-row>
        <v-col class="col-3">客戶資料:</v-col>
        <v-col>
          <p>{{ shipmentData.clientItem.name }}</p>
          <p>{{ shipmentData.clientItem.phone }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="col-3">收件資料:</v-col>
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
        <v-col class="col-3">付款方式:</v-col>
        <v-col v-if="shipmentData.payment == 1">貨到付款</v-col>
        <v-col v-else-if="shipmentData.payment == 2">匯款</v-col>
        <v-col v-else>現金</v-col>
      </v-row>
      <v-row>
        <v-col class="col-3">出貨方式:</v-col>
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
            <span v-if="shipmentData.volume == 1">常溫</span>
            <span v-if="shipmentData.volume == 2">冷藏</span>
            <span v-if="shipmentData.volume == 3">冷凍</span>
          </p>
        </v-col>
      </v-row>
      <v-row v-if="shipmentData.shipment == 2">
        <v-col class="col-3">物流編號:</v-col>
        <v-col>{{ shipmentData.trackingNo }}</v-col>
      </v-row>
      <v-row>
        <v-col class="col-3">運費金額:</v-col>
        <v-col>{{ shipmentData.shippingFee }}</v-col>
      </v-row>
      <v-row>
        <v-col class="col-2">備註:</v-col>
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
          <v-col class="col-1">
        <span>1.</span></v-col><v-col><v-radio label="商用格式" :value="1"></v-radio></v-col>
          <v-col>
            <v-radio label="零售格式" :value="2"></v-radio></v-col>
        </v-row>
      </v-radio-group>
      <v-radio-group :value="1">
        <v-row>
          <v-col class="col-1">
            <span>2.</span></v-col><v-col><v-radio label="有價格+無價格(各一份)" :value="1"></v-radio></v-col>
          <v-col>
            <v-radio label="無價格(一式兩份)" :value="2"></v-radio></v-col>
        </v-row>
      </v-radio-group>
    </div>
    <div class="text-center">
      <v-btn class="text-h6"
              color="primary"
              style="width: 70%;height: 50px;"
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
          >
            返回修改
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
                  style="width: 100%;"
          >
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
      total: 0
    };
  },
  created() {
    this.shipmentData = this.$store.state.shipment;
    this.workDate = this.$store.state.workDate;
    this.discount = this.$store.state.shipment.discount
    this.total = this.$store.state.shipment.total
  },
  methods: {
    back(){
      this.$store.state.shipmentBacked = true;
      this.$router.push("/sales");
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.title-wrapper {
  background-color: #c2c2c2;
}
</style>
