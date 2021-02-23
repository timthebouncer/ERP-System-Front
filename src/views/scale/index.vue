<template>
    <div>
        <v-container fluid class="wrapper">
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
                            :color="btColor"
                            @click="handleNotification()"
                    >{{testText}}
                        <v-icon>mdi-bluetooth</v-icon>
                    </v-btn>
                    <v-btn
                            v-if="btStatus"
                            class="mr-4"
                            large
                            depressed
                            color="error"
                            @click="handleStopNotification()"
                    >停止連接<v-icon>mdi-bluetooth</v-icon>
                    </v-btn>
                    <v-btn
                            class="mr-4"
                            large
                            depressed
                            color="primary"
                            @click="showAddNumberDialog(true)"
                    >+新增入料
                    </v-btn>
                    <v-btn class="mr-10" large depressed color="error">取消入庫</v-btn>
                    <div class="staffName">
                        <span>Jennifer Lopez</span>
                        <v-btn class="ml-2" icon @click="logout">
                            <v-icon large>mdi-exit-to-app</v-icon>
                        </v-btn>
                    </div>
                </div>
            </div>
            <div class="mid d-flex pa-2 pb-4">
                <div class="weight-wrap">
                    <div class="weight-scale">
                        <div v-if="kgStatus">{{ displayValue.toFixed(3) }}</div>
                        <div v-else-if="tkgStatus">{{Math.floor(changeValue)}}斤{{twTael}}兩</div>
                        <div v-else>{{ changeValue }}</div>
                    </div>
                    <div class="d-flex">
                        <v-btn-toggle v-model="defaultValue" mandatory>
                            <v-btn x-large active-class="btnColor" :disabled="kgStatus" @click="changeUnit('kg')">公斤</v-btn>
                            <v-btn
                                    active-class="btnColor"
                                    x-large
                                    :disabled="tkgStatus"
                                    class="mx-2"
                                    @click="changeUnit('tkg')"
                                    style="border-left: 1px solid #666"
                            >斤/兩
                            </v-btn>
                            <v-btn
                                    active-class="btnColor"
                                    x-large
                                    :disabled="gStatus"
                                    @click="changeUnit('g')"
                                    style="border-left: 1px solid #666"
                            >公克
                            </v-btn>
                        </v-btn-toggle>
                    </div>
                    <div class="d-flex" style="margin: 45px 0 -100px 0">
                        <v-btn
                                text
                                large
                                style="border: 1px solid #666; height: 52px"
                                v-long-press="800"
                                @long-press-start="onLongPressStart"
                                @click="accumulate"
                        >累加(公斤) {{accumulateValue}}
                        </v-btn>
                        <v-btn class="mx-2" x-large>扣重</v-btn>
                        <v-btn x-large>歸零</v-btn>
                    </div>
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
                                <v-select :items="items" :rules="warehouseValidat" label="儲存倉庫 :" style="font-size: 17px;"/>
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
                    <v-btn class="reprint-label">重印標籤</v-btn>
                    <v-btn class="print mt-9" @click="inboundPrint">入庫列印</v-btn>
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
                        <div>{{item.weight}}{{getUnit(item.unit)}}</div>
                    </div>
                    <i/>
                    <i/>
                    <i/>
                    <i/>
                    <i/>
                </div>
                <!--                <div class="weight-btn-bar">-->
                <!--                    <div-->
                <!--                            class="weight-control-button"-->
                <!--                            @click="handleNotification"-->
                <!--                            v-if="!characteristic"-->
                <!--                    >-->
                <!--                        <div>連接藍芽</div>-->
                <!--                    </div>-->
                <!--                    <div-->
                <!--                            class="weight-control-button"-->
                <!--                            @click="handleRestartNotification"-->
                <!--                            v-else-->
                <!--                    >-->
                <!--                        <div>重啟</div>-->
                <!--                    </div>-->
                <!--                    <div class="weight-control-button" @click="handleStopNotification">-->
                <!--                        <div>停止</div>-->
                <!--                    </div>-->
                <!--                    <div class="weight-control-button" @click="handleRecordWeight">-->
                <!--                        <div>輸出</div>-->
                <!--                    </div>-->
                <!--                    <div-->
                <!--                            class="weight-control-button"-->
                <!--                            @click="handleRecordWeightInterval"-->
                <!--                    >-->
                <!--                        <div>間段輸出</div>-->
                <!--                    </div>-->
                <!--                    <div class="weight-control-button" @click="handleRecordWeight">-->
                <!--                        <div>暫無</div>-->
                <!--                    </div>-->
                <!--                    <div class="weight-control-button" @click="handleRecordWeight">-->
                <!--                        <div>暫無</div>-->
                <!--                    </div>-->
                <!--                    <div class="weight-control-button" @click="handleRecordWeight">-->
                <!--                        <div>暫無</div>-->
                <!--                    </div>-->
                <!--                    <div class="weight-control-button" @click="handleRecordWeight">-->
                <!--                        <div>暫無</div>-->
                <!--                    </div>-->
                <!--                </div>-->

                <!--                <div class="log-wrapper">{{ log }}</div>-->
            </div>
            <!--藍芽連結成功提示-->
            <v-snackbar v-model="btConncet" :top="'top'" :color="btStatus ? 'success' : 'error'" :timeout="2500">
                {{btStatus ? '藍芽連結成功' : '連接中斷!'}}
                <template v-slot:action="{ attrs }">
                    <v-btn text v-bind="attrs" @click="btConncet = false">關閉</v-btn>
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
    </div>
