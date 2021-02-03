<template>
  <v-container class="container">
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

        <v-list-item v-for="child in item.items" :key="child.title">
          <v-list-item-action>
            <v-checkbox :input-value="child.active"></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="child.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
    <div class="content-wrapper">
      輸入商品
    </div>
    <div class="footer-wrapper">
      商品資料
    </div>
  </v-container>
</template>
<script>
export default {
  name: "Sales",
  data() {
    return {
      items: [
        {
          title: "客戶類別:",
          active: true,
          items: [
            { title: "客戶類別1",active:false },
            { title: "客戶類別2",active:false },
            { title: "客戶類別3",active:false }
          ]
        },
        {
          title: "客戶資料:",
          items: [
            { title: "同公司資料" },
            { title: "示範客戶A" },
            { title: "示範客戶B" }
          ]
        },
        {
          items: [{ title: "List Item" }],
          title: "收件資料"
        }
      ]
    };
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
</style>
