<template>
  <div class="app-class">
    <HeaderOption />
    <v-main>
      <router-link to="/Sales"></router-link>
      <router-link to="/Restore"></router-link>
      <router-view />
    </v-main>
  </div>
</template>

<script>
  import HeaderOption from './components/Header/index'
  export default {
    components:{ HeaderOption}
  }
</script>

<style lang="scss" scoped>
  .app-class{
    background-color: #fff0e9;
    height: 100%;
  }
</style>
