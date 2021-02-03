<template>
  <div>
    <v-toolbar fixed dark color="#0c519c">
      <v-spacer></v-spacer>
      <v-menu
        bottom
        offset-y
        offset-x
        nudge-left="160"
        nudge-bottom="10"
        max-width="300"
        min-width="300"
        :value="showMenu"
      >
        <template v-slot:activator="{ on, attrs, value }">
          <v-btn :ripple="false" icon v-bind="attrs" v-on="on" style="margin-left: 30px;">
            <span style="font-size: large; color: #fff0e9;">{{menuName}}</span>
            <v-icon large color="#f7b573" v-if="value">mdi-menu-up</v-icon>
            <v-icon large color="#f7b573" v-else>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-row style="background-color: #fff0e9;">
          <v-col cols="5" >
            <v-list style="background-color: #fff0e9;">
              <v-list-item
                ><v-btn color="primary" @click="toggleMenu('出貨')"
                  ><span style="font-size: large; color: #fff0e9;">出貨</span></v-btn
                ></v-list-item
              >
              <v-list-item
                ><v-btn color="primary" @click="toggleMenu('取消入庫')"
                  ><span style="font-size: large; color: #fff0e9;">取消入庫</span></v-btn
                ></v-list-item
              >
              <v-list-item
                ><v-btn color="primary" @click="toggleMenu('重新入庫')"
                  ><span style="font-size: large; color: #fff0e9;">重新入庫</span></v-btn
                ></v-list-item
              >
            </v-list>
          </v-col>
          <v-col cols="7">
            <v-list style="background-color: #fff0e9;">
              <v-list-item class="pl-0"
                ><v-btn color="primary" @click="toggleMenu('出貨清單')"
                  ><span style="font-size: large; color: #fff0e9;">出貨清單</span></v-btn
                ></v-list-item
              >
              <v-list-item class="pl-0"
                ><v-btn color="primary" @click="toggleMenu('取消入庫清單')"
                  ><span style="font-size: large; color: #fff0e9;">取消入庫清單</span></v-btn
                ></v-list-item
              >
              <v-list-item class="pl-0"
                ><v-btn color="primary" @click="toggleMenu('重新入庫清單')"
                  ><span style="font-size: large; color: #fff0e9;">重新入庫清單</span></v-btn
                ></v-list-item
              >
            </v-list>
          </v-col>
        </v-row>
      </v-menu>
      <v-spacer></v-spacer>
      <span style="font-size: large; color: #fff0e9;">名字</span>
      <v-btn icon>
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
      showMenu: false,
      menuName: ''
    };
  },
  methods: {
    toggleMenu(name) {
      this.menuName = name
      this.showMenu = false

      switch (name) {
        case '出貨':
        this.$router.push('/Sales')
        break;
        case '重新入庫':
        this.$router.push('Restore')
        break;
      }


    },
    openMenu(attrs){
      console.log(attrs);
      this.showMenu = !this.showMenu
    },
    doNothing() {}
  },
  mounted() {
    this.menuName = '出貨'
  }
};
</script>
<style lang="scss" scoped>
.header-wrapper {
}
  .v-menu__content{
    overflow: hidden;
  }

</style>
