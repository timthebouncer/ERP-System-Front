<template>
    <v-row justify="center">
        <v-dialog v-model="show" persistent max-width="400">
            <v-card>
                <v-toolbar flat>
                    <v-toolbar-title>新增入料</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="mt-8">
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-text-field label="入料單號" disabled />
                        <v-select :items="items" label="物料名稱"/>
                        <v-text-field label="物料數量" type="number" />
                        <v-text-field label="屠體重量(公斤)" disabled />
                        <v-text-field label="毛雞重量(公斤)" type="number" />
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
            {{deleteText ? deleteText : '新增成功'}}
            <template v-slot:action="{ attrs }">
                <v-btn
                        text
                        v-bind="attrs"
                        @click="snackbar = false"
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
                items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
                snackbar: false,
                loading: false,
                valid: true,
                deleteText: ''
            }
        },
        methods: {
            async submit () {
                this.$emit('close')
                // await this.$api.Customer.deleteCustomer({contractId: this.current.contractId}).then(res => {
                //     this.loading = true
                //     if (res.data.status) {
                //         this.$emit('close')
                //     }
                // }).catch(err => {
                //     if (err.response.data.message) {
                //         this.loading = false
                //         this.snackbar = true
                //         this.deleteText = err.response.data.message
                //     }
                // })
            },
            cancel () {
                this.$emit('close')
            }
        }
    }
</script>

<style scoped>

</style>
