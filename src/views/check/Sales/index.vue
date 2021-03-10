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
    <!--    新增客戶資料 新增收件資料 彈窗-->
    <v-dialog v-model="dialogVisible" hide-overlay fullscreen>
      <v-card style="background-color: #fff0e9;">
        <v-card-title class="justify-center">
          <span class="text-h4">{{ dialogTitle }}</span>
        </v-card-title>
        <v-card-text>
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
          <v-btn color="primary" @click="dialogVisible = false">
            儲存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    新增商品 彈窗-->
    <v-dialog v-model="salesDialogVisible">
      <v-card style="background-color: #fff0e9;">
        <v-card-text>
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
            ><v-col class="col-8"
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
          ></v-row>
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
          <v-btn color="primary" @click="addSales(productData.id)">
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
        <v-card-text>
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
            <v-col class="col-4">
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-col>
            <v-col v-if="hasReceive">
              <v-list-item-title v-if="receiveData.id == 1" class="text-center"
                >同客戶資料<span v-if="item.defaultReceiveInfo == 0"
                  >(預設地址)</span
                ></v-list-item-title
              >
              <v-list-item-title
                v-else-if="receiveData.id == 2"
                class="text-center"
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
                <v-col class="col-1">{{ receiveData.code }}</v-col
                ><v-col class="col-10">{{ receiveData.address }}</v-col>
              </v-list-item>
            </div>
          </v-list-item-content>
          <v-list-item-content v-else>
            <v-col class="col-4">
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-col>
            <v-col v-if="item.key == 'class'"
              ><v-list-item-title
                style="word-break: break-all;text-align: center;"
                >{{ classData.className }}</v-list-item-title
              ></v-col
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
              <v-list-item-action class="mr-4">
                <v-radio :value="child.id" :key="child.id"></v-radio>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="child.className"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-radio-group>
        </template>
        <!--        客戶資料 List-->
        <template v-else-if="item.key == 'client'">
          <v-radio-group @change="clientRadioChange" :value="clientData.id">
            <v-list-item v-for="child in item.items" :key="child.id">
              <v-list-item-action class="mr-0">
                <v-radio :value="child.id" :key="child.id"></v-radio>
              </v-list-item-action>
              <v-list-item-content>
                <v-row class="justify-space-between ma-0 text-center"
                  ><span class="col-4">{{ child.name }}</span
                  ><span class="col-6">{{ child.phone }}</span
                  ><span class=""></span
                ></v-row>
              </v-list-item-content>
            </v-list-item>
          </v-radio-group>
          <v-list-item class="pa-0 justify-center">
            <v-btn
              text
              class="font-weight-bold text-h5"
              @click="addClientData('client')"
              ><v-icon>mdi-plus-circle-outline</v-icon>新增客戶資料</v-btn
            >
          </v-list-item>
        </template>
        <!--        收件資料 List-->
        <template v-else-if="item.key == 'receive'">
          <v-radio-group @change="receiveRadioChange" :value="receiveData.id">
            <v-list-item v-for="child in item.items" :key="child.id">
              <v-list-item-action class="mr-4">
                <v-radio :value="child.id" :key="child.id"></v-radio>
              </v-list-item-action>
              <v-list-item-content>
                <div>
                  <v-row class="justify-space-between ma-0"
                    ><span class="">{{ child.name }}</span
                    ><span class="">{{ child.phone }}</span
                    ><span></span
                  ></v-row>
                  <v-row class="justify-space-between ma-0"
                    ><span class="col-1">{{ child.code }}</span
                    ><span class="col-10">{{ child.address }}</span
                    ><span></span
                  ></v-row>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-radio-group>
          <v-list-item class="pa-0 justify-center">
            <v-btn
              text
              class="font-weight-bold text-h5"
              @click="addClientData('receive')"
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
        ><v-col
          ><v-autocomplete
            v-model="productId"
            :items="productItemData"
            item-text="barcode"
            item-value="productId"
            dense
            @change="setBarcode"
            filled
          ></v-autocomplete></v-col
      ></v-row>
    </div>
    <div class="footer-wrapper rounded">
      商品資料
    </div>
    <!--    商品資料 List-->
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
          <v-col class="col-6 align-self-center pl-0">
            <div class="mr-1">
              <ul class="counter">
                <p class="mb-1 commodityNumber">數量</p>
                <li>
                  <input type="button" @click="minuser(index)" value="-" />
                </li>
                <li style="width: 100%; height: 50px;">
                  <input
                    class="numberCount"
                    type="number"
                    v-model="item.quantity"
                    style="text-align: center"
                  />
                </li>
                <li>
                  <input type="button" @click="adder(index)" value="+" />
                </li>
              </ul>
            </div>
            <div class="text-center pt-3">
              <p>
                $<input
                  type="number"
                  v-model="item.money"
                  @change="onCalculation"
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
  </v-container>
