<template>
    <div>
        <v-container fluid class="wrapper">
            <div style="position: absolute; top:-500px">
                <svg id="barcode"
                     :jsbarcode-format="'auto'"
                     :jsbarcode-value="barcodeStorage"
                     jsbarcode-textmargin="0"
                     jsbarcode-fontoptions="bold">
                </svg>
                <canvas id="canvasTest" v-show="false" width="550" height="550"></canvas>
                <img
                        v-show="false"
                        class="barcodeImg"
                        :src="barcodeImageUrl"
                        alt="avatar"
                        style="width: 190px; height: 45px;"
                />
            </div>
            <div class="top pa-3">
                <div class="title d-flex align-center">
<!--                    <div-->
<!--                            class="mr-3"-->
<!--                            v-if="btStatus"-->
<!--                            style="width:20px; height:20px; background-color: #4caf50; border-radius: 50%"-->
<!--                    />-->
<!--                    <div-->
<!--                            class="mr-3"-->
<!--                            v-if="!btStatus"-->
<!--                            style="width:20px; height:20px; background-color: #888888; border-radius: 50%"-->
<!--                    />-->
                    <span class="inbound">入庫作業</span>
                    <span class="work-date">工作日期 : {{today}}</span>
                </div>
                <div class="btn d-flex align-center">
                    <v-btn
                            class="mr-4"
                            large
                            depressed
                            color="primary"
                            @click="setIPDialog"
                    >
                        <h3>設定IP</h3>
                    </v-btn>
                    <v-btn
                            class="mr-4"
                            large
                            depressed
                            :color="btColor"
                            @click="handleNotification"
                            v-if="!characteristic"
                    ><h3>{{testText}}</h3>
                        <v-icon>mdi-bluetooth</v-icon>
                    </v-btn>
                    <v-btn
                            class="mr-4"
                            large
                            depressed
                            color="success"
                            @click="handleRestartNotification"
                            v-else
                    >
                        <h3>重新連接</h3>
                        <v-icon>mdi-bluetooth</v-icon>
                    </v-btn>
                    <v-btn
                            v-if="btStatus"
                            class="mr-4"
                            large
                            depressed
                            color="error"
                            @click="handleStopNotification()"
                    ><h3>停止連接</h3><v-icon>mdi-bluetooth-off</v-icon>
                    </v-btn>
                    <v-btn
                            class="mr-4"
                            large
                            depressed
                            color="primary"
                            @click="showAddNumberDialog(true)"
                    ><h3>+新增入料</h3>
                    </v-btn>
                    <v-btn :disabled="rePrintStatus" class="mr-10" large depressed color="error" @click="updateStock()"><h3>取消入庫</h3></v-btn>
                    <div class="staffName">
                        <h3 style="display: inline-block">{{userName}}</h3>
                        <v-btn class="ml-2" icon @click="logout">
                            <v-icon large>mdi-exit-to-app</v-icon>
                        </v-btn>
                    </div>
                </div>
            </div>
            <div class="mid d-flex pa-2 pb-4">
                <div class="weight-wrap">
                    <div class="weight-scale">
                        <div v-if="kgStatus">{{ deductionValue && displayValue !== 0 ? (Number(displayValue) - deductionValue).toFixed(3) : Number(displayValue).toFixed(3) }}</div>
                        <div v-else-if="tkgStatus">{{Math.floor(changeValue)}}斤{{twTael}}兩</div>
                        <div v-else>{{ changeValue }}</div>
                    </div>
                    <div class="d-flex">
                        <v-btn-toggle v-model="defaultValue" mandatory>
                            <v-btn x-large active-class="btnColor" :disabled="kgStatus" @click="changeUnit('kg')"><h3>公斤</h3></v-btn>
                            <v-btn
                                    active-class="btnColor"
                                    x-large
                                    :disabled="tkgStatus"
                                    class="mx-2"
                                    @click="changeUnit('tkg')"
                                    style="border-left: 1px solid #666"
                            ><h3>斤/兩</h3>
                            </v-btn>
                            <v-btn
                                    active-class="btnColor"
                                    x-large
                                    :disabled="gStatus"
                                    @click="changeUnit('g')"
                                    style="border-left: 1px solid #666"
                            ><h3>公克</h3>
                            </v-btn>
                        </v-btn-toggle>
                    </div>
                    <v-btn-toggle class="d-flex" style="margin: 45px 0 -100px 0">
                        <v-btn
                                text
                                large
                                style="border: 1px solid #666; height: 52px"
                                v-long-press="800"
                                @long-press-start="onLongPressStart"
                                @click="accumulate"
                        >
                            <h3>
                                累加(公斤) {{accumulateValue}}
                            </h3>
                        </v-btn>
                        <v-btn class="mx-2" x-large active-class="btnColor" style="border-left: 1px solid #666" @click="deduction()">
                            <h3>扣重</h3>
                        </v-btn>
                        <v-btn x-large active-class="btnColor" style="border-left: 1px solid #666" @click="toZero()">
                            <h3>歸零</h3>
                        </v-btn>
                    </v-btn-toggle>
                </div>
                <div class="pl-5">
                    <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                    >
                    <v-row align="center">
                            <v-col class="d-flex pb-0" cols="12" sm="6" md="6">
                                <v-text-field
                                        v-model="orderNumber"
                                        :disabled="textDisabled"
                                        readonly
                                        append-icon="mdi-menu-down"
                                        label="入料單號 :"
                                        @click="showOrderNumberDialog(true)"
                                        style="font-size: 22px;"
                                />
                            </v-col>
                            <v-col class="d-flex pb-0" cols="12" sm="6" md="6">
                                <v-text-field v-model="orderName" disabled label="物料名稱 :" style="font-size: 22px;" />
                            </v-col>
                            <v-col class="d-flex pb-0" cols="12" sm="6" md="6">
                                <v-text-field v-model="addOrderForm.count" disabled label="物料數量 :" style="font-size: 22px;" />
                            </v-col>
                            <v-col class="d-flex pb-0" cols="12" sm="6" md="6">
                                <v-text-field v-model="addOrderForm.carcassWeight" disabled label="屠體重量(公斤) :" style="font-size: 22px;" />
                            </v-col>
                            <v-col class="d-flex pb-0" cols="12" sm="6" md="6">
                                <v-text-field v-model="addOrderForm.livingWeight" type="number" label="毛雞重量(公斤) :" style="font-size: 22px;"/>
                            </v-col>
                            <v-col class="d-flex pb-0" cols="12" sm="6" md="6">
                                <v-select v-model="productDepot" :items="productDepotList" item-value="id" item-text="name" :rules="warehouseValidat" label="儲存倉庫 :" style="font-size: 17px;" @change="changeDepot"/>
                            </v-col>
                        <v-col class="d-flex pb-0 mt-4" cols="12" sm="6" md="6">
                            <PlusButton v-if="restPlusBtn" :name="'商品序號'" @changeNumber="changeNumber"/>
                        </v-col>
                        <v-col class="d-flex pb-0 mt-4" cols="12" sm="6" md="6">
                            <PlusButton v-if="restPlusBtn" :name="'數量'" @changeNumber="changeNumber"/>
                        </v-col>
                    </v-row>
                    </v-form>
                </div>
                <div class="mid-btn mx-5 mt-6">
                    <v-btn :disabled="rePrintTagStatus" class="reprint-label" @click="rePrintTag"><h1>重印標籤</h1></v-btn>
                    <v-btn :disabled="inboundPrintStatus" class="print mt-9" @click="inboundPrint"><h1 style="font-size: 36px;">入庫列印</h1></v-btn>
                </div>
            </div>
            <div class="weight-control">
                <div id class="weight-btn-bar">
                    <div
                            class="weight-control-button"
                            v-for="(item, index) in commodity"
                            :key="item.id"
                            @click="addClass(index)"
                            :class="{'active': position === index}"
                    >
                        <div>{{item.name}}</div>
                        <div>{{item.weight === 0 ? '' : item.weight}}{{getUnit(item.unit)}}</div>
                    </div>
                    <i/>
                    <i/>
                    <i/>
                    <i/>
                    <i/>
                </div>
            </div>
            <!--藍芽連結成功提示-->
            <v-snackbar v-model="btConncet" :top="'top'" :color="btStatus ? 'success' : 'error'" :timeout="2500">
                <h3>{{btStatus ? '藍芽連結成功' : '連接中斷!'}}</h3>
                <template v-slot:action="{ attrs }">
                    <v-btn text v-bind="attrs" @click="btConncet = false">
                        <h3>關閉</h3>
                    </v-btn>
                </template>
            </v-snackbar>
            <!--入庫成功提示-->
            <v-snackbar v-model="inboundStatus" :top="'top'" :color="inboundMsg ? 'error' : 'success'" :timeout="2500">
                <h3>{{inboundMsg ? inboundMsg : inboundSuccessMsg}}</h3>
                <template v-slot:action="{ attrs }">
                    <v-btn text v-bind="attrs" @click="inboundStatus = false">
                        <h3>關閉</h3>
                    </v-btn>
                </template>
            </v-snackbar>
        </v-container>
        <AddNumberDialog :show="addNumberShow" :kg="displayValue" :materialList="materialList" :addOrderNumber="addOrderNumber" @getAddOrderForm="getAddOrderForm" @close="closeAddNumberDialog"/>
        <OrderNumberDialog
                :show="orderNumberShow"
                :getUnusedList="getUnusedList"
                @getOrderNumber="getOrderNumber"
                @close="closeOrderNumberDialog"
        />
        <AccumulateDialog
                :show="accumulateShow"
                :kg="accumulateValue"
                @close="closeAccumulateShowDialog"
                @getZero="getZero"
        />
        <IpDialog
                :show="ipShow"
                @close="closeIpDialog"
        />
    </div>
