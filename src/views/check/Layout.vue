<template>
  <div class="PosSystem">
    <div class="title">條碼機系統</div>
    <router-view />
    <HeaderOption />


  </div>
</template>

<script>
  import HeaderOption from './components/Header/index'
  export default {
    components:{HeaderOption}
  }
</script>

<style lang="scss" scoped>
  .HeaderOption{
  }
</style>