</template>
<script>
import { SwipeList } from "vue-swipe-actions";
import "vue-swipe-actions/dist/vue-swipe-actions.css";
export default {
  name: "Sales",
  components: {
    SwipeList
  },
  data() {
    return {
      fab: false,
      snackbar: false,
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
      productId: "",
      productData: {
        id: "",
        productId: "",
        barcode: "",
        name: "",
        unit: "",
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
      total: 0
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
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
    classRadioChange(value) {
      this.clientData = {};
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
      console.log(this.clientListRes, "clientRadioChange clientList");
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
      }).then(res => {
        this.productItemData = [];
        res.data.map((item, index) => {
          let data = {
            id: index,
            productId: item.productId,
            barcode: item.barcode,
            name: item.productName,
            unit: item.unit,
            amount: item.amount,
            salesPrice: item.clientPrice,
            listPrice: item.clientPrice,
            description: "",
            quantity: 1,
            money: 0
          };
          this.productItemData.push(data);
        });
        console.log(this.productItemData);
      });

      this.checkNexted();
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
    addClientData(type) {
      if (type === "client") {
        this.dialogTitle = "新增客戶資料";
        this.dialogData = [
          { title: "*客戶名稱", value: "", required: true },
          { title: "*客戶電話", value: "", required: true },
          { title: "郵遞區號", value: "", required: false },
          { title: "聯絡地址", value: "", required: false }
        ];
      } else {
        this.dialogTitle = "新增收件資料";
        this.dialogData = [
          { title: "收件人", value: "", required: false },
          { title: "收件電話", value: "", required: false },
          { title: "郵遞區號", value: "", required: false },
          { title: "收件地址", value: "", required: false }
        ];
      }

      this.dialogVisible = true;
    },
    setBarcode(id) {
      this.productData = Object.assign(
        {},
        this.productItemData.find(x => x.productId == id)
      );
      this.quantityDialog = 1;
      this.remarkDialog = "";
      this.salesDialogVisible = true;
    },
    addSales(id) {
      if (this.productItem.findIndex(item => item.productId == id) == -1) {
        this.productData.quantity = this.quantityDialog;
        this.productData.description = this.remarkDialog;
        this.productItem.push(this.productData);
      } else {
        let data = this.productItem.find(item => item.productId == id);
        if (data.quantity + this.quantityDialog > data.amount) {
          data.quantity = data.amount;
        } else {
          data.quantity += this.quantityDialog;
        }
      }

      this.productItem.forEach(item => {
        item.money =
          (item.salesPrice === 0 ? item.listPrice : item.salesPrice) *
          item.quantity;
      });
      this.onCalculation();
      this.salesDialogVisible = false;
    },
    adder(index) {
      let item = this.productItem[index];
      if (item.quantity < item.amount) {
        item.quantity++;
        item.money =
          (item.salesPrice === 0 ? item.listPrice : item.salesPrice) *
          item.quantity;
        this.onCalculation();
      } else {
        this.snackbar = true;
        this.messageText = "數量不能超過現有庫存數!";
      }
    },
    minuser(index) {
      let item = this.productItem[index];
      if (item.quantity > 1) {
        item.quantity--;
        item.money =
          (item.salesPrice === 0 ? item.listPrice : item.salesPrice) *
          item.quantity;
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
        price =
          (item.salesPrice === 0 ? item.listPrice : item.salesPrice) *
          item.quantity;
        _this.discount = _this.discount + (price - item.money);

        _this.total = _this.total + parseInt(item.money, 10);
      });
      this.checkNexted();
    },
    submit() {
      this.$store.state.shipment.classItem = this.classData;
      this.$store.state.shipment.clientItem = this.clientData;
      this.$store.state.shipment.receiveItem = this.receiveData;
      this.$store.state.shipment.orderItemRequestList = this.productItem;
      this.$store.state.shipment.discount = this.discount;
      this.$store.state.shipment.total = this.total;
      console.log(this.productItem, "productItem");
      this.$router.push("/shipment");
    },
    changeDialogInput() {
      console.log("dialog input change");
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
      this.$api.Customer.onlyCustomerList().then(res => {
        this.clientListRes = res.data;
      });
    }).catch(()=>{})

    // })
    if (this.$store.state.shipmentBacked) {
      this.classRadioChange(this.$store.state.shipment.classItem.id);
      this.clientRadioChange(this.$store.state.shipment.clientItem.id);
      this.receiveRadioChange(this.$store.state.shipment.receiveItem.id);
      // this.classData = this.$store.state.shipment.classItem
      // this.clientData = this.$store.state.shipment.clientItem
      // this.receiveData = this.$store.state.shipment.receiveItem
      this.productItem = this.$store.state.shipment.orderItemRequestList;

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
