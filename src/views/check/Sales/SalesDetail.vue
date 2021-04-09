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
          :jsbarcode-value="shipmentData.orderNo"
        ></svg>
        <svg
          id="tag-trackNo"
          :jsbarcode-format="skus2.format"
          :jsbarcode-value="shipmentData.trackingNo"
          jsbarcode-textmargin="0"
          jsbarcode-fontoptions="bold"
        ></svg>
      </div>
    </div>
    <!--    出貨單 html start   -->
    <div
      :title="templateType"
      id="exampleWrapper"
      style="position: absolute; top:-2000px; opacity: 0%; width: 1200px; height: 560px;"
    >
      <div class="table-content">
        <div class="top-wrapper">
          <div>
            <span class="Brand-logo"><img src="@/assets/brand_logo.jpg"/></span>
          </div>
          <div class="title">
            <h1>出貨單</h1>
          </div>
          <div v-show="templateType === '零售-有價格' || templateType === '零售-無價格'" class="logo2">
            <h1 class="black-cat-logo">
              {{
                shipmentData.shipment === 1
                  ? "親送"
                  : shipmentData.shipment === 2
                  ? "黑貓宅配"
                  : shipmentData.shipment === 3
                  ? "自取"
                  : ""
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
              >統一編號:<span style="border-bottom: 1px dotted">{{ vatNumber == null ? '無' : vatNumber }}</span></span
            >
            <span v-show="templateType !== '零售-有價格' && templateType !== '零售-無價格'"
              >出貨方式:<span style="border-bottom: 1px dotted">{{
                shipmentData.shipment === 1
                  ? "親送"
                  : shipmentData.shipment === 2
                  ? "黑貓宅配"
                  : shipmentData.shipment === 3
                  ? "自取"
                  : ""
              }}</span></span
            >
            <span v-show="templateType === '零售-有價格' || templateType === '零售-無價格'">
              付款方式:
              <span style="border-bottom: 1px dotted">{{
                shipmentData.payment === 1
                  ? "貨到付款"
                  : shipmentData.payment === 2
                  ? "匯款"
                  : shipmentData.payment === 3
                  ? "現金"
                  : ""
              }}</span>
            </span>
            <span>備註:{{ shipmentData.remark }}</span>
          </div>
          <div class="barcode-wrapper">
            <span>出貨日期:{{ shipmentData.shipmentDate }}</span>
            <div class="paper-content-detail-order">
              <span style="width: 40%;">出貨單號:</span>
              <div class="other3-order-barcode">
                <svg
                  id="order-barcode"
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
              <span style="width: 40%;">物流編號:</span>
              <div class="other3-package-barcode">
                <svg
                  id="order-trackNo"
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
            :headers="setHeader"
            :items="shipmentData.orderItemRequestList"
            :pagination="false"
            hide-default-footer
            disable-sort
            disable-filtering
            disable-pagination
            :mobile-breakpoint="0"
            style="text-align: center"
          >
            <template v-slot:item.listPrice="{ item }">
              <span>${{ formatPrice(item.listPrice * item.quantity) }}</span>
            </template>
            <template v-slot:item.salesPrice="{ item }">
              <span>${{ formatPrice(item.salesPrice * item.quantity) }}</span>
            </template>
            <template v-slot:item.discount="{ item }">
              <span
                >${{
                  formatPrice(
                    (item.salesPrice == 0 ? item.listPrice : item.salesPrice) *
                      item.quantity -
                      item.money
                  )
                }}</span
              >
            </template>
            <template v-slot:item.total="{ item }">
              <span>${{ formatPrice(item.money) }}</span>
            </template>
          </v-data-table>
        </div>
        <div class="footer">
          <div class="contact-wrapper" v-if="templateType !== '零售-有價格' && templateType !== '零售-無價格'">
            <span style="font-size: 35px;">總計 {{ shipmentData.orderItemRequestList.length }}</span>
            <span>藤舍牧業(何藤畜牧場) 農場牧登字第一一七四三三號</span>
            <span>業務聯絡人 : 0935-734982</span>
            <span>帳務聯絡人 : 0952-582050</span>
            <span>匯款帳號: 中國信託-新竹分行 822-554540329807</span>
            <span>戶名: 張何男</span>
          </div>
          <div v-else class="contact-wrapper">
            <span style="font-size: 35px;">總計 {{ shipmentData.orderItemRequestList.length }}</span>
            <span>藤舍牧業(何藤畜牧場) 農場牧登字第一一七四三三號</span>
            <span>聯絡電話: 03-4760311</span>
            <span>匯款帳號: 中國信託-新竹分行 822-554540329807</span>
            <span>戶名: 張何男</span>
          </div>
          <div class="sign-wrapper">
            <div v-if="templateType === '商用-有價格' || templateType === '零售-有價格'">
              <span
                >合計 ${{ formatPrice(total - shipmentData.shippingFee) }}</span
              >
            </div>
            <div v-else></div>
            <div v-if="templateType !== '零售-有價格' && templateType !== '零售-無價格'" class="sign-block">
              <span style="font-size: 17px;">客戶簽收</span>
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
            <span v-if="shipmentData.shipment != 3">
              <span>/</span>
              <span v-if="shipmentData.temperatureCategory == 1">常溫</span>
              <span v-if="shipmentData.temperatureCategory == 2">冷藏</span>
              <span v-if="shipmentData.temperatureCategory == 3">冷凍</span>
              <span>/</span>
              <span v-if="shipmentData.volume == 1">60公分</span>
              <span v-if="shipmentData.volume == 2">90公分</span>
              <span v-if="shipmentData.volume == 3">120公分</span>
              <span v-if="shipmentData.volume == 4">150公分</span>
            </span>
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
              <p v-if="item.unit == '件' || item.unit == '包'">{{ item.quantity }}</p>
              <p v-else>{{ item.weight }}</p>
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
      <v-radio-group v-model="printType">
        <v-row>
          <v-col class="col-1"> <span>1.</span></v-col
          ><v-col><v-radio label="商用格式" :value="1"></v-radio></v-col>
          <v-col> <v-radio label="零售格式" :value="2"></v-radio></v-col>
        </v-row>
      </v-radio-group>
      <v-radio-group v-model="printType2">
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
          <v-btn
            :disabled="btnDisable"
            style="width: 100%;"
            @click="back"
            v-else
          >
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
import { jsPDF } from "jspdf";
// import PDFMerger from "pdf-merger-js";
// import merge from 'easy-pdf-merge'
export default {
  name: "SalesDetail",
  data() {
    return {
      shipmentData: {},
      vatNumber: null,
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
      printType:1,
      printType2:1,
      templateType: "",
      headers: [
        {
          text: "商品名稱",
          value: "name",
          class: "text-h5 font-weight-black grey lighten-2 pt-5 pb-5"
        },
        {
          text: "數量",
          value: "quantity",
          class: "text-h5 font-weight-black grey lighten-2"
        },
        {
          text: "單位",
          value: "unit",
          class: "text-h5 font-weight-black grey lighten-2"
        },
        {
          text: "建議售價",
          value: "listPrice",
          class: "text-h5 font-weight-black grey lighten-2"
        },
        {
          text: "出貨售價",
          value: "salesPrice",
          class: "text-h5 font-weight-black grey lighten-2"
        },
        {
          text: "折讓",
          value: "discount",
          class: "text-h5 font-weight-black grey lighten-2"
        },
        {
          text: "總計",
          value: "total",
          class: "text-h5 font-weight-black grey lighten-2"
        },
        {
          text: "備註",
          value: "remark",
          class: "text-h5 font-weight-black grey lighten-2"
        }
      ],
      headers2: [
        {
          text: "商品名稱",
          value: "name",
          class: "text-h5 font-weight-black grey lighten-2 pt-5 pb-5"
        },
        {
          text: "數量",
          value: "quantity",
          class: "text-h5 font-weight-black grey lighten-2"
        },
        {
          text: "單位",
          value: "unit",
          class: "text-h5 font-weight-black grey lighten-2"
        },
        {
          text: "",
          value: "",
          class: "text-h5 font-weight-black grey lighten-2"
        },
        {
          text: "",
          value: "",
          class: "text-h5 font-weight-black grey lighten-2"
        },
        {
          text: "",
          value: "",
          class: "text-h5 font-weight-black grey lighten-2"
        },
        {
          text: "",
          value: "",
          class: "text-h5 font-weight-black grey lighten-2"
        },
        {
          text: "備註",
          value: "remark",
          class: "text-h5 font-weight-black grey lighten-2"
        }
      ],
      setHeader: [],
      tableData: [],
      columnList: [],
      reportPDF: "",
      reportPDF2: "",
      printPage: null,
      printPage2: null
    };
  },
  created() {
    this.shipmentData = this.$store.state.shipment;
    if(this.shipmentData.clientItem.id == '' || this.shipmentData.clientItem.id == null){
      this.$store.state.salesDetailed = false;
      this.$router.push("/salesLog");
    }
    this.workDate = this.$store.state.workDate;
    this.discount = this.$store.state.shipment.discount;
    this.total =
      this.$store.state.shipment.total + this.$store.state.shipment.shippingFee;
    this.setHeader = this.headers;
    this.$api.Customer.getClient(this.shipmentData.clientItem.id).then(res=>{
      console.log(res);
      this.vatNumber = res.data.vatNumber
    })
    this.printPage = document.createElement("div");
    this.printPage2 = document.createElement("div");
    this.reportPDF = new jsPDF("p", "pt", "a4");
    this.reportPDF2 = new jsPDF("p", "pt", "a4");
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
    async submit(value) {
      this.btnDisable = true;
      let recipientId = this.$store.state.shipment.receiveItem.id;
      if (recipientId == "1") {
        recipientId = "0";
      } else if (recipientId == "2") {
        recipientId = "1";
      }
      // await this.printReport(value);
      // this.printPage.remove();
      // console.log("printPage remove");
      // this.printPage2.remove();
      // console.log("printPage2 remove");
      // return
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
                discount:
                  (item.salesPrice === 0 ? item.listPrice : item.salesPrice) *
                    item.quantity -
                  item.money,
                price: item.money,
                remark: item.remark,
                weight: item.weight
              };
            }
          )
        })
          .then(async () => {
            if (value == 1) {
              await this.printReport(value);
              this.printPage.remove();
              console.log("printPage remove");
              this.printPage2.remove();
              console.log("printPage2 remove");
              // await this.drawLabel(value);
            } else if (value == 2) {
              await this.drawLabel(value);
            }
          })
          .catch(err => {
            this.messageText = err.response.data.message;
            this.snackbar = true;
          });
      } else {
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
          .then(async () => {
            if (value == 1) {
              await this.printReport(value);
              this.printPage.remove();
              console.log("printPage remove");
              this.printPage2.remove();
              console.log("printPage2 remove");
              // await this.drawLabel(value);
            } else if (value == 2) {
              await this.drawLabel(value);
            }
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
    async addReportImg(value) {
      const dataUrl = await htmlToImage.toPng(
        document.querySelector(".table-content")
      );

      if (value == 1) {
        let img = new Image();

        img.src = dataUrl;
        img.width = 595;
        this.printPage.appendChild(img);
        console.log("pirnt page add image");
      } else if (value == 2) {
        let img = new Image();

        img.src = dataUrl;
        img.width = 595;
        this.printPage2.appendChild(img);
        console.log("print page2 add image");
      }
      // let img = new Image()
      //
      // img.src = dataUrl
      // img.width = 595
      // this.printPage.appendChild(img)
    },
    async printReport(value) {
      let pdfFile, pdfFile2;
      let file1, file2;
      // 出貨單 輸出格式
      let printTypeStr = '', printTypeStr2 = ''
      if(this.printType == 1){
        if(this.printType2 == 1){
          printTypeStr = '商用-有價格'
          printTypeStr2 = '商用-無價格'
        }
        else if(this.printType2 == 2){
          printTypeStr = '商用-無價格'
          printTypeStr = '商用-無價格'
        }
      }
      else if(this.printType == 2){
        if(this.printType2 == 1){
          printTypeStr = '零售-有價格'
          printTypeStr2 = '零售-無價格'
        }
        else if(this.printType2 == 2){
          printTypeStr = '零售-無價格'
          printTypeStr2 = '零售-無價格'
        }
      }
      this.$nextTick(() => {
        this.templateType = printTypeStr;
        if(this.printType2 == 2){
          this.setHeader = this.headers2;
        }
      });
      JsBarcode("#order-barcode").init();
      JsBarcode("#order-trackNo").init();
      await this.addReportImg(1);
      // this.printPage.classList.add('printImage')
      console.log("print report first");
      // console.log(this.printPage);

      let doc = this.reportPDF;
      await this.reportPDF.html(this.printPage, {
        callback: function(doc) {
          // console.log(doc.output('datauristring'));
          pdfFile = doc.output("datauristring");
        },
        x: 10
      });
      this.$nextTick(() => {
        this.templateType = printTypeStr2;
        this.setHeader = this.headers2;
        console.log("is set header2");
      });

      await this.addReportImg(2);
      // this.printPage.classList.add('printImage2')
      console.log("print report second");
      // console.log(this.printPage2);
      // let doc = this.reportPDF
      // doc.addHTML(this.printPage)
      this.reportPDF = new jsPDF("p", "pt", "a4");
      let doc2 = this.reportPDF;

      await this.reportPDF.html(this.printPage2, {
        callback: async function(doc2) {
          // console.log(doc2.output('datauristring'));

          pdfFile2 = doc2.output("datauristring");
          // console.log(pdfFile);
          console.log("pdfFile created");
          // function loadFile(){
          //   return new Promise(resolve => {
          fetch(pdfFile)
            .then(res => res.blob())
            .then(blob => {
              console.log("ready create file1");
              file1 = new File([blob], "test.pdf", { type: "application/pdf" });
              console.log("is file1 created");

              // let fileURL = URL.createObjectURL(file1);
              // window.open(fileURL);
            });

          // })
          // }

          fetch(pdfFile2)
            .then(res => res.blob())
            .then(blob => {
              console.log("ready create file2");
              file2 = new File([blob], "test2.pdf", {
                type: "application/pdf"
              });
              console.log("is file2 created");
              // let fileURL = URL.createObjectURL(file2);
              // window.open(fileURL);
            });

          // merger.add(pdfFile)
          // merger.add(pdfFile2)
          // await merger.save('output.pdf')

          // merge([file1, file2], 'File Ouput.pdf', function (err) {
          //   if (err) {
          //     return console.log(err)
          //   }
          //   console.log('Successfully merged!')
          // });
        },
        x: 10
      });

      function postPdf() {
        return new Promise(async resolve => {
          console.log("is ready print pdf");
          let formData = new FormData();
          formData.append("pdf", file1);
          // formData.append("printerName", "Sbarco T4ES 203 dpi");
          formData.append("printerName", "EPSONDB5105 (L3150 Series)");
          console.log(this.$store.state.ip);
          const agent = new https.Agent({ rejectUnauthorized: false });

          await axios
            .post(
              `https://${this.$store.state.ip}:8099/print/printPdf`,
              formData,
              { httpsAgent: agent }
            )
            .then(async res => {
              console.log(res);
              formData.set("pdf", file2);
              await axios
                .post(
                  `https://${this.$store.state.ip}:8099/print/printPdf`,
                  formData,
                  { httpsAgent: agent }
                )
                .then(async res=> {
                  console.log(res);
                  await this.drawLabel(value);
                })
                .catch(error => {
                  console.error(error);
                  this.$store.state.successMsg = "出貨單產出失敗";
                  this.$store.state.successSnackbar = true;
                  this.$store.state.salesDetailed = false;
                  this.$router.push("/salesLog");
                });
            })
            .catch(error => {
              console.error(error);
              this.$store.state.successMsg = "出貨單產出失敗";
              this.$store.state.successSnackbar = true;
              this.$store.state.salesDetailed = false;
              this.$router.push("/salesLog");
            });


          resolve(true);
        });
      }
      setTimeout(async () => {
        await postPdf.bind(this)();
      }, 5000);
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
          left: 80,
          top: 10,
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
          top: 210,
          width: 288,
          height: 100,
          scaleX: 0.8,
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
        await JsBarcode("#tag-trackNo").init();

        const _dataUrl = await htmlToImage.toPng(
          document.querySelector("#tag-trackNo")
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
            left: 200,
            top: 320,
            width: 254,
            height: 100,
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
      formData.append("width", "100");
      formData.append("height", "80");
      formData.append("printerName", "Sbarco T4ES 203 dpi");
      const agent = new https.Agent({ rejectUnauthorized: false });
      await axios
        .post(`https://${this.$store.state.ip}:8099/print/printTag`, formData, {
          httpsAgent: agent
        })
        .then(res => {
          console.log(res);
          if (value == 1) {
            this.$store.state.successMsg =
              "出貨確認成功，已列印出貨單/貼箱標籤";
            console.log(this.$store.state.successMsg,'exportSVG');
          } else if (value == 2) {
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
          } else if (value == 2) {
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
.top-wrapper {
  display: flex;
  /*justify-content: space-between;*/
  align-items: center;
  height: 120px;
  .black-cat-logo {
    border: 2px solid;
  }
  .title {
    position: relative;
    right: -30%;
  }
  .logo2 {
    position: relative;
    right: -55%;
  }
  img {
    width: 150px;
    position: relative;
    left: 0;
    top: 0;
  }
}

#exampleWrapper {
  opacity: 0;
}
.table-content {
  padding: 0px 60px 0 10px;
}
.detail-wrapper {
  display: flex;
  justify-content: space-between;

  .detail-list {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 70%;
    line-height: 30px;
    left: 0;
    span {
      font-size: 25px;
    }
  }
  .barcode-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 30%;
    right: 20px;
    span {
      font-size: 25px;
    }
    .paper-content-detail-order {
      display: flex;
      /*justify-content: space-between;*/
      margin: -25px 0 -25px 0;
      align-items: center;
    }
  }
}
.other3-order-barcode {
  svg {
    width: 200px;
  }
}
.content-wrapper {
  position: relative;
  top: 20px;
  margin-bottom: 20px;
}
.footer {
  margin-top: 80px;
  h2 {
    margin-bottom: 50px;
  }
  display: flex;
  justify-content: space-between;
  .contact-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 70%;
    left: 0;
    span {
      font-size: 25px;
    }
  }
  .sign-wrapper {
    position: relative;
    width: 20%;
    right: 0px;
    span {
      font-size: 35px;
    }
  }
  .sign-block {
    background-color: #f4f4f4;
    width: 230px;
    height: 50px;
    line-height: 3;
    margin-top: 77px;
    padding: 0 0 0 12px;
  }
}
.package-wrapper {
  width: 520px;
  height: 510px;
  margin: 0 auto;
  position: relative;
  opacity: 0;
}
.other3-package-barcode {
  svg {
    width: 200px;
  }
}
/*::v-deep .v-data-table-header{*/
/*  background-color: #d9001b;*/
/*  tr > th{*/
/*    font-size: 30px;*/
/*  }*/
/*}*/
::v-deep .v-data-table > .v-data-table__wrapper > table > tbody > tr {
  td {
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: 20px !important;
  }
}
</style>
