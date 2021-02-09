<template>
  <div>
    <div class="top-wrapper">
      <div class="btn-wrapper">
        <v-btn color="normal">今天</v-btn>
        <v-btn color="normal">本周</v-btn>
        <v-btn color="normal">本月</v-btn>
        <v-btn color="normal">上個月</v-btn>
        <v-btn color="normal">全部</v-btn>
      </div>
    </div>
    <div class="content-wrapper">
      <span>入庫商品資料</span>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">
                日期
              </th>
              <th class="text-center">
                商品名稱
              </th>
              <th class="text-center">
                數量
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id" class="text-center">
              <td>{{ item.title }}</td>
              <td>{{ item.goods }}</td>
              <td>{{ item.amount }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "restoreLog",
  data() {
    return {
      tableData: [
        { id: 1, title: 20211010, goods:'豬', amount:10},
        { id: 2, title: 20211020, goods:'雞', amount:20},
        { id: 3, title: 20211030, goods:'羊', amount:15},
      ]
    };
  }
};
</script>
<style scoped>
.btn-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
