<template>
  <v-container class="container">
    <!--   貼箱標籤   -->
    <div  style="position: absolute; top:-1000px;">
      <div style="height: 173px; padding: 8px 0 0 0;">
        <canvas width="800" height="500" id="art"></canvas>
      </div>
      <div class="vanish">
        <img class="brandLogo" src="@/assets/brand_logo.jpg"/>
        <svg
          id="ean-13"
          :jsbarcode-format="skus.format"
          :jsbarcode-value="shipmentData.orderNo"
        ></svg>
        <svg
          id="trackNo"
          :jsbarcode-format="skus2.format"
          :jsbarcode-value="shipmentData.trackingNo"
          jsbarcode-textmargin="0"
          jsbarcode-fontoptions="bold"
        ></svg>
      </div>
    </div>
    <!--    出貨單 html start   -->
    <div :title="templateType" id="exampleWrapper" style="position: absolute; top:-1000px;">
      <div class="table-content">
        <div class="top-wrapper">
          <div>
            <span class="Brand-logo"><img src="@/assets/brand_logo.jpg"/></span>
          </div>
          <div class="title">
            <h1>出貨單</h1>
          </div>
          <div v-show="templateType === '零售-有價格'" class="logo2">
            <h1 class="black-cat-logo">
              {{
              shipmentData.shipment === 1
              ? '親送'
              : shipmentData.shipment === 2
              ? '黑貓宅配'
              : shipmentData.shipment === 3
              ? '自取'
              : ''
              }}
            </h1>
          </div>
        </div>
        <div class="detail-wrapper">
          <div class="detail-list">
            <span
            >客戶名稱:<span style="border-bottom: 1px dotted">{{
                shipmentData.clientItem.name
              }}</span></span
            >
            <span
            >客戶類別:<span style="border-bottom: 1px dotted">{{
                shipmentData.classItem.className
              }}</span></span
            >
            <span
            >收件地址:<span style="border-bottom: 1px dotted"
            >{{ shipmentData.receiveItem.code
                }}{{ shipmentData.receiveItem.address }}</span
            ></span
            >
            <span
            >客戶電話:<span style="border-bottom: 1px dotted">{{
                shipmentData.clientItem.phone
              }}</span></span
            >
            <span
            >統一編號:<span style="border-bottom: 1px dotted">無</span></span
            >
            <span v-show="templateType !== '零售-有價格'"
            >出貨方式:<span style="border-bottom: 1px dotted">{{
                shipmentData.shipment === 1
                  ? '親送'
                  : shipmentData.shipment === 2
                  ? '黑貓宅配'
                  : shipmentData.shipment === 3
                  ? '自取'
                  : ''
              }}</span></span
            >
            <span v-show="templateType === '零售-有價格'">
              付款方式:
              <span style="border-bottom: 1px dotted">{{
                shipmentData.payment === 1
                  ? '貨到付款'
                  : shipmentData.payment === 2
                  ? '匯款'
                  : shipmentData.payment === 3
                  ? '現金'
                  : ''
              }}</span>
            </span>
            <span>備註:{{ shipmentData.remark }}</span>
          </div>
          <div class="barcode-wrapper">
            <span>出貨日期:{{ shipmentData.shipmentDate }}</span>
            <div class="paper-content-detail-order">
              <span>出貨單號:</span>
              <div class="other3-order-barcode">
                <svg
                        id="ean-13"
                        :jsbarcode-format="skus.format"
                        :jsbarcode-value="shipmentData.orderNo"
                        jsbarcode-textmargin="0"
                        jsbarcode-fontoptions="bold"
                ></svg>
              </div>
            </div>
            <div
                    class="paper-content-detail-order"
                    v-show="shipmentData.trackingNo"
            >
              <span>物流編號:</span>
              <div class="other3-package-barcode">
                <svg
                        id="trackNo"
                        :jsbarcode-format="skus2.format"
                        :jsbarcode-value="shipmentData.trackingNo"
                        jsbarcode-textmargin="0"
                        jsbarcode-fontoptions="bold"
                ></svg>
              </div>
            </div>
          </div>
        </div>
        <div class="content-wrapper">
          <v-data-table
                  :headers="headers"
                  :items="shipmentData.orderItemRequestList"
                  :pagination="false"
                  hide-default-footer
                  style="text-align: center"
          >
            <template v-slot:item.listPrice="{ item }">
                ${{ item.listPrice * item.quantity }}
            </template>
          </v-data-table>
        </div>
        <div class="footer">
          <div class="contact-wrapper" v-if="templateType !== '零售-有價格'">
            <span>總計 ${{ formatPrice(total) }}</span>
            <span>藤舍牧業(何藤畜牧場) 農場牧登字第一一七四三三號</span>
            <span>業務聯絡人 : 0935-734982</span>
            <span>帳務聯絡人 : 0952-582050</span>
            <span>匯款帳號: 中國信託-新竹分行 822-554540329807</span>
            <span>戶名: 張何男</span>
          </div>
          <div v-else class="contact-wrapper">
            <span>總計 ${{ formatPrice(total) }}</span>
            <span>藤舍牧業(何藤畜牧場) 農場牧登字第一一七四三三號</span>
            <span>聯絡電話: 03-4760311</span>
            <span>匯款帳號: 中國信託-新竹分行 822-554540329807</span>
            <span>戶名: 張何男</span>
          </div>
          <div class="sign-wrapper">
            <div v-if="templateType === '商用-有價格'">
              <span>合計 ${{ formatPrice(total-shipmentData.shippingFee) }}</span>
            </div>
            <div v-else></div>
            <div v-if="templateType !== '零售-有價格'" class="sign-block">
              <span>客戶簽收</span>
            </div>
            <div v-else></div>
          </div>
        </div>
      </div>
    </div>
    <!--  出貨單 html end   -->
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
        <v-col>{{ formatPrice(shipmentData.shippingFee) }}</v-col>
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
                    formatPrice(
                      item.salesPrice === 0
                        ? item.listPrice * item.quantity
                        : item.salesPrice * item.quantity
                    )
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
              <p>${{ formatPrice(item.money) }}</p>
            </v-col>
          </v-row>
        </template>
      </v-list-item>
    </v-list>
    <div class="pa-2" style="font-size: 26px; font-weight:bold;">
      <v-row>
        <v-col><span>折讓</span></v-col
        ><v-col class="text-end"
          ><span>${{ formatPrice(discount) }}</span></v-col
        >
      </v-row>
      <v-row>
        <v-col><span>合計</span></v-col
        ><v-col class="text-end"
          ><span style="color: red;">${{ formatPrice(total) }}</span></v-col
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
        :disabled="btnDisable"
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
            :disabled="btnDisable"
            style="width: 100%;"
            @click="back"
            v-if="$store.state.shipmentEdited"
          >
            修改
          </v-btn>
          <v-btn :disabled="btnDisable" style="width: 100%;" @click="back" v-else>
            返回修改
          </v-btn>
        </v-col>
        <v-col>
          <v-btn :disabled="btnDisable" style="width: 100%;" @click="submit(2)">
            只列印貼箱標籤
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import https from "https";
import { fabric } from "fabric";
import JsBarcode from "jsbarcode";
import * as htmlToImage from "html-to-image";
export default {
  name: "SalesDetail",
  data() {
    return {
      shipmentData: {},
      workDate: "",
      discount: 0,
      total: 0,
      messageText: "",
      snackbar: false,
      dialogVisible: false,
      svgJson: "",
      skus: { format: "auto", title: "" },
      skus2: { format: "auto", title: "" },
      btnDisable: false,
      templateType: '',
      headers:[
        { text: '商品名稱',value: 'name', },
        { text: '數量', value: 'quantity' },
        { text: '單位', value: 'unit' },
        { text: '建議售價', value: 'listPrice' },
        { text: '出貨售價', value: 'salesPrice' },
        { text: '折讓', value: 'discount' },
        { text: '總計', value: 'total' },
        { text: '備註', value: 'remark' },
      ],
      tableData: [],
      columnList: []
    };
  },
  created() {
    this.shipmentData = this.$store.state.shipment;
    console.log(this.shipmentData);
    this.workDate = this.$store.state.workDate;
    this.discount = this.$store.state.shipment.discount;
    this.total =
      this.$store.state.shipment.total + this.$store.state.shipment.shippingFee;
    console.log(this.$store.state.shipment.shippingFee);
  },
  methods: {
    formatPrice(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    back() {
      this.$store.state.shipmentBacked = true;
      this.$router.push("/sales");
    },
    submit(value) {
      this.btnDisable = true
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
          .then(async () => {
              await this.drawLabel(value)
              console.log('drawed')
            // this.$store.state.successSnackbar = true;
            // this.$store.state.salesDetailed = false;
            // this.$router.push("/salesLog");
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
                discount:
                  (item.salesPrice === 0 ? item.listPrice : item.salesPrice) *
                    item.quantity -
                  item.money,
                price: item.money,
                remark: item.remark
              };
            }
          )
        })
          .then(() => {
            let _this = this;

            setTimeout(() => {
              _this.drawLabel(value);
            }, 100);
            // this.$store.state.successSnackbar = true;
            // this.$store.state.salesDetailed = false;
            // this.$router.push("/salesLog");
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
    },
    async drawLabel(value) {
      let canvas = new fabric.Canvas("art");
      let img = new Image();
      const dataUrl = await htmlToImage.toPng(
        document.querySelector(".brandLogo")
      );

      img.src = dataUrl;

      this.$nextTick(() => {
        let image = new fabric.Image(img, {
          left: 100,
          top: 10,
          width:200,
          height:121,
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
        top: 140,
        name: "species",
        fontSize: 25,
        fontFamily: "微軟正黑體"
      });
      let text1 = new fabric.Textbox(`${this.shipmentData.receiveItem.name}`, {
        left: 90,
        top: 170,
        name: "species",
        fontSize: 25,
        fontFamily: "微軟正黑體"
      });
      let line = new fabric.Textbox("|", {
        left: 170,
        top: 138,
        fontSize: 20,
        fontWeight: 5,
        fontFamily: "微軟正黑體"
      });
      let line1 = new fabric.Textbox("|", {
        left: 170,
        top: 258,
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
        top: 260,
        name: "orderNo",
        fontSize: 25,
        fontFamily: "微軟正黑體"
      });
      canvas.add(text2);
      await JsBarcode("#ean-13").init();

      // let svg = document.querySelector('#ean-13')
      // let xml = new XMLSerializer().serializeToString(svg);
      // let base64 = 'data:image/svg+xml;base64,' + btoa(xml);
      // let img =  document.querySelector('#ean')
      // img.src = base64;

      const _dataUrl = await htmlToImage.toPng(
        document.querySelector("#ean-13")
      );
      let _img = new Image();
      _img.src = _dataUrl;

      this.$nextTick(() => {
        let _image = new fabric.Image(_img, {
          left: 415,
          top: 210,
          width:288,
          height:142,
          scaleX: 1,
          scaleY: 1
        });
        canvas.add(_image);
      });

      if (this.shipmentData.trackingNo) {
        let text3 = new fabric.Textbox("物流編號", {
          left: 70,
          top: 390,
          name: "orderNo",
          fontSize: 25,
          fontFamily: "微軟正黑體"
        });
        canvas.add(text3);
        await JsBarcode("#trackNo").init();

        const _dataUrl = await htmlToImage.toPng(
          document.querySelector("#trackNo")
        );
        let __img = new Image();
        __img.src = _dataUrl;

        let line2 = new fabric.Textbox("|", {
          left: 170,
          top: 387,
          fontSize: 20,
          fontWeight: 5,
          fontFamily: "微軟正黑體"
        });
        canvas.add(line2);

        this.$nextTick(() => {
          let images2 = new fabric.Image(__img, {
            left: 350,
            top: 350,
            width:354,
            height:140,
            scaleX: 1,
            scaleY: 1
          });
          canvas.add(images2);
        });
      }

      let text7 = new fabric.Textbox("出貨日期", {
        left: 250,
        top: 48,
        name: "workingDate",
        fontSize: 25,
        fontFamily: "微軟正黑體"
      });
      let line3 = new fabric.Textbox("|", {
        left: 350,
        top: 45,
        fontSize: 20,
        fontWeight: 5,
        fontFamily: "微軟正黑體"
      });
      let text8 = new fabric.Textbox(`${this.shipmentData.shipmentDate}`, {
        left: 370,
        top: 48,
        name: "species",
        fontSize: 25
      });
      canvas.add(text7);
      canvas.add(text8);
      canvas.add(line3);

      // logo.outerHTML = ''
      this.$nextTick((this.canvas = canvas));

      setTimeout(() => {
        this.exportSVG(value);
      }, 1000);
    },
    async exportSVG(value) {
      let canvasJson = this.canvas.toJSON();
      console.log(canvasJson);
      let file = await new File([JSON.stringify(canvasJson)], "foo.txt", {
        type: "text/plain"
      });
      const formData = await new FormData();
      formData.append("file", file);

      const agent = new https.Agent({ rejectUnauthorized: false });
      await axios
        .post(`https://127.0.0.1:8099/print/printTag`, formData, {
          httpsAgent: agent
        })
        .then(res => {
          console.log(res)
          if (value == 1) {
            this.$store.state.successMsg =
                    "出貨確認成功，已列印出貨單/貼箱標籤";
          }
          else if(value == 2){
            this.$store.state.successMsg = "出貨確認成功，已列印貼箱標籤";
          }
          this.$store.state.successSnackbar = true;
          this.$store.state.salesDetailed = false;
          this.$router.push("/salesLog");
        })
        .catch(error => {
          console.error(error);
          if (value == 1) {
            this.$store.state.successMsg =
                    "出貨確認成功，列印出貨單/貼箱標籤 失敗";
          }
          else if(value == 2){
            this.$store.state.successMsg = "出貨確認成功，列印貼箱標籤 失敗";
          }
          this.$store.state.successSnackbar = true;
          this.$store.state.salesDetailed = false;
          this.$router.push("/salesLog");
        });
      // axios.post('http://127.0.0.1:8099/print/printTag',formData)
      //         .then(res =>{
      //           console.log(res)
      //         })
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
canvas {
  border: 1px solid #000;
}
.vanish {
  opacity: 0;
}
</style>
