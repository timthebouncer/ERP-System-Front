<template>
  <v-container>
    <v-dialog v-model="delOrderDialogVisible">
      <v-card style="background-color: #fff0e9;">
        <v-card-text class="text-center"
          ><span class="text-h6 font-weight-black"
            >取消訂單後將無法復原</span
          ></v-card-text
        >
        <v-card-actions class="justify-center">
          <v-btn
            color=""
            text
            outlined
            @click="delOrderDialogVisible = false"
          >
            取消
          </v-btn>
          <v-btn color="primary" @click="deleteOrder(delOrderId)">
            確定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="title-wrapper rounded">
      出貨資料
    </div>
    <div>
      <swipe-list
        ref="swipeList"
        class="productList"
        :items="tableData"
        transition-key="orderId"
      >
        <template slot-scope="{ item, index }">
          <v-row class="pt-2 pb-2 pl-1 pr-1" v-if="item.remark!='註銷'" @click="onDetail(item.orderId)">
            <v-col>{{ item.orderNo }}</v-col>
            <v-col class="text-center">{{ item.clientName }}</v-col>
            <v-col class="text-end">${{ item.totalPrice }}</v-col>
          </v-row>
          <v-divider v-if="item.remark!='註銷'"></v-divider>
        </template>
        <template v-slot:left="{ item }">
          <div
            class="swipeout-action action-panel-left"
            @click="onPrint(item.orderId)"
          >
            <div>
              <span>列印貼箱標籤</span>
            </div>
          </div>
        </template>
        <template v-slot:right="{ item }">
          <div
            class="swipeout-action action-panel-right"
            @click="onDelOrderDialog(item.orderId)"
          >
            <div>
              <span>取消訂單</span>
            </div>
          </div>
        </template>
      </swipe-list>
    </div>
  </v-container>
</template>
<script>
import { SwipeList } from "vue-swipe-actions";
import "vue-swipe-actions/dist/vue-swipe-actions.css";
export default {
  name: "salesLog",
  components: {
    SwipeList
  },
  data() {
    return {
      startDate: "",
      endDate: "",
      tableData: [],
      pageNumber: 1,
      pageSize: 15,
      total: 0,
      delOrderDialogVisible: false,
      delOrderId:''
    };
  },
  methods: {
      onPrint(id){
          console.log(id,'order id');
      },
    onDelOrderDialog(id) {
        this.delOrderDialogVisible = true
        this.delOrderId = id
    },
    deleteOrder(id){
      this.$api.Distribute.deleteOrderList(id).then(() => {
        this.delOrderDialogVisible = false
        this.getDistributeList()
      })
    },
    getDistributeList(){
      this.$api.Distribute.getDistributeList({
        orderNo: "",
        startDate: this.startDate,
        endDate: this.endDate,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }).then(res => {
        this.total = res.data.totalElements;
        this.tableData = res.data.content;
      });
    },
    onDetail(id){
      this.$api.Distribute.getDistributeDetail(id).then(response=>{
        console.log(response.data);
        let data = response.data
        this.$store.state.shipment.shipmentDate = data.salesDay
        this.$store.state.shipment.orderNo
        this.$store.state.shipment.classItem = {id:data.classId,className:data.className}
        this.$store.state.shipment.clientItem = {id: data.clientId, name: data.clientName, phone: data.phoneNumber, code: "", address: ""}
        this.$store.state.shipment.receiveItem = {id: '', name: "", phone: data.receiverPhone, code: data.receivePostCode, address: data.receiveAddress}
        this.$store.state.shipment.discount = 0
        this.$store.state.shipment.total = 0
        this.$store.state.shipment.payment = data.payment
        this.$store.state.shipment.shipment = data.shipment
        this.$store.state.shipment.temperatureCategory = data.temperatureCategory
        this.$store.state.shipment.volume = data.volume
        this.$store.state.shipment.shippingFee = data.shippingFee
        this.$store.state.shipment.trackingNo = data.trackingNo
        this.$store.state.shipment.remark = data.remark
        this.$store.state.shipment.orderItemRequestList = data.orderDetailItemResponseList.map(
                item=>{
                  return{
                    id:item.id,
                    barcode: item.barcode,
                    name: item.productName,
                    quantity: item.amount,
                    salesPrice: item.price,
                    money: item.price - item.discount,
                    unit: item.unit,
                    remark: item.remark
                  }
                }
        )
        this.$router.push("/salesDetail");
      })
    }
  },
  mounted() {
    this.getDistributeList()
  }
};
</script>
<style lang="scss" scoped>
.title-wrapper {
  background-color: #c2c2c2;
}
.swipeout-list {
  display: flex;
  flex-direction: column;
}
.swipeout-list-item {
  flex: 1;
  border-bottom: 1px solid lightgray;
  &:last-of-type {
    border-bottom: none;
  }
}
.swipeout-action {
  display: flex;
  > div {
    display: flex;
    align-items: center;
    padding: 0 3rem;
    cursor: pointer;
  }
  &.action-panel-right {
    > div {
      background-color: #d9001b;
      color: white;
      padding: 5px 10px 5px 10px;
    }
  }
  &.action-panel-left {
    > div {
      background-color: #71b603;
      color: white;
      padding: 5px 10px 5px 10px;
    }
  }
}
.productList {
  width: 100%;
  background-color: white;
  border-radius: 3px;
  box-shadow: none;
  border: 1px solid lightgray;
}
</style>
