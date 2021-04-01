<template>
  <div>
    <div class="top-wrapper">
      <div class="btn-wrapper">
        <v-btn :style="{background: isActive === true? 'burlywood':'white'}"  @click="showToday">今天</v-btn>
        <v-btn :style="{background: isActive2 === true? 'burlywood':'white'}" @click="showWeek">本周</v-btn>
        <v-btn :style="{background: isActive3 === true? 'burlywood':'white'}" @click="showMonth">本月</v-btn>
        <v-btn :style="{background: isActive4 === true? 'burlywood':'white'}" @click="showLastMonth">上個月</v-btn>
        <v-btn :style="{background: isActive5 === true? 'burlywood':'white'}" @click="showAll">全部</v-btn>
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
            <tr v-for="(item,index) in tableData" :key="index" class="text-center">
              <td>{{ item.updateDate }}</td>
              <td>{{ item.productName }}</td>
              <td style="color: red">{{ item.amount }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <div class="nodata-message" v-show="message">
        <h1>尚無資料</h1>
      </div>
      <div class="loading">
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: "restoreLog",
  data() {
    let differentDate = [
      moment()
              .startOf('day'),
      moment().endOf('day')
    ]
    return {
      isActive:false,
      isActive2:false,
      isActive3:false,
      isActive4:false,
      isActive5:false,
      tableData: [],
      pageNumber:1,
      pageSize:30,
      differentDate,
      startDate: differentDate[0].format('YYYY-MM-DD'),
      endDate: differentDate[1].format('YYYY-MM-DD'),
      mark:'-',
      contentStatus:'',
      message:true
    };
  },
  async created() {
    const res = await this.$api.Login.loginIdentify()
    console.log(res)
    if(res.data === false){
      this.$router.push('/')
    }
    this.getInventoryLog()
    this.isActive = true
  },
  mounted() {
    window.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      if(clientHeight + scrollTop >= scrollHeight) {
        console.log("bottom")
        this.pageNumber += 1;
        if(this.contentStatus === false){
          // show the loading animation
          document.querySelector('.loading').classList.add('show')
          setTimeout(this.getInventoryLog,1000)
        }
      }
    });
  },
  methods:{
    showToday(){
      this.differentDate = [moment().startOf('day'), moment().endOf('day')]
      this.startDate = this.differentDate[0].format('YYYY-MM-DD')
      this.endDate = this.differentDate[1].format('YYYY-MM-DD')
      this.tableData = []
      this.pageNumber = 1
      this.getInventoryLog()
      this.isActive = true
      this.isActive2 = false
      this.isActive3=false
      this.isActive4=false
      this.isActive5=false
    },
    showWeek(){
      this.differentDate = [
        moment()
                .isoWeekday(1)
                .startOf('day'),
        moment()
                .isoWeekday(7)
                .startOf('day')
      ]
      this.startDate = this.differentDate[0].format('YYYY-MM-DD')
      this.endDate = this.differentDate[1].format('YYYY-MM-DD')
      this.tableData = []
      this.pageNumber = 1
      this.getInventoryLog()
      this.isActive2 = true
      this.isActive = false
      this.isActive3=false
      this.isActive4=false
      this.isActive5=false
    },
    showMonth(){
      this.differentDate = [
        moment()
                .date(1)
                .startOf('day'),
        moment().endOf('month')
      ]
      this.startDate = this.differentDate[0].format('YYYY-MM-DD')
      this.endDate = this.differentDate[1].format('YYYY-MM-DD')
      this.tableData = []
      this.pageNumber = 1
      this.getInventoryLog()
      this.isActive3 = true
      this.isActive = false
      this.isActive2=false
      this.isActive4=false
      this.isActive5=false
    },
    showLastMonth(){
      this.differentDate = [
        moment()
                .month(moment().month() - 1)
                .date(1)
                .startOf('day'),
        moment()
                .month(moment().month() - 1)
                .endOf('month')
      ]
      this.startDate = this.differentDate[0].format('YYYY-MM-DD')
      this.endDate = this.differentDate[1].format('YYYY-MM-DD')
      this.tableData = []
      this.pageNumber = 1
      this.getInventoryLog()
      this.isActive4 = true
      this.isActive = false
      this.isActive2=false
      this.isActive3=false
      this.isActive5=false
    },
    showAll(){
      this.differentDate = ['']
      this.startDate = this.differentDate[0]
      this.endDate = this.differentDate[0]
      this.tableData = []
      this.pageNumber = 1
      this.getInventoryLog()
      this.isActive = false
      this.isActive2 = false
      this.isActive3=false
      this.isActive4=false
      this.isActive5=true
    },
    getInventoryLog(){
      this.$api.Inventory.getInventoryLogList({
        searchKey:"",
        action:"STOCK_EDIT",
        startDate:this.startDate == '' ? this.startDate : this.startDate + ' 00:00:00',
        endDate: this.endDate == '' ? this.endDate : this.endDate + ' 23:59:59',
        pageNumber:this.pageNumber,
        pageSize:this.pageSize,
        mark:this.mark
      }).then(res=>{
        this.contentStatus = res.data.empty
        document.querySelector('.loading').classList.remove('show')
        this.tableData.push(...res.data.content)
        if(this.tableData.length ===0){
          this.message = true
        }else {
          this.message = false
        }
      })
    }
  }
};
</script>
<style scoped>
.btn-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
#today-btn-color:hover{
  background-color: burlywood !important;
}
.nodata-message{
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
.loading{
  opacity: 0;
  display: flex;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity .3s ease-in;
}
.loading.show {
  opacity: 1;
}
.ball{
  background-color: #777;
  border-radius: 50%;
  margin: 5px;
  height: 10px;
  width: 10px;
  animation: jump 0.5s ease-in infinite;
}
.ball:nth-of-type(2) {
  animation-delay: 0.1s;
}

.ball:nth-of-type(3) {
  animation-delay: 0.2s;
}
@keyframes jump {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}
</style>
