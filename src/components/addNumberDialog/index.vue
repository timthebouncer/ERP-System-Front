<template>
  <div style="position: relative">
    <v-row justify="center">
      <v-dialog v-model="show" persistent max-width="400">
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title>新增入料</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="mt-8">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="addOrderNumber"
                label="入料單號"
                disabled
              />
              <!--                        <v-select v-model="material" :items="materialList" return-object item-text="name" item-value="id" label="*物料名稱"/>-->
<!--              使用套件製作彈出選項  -->
              <div class="materialName">
                <div :style="selectData? 'fontSize:12px':'fontSize:16px'">*物料名稱</div>
                <div class="btn-wrapper">
                  <div style="font-size: 20px;color: rgba(0,0,0,.87);">{{selectData}}</div>
                  <v-btn plain>
                    <div id="trigger5"><i class="v-icon notranslate mdi mdi-menu-down theme--light"></i></div>
                  </v-btn>
                </div>
              </div>
              <v-text-field
                v-model="orderForm.count"
                label="*物料數量"
                type="number"
              />
              <v-text-field v-model="kg" label="屠體重量(公斤)" disabled />
              <v-text-field
                v-model="orderForm.livingWeight"
                label="毛雞重量(公斤)"
                type="number"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="loading" text @click="cancel">取消</v-btn>
            <v-btn :loading="loading" text @click="submit">確定</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--新增成功提示-->
      <v-snackbar
        v-model="snackbar"
        :top="'top'"
        :color="deleteText ? 'error' : 'success'"
        :timeout="2500"
      >
        <h3>{{ deleteText ? deleteText : "新增成功" }}</h3>
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar = false">
            <h3>關閉</h3>
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
  </div>
</template>

<script>
import MobileSelect from "mobile-select";
export default {
  name: "index",
  props: {
    show: Boolean,
    kg: Number,
    materialList: Array,
    addOrderNumber: String
  },
  data() {
    return {
      snackbar: false,
      loading: false,
      valid: true,
      mobileSelect5: null,
      deleteText: "",
      offsetTop: 0,
      count: "",
      livingWeight: "",
      material: { id: "", name: "" },
      materialSave: { id: "", name: "" },
      orderForm: {
        materialId: "",
        count: "",
        carcassWeight: "",
        livingWeight: "",
        username: ""
      },
      selectData: ''
    };
  },
  mounted() {},
  watch: {
    //判斷彈窗是否開啟
    show() {
      if (this.show) {
        this.materialList.unshift({id: 0, name: '請選擇'})
        if(this.mobileSelect5 === null){
          this.$nextTick(() => {
            this.mobileSelect5 = new MobileSelect({
              trigger: "#trigger5",
              title: "",
              wheels: [
                {
                  data: this.materialList
                }
              ],
              keyMap: {
                id: "id",
                value: "name"
              },
              position:[0],
              triggerDisplayData:false,
              transitionEnd: ((indexArr, data) => {
                  this.material.id = data[0].id;
                  this.material.name = data[0].name;
                  this.selectData = data[0].name;
                  // this.materialSave.id = data[0].id;
                  // this.materialSave.name = data[0].name;
                let arr = [
                  ...document.getElementsByClassName("selectContainer")[0]
                          .childNodes
                ];
                arr.map(item => {
                  if (item.innerText === this.material.name) {
                    return (item.style.backgroundColor = "#81D3F8");
                  } else {
                    return (item.style.backgroundColor = "");
                  }
                });
              }),
              ensureBtnText: "確認",
              bgColor: "#F2F2F2"
            });
          });
        }else {
          this.selectData = ''
          this.mobileSelect5.updateWheel(0,this.materialList)
          this.mobileSelect5.locatePosition(0,0)
        }
      }
    }
  },
  methods: {
    async submit() {
      if (this.material.id === "") {
        return (this.snackbar = true), (this.deleteText = "請選擇物料名稱");
      }
      if (this.orderForm.count === "") {
        return (this.snackbar = true), (this.deleteText = "請填寫物料數量");
      }
      this.orderForm.materialId = this.material.id;
      this.orderForm.carcassWeight = this.kg;
      this.orderForm.username = sessionStorage.getItem("userName");
      await this.$scale.DepotOrder.addOrder(this.orderForm).then(res => {
        this.loading = true;
        if (res.status === 200) {
          this.$emit(
            "getAddOrderForm",
            this.orderForm,
            this.addOrderNumber,
            this.material.name,
            res.data
          );
          this.$emit("close");
          sessionStorage.setItem(
            "addOrderForm",
            JSON.stringify(this.orderForm)
          );
          sessionStorage.setItem("orderNumber", this.addOrderNumber);
          sessionStorage.setItem("orderName", this.material.name);
          this.orderForm = {
            materialId: "",
            count: "",
            carcassWeight: "",
            livingWeight: ""
          };
          this.material = { id: "", name: "" };
          this.loading = false;
          //紀錄後一次操作的日期
          let today = new Date();
          let time =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1 < 10 ? "0" : "") +
            (today.getMonth() + 1) +
            "-" +
            (today.getDate() < 10 ? "0" : "") +
            today.getDate();
          sessionStorage.setItem("time", time);
        }
      });
    },
    cancel() {
      this.orderForm = {
        materialId: "",
        count: "",
        carcassWeight: "",
        livingWeight: ""
      };
      this.material = { id: "", name: "" };
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.v-text-field >>> input {
  font-size: 20px;
}
.materialName{
  border-bottom: 1px solid;
}
.btn-wrapper{
  display: flex;
  justify-content:space-between;
  line-height: 2;
  margin-right: -20px;
}
#trigger5 {
  font-size: 20px;
}
</style>
