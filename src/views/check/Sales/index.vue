<template>
  <v-container class="container">
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
              ><span class="text-h6">123456</span></v-col
            ></v-row
          >
          <v-row class="align-content-center"
            ><v-col class="col-4"
              ><span class="text-h6 font-weight-black">商品名稱</span></v-col
            ><v-col class="col-8"
              ><span class="text-h6">雞腿</span></v-col
            ></v-row
          >
          <v-row class="align-content-center"
            ><v-col class="col-4"
              ><span class="text-h6 font-weight-black">計價單位</span></v-col
            ><v-col class="col-8"><span class="text-h6">包</span></v-col></v-row
          >
          <v-row class="align-content-center"
            ><v-col class="col-4"
              ><span class="text-h6 font-weight-black">數量</span></v-col
            ><v-col class="col-8"
              ><ul class="counter">
                <li>
                  <input type="button" value="-" />
                </li>
                <li style="width: 100%; height: 50px;">
                  <input
                    class="numberCount"
                    type="number"
                    value="1"
                    style="text-align: center"
                  />
                </li>
                <li>
                  <input type="button" value="+" />
                </li></ul></v-col
          ></v-row>
          <v-row class="align-content-center"
            ><v-col class="col-4"
              ><span class="text-h6 font-weight-black">備註</span></v-col
            ><v-col class="col-8"><v-textarea solo rows="3"></v-textarea></v-col
          ></v-row>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="" text outlined @click="salesDialogVisible = false">
            取消
          </v-btn>
          <v-btn color="primary" @click="addSales">
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
            @click="delProductDialogVisible = false"
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
          ><span class="text-h6">{{changeProductDialogItem.barcode}}</span></v-col
          ></v-row
          >
          <v-row class="align-content-center"
          ><v-col class="col-4"
          ><span class="text-h6 font-weight-black">商品名稱</span></v-col
          ><v-col class="col-8"
          ><span class="text-h6">{{changeProductDialogItem.name}}</span></v-col
          ></v-row
          >
          <v-row class="align-content-center"
          ><v-col class="col-4"
          ><span class="text-h6 font-weight-black">備註</span></v-col
          ><v-col class="col-8"><v-textarea solo rows="3" v-model="changeProductDialogDes"></v-textarea></v-col
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
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-col class="col-4">
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-col>
            <v-col v-if="item.key == 'class'"
              ><v-list-item-title
                style="word-break: break-all;text-align: center;"
                >{{ className }}</v-list-item-title
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
            <v-col v-else-if="item.key == 'receive'"
              ><v-list-item-title
                style="word-break: break-all;text-align: center;"
                ><v-row class="justify-space-between ma-0"
                  ><span class="">{{ receiveData.name }}</span
                  ><span class="">{{ receiveData.phone }}</span
                  ><span></span
                ></v-row>
                <v-row class="justify-space-between ma-0"
                  ><span class="">{{ receiveData.code }}</span
                  ><span class="">{{ receiveData.address }}</span
                  ><span></span
                ></v-row> </v-list-item-title
            ></v-col>
          </v-list-item-content>
        </template>

        <!--        客戶類別 List-->
        <template v-if="item.key == 'class'">
          <v-radio-group @change="classRadioChange" class="mt-0">
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
          <v-radio-group @change="clientRadioChange">
            <v-list-item v-for="child in item.items" :key="child.id">
              <v-list-item-action class="mr-4">
                <v-radio :value="child.id" :key="child.id"></v-radio>
              </v-list-item-action>
              <v-list-item-content>
                <v-row class="justify-space-between ma-0"
                  ><span class="">{{ child.name }}</span
                  ><span class="">{{ child.phone }}</span
                  ><span></span
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
          <v-radio-group @change="receiveRadioChange">
            <v-list-item v-for="child in item.items" :key="child.id">
              <v-list-item-action class="mr-4">
                <v-radio :value="child.id" :key="child.id"></v-radio>
              </v-list-item-action>
              <v-list-item-content>
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
            item-value="id"
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
    <swipe-list ref="swipeList" class="productList" :items="productItem" transition-key="id">
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

      <template v-slot:left="{ item , index }">
        <div class="swipeout-action action-panel-left" @click="onChangeDesDialog(item,index)">
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
      <v-btn color="primary" style="width: 100%;" :disabled="nextDisabled">
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
      snackbar: false,
      messageText: "",
      items: [
        {
          key: "class",
          title: "客戶類別:",
          active: true,
          items: [
            { id: 1, className: "客戶類別1" },
            { id: 2, className: "客戶類別2" },
            { id: 3, className: "客戶類別3" }
          ]
        },
        {
          key: "client",
          title: "客戶資料:",
          items: [
            {
              id: 1,
              name: "示範客戶A",
              phone: "0912265485",
              code: "123",
              address: "AAAA"
            },
            {
              id: 2,
              name: "示範客戶B",
              phone: "0912265486",
              code: "321",
              address: "BBBB"
            },
            {
              id: 3,
              name: "示範客戶C",
              phone: "0912265487",
              code: "444",
              address: "CCCC"
            }
          ]
        },
        {
          key: "receive",
          title: "收件資料:",
          items: [
            {
              id: 1,
              name: "同客戶資料(預設地址)",
              phone: "",
              code: "",
              address: ""
            },
            { id: 2, name: "同公司資料", phone: "", code: "", address: "" },
            {
              id: 3,
              name: "收件客戶A",
              phone: "0912265485",
              code: "123",
              address: "示範收件地址A"
            },
            {
              id: 4,
              name: "收件客戶B",
              phone: "0912265486",
              code: "321",
              address: "示範收件地址B"
            },
            {
              id: 5,
              name: "收件客戶C",
              phone: "0912265487",
              code: "444",
              address: "示範收件地址C"
            },
            {
              id: 6,
              name: "收件客戶D",
              phone: "0912265487",
              code: "444",
              address: "示範收件地址D"
            }
          ]
        }
      ],
      productItemData: [
        {
          id: 1,
          barcode: "123456",
          name: "商品1",
          unit: "KG",
          amount: "10",
          salesPrice: 150,
          listPrice: 150,
          description: "123",
          quantity: 1,
          money: 0
        },
        {
          id: 2,
          barcode: "1234567",
          name: "商品2",
          unit: "PACK",
          amount: "20",
          salesPrice: 0,
          listPrice: 100,
          description: "456",
          quantity: 1,
          money: 0
        },
        {
          id: 3,
          barcode: "1234568",
          name: "商品3",
          unit: "G",
          amount: "5",
          salesPrice: 50,
          listPrice: 50,
          description: "",
          quantity: 1,
          money: 0
        }
      ],
      productItem: [],
      productId: "",
      dialogVisible: false,
      salesDialogVisible: false,
      delProductDialogVisible: false,
      changeProductDialogVisible: false,
      delProductDialogItem: {},
      changeProductDialogItem: {},
      changeProductDialogDes: "",
      changeProductDesIndex: 0,
      dialogTitle: "",
      dialogData: [{ title: "", value: "" }],
      className: "",
      clientData: {
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
  methods: {
    classRadioChange(value) {
      this.className = this.items[0].items.find(x => x.id == value).className;
      this.items[0].active = false;
      this.hasClass = true;
      this.checkNexted();
    },
    clientRadioChange(value) {
      this.clientData = this.items[1].items.find(x => x.id == value);
      this.items[1].active = false;
      this.hasClient = true;
      this.checkNexted();
    },
    receiveRadioChange(value) {
      this.receiveData = this.items[2].items.find(x => x.id == value);
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
    setBarcode() {
      this.salesDialogVisible = true;
    },
    addSales() {
      this.productItem = this.productItemData;
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
      this.productItem = this.productItem.filter(i => i !== item);
      this.delProductDialogVisible = false;
      this.onCalculation();
    },
    onChangeDesDialog(item,index) {
      this.changeProductDialogItem = item
      this.changeProductDialogDes = item.description
      this.changeProductDesIndex = index
      this.changeProductDialogVisible = true
    },
    changeProductDes() {
      this.productItem[this.changeProductDesIndex].description = this.changeProductDialogDes
      this.changeProductDialogVisible = false
      this.$refs.swipeList.closeActions(this.changeProductDesIndex)
    },
    changeDesDialogCancel(){
      this.changeProductDialogVisible = false
      this.$refs.swipeList.closeActions(this.changeProductDesIndex)
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
    }
  },
  mounted() {}
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
