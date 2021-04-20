<template>
  <v-container class="container">
    <!--   貼箱標籤   -->
    <div style="position: absolute; top:-1000px;">
      <div style="height: 173px; padding: 8px 0 0 0;">
        <canvas width="800" height="500" id="art"></canvas>
      </div>
      <div class="vanish">
        <img class="brandLogo" src="@/assets/brand_logo.jpg" />
        <svg
                id="tag-barcode"
                :jsbarcode-format="skus.format"
                :jsbarcode-value="orderNo"
        ></svg>
        <svg
                id="tag-trackNo"
                :jsbarcode-format="skus2.format"
                :jsbarcode-value="trackingNo"
                jsbarcode-textmargin="0"
                jsbarcode-fontoptions="bold"
        ></svg>
      </div>
    </div>
    <!--   貼箱標籤 end  -->
    <v-snackbar v-model="delSnackbar" centered color="primary" timeout="3000">
      <p class="text-center ma-0">{{ messageText }}</p>
    </v-snackbar>
    <v-dialog v-model="delOrderDialogVisible">
      <v-card style="background-color: #fff0e9;">
        <v-card-text class="text-center"
          ><span class="text-h6 font-weight-black"
            >取消訂單後將無法復原</span
          ></v-card-text
        >
        <v-card-actions class="justify-center">
          <v-btn color="" text outlined @click="delOrderDialogVisible = false">
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
          <v-row
            class="pt-2 pb-2 pl-1 pr-1"
            v-if="item.action != 'CANCEL_ORDER'"
            @click="onDetail(item.orderId)"
          >
            <v-col>{{ item.orderNo }}</v-col>
            <v-col class="text-center">{{ item.clientName }}</v-col>
            <v-col class="text-end">${{ item.totalPrice }}</v-col>
          </v-row>
          <v-divider v-if="item.action != 'CANCEL_ORDER'"></v-divider>
        </template>
        <template v-slot:left="{ item , index }">
          <div class="swipeout-action action-panel-left" @click="onPrint(item,index)">
            <div>
              <span>列印貼箱標籤</span>
            </div>
          </div>
        </template>
        <template v-slot:right="{ item }">
          <div
            class="swipeout-action action-panel-right"
            @click="onDelOrderDialog(item)"
          >
            <div>
              <span>取消訂單</span>
            </div>
          </div>
        </template>
      </swipe-list>
      <div class="loading">
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
      </div>
    </div>
  </v-container>
