<template>
  <div>
    <v-toolbar fixed dark color="#0c519c">
      <v-spacer></v-spacer>
      <v-menu
        bottom
        offset-y
        offset-x
        absolute
        :position-x="menuPositionX"
        :position-y="menuPositionY"
        max-width="300"
        min-width="300"
        :value="showMenu"
      >
        <template v-slot:activator="{ on, attrs, value }">
          <v-btn
            :ripple="false"
            text
            v-bind="attrs"
            v-on="on"
            style="margin-left: 30px;"
          >
            <span style="font-size: large; color: #fff0e9;">{{
              menuName
            }}</span>
            <v-icon large color="#f7b573" v-if="value">mdi-menu-up</v-icon>
            <v-icon large color="#f7b573" v-else>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-row style="background-color: #fff0e9;">
          <v-col cols="5">
            <v-list style="background-color: #fff0e9;">
              <v-list-item
                ><v-btn
                  color="primary"
                  @click="toggleMenu('出貨')"
                  :disabled="btnDisable.salesBtn"
                  ><span style="font-size: large; color: #fff0e9;"
                    >出貨</span
                  ></v-btn
                ></v-list-item
              >
              <v-list-item
                ><v-btn
                  color="primary"
                  @click="toggleMenu('取消入庫')"
                  :disabled="btnDisable.cancelRestoreBtn"
                  ><span style="font-size: large; color: #fff0e9;"
                    >取消入庫</span
                  ></v-btn
                ></v-list-item
              >
              <v-list-item
                ><v-btn
                  color="primary"
                  @click="toggleMenu('重新入庫')"
                  :disabled="btnDisable.restoreBtn"
                  ><span style="font-size: large; color: #fff0e9;"
                    >重新入庫</span
                  ></v-btn
                ></v-list-item
              >
            </v-list>
          </v-col>
          <v-col cols="7">
            <v-list style="background-color: #fff0e9;">
              <v-list-item class="pl-0"
                ><v-btn
                  color="primary"
                  @click="toggleMenu('出貨清單')"
                  :disabled="btnDisable.salesLogBtn"
                  ><span style="font-size: large; color: #fff0e9;"
                    >出貨清單</span
                  ></v-btn
                ></v-list-item
              >
              <v-list-item class="pl-0"
                ><v-btn
                  color="primary"
                  @click="toggleMenu('取消入庫清單')"
                  :disabled="btnDisable.cancelRestoreLogBtn"
                  ><span style="font-size: large; color: #fff0e9;"
                    >取消入庫清單</span
                  ></v-btn
                ></v-list-item
              >
              <v-list-item class="pl-0"
                ><v-btn
                  color="primary"
                  @click="toggleMenu('重新入庫清單')"
                  :disabled="btnDisable.restoreLogBtn"
                  ><span style="font-size: large; color: #fff0e9;"
                    >重新入庫清單</span
                  ></v-btn
                ></v-list-item
              >
            </v-list>
          </v-col>
        </v-row>
      </v-menu>
      <v-spacer></v-spacer>
      <span style="font-size: large; color: #fff0e9;">名字</span>
      <v-btn icon @click="userLogout">
        <v-icon color="#f7b573">mdi-export</v-icon>
      </v-btn>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: "HeaderOption",
  data() {
    return {
      menuPositionX: 100,
      menuPositionY: 50,
      showMenu: false,
      menuName: "",
      btnDisable: {
        salesBtn: false,
        salesLogBtn: false,
        restoreBtn: false,
        restoreLogBtn: false,
        cancelRestoreBtn: false,
        cancelRestoreLogBtn: false
      }
    };
  },
  watch: {
    $route() {
      this.changeMenuName();
    }
  },
  methods: {
    toggleMenu(name) {
      this.resetShipmentData()
      this.showMenu = false;
      this.$store.state.shipmentEdited = false;
      switch (name) {
        case "出貨":
          this.$router.push("/sales");
          break;
        case "出貨清單":
          this.$router.push("/salesLog");
          break;
        case "重新入庫":
          this.$router.push("/restore");
          break;
        case "重新入庫清單":
          this.$router.push("/restoreLog");
          break;
        case "取消入庫":
          this.$router.push("/cancelRestore");
          break;
        case "取消入庫清單":
          this.$router.push("/cancelRestoreLog");
          break;
      }
    },
    changeMenuName() {
      let data = {
        salesBtn: false,
        salesLogBtn: false,
        restoreBtn: false,
        restoreLogBtn: false,
        cancelRestoreBtn: false,
        cancelRestoreLogBtn: false
      };
      this.btnDisable = data;
      let routeName = this.$route.name;
      switch (routeName) {
        case "sales":
          this.btnDisable.salesBtn = true;
          this.menuName = "出貨";
          break;
        case "salesLog":
          this.btnDisable.salesLogBtn = true;
          this.menuName = "出貨清單";
          break;
        case "restore":
          this.btnDisable.restoreBtn = true;
          this.menuName = "重新入庫";
          break;
        case "restoreLog":
          this.btnDisable.restoreLogBtn = true;
          this.menuName = "重新入庫清單";
          break;
        case "cancelRestore":
          this.btnDisable.cancelRestoreBtn = true;
          this.menuName = "取消入庫";
          break;
        case "cancelRestoreLog":
          this.btnDisable.cancelRestoreLogBtn = true;
          this.menuName = "取消入庫清單";
          break;
      }
    },
    resetShipmentData() {
      this.$store.state.shipment = {
        shipmentDate: "",
        orderNo: "",
        classItem: { id: "", className: "" },
        clientItem: { id: "", name: "", phone: "", code: "", address: "" },
        receiveItem: { id: "", name: "", phone: "", code: "", address: "" },
        discount: 0,
        total: 0,
        payment: 1,
        shipment: 1,
        temperatureCategory: 1,
        volume: 1,
        shippingFee: 0,
        trackingNo: "",
        remark: "",
        orderItemRequestList: []
      };

      this.$store.state.shipmentBacked = false;
      this.$store.state.salesDetailed = false;
    },
    userLogout(){
      this.$api.Login.logOut()
      .then(()=>{
        sessionStorage.removeItem('token')
        this.$router.push('/')
        this.menuName = ''
      })
    }
  },
  mounted() {
    this.changeMenuName();
    this.menuPositionX = window.innerWidth / 2 - 150;
  }
};
</script>
<style lang="scss" scoped>
.header-wrapper {
}
.v-menu__content {
  overflow: hidden;
}
</style>
