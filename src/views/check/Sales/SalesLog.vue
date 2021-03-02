<template>
  <div>
    <swipe-list
      ref="swipeList"
      class="productList"
      :items="productItem"
      transition-key="id"
    >
        <template slot-scope="{ item, index }">

        </template>
        <template v-slot:left="{ item , index }">
            <div class="swipeout-action action-panel-left" @click="onChangeDesDialog(item,index)">
                <div>
                    <span>編輯備註</span>
                </div>
            </div>
        </template>
        <template v-slot:right="{ item }">
            <div
                    class="swipeout-action action-panel-right"
                    @click="onDelProductDialog(item)"
            >
                <div>
                    <v-icon>mdi-trash-can-outline</v-icon>
                </div>
            </div>
        </template>
    </swipe-list>
  </div>
</template>
<script>
import { SwipeList } from "vue-swipe-actions";
export default {
  name: "salesLog",
  components: {
    SwipeList
  },
    mounted() {
        this.$api.Distribute.getDistributeList({
            orderNo: this.search,
            startDate:
                this.startDate == '' ? this.startDate : this.startDate + ' 00:00:00',
            endDate: this.endDate == '' ? this.endDate : this.endDate + ' 23:59:59',
            pageNumber: this.pageNumber,
            pageSize: this.pageSize
        }).then(res => {
            this.total = res.data.totalElements
            this.tableData = res.data.content
        })
    }
};
</script>
