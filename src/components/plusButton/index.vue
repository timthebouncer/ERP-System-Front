<template>
    <ul class="counter">
        <p class="mb-1 commodityNumber">{{name}}</p>
        <li>
            <input type="button" @click="minuser" value="-"/>
        </li>
        <li style="width: 100%; height: 50px">
            <input class="numberCount" v-model="number" style="text-align: center"/>
        </li>
        <li>
            <input type="button" @click="adder" value="+"/>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "index",
        props: {
            name: String
        },
        data() {
            return {
                number: 0
            }
        },
        watch: {
            number(value) {
                this.number = value
                this.$emit('changeNumber', this.number, this.name)
            }
        },
        methods: {
            adder() {
                this.number++;
                this.$emit('changeNumber', this.number, this.name)
            },
            minuser() {
                if (this.number <= 0) {
                    this.number = 0;
                } else {
                    this.number--;
                    this.$emit('changeNumber', this.number, this.name)
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    ul, li {
        margin: 0;
        padding: 0;
    }
    .counter {
        width: 100%;
        display: flex;
        position: relative;

        li:nth-child(2n+1) {
            border-style: solid none;
        }

        li {
            list-style-type: none;
            width: 50px;
            height: 50px;
            text-align: center;
            line-height: 30px;
            border: #999 thin solid;
            background-color: #fff;

            input {
                font-size: 20px;
                width: 100%;
                height: 100%;
                outline: none;
                -webkit-appearance: none;
                background: none;
                margin: 0;
                padding: 0;
                border: 1px solid transparent;
                border-radius: 0;
            }
        }

        .commodityNumber {
            top: -60%;
            position: absolute;
        }
    }
</style>
