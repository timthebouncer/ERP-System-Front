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
      @click="toTop"
      ><v-icon>mdi-chevron-up</v-icon></v-btn
    >
    <v-snackbar v-model="snackbar" top color="primary" timeout="2000">
      <span>{{ messageText }}</span>
    </v-snackbar>
    <v-snackbar v-model="errSnackbar" centered color="red" timeout="2000">
      <span>{{ messageText }}</span>
    </v-snackbar>
    <!--    新增客戶資料 新增收件資料 彈窗-->
    <v-dialog v-model="dialogVisible" hide-overlay fullscreen>
      <v-card style="background-color: #fff0e9;">
        <v-system-bar color="#fff0e9"
          ><v-spacer></v-spacer
          ><v-btn icon @click="dialogVisible = false"
            ><v-icon color="#000000" size="25">mdi-close</v-icon></v-btn
          ></v-system-bar
        >
        <v-card-title class="justify-center">
          <span class="text-h4">{{ dialogTitle }}</span>
        </v-card-title>
        <v-card-text class="pa-2">
          <v-row
            class="align-content-center"
            v-for="item in dialogData"
            v-bind:key="item.title"
            ><v-col class="col-4"
              ><span class="text-h6 font-weight-black">{{
                item.title
              }}</span></v-col
            ><v-col class="col-8"
              ><v-text-field
                class=""
                solo
                v-model="item.value"
              ></v-text-field></v-col
          ></v-row>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="" text outlined @click="dialogVisible = false">
            取消
          </v-btn>
          <v-btn color="primary" @click="addDialog">
            儲存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    新增商品 彈窗-->
    <v-dialog v-model="salesDialogVisible">
      <v-card style="background-color: #fff0e9;">
        <v-system-bar color="#fff0e9"
          ><v-spacer></v-spacer
          ><v-btn icon @click="salesDialogVisible = false"
            ><v-icon color="#000000" size="25">mdi-close</v-icon></v-btn
          ></v-system-bar
        >
        <v-card-text class="pl-1 pr-2">
          <v-row class="align-content-center"
            ><v-col class="col-4"
              ><span class="text-h6 font-weight-black">商品條碼</span></v-col
            ><v-col class="col-8"
              ><span class="text-h6">{{ productData.barcode }}</span></v-col
            ></v-row
          >
          <v-row class="align-content-center"
            ><v-col class="col-4"
              ><span class="text-h6 font-weight-black">商品名稱</span></v-col
            ><v-col class="col-8"
              ><span class="text-h6">{{ productData.name }}</span></v-col
            ></v-row
          >
          <v-row class="align-content-center"
            ><v-col class="col-4"
              ><span class="text-h6 font-weight-black">計價單位</span></v-col
            ><v-col class="col-8"
              ><span class="text-h6">{{ productData.unit }}</span></v-col
            ></v-row
          >
          <v-row class="align-content-center"
            ><v-col class="col-4"
              ><span class="text-h6 font-weight-black">數量</span></v-col
            ><v-col
              class="col-8"
              v-if="productData.unit == '件' || productData.unit == '包'"
              ><ul class="counter">
                <li>
                  <input
                    type="button"
                    value="-"
                    @click="
                      () => {
                        if (this.quantityDialog > 1) {
                          this.quantityDialog--;
                        }
                      }
                    "
                  />
                </li>
                <li style="width: 100%; height: 50px;">
                  <input
                    class="numberCount"
                    type="number"
                    v-model="quantityDialog"
                    style="text-align: center"
                  />
                </li>
                <li>
                  <input
                    type="button"
                    value="+"
                    @click="
                      () => {
                        if (this.quantityDialog < productData.amount) {
                          this.quantityDialog++;
                        }
                      }
                    "
                  />
                </li></ul></v-col
            ><v-col class="col-8" v-else
              ><span class="text-h6">{{ productData.weight }}</span></v-col
            >
          </v-row>
          <v-row class="align-content-center"
            ><v-col class="col-4"
              ><span class="text-h6 font-weight-black">備註</span></v-col
            ><v-col class="col-8"
              ><v-textarea
                solo
                rows="3"
                v-model="remarkDialog"
              ></v-textarea></v-col
          ></v-row>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="" text outlined @click="salesDialogVisible = false">
            取消
          </v-btn>
          <v-btn color="primary" @click="addSales(productData.barcode)">
            儲存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    刪除商品 彈窗-->
    <v-dialog v-model="delProductDialogVisible">
      <v-card style="background-color: #fff0e9;">
        <v-card-text class="text-center"
          ><span class="text-h6 font-weight-black"
            >是否刪除{{ delProductDialogItem.name }}</span
          ></v-card-text
        >
        <v-card-actions class="justify-center">
          <v-btn
            color=""
            text
            outlined
            @click="deleteDialogCancel(delProductDialogItem)"
          >
            取消
          </v-btn>
          <v-btn color="primary" @click="deleteProduct(delProductDialogItem)">
            確定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    編輯備註 彈窗-->
    <v-dialog v-model="changeProductDialogVisible">
      <v-card style="background-color: #fff0e9;">
        <v-system-bar color="#fff0e9"
          ><v-spacer></v-spacer
          ><v-btn icon @click="changeDesDialogCancel"
            ><v-icon color="#000000" size="25">mdi-close</v-icon></v-btn
          ></v-system-bar
        >
        <v-card-text class="pl-1 pr-2">
          <v-row class="align-content-center"
            ><v-col class="col-4"
              ><span class="text-h6 font-weight-black">商品條碼</span></v-col
            ><v-col class="col-8"
              ><span class="text-h6">{{
                changeProductDialogItem.barcode
              }}</span></v-col
            ></v-row
          >
          <v-row class="align-content-center"
            ><v-col class="col-4"
              ><span class="text-h6 font-weight-black">商品名稱</span></v-col
            ><v-col class="col-8"
              ><span class="text-h6">{{
                changeProductDialogItem.name
              }}</span></v-col
            ></v-row
          >
          <v-row class="align-content-center"
            ><v-col class="col-4"
              ><span class="text-h6 font-weight-black">備註</span></v-col
            ><v-col class="col-8"
              ><v-textarea
                solo
                rows="3"
                v-model="changeProductDialogDes"
              ></v-textarea></v-col
          ></v-row>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="" text outlined @click="changeDesDialogCancel">
            取消
          </v-btn>
          <v-btn color="primary" @click="changeProductDes">
            儲存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="top-wrapper rounded">
      客戶資訊
    </div>
    <!--    客戶資訊 -->
    <v-list class="rounded elevation-10">
      <v-list-group
        v-for="item in items"
        :key="item.title"
        v-model="item.active"
        no-action
        :disabled="item.key != 'receive' && $store.state.shipmentEdited"
      >
        <template v-slot:activator>
          <v-list-item-content v-if="item.key == 'receive'">
            <v-col class="col-4 pl-0">
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-col>
            <v-col v-if="hasReceive">
              <v-list-item-title v-if="receiveData.id == 1"
                >同客戶資料<span v-if="item.defaultReceiveInfo == 0"
                  >(預設地址)</span
                ></v-list-item-title
              >
              <v-list-item-title v-else-if="receiveData.id == 2"
                >同公司資料<span v-if="item.defaultReceiveInfo == 1"
                  >(預設地址)</span
                ></v-list-item-title
              >
              <v-list-item-title v-else class="text-center"
                ><span v-if="item.defaultReceiveInfo == item.selectedIndex"
                  >(預設地址)</span
                ></v-list-item-title
              >
            </v-col>
            <div v-if="hasReceive">
              <v-list-item class="justify-space-between ma-0 pa-0">
                <v-col class="">{{ receiveData.name }}</v-col
                ><v-col class="">{{ receiveData.phone }}</v-col>
              </v-list-item>
              <v-list-item class="justify-space-between ma-0 pa-0">
                <v-col class="col-3">{{ receiveData.code }}</v-col
                ><v-col class="col-9 pl-0 pr-0">{{
                  receiveData.address
                }}</v-col>
              </v-list-item>
            </div>
          </v-list-item-content>
          <v-list-item-content v-else>
            <v-col class="col-4 pl-0">
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-col>
            <v-col v-if="item.key == 'class'"
              ><v-list-item-title style="word-break: break-all;">{{
                classData.className
              }}</v-list-item-title></v-col
            >
            <v-col v-else-if="item.key == 'client'"
              ><v-list-item-title
                style="word-break: break-all;text-align: center;"
                ><v-row class="justify-space-between ma-0"
                  ><span class="">{{ clientData.name }}</span
                  ><span class="">{{ clientData.phone }}</span
                  ><span></span></v-row></v-list-item-title
            ></v-col>
          </v-list-item-content>
        </template>

        <!--        客戶類別 List-->
        <template v-if="item.key == 'class'">
          <v-radio-group
            @change="classRadioChange"
            class="mt-0"
            :value="classData.id"
          >
            <v-list-item v-for="child in item.items" :key="child.id">
              <v-radio :value="child.id" :key="child.id">
                <template v-slot:label>
                  <v-list-item-action class="mr-1"> </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="child.className"
                      style="color: black;"
                    ></v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-radio>
            </v-list-item>
          </v-radio-group>
        </template>
        <!--        客戶資料 List-->
        <template v-else-if="item.key == 'client'">
          <v-radio-group @change="clientRadioChange" :value="clientData.id">
            <v-list-item v-for="child in item.items" :key="child.id">
              <v-radio :value="child.id" :key="child.id" style="width: 100%;">
                <template v-slot:label>
                  <v-list-item-content>
                    <v-row class=" ma-0 text-center"
                      ><span class="col-6 pl-0" style="color: black;">{{
                        child.name
                      }}</span
                      ><span class="col-4" style="color: black;">{{
                        child.phone
                      }}</span
                      ><span class=""></span
                    ></v-row>
                  </v-list-item-content>
                </template>
              </v-radio>
            </v-list-item>
          </v-radio-group>
          <v-list-item class="pa-0 justify-center">
            <v-btn
              text
              class="font-weight-bold text-h5"
              @click="openDataDialog('client')"
              :disabled="classData.id == ''"
              ><v-icon>mdi-plus-circle-outline</v-icon>新增客戶資料</v-btn
            >
          </v-list-item>
        </template>
        <!--        收件資料 List-->
        <template v-else-if="item.key == 'receive'">
          <v-radio-group
            @change="receiveRadioChange"
            :value="receiveData.id"
            class="ma-0"
          >
            <v-list-item v-for="(child,index) in item.items" :key="child.id">
              <v-radio :value="child.id" :key="child.id">
                <template v-slot:label>
                  <v-list-item-content>
                    <div style="color: black;">
                      <v-row class="ma-0"
                        ><span class="">{{ child.name }}</span
                        ><span class="pl-2"></span><span class="">{{ child.phone }}</span
                        ></v-row>
                      <v-row v-if="index>1" class="justify-space-between ma-0"
                        ><span class="col-1 pl-0">{{ child.code }}</span
                        ><span class="col-10">{{ child.address }}</span
                        ><span></span
                      ></v-row>
                    </div>
                  </v-list-item-content>
                  <span v-if="item.defaultReceiveInfo == index" class="pl-2 red--text text-h5">預</span>
                </template>
              </v-radio>
            </v-list-item>
          </v-radio-group>
          <v-list-item class="pa-0 justify-center">
            <v-btn
              text
              class="font-weight-bold text-h5"
              @click="openDataDialog('receive')"
              :disabled="clientData.id == ''"
              ><v-icon>mdi-plus-circle-outline</v-icon>新增收件資料</v-btn
            >
          </v-list-item>
        </template>
      </v-list-group>
    </v-list>
    <div class="content-wrapper rounded">
      輸入商品
    </div>
    <div>
      <v-row class="ma-0"
        ><v-col class="col-4 align-self-center"><span>商品條碼</span></v-col
        ><v-col>
          <!--        <v-autocomplete-->
          <!--            v-model="productId"-->
          <!--            :items="productItemData"-->
          <!--            item-text="barcode"-->
          <!--            item-value="productId"-->
          <!--            dense-->
          <!--            @change="setBarcode"-->
          <!--            filled-->
          <!--            :autofocus="inputFocused"-->
          <!--          ></v-autocomplete>-->
          <v-text-field
            id="barcodeInput"
            v-model="productBarcode"
            placeholder="可掃條碼 或 手動輸入"
            @input="setBarcode"
            solo
          ></v-text-field> </v-col
      ></v-row>
    </div>
    <div class="footer-wrapper rounded">
      商品資料
    </div>
    <!--    商品資料 List-->
    <div
      v-if="productItem.length == 0"
      class="text-h4 text-center grey--text mt-3"
    >
      +請掃條碼添加商品
    </div>
    <div v-else>
      <swipe-list
        ref="swipeList"
        class="productList"
        :items="productItem"
        transition-key="id"
      >
        <template slot-scope="{ item, index }">
          <v-row>
            <v-col class="col-6">
              <div class="productList-content">
                <p>{{ item.barcode }}</p>
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
            <v-col class="col-6 align-self-center pl-0">
              <div class="mr-1">
                <ul
                  class="counter"
                  v-if="item.unit == '件' || item.unit == '包'"
                >
                  <p class="mb-1 commodityNumber">數量</p>
                  <li>
                    <input type="button" @click="minuser(index)" value="-" />
                  </li>
                  <li style="width: 100%; height: 50px;">
                    <input
                      class="numberCount"
                      type="number"
                      v-model="item.quantity"
                      @input="item = productCountInput(item)"
                      @change="item = productCountChange(item)"
                      style="text-align: center"
                    />
                  </li>
                  <li>
                    <input type="button" @click="adder(index)" value="+" />
                  </li>
                </ul>
                <ul class="counter" v-else>
                  <p class="mb-1 commodityNumber">數量</p>
                  <span class="text-h6">{{ item.weight }}</span>
                </ul>
              </div>
              <div class="text-center pt-3">
                <p>
                  $<input
                    type="text"
                    v-model="item.money"
                    @input="item.money = productMoneyInput(item.money)"
                    @change="item = productMoneyChange(item)"
                    style="text-align: center;border: #999 thin solid; width: 100px;margin-left: 5px; font-size: large;"
                  />
                </p>
              </div>
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </template>

        <template v-slot:left="{ item, index }">
          <div
            class="swipeout-action action-panel-left"
            @click="onChangeDesDialog(item, index)"
          >
            <div>
              <span>編輯備註</span>
            </div>
          </div>
        </template>
        <template v-slot:right="{ item }">
          <div
            class="swipeout-action action-panel-right"
            @click="onDelProductDialog(item)"
          >
            <div>
              <v-icon>mdi-trash-can-outline</v-icon>
            </div>
          </div>
        </template>
      </swipe-list>
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
      <div>
        <v-btn
          color="primary"
          style="width: 100%; font-size: large;"
          :disabled="nextDisabled"
          @click="submit"
        >
          下一步 > 輸入出貨資料
        </v-btn>
      </div>
    </div>
  </v-container>
