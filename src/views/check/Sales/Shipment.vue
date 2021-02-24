<template>
  <v-container class="container">
    <v-btn  v-scroll="onScroll"
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
            @click="toTop"><v-icon>mdi-chevron-up</v-icon></v-btn>
    <div class="title-wrapper rounded">
      出貨資料
    </div>
    <div>
      <v-row class="ma-0">
        <v-col class="col-3 align-self-center"><span>出貨日期:</span></v-col>
        <v-col class="col-9"><v-menu
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
          ></v-date-picker>
        </v-menu></v-col>
      </v-row>
      <v-row class="ma-0">
        <v-col class="col-3 align-self-center"><span>出貨單號:</span></v-col>
        <v-col class="col-9"><span>{{orderNo}}</span></v-col>
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
        <v-col class="col-9 pl-0 pr-0"><v-radio-group class="mt-2" v-model="shipmentEvent" @change="changeShip">
          <v-row class="justify-space-between">
          <v-col class="pl-0 pr-0"><v-radio :value="1" label="親送"></v-radio></v-col>
            <v-col class="pl-0 pr-0"><v-radio :value="2" label="黑貓宅配"></v-radio></v-col>
              <v-col><v-radio :value="3" label="自取"></v-radio></v-col>
          </v-row>
        </v-radio-group></v-col>
      </v-row>
      <v-row v-if="shipmentEvent=='2'" class="mt-0">
        <v-col class="col-3"><span>物流編號:</span></v-col>
        <v-col class="col-8 pa-0"><v-text-field outlined></v-text-field></v-col>
      </v-row>
      <v-row class="mt-0" v-if="shipmentEvent!=3">
        <v-col class="col-3 align-self-center"><span>溫層類別:</span></v-col>
        <v-col class="col-9 pl-0 pr-0"><v-radio-group class="mt-2" v-model="temperatureCategory">
          <v-row class="justify-space-between">
            <v-col class="pl-0 pr-0"><v-radio :value="1" label="常溫"></v-radio></v-col>
            <v-col class="pl-0 pr-0"><v-radio :value="2" label="冷藏"></v-radio></v-col>
            <v-col><v-radio :value="3" label="冷凍"></v-radio></v-col>
          </v-row>
        </v-radio-group></v-col>
      </v-row>
      <v-row class="mt-0" v-if="shipmentEvent!=3">
        <v-col class="col-3"><span>材積單位:</span></v-col>
        <v-col class="col-9 pt-0"><v-radio-group class="mt-2" v-model="volume">
          <v-row class="">
            <v-col class=""><v-radio :value="1" label="60公分"></v-radio></v-col>
            <v-col class=""><v-radio :value="2" label="90公分"></v-radio></v-col>
          </v-row>
          <v-row class="">
            <v-col class=""><v-radio :value="3" label="120公分"></v-radio></v-col>
            <v-col class=""><v-radio :value="4" label="150公分" v-if="temperatureCategory==1"></v-radio></v-col>
          </v-row>
        </v-radio-group></v-col>
      </v-row>
      <v-row class="mt-0" v-if="shipmentEvent!=3">
        <v-col class="col-3"><span>運費金額:</span></v-col>
        <v-col class="col-4 pa-0"><v-text-field  prefix="$" outlined type="number" v-model="shippingFeeCom"></v-text-field></v-col>
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
        <v-col>
        <v-btn class="flex-column" color="primary" style="width: 100%;"  @click="back">
          客戶/商品資料 < 上一步
        </v-btn>
        </v-col>
        <v-col>
        <v-btn class="flex-column" color="primary" style="width: 100%;" :disabled="nextDisabled" @click="submit">
          下一步 > 出貨單
        </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import {shippingRule} from '@/components/shippingFee'
export default {
  name: "Shipment",
  data() {
    return {
      date:'',
      orderNo:'',
      payment:1,
      menuVisible: false,
      shipmentEvent: 1,
      temperatureCategory:2,
      volume:1,
      shippingFee:0,
      remark:'',
      nextDisabled: false,
      fab:false
    }
  },
  computed:{
    shippingFeeCom:{
      get: function () {
        return shippingRule[''+this.shipmentEvent+this.temperatureCategory+this.volume]
      }
    }
  },
  watch:{
    temperatureCategory(value){
      console.log(value,'t value');
      if(value>1){
        if(this.volume>3){
          this.volume = 1
        }
      }
    }
  },
  methods: {
    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset ||   e.target.scrollTop || 0
      this.fab = top > 20
    },
    toTop () {
      this.$vuetify.goTo(0)
    },
    onChangeDate(){
      console.log(this.date)
      this.$api.Distribute.getOrderNo({
        date: this.date
      }).then(res => {
        this.orderNo = res.data
      })
    },
    changeShip(){
      console.log(this.shipmentEvent)
    },
    back(){
      this.$store.state.shipmentBacked = true
      this.$router.push('/sales')
    },
    submit(){}
  },
  mounted() {
    this.toTop()
  }
};
</script>

<style lang="scss" scoped>
.title-wrapper {
  background-color: #c2c2c2;
}
</style>
