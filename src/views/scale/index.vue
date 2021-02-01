<template>
    <div>
        <div class="container">
            <div class="top mb-5 mt-3 pa-3">
                <div class="title d-flex align-center">
                    <span class="inbound">入庫作業</span>
                    <span class="work-date">工作日期 : {{today}}</span>
                </div>
                <div class="btn d-flex align-center">
                    <v-btn class="mr-4" large depressed color="primary" @click="showAddNumberDialog(true)">
                        +新增單號
                    </v-btn>
                    <v-btn class="mr-10" large depressed color="error">
                        取消入庫
                    </v-btn>
                    <div class="staffName">
                        <span>Jennifer Lopez</span>
                        <v-btn class="ml-2" icon>
                            <v-icon large>mdi-exit-to-app</v-icon>
                        </v-btn>
                    </div>
                </div>
            </div>
            <div class="mid d-flex">
                <div class="weight-wrap">
                    <div class="weight-scale">
                        <div>{{ displayValue }}</div>
                    </div>
                    <div class="weight-list">
                        <div v-for="(item, index) in list" :key="index">{{ item }}</div>
                    </div>
                    <div class="d-flex">
                        <v-btn x-large @click="changeUnit('kg')">
                            公斤
                        </v-btn>
                        <v-btn x-large class="mx-2" @click="changeUnit('tkg')">
                            斤/兩
                        </v-btn>
                        <v-btn x-large @click="changeUnit('g')">
                            公克
                        </v-btn>
                    </div>
                    <div class="d-flex" style="margin: 45px 0 -102px 0">
                        <v-btn text large style="border: 1px solid #666; height: 52px">累加(公斤) 100</v-btn>
                        <v-btn class="mx-2" x-large>扣重</v-btn>
                        <v-btn x-large>歸零</v-btn>
                    </div>
                </div>
                <div class="ma-3 pl-5">
                    <v-row align="center">
                        <v-col class="d-flex" cols="12" sm="6" md="6">
                            <v-text-field v-model="orderNumber" readonly append-icon="mdi-menu-down" label="入庫單號 :" @click="showOrderNumberDialog(true)"/>
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="6" md="6">
                            <v-text-field disabled label="物料名稱 :"/>
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="6" md="6">
                            <v-text-field disabled label="物料數量 :"/>
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="6" md="6">
                            <v-text-field disabled label="屠體重量(公斤) :"/>
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="6" md="6">
                            <v-text-field disabled label="毛雞重量(公斤) :"/>
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="6" md="6">
                            <v-select :items="items" label="儲存倉庫 :"/>
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="6" md="6">
                            <PlusButton
                                    :name="'商品序號'"
                                    @changeNumber="changeNumber"
                            />
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="6" md="6">
                            <PlusButton
                                    :name="'數量'"
                                    @changeNumber="changeNumber"
                            />
                        </v-col>
                    </v-row>
                </div>
                <div class="mid-btn mx-5 mt-10">
                    <v-btn class="reprint-label">
                        重印標籤
                    </v-btn>
                    <v-btn class="print mt-13">
                        入庫列印
                    </v-btn>
                </div>
            </div>
            <div class="weight-control">
                <div class="weight-btn-bar">
                    <div
                            class="weight-control-button"
                            @click="handleNotification"
                            v-if="!characteristic"
                    >
                        <div>連接藍芽</div>
                    </div>
                    <div
                            class="weight-control-button"
                            @click="handleRestartNotification"
                            v-else
                    >
                        <div>重啟</div>
                    </div>
                    <div class="weight-control-button" @click="handleStopNotification">
                        <div>停止</div>
                    </div>
                    <div class="weight-control-button" @click="handleRecordWeight">
                        <div>輸出</div>
                    </div>
                    <div
                            class="weight-control-button"
                            @click="handleRecordWeightInterval"
                    >
                        <div>間段輸出</div>
                    </div>
                    <div class="weight-control-button" @click="handleRecordWeight">
                        <div>暫無</div>
                    </div>
                    <div class="weight-control-button" @click="handleRecordWeight">
                        <div>暫無</div>
                    </div>
                    <div class="weight-control-button" @click="handleRecordWeight">
                        <div>暫無</div>
                    </div>
                    <div class="weight-control-button" @click="handleRecordWeight">
                        <div>暫無</div>
                    </div>
                </div>

                <div class="log-wrapper">{{ log }}</div>
            </div>
        </div>
        <AddNumberDialog :show="this.addNumberShow" @close="closeAddNumberDialog"/>
        <OrderNumberDialog :show="this.orderNumberShow" @getOrderNumber="getOrderNumber" @close="closeOrderNumberDialog"/>
    </div>
</template>

