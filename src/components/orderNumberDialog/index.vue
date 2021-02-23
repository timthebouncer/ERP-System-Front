<template>
    <v-row justify="center">
        <v-dialog v-model="show" persistent max-width="900">
            <v-card>
                <v-toolbar flat class="mb-8">
                    <v-toolbar-title class="mt-8 ml-4" style="font-size: 28px;">入料單號</v-toolbar-title>
                </v-toolbar>
                <v-data-table
                        v-model="selected"
                        item-key="number"
                        :headers="headers"
                        :items="getUnusedList"
                        :options.sync="options"
                        :footer-props="{ itemsPerPageText: '每頁顯示筆數' }"
                        @click:row="handleRow"
                        hide-default-footer
                >
                </v-data-table>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn large text @click="cancel">取消</v-btn>
                    <v-btn large :loading="loading" text @click="submit">確定</v-btn>
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
            show: Boolean,
            getUnusedList: Array
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
                        text: '入料單號',
                        align: 'center',
                        sortable: false,
                        value: 'number',
                    },
                    { text: '物料名稱', value: 'name', align: 'center', },
                    { text: '物料數量', value: 'count', align: 'center', },
                    { text: '屠體重量(公斤)', value: 'carcassWeight', align: 'center', },
                    { text: '毛雞重量(公斤)', value: 'livingWeight', align: 'center', }
                ],
                options:{
                    itemsPerPage: 500,
                }
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
                this.currentObj = {}
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
    .v-dialog > .v-card > .v-card__actions {
        position: sticky;
        bottom: 0;
        z-index: 999;
        background-color: #fff;
    }
    .v-data-table >>> th,
    .v-data-table >>> td {
        font-size: 18px !important;
    }
</style>
