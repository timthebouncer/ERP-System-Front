<template>
    <v-row justify="center">
        <v-dialog v-model="show" persistent max-width="400" max-height="200">
            <v-card>
                <v-toolbar class="pb-0" flat>
                    <v-spacer></v-spacer>
                    <v-btn icon x-large @click="cancel">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-title class="headline" />
                <v-card-text class="pb-6" style="text-align: center">
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-text-field v-model="ip" outlined label="請輸入IP" :rules="ipValidate"/>
                    </v-form>
                    <v-btn x-large color="primary" style="width: 120px" @click="submit">確定</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
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
                loading: false,
                valid: true,
                ip: '',
                ipValidate:[
                    v => !!v || '請填寫IP'
                ]
            }
        },
        methods: {
            async submit () {
                if (this.$refs.form.validate()) {
                    this.$emit('close', this.ip)
                }
            },
            cancel () {
                this.$emit('close')
            }
        }
    }
</script>

<style scoped>

</style>
