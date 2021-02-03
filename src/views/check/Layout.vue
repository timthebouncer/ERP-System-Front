<template>
  <div class="app-class">
    <HeaderOption />
    <v-main>
      <Sales/>
    </v-main>

  </div>
</template>

<script>
  import HeaderOption from './components/Header/index'
  import Sales from './Sales'
  export default {
    components:{HeaderOption,Sales}
  }
</script>

<style lang="scss" scoped>
  .app-class{
    background-color: #fff0e9;
    height: 100%;
  }
</style>