</template>

<script>
    import { fabric } from "fabric";
    import PlusButton from "../../components/plusButton";
    import AddNumberDialog from "../../components/addNumberDialog";
    import OrderNumberDialog from "../../components/orderNumberDialog";
    import AccumulateDialog from "../../components/accumulateDialog";
    import IpDialog from "../../components/ipDialog";
    import LongPress from "vue-directive-long-press";
    import {UNIT} from "../../mixin/enums"
    import axios from "axios";
    const SERVICE_ID = "00004353-0000-1000-8000-00805f9b34fb";
    export default {
        components: {
            PlusButton,
            AddNumberDialog,
            OrderNumberDialog,
            AccumulateDialog,
            IpDialog
        },
        data() {
            return {
                characteristic: null,
                addNumberShow: false,
                isActive: false,
                orderNumberShow: false,
                accumulateShow: false,
                ipShow: false,
                textDisabled: false,
                btStatus: false,
                btDisabled: false,
                btConncet: false,
                gStatus: false,
                kgStatus: false,
                tkgStatus: false,
                tagStatus: false,
                inboundStatus: false,
                inboundPrintStatus: false,
                rePrintStatus: false,
                rePrintTagStatus: true,
                valid: true,
                restPlusBtn: true,
                defaultValue: 0,
                list: [],
                lastValue: "0",
                displayValue: 0.000,
                changeValue: 0,
                accumulateValue: 0,
                stockInFormAmount: 0,
                deductionValue: 0,
                userName: '',
                userIP: '',
                log: '',
                today: '',
                orderName: '',
                position: '',
                orderNumber: '',
                addOrderNumber: '',
                inventoryId: '',
                barcodeStorage: '',
                inboundMsg: '',
                inboundSuccessMsg: '',
                btColor: "success",
                testText: "連接藍芽",
                commodityNumber: 1,
                count: 1,
                commodity: [],
                materialList: [],
                getUnusedList: [],
                productDepotList: [],
                productDepot: '',
                addOrderForm: {},
                stockInForm: {
                    depotId: '',
                    productId: '',
                    unit: '',
                    barcode: '',
                    weight: '',
                    amount: 0,
                    orderId: ''
                },
                svgForm: {
                    name: '',
                    unit: '',
                    weight: 0,
                    barcode: '',
                    productNo: 1,
                    price: 0,
                    today: '',
                    pSolarDay: 1,
                    rSolarDay: 1,
                },
                svgString: '',
                barcodeBase64: '',
                barcodeImageUrl: '',
                warehouseValidat: [
                    v => !!v || '請選擇倉庫'
                ],
            };
        },
        async mounted() {
            this.userName = sessionStorage.getItem("userName")
            //需要有IP才能入庫
            if(this.userIP){
                this.inboundPrintStatus = false
            } else {
                this.inboundPrintStatus = true
                this.inboundPrintStatus = true
            }
            //代入上次操作結果
            if(sessionStorage.getItem('orderNumber')){
                this.addOrderForm = JSON.parse(sessionStorage.getItem('addOrderForm'))
                this.orderNumber = sessionStorage.getItem('orderNumber')
                this.orderName = sessionStorage.getItem('orderName')
                this.stockInForm.depotId = sessionStorage.getItem('depot')
                this.productDepot = sessionStorage.getItem('depot')
            }
            this.canvas = new fabric.Canvas('canvasTest')
            await this.$scale.Product.getProduct().then(res => {
                if (res.status === 200) {
                    this.commodity = res.data
                }
            })
            await this.$scale.ProductDepot.productDepotList().then(res => {
                if (res.status === 200) {
                    this.productDepotList = res.data
                }
            })
            this.changeUnit("kg");
            let today = new Date();
            this.today =
                today.getFullYear() +
                "-" +
                (today.getMonth()+1<10 ? '0' : '')+(today.getMonth() + 1) +
                "-" +
                (today.getDate()<10 ? '0' : '')+today.getDate();
        },
        directives: {
            "long-press": LongPress
        },
        watch: {
            userIP() {
                //需要有IP才能入庫
              if(this.userIP){
                  this.inboundPrintStatus = false
              } else {
                  this.inboundPrintStatus = true
              }
            },
            position() {
                //先設定IP
                if(this.userIP){
                    this.barcodeStorage = ""
                    this.inventoryId = ""
                    //切換標籤時重置取消入庫狀態
                    this.rePrintStatus = false
                    //切換標籤時重置入庫列印狀態
                    this.inboundPrintStatus = false
                    //切換標籤時重置重印標籤狀態
                    this.rePrintTagStatus = true
                }
            },
            //當磅秤機重量改變時
            displayValue() {
                if(this.kgStatus) {
                    this.changeUnit('kg')
                }else if(this.tkgStatus) {
                    this.changeUnit('tkg')
                }else{
                    this.changeUnit('g')
                }
            }
        },
        computed: {
            twTael () {
                let tael = this.changeValue.toFixed(3).toString().split('.')[1]
                let num = Math.floor(Number('0.'+tael) * 16)
                return num
            },
        },
        methods: {
            changeDepot() {
                this.stockInForm.depotId = this.productDepot
                window.sessionStorage.setItem('depot', this.productDepot)
            },
            accumulate() {
                //防止累加按鈕連續操作
                if(this.displayValue === 0.000) return
                //累加的值如果有扣重的重量要扣掉
                this.accumulateValue = Number((this.accumulateValue+(this.displayValue-this.deductionValue)).toFixed(3))
                this.displayValue = 0.000
                this.changeValue = 0.000
            },
            onLongPressStart() {
                this.accumulateShow = true;
            },
            changeUnit(value) {
                if (value === "kg") {
                    return (
                        //為了扣重後不要進來跑，當物品放上去後才跑
                        (this.changeValue = this.deductionValue && this.displayValue !== 0 ? this.displayValue - this.deductionValue :this.displayValue),
                            (this.kgStatus = true),
                            (this.gStatus = false),
                            (this.tkgStatus = false)
                    );
                } else if (value === "tkg") {
                    return (
                        (this.changeValue = this.deductionValue && this.displayValue !== 0 ? (this.displayValue - this.deductionValue) / 0.6 : this.displayValue / 0.6),
                            (this.kgStatus = false),
                            (this.gStatus = false),
                            (this.tkgStatus = true)
                    );
                } else if (value === "g") {
                    return (
                        (this.changeValue = this.deductionValue && this.displayValue !== 0 ? (this.displayValue*1000 - this.deductionValue*1000) : this.displayValue * 1000),
                            (this.kgStatus = false),
                            (this.gStatus = true),
                            (this.tkgStatus = false)
                    );
                }
            },
            setIPDialog() {
              this.ipShow = true
            },
            closeIpDialog(ip) {
              this.ipShow = false
              this.userIP = ip
            },
            async showAddNumberDialog(show) {
                this.addNumberShow = show;
                //拿物料名稱
                await this.$scale.Material.getList().then(res => {
                    if (res.status === 200) {
                        this.materialList = res.data
                    }
                })
                //拿入料單號
                await this.$scale.DepotOrder.getNumber().then(res => {
                    if (res.status === 200) {
                        this.addOrderNumber = res.data.toString()
                    }
                })
            },
            closeAddNumberDialog() {
                this.addNumberShow = false;
            },
            getAddOrderForm(form, addOrderNumber, name, id) {
                this.addOrderForm = form
                this.orderNumber = addOrderNumber
                this.orderName = name
                this.addOrderForm.id = id
            },
            showOrderNumberDialog(show) {
                this.$scale.DepotOrder.getUnusedList().then(res => {
                    if(res.status === 200) {
                        this.getUnusedList = res.data
                    }
                })
                this.textDisabled = true;
                this.orderNumberShow = show;
            },
            closeOrderNumberDialog() {
                this.textDisabled = false;
                this.orderNumberShow = false;
            },
            closeAccumulateShowDialog() {
                this.accumulateShow = false;
            },
            getOrderNumber(value) {
                this.addOrderForm = value
                this.orderNumber = value.number;
                this.orderName = value.name
                //紀錄最後一次操作的單號資料
                sessionStorage.setItem('addOrderForm', JSON.stringify(value))
                sessionStorage.setItem('orderNumber', value.number)
                sessionStorage.setItem('orderName', value.name)
            },
            changeNumber(value, name) {
                if (name === "商品序號") {
                    this.commodityNumber = value;
                } else {
                    this.count = value;
                }
            },
            appendLog(text) {
                this.log = this.log + "\n" + text;
            },
            //商品切換
            addClass(index) {
                //當前選擇的商品ID
                this.stockInForm.productId = this.commodity[index].id
                //當前選擇的商品barcode
                this.stockInForm.barcode = this.commodity[index].barcode
                //當前選擇的商品的總數量
                this.stockInFormAmount = this.commodity[index].stockAmount
                //取得當前選擇的商品單位
                this.stockInForm.unit = this.commodity[index].unit
                //取得當前選擇的商品重量
                this.stockInForm.weight = this.commodity[index].weight
                //取得當前選擇的商品barcodeBase64
                this.barcodeBase64 = this.commodity[index].barcodeBase64
                //SVG
                this.svgString = this.commodity[index].svgString
                this.svgForm.name = this.commodity[index].name
                this.svgForm.unit = this.getUnit(this.commodity[index].unit)
                this.svgForm.weight = this.commodity[index].weight
                this.svgForm.barcode = this.commodity[index].barcode
                this.svgForm.price = this.commodity[index].price
                this.position = index;
                //切換標籤時reset組件
                this.restPlusBtn = false
                //切換標籤時reset組件
                this.$nextTick(() => {
                    this.restPlusBtn = true
                    this.commodityNumber = 1 //切換標籤的時候數量歸1
                    this.count = 1 //切換標籤的時候數量歸1
                })
            },
            connectBt(status) {
                if (status) {
                    if ( this.testText === "連接成功") return
                    this.testText = "連接中...";
                    setTimeout(() => {
                        this.btStatus = status;
                        if (this.btStatus) {
                            this.testText = "連接成功";
                            this.btColor = "success";
                            this.btConncet = true;
                        }
                    }, 1500);
                } else {
                    this.btStatus = status;
                    this.testText = "連接藍芽";
                    this.btColor = "success";
                    this.btConncet = true;
                }
            },
            //累加歸零
            getZero() {
                this.accumulateValue = 0
            },
            //平板歸零
            toZero() {
                this.changeValue = 0
                this.deductionValue = 0
                this.displayValue = 0
            },
            //平板扣重
            deduction() {
                //紀錄第一次扣重的物品重量
                if(this.deductionValue === 0) {
                    this.deductionValue = this.displayValue
                    this.displayValue = 0
                    this.changeValue = 0
                }
            },
            //取消入庫
            updateStock() {
                if(this.orderNumber === "") {
                    return this.inboundStatus = true, this.inboundMsg = '請選擇入料單號'
                }
                if(this.stockInForm.productId === "") {
                    return this.inboundStatus = true, this.inboundMsg = '請選擇商品'
                }
                //需要先入庫才能取消入庫
                if(this.inventoryId === "") {
                    return this.inboundStatus = true, this.inboundMsg = '請先入庫'
                }
                if(this.stockInFormAmount - this.count < 0) {
                    return this.inboundStatus = true, this.inboundMsg = '超過商品數量'
                }
                this.$scale.Inventory.updateStock({
                    //當前庫存id
                    id: this.inventoryId,
                    //如果有動態條碼就使用，反之則拿固定條碼
                    barcode: this.barcodeStorage ? this.barcodeStorage : this.stockInForm.barcode,
                    //目前庫存 - 要取消的數量
                    amount: this.stockInFormAmount - this.count
                }).then(res => {
                    if(res.status === 200) {
                        if(this.stockInForm.barcode === '') {
                            this.rePrintStatus = true
                        }
                        //取消入庫成功後獲得當前商品數量
                        this.stockInFormAmount = res.data.amount
                        this.inboundStatus = true
                        this.inboundSuccessMsg = '取消入庫成功'
                        this.inboundMsg = ''
                    }
                })
            },
            async rePrintTag() {
                if(this.orderNumber === "") {
                    return this.inboundStatus = true, this.inboundMsg = '請選擇入料單號'
                }
                if(this.stockInForm.productId === "") {
                    return this.inboundStatus = true, this.inboundMsg = '請選擇商品'
                }
                if(this.productDepot === "") {
                    return this.inboundStatus = true, this.inboundMsg = '請選擇儲存倉庫'
                }
                //svg塞值
                let svgJSON = this.svgString ? JSON.parse(this.svgString) : null
                //正向太陽日 今天是一年中的第幾天
                let pSolarDay = Math.ceil((new Date() - new Date(new Date().getFullYear().toString())) / (24 * 60 * 60 * 1000));
                //反向太陽日 一年幾天-正向太陽日+今天
                let rSolarDay = 365 - pSolarDay + 1;
                if (svgJSON) {
                    await svgJSON.objects.map(async items => {
                        if (items.name === "productName") {
                            items.text = `商品名稱:${this.svgForm.name}`
                        } else if (items.name === "unit") {
                            items.text = `計價單位:${this.svgForm.unit}`
                        } else if (items.name === "weight") {
                            items.text = `重量:${this.svgForm.weight}`
                        } else if (items.name === "price") {
                            items.text = `價格:${this.svgForm.price}元`
                        } else if (items.name === "productNo") {
                            items.text = `${this.commodityNumber}`
                        } else if (items.name === "today") {
                            items.text = `${this.today}`
                        } else if (items.name === "pSolarDay") {
                            items.text = `正向太陽日:${pSolarDay}`
                        } else if (items.name === "rSolarDay") {
                            items.text = `反向太陽日:${rSolarDay}`
                        }
                    })
                    this.canvas.clear()
                    await this.loadFromJson(svgJSON)
                    await this.changeBarcode()
                }
            },
            loadFromJson(svgJSON) {
                return new Promise(resolve => {
                    this.canvas.loadFromJSON(
                        svgJSON,
                        () => {
                            this.canvas.renderAll.bind(this.canvas)
                            resolve(true)
                        },
                        (o, obj) => {
                            this.canvas._objects.push(obj)
                        }
                    )
                })
            },
            changeBarcode() {
                function loadImage() {
                    return new Promise(resolve => {
                        this.barcodeImageUrl = 'data:image/png;base64,' + this.barcodeBase64
                        resolve(true)
                    })
                }
                return new Promise(async resolve => {
                    await loadImage.bind(this)()
                    let imgElement
                    await this.$nextTick(() => {
                        imgElement = document.getElementsByClassName('barcodeImg')[0]
                    })
                    this.canvas.getObjects().map(o => {
                        if (o.name === 'barcode' && this.barcodeImageUrl) {
                            let { width, height, left, top, scaleX, scaleY } = o
                            this.canvas.remove(o)
                            let element
                            element = new fabric.Image(imgElement, {
                                left: left,
                                top: top,
                                name: 'barcode'
                            })
                            element.scaleX = (width * scaleX) / element.width
                            element.scaleY = (height * scaleY) / element.height
                            this.canvas.add(element)
                            this.canvas.renderAll()
                        }
                    })
                    if(this.count > 1){
                        let status = true
                        for(let i = this.commodityNumber; i < Number(this.count)+Number(this.commodityNumber); i++){
                            this.canvas.getObjects().map(items => {
                                if(items.name === "productNo") {
                                    items.text = `${i}`
                                }
                            })
                            if(status) {
                                let canvasStr = JSON.stringify(this.canvas)
                                let file = new File([canvasStr], 'text.txt', {type: 'text/plain'})
                                let formData = new FormData()
                                formData.append("file", file)
                                await axios.post(`http://${this.userIP}:8099/print/printTag`, formData).then(res => {
                                    if(res.data.status === 200) {
                                        status = true
                                        console.log(res.data.status);
                                    }
                                }).catch((error) => {
                                    status = false
                                    console.error(error)
                                })
                            }else{
                                return this.inboundStatus = true, this.inboundMsg = '列印發生錯誤'
                            }
                        }
                    }else{
                        let canvasStr = JSON.stringify(this.canvas)
                        let file = new File([canvasStr], 'text.txt', {type: 'text/plain'})
                        let formData = new FormData()
                        formData.append("file", file)
                        await axios.post(`http://${this.userIP}:8099/print/printTag`, formData).then(res => {
                            console.log(res.data.status)
                        }).catch((error) => {
                            console.error(error)
                        })
                    }
                    // this.imageDataUrl = this.canvas.toDataURL({
                    //     left: 25,
                    //     top: 25,
                    //     width: 500,
                    //     height: 500,
                    //     format: 'png'
                    // })
                    // //base64 to image
                    // fetch(this.imageDataUrl)
                    //     .then(res => res.blob())
                    //     .then(blob => {
                    //         const file = new File([blob], "File name",{ type: "image/png" })
                    //         let fileURL = URL.createObjectURL(file);
                    //         window.open(fileURL);
                    //     })
                })
            },
            //入庫列印
            async inboundPrint () {
                if (this.$refs.form.validate()) {
                    if(this.orderNumber === "") {
                        return this.inboundStatus = true, this.inboundMsg = '請選擇入料單號'
                    }
                    if(this.stockInForm.productId === "") {
                        return this.inboundStatus = true, this.inboundMsg = '請選擇商品'
                    }
                    //取得當前要操作入庫/取消的數量
                    this.stockInForm.amount = this.count
                    this.stockInForm.orderId = this.addOrderForm.id
                    await this.$scale.Inventory.stockIn(this.stockInForm).then(async res => {
                        if(res.status === 200) {
                            this.inboundSuccessMsg = '商品入庫成功'
                            //入庫之後才能重印標籤
                            this.rePrintTagStatus = false
                            //barcode為空時才做barcode暫存
                            if(this.stockInForm.barcode === '') {
                                this.barcodeStorage = res.data.barcode
                                this.barcodeBase64 = res.data.barcodeBase64
                                //動態條碼只能入庫一次
                                this.inboundPrintStatus = true
                            }
                            //獲取當前庫存id
                            this.inventoryId = res.data.id
                            //新增入庫成功後獲得當前商品數量
                            this.stockInFormAmount = res.data.amount
                            this.inboundMsg = ''
                            this.inboundStatus = true
                            //svg塞值
                            let svgJSON = this.svgString ? JSON.parse(this.svgString) : null
                            //正向太陽日 今天是一年中的第幾天
                            let pSolarDay = Math.ceil(( new Date() - new Date(new Date().getFullYear().toString()))/(24*60*60*1000));
                            //反向太陽日 一年幾天-正向太陽日+今天
                            let rSolarDay = 365-pSolarDay+1;
                            if(svgJSON) {
                                await svgJSON.objects.map(async items => {
                                    if(items.name === "productName") {
                                        items.text = `商品名稱:${this.svgForm.name}`
                                    }else if(items.name === "unit") {
                                        items.text = `計價單位:${this.svgForm.unit}`
                                    }else if(items.name === "weight") {
                                        items.text = `重量:${this.svgForm.weight}`
                                    }else if(items.name === "price") {
                                        items.text = `價格:${this.svgForm.price}元`
                                    }else if(items.name === "productNo") {
                                        items.text = `${this.commodityNumber}`
                                    }else if(items.name === "today") {
                                        items.text = `${this.today}`
                                    }else if(items.name === "pSolarDay") {
                                        items.text = `正向太陽日:${pSolarDay}`
                                    }else if(items.name === "rSolarDay") {
                                        items.text = `反向太陽日:${rSolarDay}`
                                    }
                                })
                                this.canvas.clear()
                                await this.loadFromJson(svgJSON)
                                await this.changeBarcode()
                            }
                        }
                    })
                }
            },
            logout () {
              this.$scale.Logout.logout().then(res => {
                  if(res.status === 200) {
                      sessionStorage.removeItem('token')
                      sessionStorage.removeItem('userName')
                      this.$router.push('/login')
                  }
              })
            },
            getUnit(unit) {
                let unitName = UNIT.find(item => item.value === unit);
                if (unitName) {
                    return unitName.name
                }
            },
            async handleNotification() {
                try {
                    const serviceUuid = "0000ffe0-0000-1000-8000-00805f9b34fb";
                    const characteristicUuid = "0000ffe1-0000-1000-8000-00805f9b34fb";
                    const device = await navigator.bluetooth.requestDevice({
                        filters: [{services: [SERVICE_ID]}],
                        optionalServices: [serviceUuid]
                    });
                    const server = await device.gatt.connect();
                    this.appendLog("Getting Service...");
                    const service = await server.getPrimaryService(serviceUuid);
                    this.appendLog("Getting Characteristic...");
                    let myCharacteristic = await service.getCharacteristic(
                        characteristicUuid
                    );
                    this.connectBt(true)
                    await myCharacteristic.startNotifications();
                    this.characteristic = myCharacteristic;
                    this.appendLog("> Notifications started");
                    this.characteristic.addEventListener(
                        "characteristicvaluechanged",
                        this.handleNotifications
                    );
                } catch (e) {
                    setTimeout(() => {
                        this.connectBt(false)
                    }, 1000)
                    this.appendLog(e);
                }
            },
            async handleRestartNotification() {
                let myCharacteristic = this.characteristic;
                await myCharacteristic.startNotifications();
                this.characteristic = myCharacteristic;
                this.appendLog("> Notifications started");
                this.connectBt(true)
                myCharacteristic.addEventListener(
                    "characteristicvaluechanged",
                    this.handleNotifications
                );
            },
            async handleStopNotification() {
                if (this.characteristic) {
                    try {
                        this.connectBt(false)
                        this.toZero()
                        await this.characteristic.stopNotifications();
                        this.appendLog("> Notifications stopped");
                        this.characteristic.removeEventListener(
                            "characteristicvaluechanged",
                            this.handleNotifications
                        );
                    } catch (error) {
                        this.appendLog("Argh! " + error);
                    }
                }
            },
            handleNotifications(event) {
                let noti = Buffer.from(event.target.value.buffer);
                if (!(this.lastValue == noti.toString("ascii"))) {
                    this.lastValue = noti.toString("ascii");
                    this.displayValue = Number(noti.toString("ascii"));
                }
            },
            handleRecordWeightInterval() {
                setInterval(() => {
                    this.handleRecordWeight();
                }, 5000);
            },
            handleRecordWeight() {
                let array = this.list;
                array.push(this.lastValue);
                this.list = array;
            }
        }
    };
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 0;
        color: #fff;
        background: #ececec;
    }

    @mixin center {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .wrapper {
        /*width: calc(100% - 20px);*/
        width: 100%;
        height: calc(100vh - 20px);
        /*display: flex;*/
        /*align-items: center;*/
        /*flex-direction: column;*/
        /*flex-wrap: wrap;*/
        .top {
            display: flex;
            justify-content: space-between;
            /*background-color: cornflowerblue;*/
            border-bottom: 0.8px solid rgba(0, 0, 0, 0.4);

            .title {
                font-weight: normal;

                .inbound {
                    font-size: 34px;
                    font-weight: 700;
                }

                .work-date {
                    margin-left: 20px;
                }
            }
        }
    }

    .log-wrapper {
        flex: 1;
        white-space: pre-wrap;
        background: #c2c2c2;
        padding: 20px;
        white-space: pre-line;
    }

    .mid {
        /*background-color: cornflowerblue;*/
        border-bottom: 0.8px solid #666;

        .weight-wrap {
            position: relative;
            /*background: #00cc92;*/
            border: 1px solid #666666;
            margin-top: 20px;
            padding: 20px;
            width: 100%;
            height: 210px;
            display: flex;
            flex-direction: column;
            align-items: center;
            border-radius: 8px;
        }

        .weight-list {
            position: absolute;
            right: 20px;
        }

        .weight-scale {
            width: 500px;
            height: 300px;
            /*border: 5px solid #fff;*/
            /*border-radius: 50%;*/
            position: relative;

            div {
                white-space: nowrap;
                font-size: 64px;
                position: absolute;
                top: 10%;
                right: 0%;
                //transform: translate(-50%, -50%);
            }
        }

        .reprint-label {
            width: 180px;
            height: 70px;
        }

        .print {
            width: 180px;
            height: 180px;
            color: #ffffff;
            background-color: #179bd5;
        }
    }

    .weight-control {
        width: 100%;
        height: calc(44%);
        overflow-y: scroll;
        flex: 1;
        color: #444;
        padding-top: 5px;
    }

    .weight-btn-bar {
        /*flex: 1;*/
        display: flex;
        flex-wrap: wrap;
        /*align-items: flex-start;*/
        /*align-content: flex-start;*/
        justify-content: space-between;
        box-sizing: border-box;

        > div {
            margin: 12px;
        }

        > i {
            width: calc(17%);
            margin-right: 22px;
        }
    }

    .weight-control-button {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
        width: calc(17%);
        /*width: 160px;*/
        height: 100px;
        text-align: center;
        padding: 6px;
        /*position: relative;*/
        background: #fff;
        box-shadow: 0px 0 2px rgba(0, 0, 0, 0.5);
        font-size: 18px;
        font-weight: bold;
    }

    .active {
        //width: calc(17.05%);
        transition: 0.3s;
        background-color: #179bd5;
        color: #ffffff;
        /*box-shadow: 0 5px 8px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.2);*/
    }

    h2 {
        // flex-basis: 100%;
        width: 100%;
        // background: #dcdcdc;
        padding-bottom: 40px;
        @include center;
        font-size: 32px;
        margin: 0;
    }
    .v-btn--active.btnColor::before {
        background-color: #000000 !important;
    }
</style>
