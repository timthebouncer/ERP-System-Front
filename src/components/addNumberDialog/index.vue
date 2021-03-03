<template>
    <v-row justify="center">
        <v-dialog v-model="show" persistent max-width="400">
            <v-card>
                <v-toolbar flat>
                    <v-toolbar-title>新增入料</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="mt-8">
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-text-field v-model="addOrderNumber" label="入料單號" disabled />
                        <v-select v-model="material" :items="materialList" return-object item-text="name" item-value="id" label="*物料名稱"/>
                        <v-text-field v-model="orderForm.count" label="*物料數量" type="number"/>
                        <v-text-field v-model="kg" label="屠體重量(公斤)" disabled />
                        <v-text-field v-model="orderForm.livingWeight" label="毛雞重量(公斤)" type="number" />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="loading" text @click="cancel">取消</v-btn>
                    <v-btn :loading="loading" text @click="submit">確定</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!--新增成功提示-->
        <v-snackbar
                v-model="snackbar"
                :top="'top'"
                :color="deleteText ? 'error' : 'success'"
                :timeout="2500"
        >
            <h3>{{deleteText ? deleteText : '新增成功'}}</h3>
            <template v-slot:action="{ attrs }">
                <v-btn
                        text
                        v-bind="attrs"
                        @click="snackbar = false"
                >
                    <h3>關閉</h3>
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
            kg: Number,
            materialList: Array,
            addOrderNumber: String
        },
        data () {
            return {
                snackbar: false,
                loading: false,
                valid: true,
                deleteText: '',
                count: '',
                livingWeight: '',
                material: {id: '', name: ''},
                orderForm: {
                    materialId: '',
                    count: '',
                    carcassWeight: '',
                    livingWeight: ''
                }
            }
        },
        methods: {
            async submit () {
                if(this.material.id === '') {
                    return this.snackbar = true, this.deleteText = '請選擇物料名稱'
                }
                if(this.orderForm.count === '') {
                    return this.snackbar = true, this.deleteText = '請填寫物料數量'
                }
                this.orderForm.materialId = this.material.id
                this.orderForm.carcassWeight = this.kg
                await this.$scale.DepotOrder.addOrder(this.orderForm).then(res => {
                    this.loading = true
                    if(res.status === 200){
                        this.$emit('getAddOrderForm', this.orderForm, this.addOrderNumber, this.material.name)
                        this.$emit('close')
                        this.orderForm={
                            materialId: '',
                            count: '',
                            carcassWeight: '',
                            livingWeight: ''
                        }
                        this.material = {id: '', name: ''}
                        this.loading = false
                    }
                })
            },
            cancel () {
                this.$emit('close')
                this.orderForm={
                    materialId: '',
                    count: '',
                    carcassWeight: '',
                    livingWeight: ''
                }
                this.material = {id: '', name: ''}
            }
        }
    }
</script>

<style scoped>
    .v-text-field >>> input {
        font-size: 20px;
    }
</style>
