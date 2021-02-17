<template>
    <v-row justify="center">
        <v-dialog v-model="show" persistent max-width="400">
            <v-card>
                <v-toolbar flat>
                    <v-spacer></v-spacer>
                    <v-btn icon x-large @click="cancel">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-title class="headline" />
                <v-card-text class="pb-15" style="text-align: center">
                    <p style="font-size: 22px;">累加重量 : {{kg}} 公斤</p>
                    <v-btn class="mt-5" x-large color="primary" style="width: 240px" @click="getZero">歸零</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!--重量歸零成功提示-->
        <v-snackbar
                v-model="snackbar"
                :top="'top'"
                :color="'success'"
                :timeout="2500"
        >
            {{'重量已歸零'}}
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
            show: Boolean,
            kg: Number
        },
        data () {
            return {
                snackbar: false,
                loading: false,
                valid: true
            }
        },
        methods: {
            getZero () {
                this.snackbar = true
            },
            async submit () {
                this.$emit('close')
            },
            cancel () {
                this.$emit('close')
            }
        }
    }
</script>

<style scoped>

</style>
