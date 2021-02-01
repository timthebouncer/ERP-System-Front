<template>
  <div>
    <div class="container">
      <div class="weight-wrap">
        <h2>藍芽磅秤</h2>
        <div class="weight-scale">
          <div>{{ displayValue }}</div>
        </div>
        <div class="weight-list">
          <div v-for="(item, index) in list" :key="index">{{ item }}</div>
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
  </div>
</template>

<script>
const SERVICE_ID = '00004353-0000-1000-8000-00805f9b34fb'
export default {
  data() {
    return {
      characteristic: null,
      list: [],
      lastValue: '00.00',
      displayValue: '00.00',
      log: '',
    }
  },
  methods: {
    appendLog(text) {
      this.log = this.log + '\n' + text
    },
    async handleNotification() {
      try {
        const serviceUuid = '0000ffe0-0000-1000-8000-00805f9b34fb'
        const characteristicUuid = '0000ffe1-0000-1000-8000-00805f9b34fb'
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ services: [SERVICE_ID] }],
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
  margin: 20px;
  width: calc(100% - 40px);
  height: calc(100vh - 40px);
  display: flex;
  align-items: center;
  flex-direction: column;
  // flex-wrap: wrap;
}
.log-wrapper {
  flex: 1;
  white-space: pre-wrap;
  background: #c2c2c2;
  padding: 20px;
  white-space: pre-line;
}
.weight-wrap {
  position: relative;
  background: #00cc92;
  padding: 20px;
  padding-bottom: 40px;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 35px;
}
.weight-list {
  position: absolute;
  right: 20px;
}
.weight-scale {
  width: 300px;
  height: 300px;
  border: 5px solid #fff;
  border-radius: 50%;
  position: relative;
  div {
    white-space: nowrap;
    font-size: 74px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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