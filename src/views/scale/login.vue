<template>
  <v-main>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="4" md="4">
          <v-card class="elevation-12" height="420">
            <v-toolbar dark flat>
              <v-toolbar-title>磅秤機系統</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <v-col class="mt-6" cols="12" sm="12">
                    <v-text-field
                      v-model="model.username"
                      label="帳號"
                      name="login"
                      prepend-icon="mdi-account"
                      type="text"
                      required
                      :rules="accountValid"
                      @keyup.enter="login"
                    ></v-text-field>

                    <v-text-field
                      class="mt-6"
                      id="password"
                      v-model="model.password"
                      label="密碼"
                      name="password"
                      prepend-icon="mdi-lock"
                      type="password"
                      required
                      :rules="passwordValid"
                      @keyup.enter="login"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-col style="display: flex; justify-content: center">
                <v-btn
                  :loading="loading"
                  class="mt-2"
                  @click="login"
                  width="200"
                  height="45"
                >
                  <span v-if="!loading">登入</span>
                  <span v-else>登入中...</span>
                </v-btn>
              </v-col>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <!--帳號密碼錯誤提示-->
      <v-snackbar
        v-model="snackbar"
        :top="'top'"
        :color="errorText ? 'error' : 'success'"
        :timeout="3000"
      >
        <h3>{{ errorText }}</h3>
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar = false">
            <h3>關閉</h3>
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      model: {
        username: "",
        password: ""
      },
      loading: false,
      snackbar: false,
      valid: true,
      today: '',
      accountValid: [v => !!v || "請填寫帳號"],
      passwordValid: [v => !!v || "請填寫密碼"],
      errorText: "帳號密碼錯誤"
    };
  },
  mounted() {
    let today = new Date();
    this.today =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1 < 10 ? "0" : "") +
            (today.getMonth() + 1) +
            "-" +
            (today.getDate() < 10 ? "0" : "") +
            today.getDate();
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        const formData = new FormData();
        formData.append("username", this.model.username);
        formData.append("password", this.model.password);
        await this.$scale.Login.login(formData)
          .then(res => {
            if (res.status === 200) {
              //登入成功後如果今日日期與上次操作日期不同則清空localStorage
              if(localStorage.getItem("time") !== this.today){
                localStorage.removeItem("addOrderForm");
                localStorage.removeItem("orderNumber");
                localStorage.removeItem("orderName");
                localStorage.removeItem("depot");
              }
              sessionStorage.setItem("token", res.data.code);
              sessionStorage.setItem("userName", res.data.user);
              this.loading = false;
              this.$router.push("/");
            }
          })
          .catch(err => {
            if (err.response.data.msg) {
              this.errorText = err.response.data.msg;
              this.snackbar = true;
              this.loading = false;
            }
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
