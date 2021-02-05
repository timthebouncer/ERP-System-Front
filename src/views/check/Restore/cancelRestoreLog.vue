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
            <span>取消入庫商品資料</span>
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
                    <tr
                            v-for="item in desserts"
                            :key="item.name"
                    >
                        <td>{{ item.name }}</td>
                        <td>{{ item.calories }}</td>
                    </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
    </div>
</template>
<script>
  export default {
    name:'restoreLog'
  }
</script>
<style scoped>
    .btn-wrapper{
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }
</style>
