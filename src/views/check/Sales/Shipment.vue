<template>
  <v-container class="container">
    <v-btn
      v-scroll="onScroll"
      v-show="fab"
      fab
      dark
      fixed
      right
      bottom
      small
      color="primary"
      style="margin-right: -10px;"
      class="mb-10"
      @click="toTop"
      ><v-icon>mdi-chevron-up</v-icon></v-btn
    >
    <v-snackbar v-model="errSnackbar" centered color="red" timeout="2000">
      <p class="text-center ma-0">{{ messageText }}</p>
    </v-snackbar>
    <div class="title-wrapper rounded">
      出貨資料
    </div>
    <div>
      <v-row class="ma-0">
        <v-col class="col-4 align-self-center"><span>出貨日期:</span></v-col>
        <v-col class="col-8"
          ><v-menu
            v-model="menuVisible"
            :close-on-content-click="false"
            :nudge-left="20"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="mt-2"
                v-model="date"
                outlined
                append-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              @input="menuVisible = false"
              @change="onChangeDate"
            ></v-date-picker> </v-menu
        ></v-col>
      </v-row>
      <v-row class="ma-0">
        <v-col class="col-4 align-self-center"><span>出貨單號:</span></v-col>
        <v-col class="col-8"
          ><span>{{ orderNo }}</span></v-col
        >
      </v-row>
    </div>
    <div class="title-wrapper rounded">
      付款方式
    </div>
    <v-radio-group v-model="payment">
      <v-row>
        <v-col>
          <v-radio label="貨到付款" :value="1"></v-radio>
        </v-col>
        <v-col>
          <v-radio label="匯款" :value="2"></v-radio>
        </v-col>
        <v-col>
          <v-radio label="現金" :value="3"></v-radio>
        </v-col>
      </v-row>
    </v-radio-group>
    <div class="title-wrapper rounded">
      運費資料
    </div>
    <div>
      <v-row>
        <v-col class="col-3 align-self-center"><span>出貨方式:</span></v-col>
        <v-col class="col-9 pl-0 pr-0"
          ><v-radio-group
            class="mt-2"
            v-model="shipmentEvent"
            @change="computedShippingFee"
          >
            <v-row class="justify-space-between">
              <v-col class="pl-1 pr-0"
                ><v-radio :value="1" label="親送" style="width: 65px;"></v-radio
              ></v-col>
              <v-col class="pl-0 pr-0"
                ><v-radio :value="2" label="黑貓宅配"></v-radio
              ></v-col>
              <v-col><v-radio :value="3" label="自取"></v-radio></v-col>
            </v-row> </v-radio-group
        ></v-col>
      </v-row>
      <v-row v-if="shipmentEvent == 2" class="mt-0">
        <v-col class="col-3"><span>物流編號:</span></v-col>
        <v-col class="col-8 pa-0"
          ><v-text-field
            outlined
            v-model="trackingNo"
            v-mask="'####-####-####'"
          ></v-text-field
        ></v-col>
      </v-row>
      <v-row class="mt-0" v-if="shipmentEvent != 3">
        <v-col class="col-3 align-self-center"><span>溫層類別:</span></v-col>
        <v-col class="col-9 pl-0 pr-0"
          ><v-radio-group
            class="mt-2"
            v-model="temperatureCategory"
            @change="computedShippingFee"
          >
            <v-row class="justify-space-between">
              <v-col class="pl-1 pr-0"
                ><v-radio :value="1" label="常溫"></v-radio
              ></v-col>
              <v-col class="pl-0 pr-0"
                ><v-radio :value="2" label="冷藏"></v-radio
              ></v-col>
              <v-col><v-radio :value="3" label="冷凍"></v-radio></v-col>
            </v-row> </v-radio-group
        ></v-col>
      </v-row>
      <v-row class="mt-0" v-if="shipmentEvent != 3">
        <v-col class="col-3"><span>材積單位:</span></v-col>
        <v-col class="col-9 pt-0"
          ><v-radio-group
            class="mt-2"
            v-model="volume"
            @change="computedShippingFee"
          >
            <v-row class="">
              <v-col class=""
                ><v-radio :value="1" label="60公分"></v-radio
              ></v-col>
              <v-col class=""
                ><v-radio :value="2" label="90公分"></v-radio
              ></v-col>
            </v-row>
            <v-row class="">
              <v-col class=""
                ><v-radio :value="3" label="120公分"></v-radio
              ></v-col>
              <v-col class=""
                ><v-radio
                  :value="4"
                  label="150公分"
                  v-if="temperatureCategory == 1"
                ></v-radio
              ></v-col>
            </v-row> </v-radio-group
        ></v-col>
      </v-row>
      <v-row class="mt-0" v-if="shipmentEvent != 3">
        <v-col class="col-3"><span>運費金額:</span></v-col>
        <v-col class="col-4 pa-0"
          ><v-text-field
            prefix="$"
            outlined
            type="number"
            v-model="shippingFee"
          ></v-text-field
        ></v-col>
      </v-row>
    </div>
    <div class="title-wrapper rounded">
      備註
    </div>
    <v-row class="mt-1">
      <v-col></v-col>
      <v-col class="col-10">
        <v-textarea rows="5" no-resize solo v-model="remark"></v-textarea>
      </v-col>
      <v-col></v-col>
    </v-row>
    <div>
      <v-row>
        <v-col class="pr-0">
          <v-btn color="primary" @click="back" >
            客戶/商品資料 < 上一步
          </v-btn>
        </v-col>
        <v-col >
          <v-btn color="primary" :disabled="nextDisabled" @click="submit">
            下一步 > 出貨單
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { shippingRule } from "@/components/shippingFee";
export default {
  name: "Shipment",
  data() {
    return {
      date: "",
      orderNo: "",
      payment: 1,
      menuVisible: false,
      shipmentEvent: 1,
      trackingNo: "",
      temperatureCategory: 2,
      volume: 1,
      shippingFee: 0,
      remark: "",
      nextDisabled: true,
      fab: false,
      messageText: "",
      errSnackbar: false
    };
  },
  // computed: {
  //   shippingFeeCom: {
  //     get: function() {
  //       let value = shippingRule[
  //       "" + this.shipmentEvent + this.temperatureCategory + this.volume
  //               ];
  //       // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  //       this.shippingFee = value
  //
  //       console.log(value,'get value');
  //       return value;
  //     },
  //     set: function(value) {
  //       console.log(value,'value');
  //       this.shippingFee = value;
  //     }
  //   }
  // },
  watch: {
    temperatureCategory(value) {
      if (value > 1) {
        if (this.volume > 3) {
          this.volume = 1;
        }
      }
    },
    shipmentEvent() {
      this.checkNextDisable();
    },
    volume() {
      console.log(this.volume);
    },
    trackingNo() {
      this.checkNextDisable();
    },
    shippingFee() {
      this.checkNextDisable();
    }
  },
  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
    onChangeDate() {
      this.$api.Distribute.getOrderNo({
        date: this.date
      }).then(res => {
        this.orderNo = res.data;
        this.checkNextDisable();
      });
    },
    back() {
      this.$store.state.shipmentBacked = true;
      this.$store.state.shipment.shipmentDate = this.date;
      this.$store.state.shipment.orderNo = this.orderNo;
      this.$store.state.shipment.payment = this.payment;
      this.$store.state.shipment.shipment = this.shipmentEvent;
      this.$store.state.shipment.trackingNo = this.trackingNo;
      this.$store.state.shipment.temperatureCategory = this.temperatureCategory;
      this.$store.state.shipment.volume = this.volume;
      this.$store.state.shipment.shippingFee = this.shippingFee;
      this.$store.state.shipment.remark = this.remark;
      this.$router.push("/sales");
    },
    checkNextDisable() {
      if (this.orderNo != "" && this.shippingFee != "") {
        if (
          this.shipmentEvent == 2 &&
          (this.trackingNo == "" || this.trackingNo == null)
        ) {
          this.nextDisabled = true;
        } else {
          this.nextDisabled = false;
        }
      } else {
        if (this.shipmentEvent == 3) {
          this.nextDisabled = false;
        } else {
          this.nextDisabled = true;
        }
      }
    },
    submit() {
      // console.log(this.trackingNo.length,'trackNo len');
      if (this.shipmentEvent == 2) {
        if (this.trackingNo == null) {
          this.errSnackbar = true;
          this.messageText = "物流編號請輸入12個數字!";
          return;
        } else {
          if (this.trackingNo.length < 14) {
            this.errSnackbar = true;
            this.messageText = "物流編號請輸入12個數字!";
            return;
          }
        }
      }

      this.$store.state.shipment.shipmentDate = this.date;
      this.$store.state.shipment.orderNo = this.orderNo;
      this.$store.state.shipment.payment = this.payment;
      this.$store.state.shipment.shipment = this.shipmentEvent;
      this.$store.state.shipment.trackingNo = this.trackingNo;
      this.$store.state.shipment.temperatureCategory = this.temperatureCategory;
      this.$store.state.shipment.volume = this.volume;
      this.$store.state.shipment.shippingFee = this.shippingFee;
      this.$store.state.shipment.remark = this.remark;
      this.$store.state.salesDetailed = true;
      this.$router.push("/salesDetail");
    },
    computedShippingFee() {
      let value =
        shippingRule[
          "" + this.shipmentEvent + this.temperatureCategory + this.volume
        ];
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.shippingFee = value;
    }
  },
  mounted() {
    this.toTop();
    this.computedShippingFee();
    if (this.$store.state.shipmentBacked) {
      this.date = this.$store.state.shipment.shipmentDate;
      this.orderNo = this.$store.state.shipment.orderNo;
      this.payment = this.$store.state.shipment.payment;
      this.shipmentEvent = this.$store.state.shipment.shipment;
      this.trackingNo = this.$store.state.shipment.trackingNo;
      this.temperatureCategory = this.$store.state.shipment.temperatureCategory;
      this.volume = this.$store.state.shipment.volume;
      this.shippingFee = this.$store.state.shipment.shippingFee;
      this.remark = this.$store.state.shipment.remark;
    }
  }
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