<script>
    import PlusButton from '../../components/plusButton'
    import AddNumberDialog from '../../components/addNumberDialog'
    import OrderNumberDialog from '../../components/orderNumberDialog'
    const SERVICE_ID = '00004353-0000-1000-8000-00805f9b34fb'
    export default {
        components: {
            PlusButton,
            AddNumberDialog,
            OrderNumberDialog
        },
        data() {
            return {
                items: ['1', '2'],
                characteristic: null,
                addNumberShow: false,
                orderNumberShow: false,
                list: [],
                lastValue: '0',
                displayValue: 0.00,
                log: '',
                today: '',
                orderNumber: '',
                commodityNumber: 0,
                count: 0

            }
        },
        mounted() {
            let today = new Date();
            this.today = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
        },
        methods: {
            changeUnit (value) {
                if (value === 'kg') {
                    return
                } else if (value === 'tkg') {
                    return
                }else if (value === 'g')  {
                    return
                }
            },
            showAddNumberDialog (show) {
                this.addNumberShow = show
            },
            closeAddNumberDialog () {
                this.addNumberShow = false
            },
            showOrderNumberDialog (show) {
                this.orderNumberShow = show
            },
            closeOrderNumberDialog () {
                this.orderNumberShow = false
            },
            getOrderNumber (value) {
                this.orderNumber = value.name
            },
            changeNumber (value, name) {
                if (name === '商品序號') {
                    this.commodityNumber = value
                } else {
                    this.count = value
                }
            },
            appendLog(text) {
                this.log = this.log + '\n' + text
            },
            async handleNotification() {
                try {
                    const serviceUuid = '0000ffe0-0000-1000-8000-00805f9b34fb'
                    const characteristicUuid = '0000ffe1-0000-1000-8000-00805f9b34fb'
                    const device = await navigator.bluetooth.requestDevice({
                        filters: [{services: [SERVICE_ID]}],
                        optionalServices: [serviceUuid],
                    })
                    const server = await device.gatt.connect()
                    this.appendLog('Getting Service...')
                    const service = await server.getPrimaryService(serviceUuid)
                    this.appendLog('Getting Characteristic...')
                    let myCharacteristic = await service.getCharacteristic(
                        characteristicUuid
                    )
                    await myCharacteristic.startNotifications()
                    this.characteristic = myCharacteristic
                    this.appendLog('> Notifications started')
                    myCharacteristic.addEventListener(
                        'characteristicvaluechanged',
                        this.handleNotifications
                    )
                } catch (e) {
                    this.appendLog(e)
                }
            },
            async handleRestartNotification() {
                let myCharacteristic = this.characteristic
                await myCharacteristic.startNotifications()
                this.characteristic = myCharacteristic
                this.appendLog('> Notifications started')
                myCharacteristic.addEventListener(
                    'characteristicvaluechanged',
                    this.handleNotifications
                )
            },
            async handleStopNotification() {
                if (this.characteristic) {
                    try {
                        await this.characteristic.stopNotifications()
                        this.appendLog('> Notifications stopped')
                        this.characteristic.removeEventListener(
                            'characteristicvaluechanged',
                            this.handleNotifications
                        )
                    } catch (error) {
                        this.appendLog('Argh! ' + error)
                    }
                }
            },
            handleNotifications(event) {
                let noti = Buffer.from(event.target.value.buffer)
                if (!(this.lastValue == noti.toString('ascii'))) {
                    this.lastValue = noti.toString('ascii')
                    this.displayValue = noti.toString('ascii')
                }
            },
            handleRecordWeightInterval() {
                setInterval(() => {
                    this.handleRecordWeight()
                }, 5000)
            },
            handleRecordWeight() {
                let array = this.list
                array.push(this.lastValue)
                this.list = array
            },
        },
    }
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

    .container {
        width: calc(100% - 20px);
        height: calc(100vh - 20px);
        /*display: flex;*/
        /*align-items: center;*/
        /*flex-direction: column;*/
        /*flex-wrap: wrap;*/
        .top {
            display: flex;
            justify-content: space-between;
            /*background-color: cornflowerblue;*/
            border-bottom: 0.8px solid rgba(0, 0, 0, .4);

            .title {
                font-weight: normal;

                .inbound {
                    font-size: 40px;
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
            width: 40%;
            height: 240px;
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
            width: 300px;
            height: 300px;
            /*border: 5px solid #fff;*/
            /*border-radius: 50%;*/
            position: relative;

            div {
                white-space: nowrap;
                font-size: 74px;
                position: absolute;
                top: 20%;
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
        flex: 1;
        color: #444;
        padding-top: 40px;
        // padding: 30px 0;
        display: flex;
    }

    .weight-btn-bar {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: flex-start;

        > div {
            margin: 12px;
        }
    }

    .weight-control-button {
        cursor: pointer;
        width: calc(20% + 8px);
        padding-top: calc(20% + 8px);
        position: relative;
        @include center;
        background: #fff;
        box-shadow: 0px 0 2px rgba(0, 0, 0, 0.16);
        font-size: 24px;
        font-weight: bold;

        > div {
            width: 100%;
            text-align: center;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
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
</style>