</template>

<script>
    import PlusButton from "../../components/plusButton";
    import AddNumberDialog from "../../components/addNumberDialog";
    import OrderNumberDialog from "../../components/orderNumberDialog";
    import AccumulateDialog from "../../components/accumulateDialog";
    import LongPress from "vue-directive-long-press";
    import {UNIT} from "../../mixin/enums"

    const SERVICE_ID = "00004353-0000-1000-8000-00805f9b34fb";
    export default {
        components: {
            PlusButton,
            AddNumberDialog,
            OrderNumberDialog,
            AccumulateDialog
        },
        data() {
            return {
                items: ["台中大里第四儲存倉庫", "台中貨運儲存倉庫"],
                characteristic: null,
                addNumberShow: false,
                isActive: false,
                orderNumberShow: false,
                accumulateShow: false,
                textDisabled: false,
                btStatus: false,
                btDisabled: false,
                btConncet: false,
                gStatus: false,
                kgStatus: false,
                tkgStatus: false,
                valid: true,
                restPlusBtn: true,
                defaultValue: 0,
                list: [],
                lastValue: "0",
                displayValue: 113.685,
                changeValue: 0,
                accumulateValue: 0,
                log: "",
                today: "",
                orderName: "",
                position: "",
                orderNumber: "",
                addOrderNumber: "",
                btColor: "success",
                testText: "連接藍芽",
                commodityNumber: 1,
                count: 1,
                commodity: [],
                materialList: [],
                getUnusedList: [],
                addOrderForm: {},
                warehouseValidat: [
                    v => !!v || '請選擇倉庫'
                ],
            };
        },
        async created() {
            await this.$scale.Product.getProduct().then(res => {
                if (res.status === 200) {
                    this.commodity = res.data
                }
            })
        },
        mounted() {
            const formData = new FormData()
            formData.append("username", 'admin')
            formData.append("password", '123')
            this.$scale.Login.login(formData).then(res => {
                console.log(res);
            })
            this.changeUnit("kg");
            let today = new Date();
            this.today =
                today.getFullYear() +
                "-" +
                (today.getMonth() + 1) +
                "-" +
                today.getDate();
        },
        directives: {
            "long-press": LongPress
        },
        computed: {
            twTael () {
                let tael = this.changeValue.toFixed(3).toString().split('.')[1]
                let num = Math.floor(Number('0.'+tael) * 16)
                return num
            },
        },
        methods: {
            accumulate() {
                this.accumulateValue += this.displayValue
                this.displayValue = 0.000
                this.changeValue = 0.000
            },
            onLongPressStart() {
                this.accumulateShow = true;
            },
            changeUnit(value) {
                if (value === "kg") {
                    return (
                        (this.changeValue = this.displayValue),
                            (this.kgStatus = true),
                            (this.gStatus = false),
                            (this.tkgStatus = false)
                    );
                } else if (value === "tkg") {
                    return (
                        (this.changeValue = this.displayValue / 0.6),
                            (this.kgStatus = false),
                            (this.gStatus = false),
                            (this.tkgStatus = true)
                    );
                } else if (value === "g") {
                    return (
                        (this.changeValue = this.displayValue * 1000),
                            (this.kgStatus = false),
                            (this.gStatus = true),
                            (this.tkgStatus = false)
                    );
                }
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
            getAddOrderForm(form, addOrderNumber, name) {
                this.addOrderForm = form
                this.orderNumber = addOrderNumber
                this.orderName = name
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
            addClass(index) {
                this.position = index;
                this.restPlusBtn = false //切換標籤時reset組件
                this.$nextTick(() => { //切換標籤時reset組件
                    this.restPlusBtn = true
                })
                this.commodityNumber = 1 //切換標籤的時候數量歸1
                this.count = 1 //切換標籤的時候數量歸1
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
                // if (!status) {
                //     this.btStatus = status;
                //     this.testText = "連接藍芽";
                //     this.btColor = "primary";
                // }
            },
            getZero () {
              this.accumulateValue = 0
            },
            inboundPrint () {
                if (this.$refs.form.validate()) {
                    this.handleNotification()
                }
            },
            logout () {
              this.$router.push('/slogin')
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
                    await myCharacteristic.startNotifications();
                    this.characteristic = myCharacteristic;
                    this.appendLog("> Notifications started");
                    this.connectBt(true)
                    myCharacteristic.addEventListener(
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
                myCharacteristic.addEventListener(
                    "characteristicvaluechanged",
                    this.handleNotifications
                );
            },
            async handleStopNotification() {
                this.connectBt(false)
                if (this.characteristic) {
                    try {
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
                    this.displayValue = noti.toString("ascii");
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
        width: calc(17.05%);
        transition: 0.3s;
        box-shadow: 0 5px 8px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.2);
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