</template>
<script>
import { SwipeList } from "vue-swipe-actions";
import "vue-swipe-actions/dist/vue-swipe-actions.css";
import {UNIT} from "../../../mixin/enums";
import {fabric} from "fabric";
import * as htmlToImage from "html-to-image";
import JsBarcode from "jsbarcode";
import https from "https";
import axios from "axios";
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
      pageSize: 1000,
      total: 0,
      delOrderDialogVisible: false,
      delOrderId: "",
      delOrderNo: "",
      clientListRes: [],
      delSnackbar: false,
      messageText: "",
      skus: { format: "auto", title: "" },
      skus2: { format: "auto", title: "" },
      orderNo: '',
      trackingNo: '',
      contentStatus: false
    };
  },
  methods: {
    onPrint(item,index) {
      console.log(item);
      this.orderNo = item.orderNo
      this.trackingNo = item.trackingNo
      this.drawLabel(item,index)
    },
    onDelOrderDialog(item) {
      this.delOrderDialogVisible = true;
      this.delOrderId = item.orderId;
      this.delOrderNo = item.orderNo;
    },
    deleteOrder(id) {
      this.$api.Distribute.deleteOrderList(id).then(() => {
        this.delOrderDialogVisible = false;
        this.getDistributeList();
        this.delSnackbar = true;
        this.messageText = this.delOrderNo + "  取消成功";
      });
    },
    getDistributeList() {
      this.$api.Distribute.getDistributeList({
        orderNo: "",
        startDate: this.startDate,
        endDate: this.endDate,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }).then(res => {
        this.contentStatus = res.data.empty
        document.querySelector('.loading').classList.remove('show')
        // this.total = res.data.totalElements;
        // this.tableData = res.data.content;
        this.tableData.push(...res.data.content)
      });
    },
    async onDetail(id) {
      await this.$api.Customer.onlyCustomerList().then(res => {
        this.clientListRes = res.data;
      });

      this.$api.Distribute.getDistributeDetail(id).then(response => {
        let discount = 0,
          total = 0;
        let data = response.data;
        this.$store.state.shipment.orderId = id;
        this.$store.state.shipment.shipmentDate = data.salesDay;
        this.$store.state.shipment.orderNo = data.orderNo;
        this.$store.state.shipment.classItem = {
          id: data.classId,
          className: data.className
        };
        this.$store.state.shipment.clientItem = {
          id: data.clientId,
          name: data.clientName,
          phone: data.phoneNumber,
          code: "",
          address: ""
        };
        this.$store.state.shipment.defaultReceiveInfo = data.defaultReceiveInfo;
        let clientData = {};
        clientData = this.clientListRes.filter(item => {
          return data.clientId == item.id;
        });
        let receiveId, receiveName, receivePhone, receiveCode, receiveAddress;
        if (data.defaultReceiveInfo == 0) {
          receiveId = "1";
          receiveName = clientData[0].name;
          receivePhone = clientData[0].tel;
          receiveCode = clientData[0].postCode;
          receiveAddress = clientData[0].address;
        } else if (data.defaultReceiveInfo == 1) {
          receiveId = "2";
          receiveName = clientData[0].companyName;
          receivePhone = clientData[0].companyTel;
          receiveCode = clientData[0].companyPostCode;
          receiveAddress = clientData[0].companyAddress;
        } else {
          receiveId = data.recipientId;
          receiveName = data.receiver;
          receivePhone = data.receiverPhone;
          receiveCode = data.receivePostCode;
          receiveAddress = data.receiveAddress;
        }
        this.$store.state.shipment.receiveItem = {
          id: receiveId,
          name: receiveName,
          phone: receivePhone,
          code: receiveCode,
          address: receiveAddress
        };

        this.$store.state.shipment.payment = data.payment;
        this.$store.state.shipment.shipment = data.shipment;
        this.$store.state.shipment.temperatureCategory =
          data.temperatureCategory;
        this.$store.state.shipment.volume = data.volume;
        this.$store.state.shipment.shippingFee = data.shippingFee;
        this.$store.state.shipment.trackingNo = data.trackingNo;
        this.$store.state.shipment.remark = data.remark;
        this.$store.state.shipment.orderItemRequestList = data.orderDetailItemResponseList.map(
          item => {
            discount += item.discount;
            total +=
              (item.clientPrice == 0 ? item.price : item.clientPrice) *
                item.amount -
              item.discount;
            return {
              productId: item.id,
              barcode: item.barcode,
              name: item.productName,
              quantity: item.amount,
              amount: parseInt(item.amount),
              salesPrice: item.clientPrice,
              listPrice: item.price,
              money:
                (item.clientPrice == 0 ? item.price : item.clientPrice) *
                  item.amount -
                item.discount,
              unit: item.unit,
              description: item.remark,
              weight: item.weight,
              tWeight: (item.weight).toFixed(3)
            };
          }
        );
        this.$store.state.shipment.lastOrderItemList = this.$store.state.shipment.orderItemRequestList
        this.$store.state.shipment.discount = discount;
        this.$store.state.shipment.total = total;
        this.$store.state.salesDetailed = true;
        this.$store.state.shipmentEdited = true;
        console.log(this.$store.state.shipment);
        this.$router.push("/salesDetail");
      });
    },
    async drawLabel(item,index) {
      let canvas = new fabric.Canvas("art");
      let img = new Image();
      const dataUrl = await htmlToImage.toPng(
              document.querySelector(".brandLogo")
      );

      img.src = dataUrl;

      this.$nextTick(() => {
        let image = new fabric.Image(img, {
          left: 70,
          top: 30,
          width: 200,
          height: 121,
          scaleX: 0.7,
          scaleY: 0.7
        });
        canvas.add(image);
      });
      let placeholder = new fabric.Textbox("|", {
        left: 0,
        top: 0,
        fontSize: 1
      });
      canvas.add(placeholder);

      let text = new fabric.Textbox("收件客戶", {
        left: 70,
        top: 160,
        name: "species",
        fontSize: 25,
        fontFamily: "微軟正黑體"
      });
      let text1 = new fabric.Textbox(`${item.clientName}`, {
        left: 90,
        top: 190,
        name: "species",
        fontSize: 25,
        fontFamily: "微軟正黑體"
      });
      let line = new fabric.Textbox("|", {
        left: 170,
        top: 158,
        fontSize: 20,
        fontWeight: 5,
        fontFamily: "微軟正黑體"
      });
      let line1 = new fabric.Textbox("|", {
        left: 170,
        top: 278,
        fontSize: 20,
        fontWeight: 5,
        fontFamily: "微軟正黑體"
      });
      canvas.add(text);
      canvas.add(text1);
      canvas.add(line);
      canvas.add(line1);

      let text2 = new fabric.Textbox("出貨單號", {
        left: 70,
        top: 280,
        name: "orderNo",
        fontSize: 25,
        fontFamily: "微軟正黑體"
      });
      canvas.add(text2);
      await JsBarcode("#tag-barcode").init();

      // let svg = document.querySelector('#ean-13')
      // let xml = new XMLSerializer().serializeToString(svg);
      // let base64 = 'data:image/svg+xml;base64,' + btoa(xml);
      // let img =  document.querySelector('#ean')
      // img.src = base64;

      const _dataUrl = await htmlToImage.toPng(
              document.querySelector("#tag-barcode")
      );
      let _img = new Image();
      _img.src = _dataUrl;

      this.$nextTick(() => {
        let _image = new fabric.Image(_img, {
          left: 200,
          top: 230,
          width: 288,
          height: 100,
          scaleX: 0.8,
          scaleY: 1
        });
        canvas.add(_image);
      });

      if (item.trackingNo) {
        let text3 = new fabric.Textbox("物流編號", {
          left: 70,
          top: 410,
          name: "orderNo",
          fontSize: 25,
          fontFamily: "微軟正黑體"
        });
        canvas.add(text3);
        await JsBarcode("#tag-trackNo").init();

        const _dataUrl = await htmlToImage.toPng(
                document.querySelector("#tag-trackNo")
        );
        let __img = new Image();
        __img.src = _dataUrl;

        let line2 = new fabric.Textbox("|", {
          left: 170,
          top: 407,
          fontSize: 20,
          fontWeight: 5,
          fontFamily: "微軟正黑體"
        });
        canvas.add(line2);

        this.$nextTick(() => {
          let images2 = new fabric.Image(__img, {
            left: 200,
            top: 340,
            width: 254,
            height: 100,
            scaleX: 1,
            scaleY: 1
          });
          canvas.add(images2);
        });
      }

      let text7 = new fabric.Textbox("出貨日期", {
        left: 240,
        top: 68,
        name: "workingDate",
        fontSize: 25,
        fontFamily: "微軟正黑體"
      });
      let line3 = new fabric.Textbox("|", {
        left: 340,
        top: 65,
        fontSize: 20,
        fontWeight: 5,
        fontFamily: "微軟正黑體"
      });
      let text8 = new fabric.Textbox(`${item.date}`, {
        left: 360,
        top: 68,
        name: "species",
        fontSize: 25
      });
      canvas.add(text7);
      canvas.add(text8);
      canvas.add(line3);

      // logo.outerHTML = ''
      this.$nextTick((this.canvas = canvas));

      setTimeout(() => {
        this.exportSVG(index);
      }, 1000);
    },
    async exportSVG(index) {
      let canvasJson = this.canvas.toJSON();
      console.log(canvasJson);
      let file = await new File([JSON.stringify(canvasJson)], "foo.txt", {
        type: "text/plain"
      });
      const formData = await new FormData();
      formData.append("file", file);
      formData.append("width", "100");
      formData.append("height", "80");
      formData.append("printerName", "Sbarco T4ES 203 dpi");
      const agent = new https.Agent({rejectUnauthorized: false});
      await axios
              .post(`https://${this.$store.state.ip}:8099/print/printTag`, formData, {
                httpsAgent: agent
              })
              .then(res => {
                console.log(res);
                this.delSnackbar = true;
                this.messageText = "已列印貼箱標籤";
                this.$refs.swipeList.closeActions(index);
              })
              .catch(error => {
                console.error(error);
                this.delSnackbar = true;
                this.messageText = "列印貼箱標籤 失敗";
                this.$refs.swipeList.closeActions(index);
              });
    }
  },
  mounted() {
    this.getDistributeList();
    // window.addEventListener('scroll', () => {
    //   console.log('scroll')
    //   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    //   // console.log(clientHeight,'clientHeight');
    //   // console.log(scrollTop,'scrollTop');
    //   // console.log(scrollHeight,'scrollHeight');
    //   if(clientHeight + scrollTop >= scrollHeight) {
    //     console.log("loading new data")
    //     this.pageNumber += 1;
    //     if(this.contentStatus === false){
    //       // show the loading animation
    //       document.querySelector('.loading').classList.add('show')
    //       setTimeout(this.getDistributeList,1000)
    //     }
    //   }
    // });
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
.loading{
  opacity: 0;
  display: flex;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity .3s ease-in;
}
.loading.show {
  opacity: 1;
}
.ball{
  background-color: #777;
  border-radius: 50%;
  margin: 5px;
  height: 10px;
  width: 10px;
  animation: jump 0.5s ease-in infinite;
}
.ball:nth-of-type(2) {
  animation-delay: 0.1s;
}

.ball:nth-of-type(3) {
  animation-delay: 0.2s;
}
@keyframes jump {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}
</style>
