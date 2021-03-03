<template>
  <div class="app-class">
    <HeaderOption />
    <v-main>
      <span class="font-weight-light">工作日期:{{ today }}</span>
      <router-link to="/"></router-link>
      <span v-if="!$store.state.salesDetailed" class="font-weight-light">工作日期:{{ today }}</span>
      <router-link to="/Sales"></router-link>
      <router-link to="/Restore"></router-link>
      <router-view />
    </v-main>

  </div>
</template>

<script>
import HeaderOption from './components/Header/index'
import moment from "moment";
export default {
  components:{HeaderOption},
  data(){
    return{
      today: "",
    }
  },
  mounted() {
    this.today = moment(new Date()).format("YYYY-MM-DD");
    this.$store.state.workDate = this.today
  }
}
</script>

<style lang="scss" scoped>
.app-class {
  background-color: #fff0e9;
  height: 100%;
  overflow-x: hidden;
}
</style>
