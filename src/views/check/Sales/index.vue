<template>
  <v-container class="container">
    <v-dialog v-model="dialogVisible" hide-overlay fullscreen >
      <v-card style="background-color: #fff0e9;">
        <v-card-title class="justify-center">
          <span class="text-h4">{{ dialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-row class="align-content-center" v-for="item in dialogData" v-bind:key="item.title"
            ><v-col class="col-4"
              ><span class="text-h6 font-weight-black">{{ item.title }}</span></v-col
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
    <span class="font-weight-light">工作日期:{{ today }}</span>
    <div class="top-wrapper rounded">
      客戶資訊
    </div>
    <v-list class="rounded-xl elevation-10">
      <v-list-group
        v-for="item in items"
        :key="item.title"
        v-model="item.active"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>

        <template v-if="item.key == 'class'">
          <v-radio-group>
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
        <template v-else-if="item.key == 'client'">
          <v-radio-group>
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
            <v-btn text class="font-weight-bold text-h5" @click="addClientData('client')"
              ><v-icon>mdi-plus-circle-outline</v-icon>新增客戶資料</v-btn
            >
          </v-list-item>
        </template>
        <template v-else-if="item.key == 'receive'">
          <v-radio-group>
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
            <v-btn text class="font-weight-bold text-h5" @click="addClientData('receive')"
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
        ><v-col><v-text-field solo></v-text-field></v-col
      ></v-row>
    </div>
    <div class="footer-wrapper rounded">
      商品資料
    </div>
  </v-container>
</template>
<script>
import moment from "moment";
export default {
  name: "Sales",
  data() {
    return {
      today: "",
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
          title: "收件資料",
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
      dialogVisible: false,
      dialogTitle: "",
      dialogData: [{ title: "", value: "" }]
    };
  },
  methods: {
    addClientData(type) {
      if(type === 'client'){
        this.dialogTitle = "新增客戶資料"
        this.dialogData = [
          { title: "*客戶名稱", value: "", required: true },
          { title: "*客戶電話", value: "", required: true },
          { title: "郵遞區號", value: "", required: false },
          { title: "聯絡地址", value: "", required: false }
        ]
      }
      else{
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
    moment
  },
  mounted() {
    this.today = moment(new Date()).format("YYYY-MM-DD");
  }
};
</script>
<style lang="scss" scoped>
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
</style>
