<template>
    <v-row justify="center">
        <v-dialog v-model="show" persistent max-width="800">
            <v-card>
                <v-toolbar flat>
                    <v-toolbar-title>入庫單號</v-toolbar-title>
                </v-toolbar>
                <v-data-table
                        v-model="selected"
                        :headers="headers"
                        :items="desserts"
                        item-key="name"
                        class="elevation-1"
                        :footer-props="{ itemsPerPageText: '每頁顯示筆數' }"
                        @click:row="handleRow"
                >
                </v-data-table>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="loading" text @click="cancel">取消</v-btn>
                    <v-btn :loading="loading" text @click="submit">確定</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!--未選擇單號提示-->
        <v-snackbar
                v-model="noChoose"
                :top="'top'"
                :color="'error'"
                :timeout="2500"
        >
            {{'請選擇入庫單號'}}
            <template v-slot:action="{ attrs }">
                <v-btn
                        text
                        v-bind="attrs"
                        @click="noChoose = false"
                >
                    關閉
                </v-btn>
            </template>
        </v-snackbar>
    </v-row>
</template>

<script>
    export default {
        name: 'index',
        props: {
            show: Boolean
        },
        data () {
            return {
                snackbar: false,
                loading: false,
                noChoose: false,
                valid: true,
                currentObj: {},
                deleteText: '',
                selected: [],
                headers: [
                    {
                        text: '入庫單號',
                        align: 'center',
                        sortable: false,
                        value: 'name',
                    },
                    { text: '物料名稱', value: 'calories', align: 'center', },
                    { text: '物料數量', value: 'fat', align: 'center', },
                    { text: '屠體重量(公斤)', value: 'carbs', align: 'center', },
                    { text: '毛雞重量(公斤)', value: 'protein', align: 'center', }
                ],
                desserts: [
                    {
                        name: '210024584',
                        calories: 159,
                        fat: 6.0,
                        carbs: 24,
                        protein: 5
                    },
                    {
                        name: '225845541',
                        calories: 237,
                        fat: 9.0,
                        carbs: 37,
                        protein: 6
                    },
                    {
                        name: '2358477741',
                        calories: 262,
                        fat: 16.0,
                        carbs: 23,
                        protein: 7
                    },
                    {
                        name: '2458477741',
                        calories: 305,
                        fat: 3.7,
                        carbs: 67,
                        protein: 8
                    },
                    {
                        name: '2558477741',
                        calories: 356,
                        fat: 16.0,
                        carbs: 49,
                        protein: 9
                    },
                    {
                        name: '2658477741',
                        calories: 375,
                        fat: 0.0,
                        carbs: 94,
                        protein: 10
                    },
                    {
                        name: '2758477741',
                        calories: 392,
                        fat: 0.2,
                        carbs: 98,
                        protein: 11
                    },
                    {
                        name: '2858477741',
                        calories: 392,
                        fat: 0.2,
                        carbs: 98,
                        protein: 11
                    },
                    {
                        name: '2958477741',
                        calories: 392,
                        fat: 0.2,
                        carbs: 98,
                        protein: 11
                    }
                ],
            }
        },
        methods: {
            async submit () {
                if (this.currentObj.name === undefined) {
                    return this.noChoose = true
                }
                this.$emit('getOrderNumber', this.currentObj)
                document.getElementsByClassName('v-dialog--active')[0].scrollTop = 0
                this.$emit('close')
            },
            cancel () {
                document.getElementsByClassName('v-dialog--active')[0].scrollTop = 0
                this.$emit('close')
            },
            handleRow(value) {
                this.currentObj = value
            }
        }
    }
</script>

<style scoped>

</style>
