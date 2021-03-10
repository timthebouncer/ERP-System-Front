<template>
  <div class="layout">
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.state.workDate = this.today;
    if (this.$route.path == "/") {
      this.$router.push("/scale");
    }
  }
};
</script>

<style lang="scss" scoped></style>