</template>
<script>
import { SwipeList } from "vue-swipe-actions";
import "vue-swipe-actions/dist/vue-swipe-actions.css";
import { UNIT } from "../../../mixin/enums";
export default {
  name: "Sales",
  components: {
    SwipeList
  },
  data() {
    return {
      fab: false,
      snackbar: false,
      errSnackbar: false,
      messageText: "",
      items: [
        {
          key: "class",
          title: "客戶類別:",
          active: true,
          items: [{ id: "", className: "" }]
        },
        {
          key: "client",
          title: "客戶資料:",
          active: false,
          items: []
        },
        {
          key: "receive",
          title: "收件資料:",
          active: false,
          defaultReceiveInfo: 0,
          selectedIndex: 0,
          items: []
        }
      ],
      productItemData: [],
      productItem: [],
      productBarcode: "",
      productData: {
        id: "",
        productId: "",
        barcode: "",
        name: "",
        unit: "",
        weight: 0,
        amount: "",
        salesPrice: 0,
        listPrice: 0,
        description: "",
        quantity: 1,
        money: 0
      },
      dialogVisible: false,
      salesDialogVisible: false,
      quantityDialog: 1,
      remarkDialog: "",
      delProductDialogVisible: false,
      changeProductDialogVisible: false,
      delProductDialogItem: {},
      changeProductDialogItem: {},
      changeProductDialogDes: "",
      changeProductDesIndex: 0,
      dialogTitle: "",
      dialogData: [{ title: "", value: "" }],
      classData: { id: "", className: "" },
      clientListRes: [],
      clientData: {
        id: "",
        name: "",
        phone: "",
        code: "",
        address: ""
      },
      companyData: {
        id: "",
        name: "",
        phone: "",
        code: "",
        address: ""
      },
      receiveData: {
        id: "",
        name: "",
        phone: "",
        code: "",
        address: ""
      },
      hasClass: false,
      hasClient: false,
      hasReceive: false,
      nextDisabled: true,
      discount: 0,
      total: 0,
      inputFocused: false
    };
  },
  watch: {
    quantityDialog() {
      if (this.quantityDialog == "") {
        return;
      } else {
        if (this.quantityDialog == 0) {
          this.quantityDialog = 1;
        } else if (this.quantityDialog > this.productData.amount) {
          this.quantityDialog = this.productData.amount;
        }
      }
    }
  },
  methods: {
    formatPrice(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
    classRadioChange(value) {
      this.clientData = { id: "", name: "", phone: "", code: "", address: "" };
      this.companyData = {};
      this.receiveData = {};
      this.items[2].items = [];
      this.hasClient = false;
      this.hasReceive = false;
      this.classData = this.items[0].items.find(x => x.id == value);
      this.items[0].active = false;
      this.items[1].items = [];
      this.clientListRes.map(item => {
        if (value == item.classes.id) {
          let data = {
            id: item.id,
            name: item.name,
            phone: item.tel,
            code: item.postCode,
            address: item.address
          };
          this.items[1].items.push(data);
        }
      });
      this.hasClass = true;
      this.items[1].active = false;
      this.items[1].active = true;
      this.checkNexted();
    },
    clientRadioChange(value) {
      this.companyData = {};
      this.receiveData = {};
      this.hasReceive = false;
      this.clientData = this.items[1].items.find(x => x.id == value);
      this.items[1].active = false;
      let data = {};
      data = this.clientListRes.filter(item => {
        return value == item.id;
      });
      let tmpData = {
        id: "2",
        name: data[0].companyName,
        phone: data[0].companyTel,
        code: data[0].companyPostCode,
        address: data[0].companyAddress
      };
      this.companyData = tmpData;
      let list = [];
      list = data[0].recipientList;
      // (預設地址)
      let receivedList = [
        { id: "1", name: "同客戶資料", phone: "", code: "", address: "" },
        { id: "2", name: "同公司資料", phone: "", code: "", address: "" }
      ];
      list.map(items => {
        let item = {
          id: items.id,
          name: items.receiver,
          phone: items.tel,
          code: items.postCode,
          address: items.address
        };
        receivedList.push(item);
      });
      this.items[2].items = receivedList;
      this.hasClient = true;
      let defaultReceiveInfo = data[0].defaultReceiveInfo;
      this.items[2].defaultReceiveInfo = defaultReceiveInfo;
      if (this.$store.state.shipmentEdited) {
        defaultReceiveInfo = this.$store.state.shipment.defaultReceiveInfo;
      } else {
        this.$store.state.shipment.defaultReceiveInfo = defaultReceiveInfo;
      }
      if (defaultReceiveInfo == 0) {
        this.receiveData = Object.assign({}, this.clientData);
        this.receiveData.id = "1";
        this.items[2].selectedIndex = 0;
        this.hasReceive = true;
      } else if (defaultReceiveInfo == 1) {
        this.receiveData = Object.assign({}, this.companyData);
        this.items[2].selectedIndex = 1;
        this.hasReceive = true;
      } else {
        this.receiveData = this.items[2].items[defaultReceiveInfo];
        this.items[2].selectedIndex = defaultReceiveInfo;
        this.hasReceive = true;
      }

      this.$api.Commodity.getSalesProduct({
        searchKey: "",
        barcode: "",
        clientId: value
      }).then(async res => {
        this.productItemData = [];

        await res.data.map(async (item, index) => {
          let data = {
            id: index,
            productId: item.productId,
            barcode: item.barcode,
            name: item.productName,
            unit: this.getUnit(item.unit),
            weight: item.weight,
            amount: item.amount,
            salesPrice: item.clientPrice,
            listPrice: item.price,
            description: "",
            quantity: 1,
            money: 0
          };
          let amount = 0;
          if (
            this.$store.state.shipmentEdited &&
            this.$store.state.shipment.lastOrderItemList.findIndex(
              x => x.barcode == data.barcode
            ) != -1
          ) {
            amount = this.$store.state.shipment.lastOrderItemList.find(
              x => x.barcode == data.barcode
            ).amount;
            data.amount += amount;
          }
          let productItemIndex = 0;
          productItemIndex = this.productItem.findIndex(
            x => x.barcode == data.barcode
          );
          if (productItemIndex != -1) {
            this.productItem[productItemIndex].salesPrice = data.salesPrice;
            this.productItem[productItemIndex].listPrice = data.listPrice;
            this.productItem[productItemIndex].money = this.formatPrice(
              (data.salesPrice === 0 ? data.listPrice : data.salesPrice) *
                this.productItem[productItemIndex].quantity
            );
          }
          this.productItemData.push(data);
        });
      });
      console.log('is pushed');
      if (this.productItem.length > 0) {
        setTimeout(()=>{
          console.log('onCal');
          this.onCalculation();
        },1500)
      } else {
        this.checkNexted();
      }
      document.getElementById("barcodeInput").focus();
    },
    receiveRadioChange(value) {
      if (value == "1") {
        this.receiveData = Object.assign({}, this.clientData);
        this.receiveData.id = "1";
        this.items[2].selectedIndex = 0;
      } else if (value == "2") {
        this.receiveData = Object.assign({}, this.companyData);
        this.receiveData.id = "2";
        this.items[2].selectedIndex = 1;
      } else {
        this.receiveData = this.items[2].items.find(x => x.id == value);
        this.items[2].selectedIndex = this.items[2].items.findIndex(
          x => x.id == value
        );
      }
      this.$store.state.shipment.defaultReceiveInfo = this.items[2].selectedIndex;
      this.items[2].active = false;
      this.hasReceive = true;
      document.getElementById("barcodeInput").focus();
      this.checkNexted();
    },
    checkNexted() {
      if (
        this.hasClass &&
        this.hasClient &&
        this.hasReceive &&
        this.total !== 0
      ) {
        this.nextDisabled = false;
      } else {
        this.nextDisabled = true;
      }
    },
    openDataDialog(type) {
      if (type === "client") {
        this.dialogTitle = "新增客戶資料";
        this.dialogData = [
          { title: "*客戶名稱", value: "", required: true, key: "name" },
          { title: "*客戶電話", value: "", required: true, key: "phone" },
          { title: "郵遞區號", value: "", required: false, key: "code" },
          { title: "聯絡地址", value: "", required: false, key: "address" }
        ];
      } else {
        this.dialogTitle = "新增收件資料";
        this.dialogData = [
          { title: "*收件人", value: "", required: true, key: "name" },
          { title: "*收件電話", value: "", required: true, key: "phone" },
          { title: "*郵遞區號", value: "", required: true, key: "code" },
          { title: "*收件地址", value: "", required: true, key: "address" }
        ];
      }
      this.dialogVisible = true;
    },
    setBarcode(text) {
      if (text != "") {
        if (this.productItemData.findIndex(x => x.barcode == text) != -1) {
          this.productData = Object.assign(
            {},
            this.productItemData.find(x => x.barcode == text)
          );
          this.quantityDialog = 1;
          this.remarkDialog = "";
          this.salesDialogVisible = true;
        }
      }
      // this.productData = Object.assign(
      //   {},
      //   this.productItemData.find(x => x.productId == id)
      // );
      // this.quantityDialog = 1;
      // this.remarkDialog = "";
      // this.salesDialogVisible = true;
    },
    addSales(barcode) {
      if (this.productItem.findIndex(item => item.barcode == barcode) == -1) {
        this.productData.quantity = this.quantityDialog;
        this.productData.description = this.remarkDialog;
        this.productItem.push(this.productData);
      } else {
        let data = this.productItem.find(item => item.barcode == barcode);
        if (data.unit == "件" || data.unit == "包") {
          if (data.quantity + this.quantityDialog > this.productData.amount) {
            data.quantity = this.productData.amount;
          } else {
            data.quantity += this.quantityDialog;
          }
        }else{
          this.productData.quantity = this.quantityDialog;
          this.productData.description = this.remarkDialog;
          this.productItem.push(this.productData);
        }
      }

      this.productItem.forEach(item => {
        item.money = this.formatPrice(
          (item.salesPrice === 0 ? item.listPrice : item.salesPrice) *
            item.quantity
        );
      });
      this.onCalculation();
      this.salesDialogVisible = false;
      this.productBarcode = "";
    },
    adder(index) {
      let item = this.productItem[index];
      let amount;
      if (
        this.productItemData.findIndex(x => x.barcode == item.barcode) != -1
      ) {
        amount = this.productItemData.find(x => x.barcode == item.barcode)
          .amount;
      } else {
        amount = item.amount;
      }
      if (item.quantity < amount) {
        item.quantity++;
        item.money = this.formatPrice(
          (item.salesPrice === 0 ? item.listPrice : item.salesPrice) *
            item.quantity
        );
        this.onCalculation();
      } else {
        this.snackbar = true;
        this.messageText = "數量不能超過現有庫存數!";
      }
    },
    minuser(index) {
      let item = this.productItem[index];
      if (item.quantity - 1 == 0) {
        this.onDelProductDialog(item);
      } else if (item.quantity > 1) {
        item.quantity--;
        item.money = this.formatPrice(
          (item.salesPrice === 0 ? item.listPrice : item.salesPrice) *
            item.quantity
        );
        this.onCalculation();
      }
    },
    onDelProductDialog(item) {
      this.delProductDialogItem = item;
      this.delProductDialogVisible = true;
    },
    deleteProduct(item) {
      if (this.$store.state.shipmentEdited) {
        this.$api.Distribute.deleteCommodityDiscount(item.productId);
      }
      this.productItem = this.productItem.filter(i => i !== item);
      this.delProductDialogVisible = false;
      this.onCalculation();
    },
    deleteDialogCancel(item) {
      this.delProductDialogVisible = false;
      let index;
      index = this.productItem.findIndex(x => x == item);
      this.$refs.swipeList.closeActions(index);
    },
    onChangeDesDialog(item, index) {
      this.changeProductDialogItem = item;
      this.changeProductDialogDes = item.description;
      this.changeProductDesIndex = index;
      this.changeProductDialogVisible = true;
    },
    changeProductDes() {
      this.productItem[
        this.changeProductDesIndex
      ].description = this.changeProductDialogDes;
      this.changeProductDialogVisible = false;
      this.$refs.swipeList.closeActions(this.changeProductDesIndex);
    },
    changeDesDialogCancel() {
      this.changeProductDialogVisible = false;
      this.$refs.swipeList.closeActions(this.changeProductDesIndex);
    },
    onCalculation() {
      let _this = this;
      this.discount = 0;
      this.total = 0;
      this.productItem.forEach(item => {
        let price = 0;
        let money;
        money = item.money.toString().replace(/[^0-9]+/g, "");
        money = parseInt(money);
        price =
          (item.salesPrice === 0 ? item.listPrice : item.salesPrice) *
          item.quantity;
        _this.discount = _this.discount + (price - money);

        _this.total = _this.total + money;
      });
      console.log(_this.total,'onCal  totallllll');
      this.$nextTick(()=>{
        this.total = _this.total
      })
      this.checkNexted();
    },
    submit() {
      if (this.receiveData.address.trim() == "") {
        this.errSnackbar = true;
        this.messageText = "地址為空，請至後台系統填寫!";
        return;
      }
      this.$store.state.shipment.classItem = this.classData;
      this.$store.state.shipment.clientItem = this.clientData;
      this.$store.state.shipment.receiveItem = this.receiveData;
      this.productItem.forEach(item => {
        let money;
        money = item.money.toString().replace(/[^0-9]+/g, "");
        item.money = parseInt(money);
      });
      this.$store.state.shipment.orderItemRequestList = this.productItem;
      this.$store.state.shipment.discount = this.discount;
      this.$store.state.shipment.total = this.total;
      console.log(this.productItem, "productItem");
      this.$router.push("/shipment");
    },
    addDialog() {
      if (this.dialogTitle == "新增客戶資料") {
        let data = {
          name: this.dialogData.find(x => x.key == "name").value.trim(),
          tel: this.dialogData.find(x => x.key == "phone").value.trim(),
          postCode: this.dialogData.find(x => x.key == "code").value.trim(),
          address: this.dialogData.find(x => x.key == "address").value.trim()
        };
        if (data.name == "" || data.tel == "") {
          this.errSnackbar = true;
          this.messageText = "請輸入必填項目!";
          return;
        }
        this.addClientData(data);
      } else if (this.dialogTitle == "新增收件資料") {
        let data = {
          id: "",
          receiver: this.dialogData.find(x => x.key == "name").value.trim(),
          tel: this.dialogData.find(x => x.key == "phone").value.trim(),
          postCode: this.dialogData.find(x => x.key == "code").value.trim(),
          address: this.dialogData.find(x => x.key == "address").value.trim()
        };
        if (data.receiver == "" || data.tel == "" || data.postCode == "" || data.address == "") {
          this.errSnackbar = true;
          this.messageText = "請輸入必填項目!";
          return;
        }
        let receiveList = [];
        this.items[2].items.map((item, index) => {
          if (index > 1) {
            let data = {
              id: item.id,
              receiver: item.name,
              tel: item.phone,
              postCode: item.code,
              address: item.address
            };
            receiveList.push(data);
          }
        });
        receiveList.push(data);
        this.updateClientData(receiveList);
      }
    },
    addClientData(data) {
      this.$api.Customer.add({
        ...data,
        classesId: this.classData.id,
        defaultReceiveInfo: 0
      })
        .then(async res => {
          let classId = res.data.classes.id;
          let clientId = res.data.id;
          this.dialogVisible = false;
          await this.$api.Customer.onlyCustomerList().then(res => {
            this.clientListRes = res.data;
          });
          this.classRadioChange(classId);
          this.clientRadioChange(clientId);
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateClientData(receiveList) {
      this.$api.Customer.update({
        classesId: this.classData.id,
        clientId: this.clientData.id,
        defaultReceiveInfo: this.items[2].items.length,
        recipientList: receiveList
      }).then(async () => {
        let classId = this.classData.id;
        let clientId = this.clientData.id;
        this.dialogVisible = false;
        await this.$api.Customer.onlyCustomerList().then(res => {
          this.clientListRes = res.data;
        });
        this.classRadioChange(classId);
        this.clientRadioChange(clientId);
        this.items[2].active = false;
      });
    },
    getUnit(unit) {
      let unitName = UNIT.find(item => item.value === unit);
      if (unitName) {
        return unitName.name;
      }
    },
    changeDialogInput() {
      console.log("dialog input change");
    },
    productCountInput(item) {
      let amount;
      if (
        this.productItemData.findIndex(x => x.barcode == item.barcode) != -1
      ) {
        amount = this.productItemData.find(x => x.barcode == item.barcode)
          .amount;
      } else {
        amount = item.amount;
      }
      if (item.quantity == "") {
        return;
      } else {
        if (parseInt(item.quantity) == 0) {
          item.quantity = 0;
          item.money =
            (item.salesPrice === 0 ? item.listPrice : item.salesPrice) *
            item.quantity;
          item.money = this.formatPrice(item.money);
          return item;
        } else if (parseInt(item.quantity) > amount) {
          this.snackbar = true;
          this.messageText = "數量不能超過現有庫存數!";
          item.quantity = amount;
          item.money =
            (item.salesPrice === 0 ? item.listPrice : item.salesPrice) *
            item.quantity;
          item.money = this.formatPrice(item.money);
          return item;
        }
        item.money =
          (item.salesPrice === 0 ? item.listPrice : item.salesPrice) *
          item.quantity;
        item.money = this.formatPrice(item.money);
        return item;
      }
    },
    productCountChange(item) {
      if (item.quantity == "0") {
        this.onDelProductDialog(item);
      }
      if (item.quantity == "" || item.quantity == undefined) {
        item.quantity = 1;
        item.money =
          (item.salesPrice === 0 ? item.listPrice : item.salesPrice) *
          item.quantity;
        this.onCalculation();
        return item;
      }
      item.quantity = parseInt(item.quantity);
      this.onCalculation();
      return item;
    },
    productMoneyInput(value) {
      console.log(value, "first value");
      if (value == "") {
        value = "0";
      }
      value = value.toString().replace(/[^0-9]+/g, "");
      console.log(value);
      return this.formatPrice(parseInt(value));

      // return parseInt(value)
    },
    productMoneyChange(item) {
      let price =
        (item.salesPrice === 0 ? item.listPrice : item.salesPrice) *
        item.quantity;
      item.money = item.money.toString().replace(/[^0-9]+/g, "");
      item.money = parseInt(item.money);
      // if(item.money == undefined || item.money == ""){
      //   item.money = 0
      // }
      if (item.money > price) {
        item.money = price;
      }
      console.log(item.money, "first money");
      this.onCalculation();
      item.money = this.formatPrice(item.money);
      return item;
    }
  },
  async mounted() {
    // const formData = new FormData()
    // formData.append("username",'admin')
    // formData.append("password", '123')
    // await this.$api.Login.userLogin(formData).then(async ()=>{
    await this.$api.Customer.getClass().then(res => {
      this.items[0].items = res.data.map(item => {
        return item;
      });
    });
    await this.$api.Customer.onlyCustomerList().then(res => {
      this.clientListRes = res.data;
    });
    // })
    if (this.$store.state.shipmentBacked) {
      this.classRadioChange(this.$store.state.shipment.classItem.id);
      this.clientRadioChange(this.$store.state.shipment.clientItem.id);
      this.receiveRadioChange(this.$store.state.shipment.receiveItem.id);
      // this.classData = this.$store.state.shipment.classItem
      // this.clientData = this.$store.state.shipment.clientItem
      // this.receiveData = this.$store.state.shipment.receiveItem
      this.productItem = this.$store.state.shipment.orderItemRequestList;
      this.productItem.forEach(item => {
        item.money = this.formatPrice(item.money);
      });
      this.hasClass = true;
      this.hasClient = true;
      this.hasReceive = true;
      this.onCalculation();
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .v-snack__content {
  text-align: center;
}
.container {
  background-color: #fff0e9;
  padding: 12px 5px 12px 5px;
}
.top-wrapper {
  background-color: #c2c2c2;
}
.content-wrapper {
  background-color: #c2c2c2;
}
.footer-wrapper {
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
    }
  }
  &.action-panel-left {
    > div {
      background-color: #71b603;
      color: white;
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
.productList-content {
  padding: 1rem;
}

ul,
li {
  margin: 0;
  padding: 0;
}
.counter {
  width: 100%;
  display: flex;
  position: relative;

  li {
    list-style-type: none;
    width: 150px;
    height: 50px;
    text-align: center;
    line-height: 30px;
    border: #999 thin solid;
    background-color: #fff;

    input {
      font-size: 20px;
      width: 100%;
      height: 100%;
      outline: none;
      -webkit-appearance: none;
      background: none;
      margin: 0;
      padding: 0;
      border: 1px solid transparent;
      border-radius: 0;
    }
  }

  .commodityNumber {
    top: -60%;
    position: absolute;
  }
}
</style>
