<template>
  <div class="container">
     <div class="title"><h2>盤點機登入</h2></div>
    <div class="login-panel">
      <div class="account">
        <v-text-field
          v-model="userAccount"
          label="帳號"
          placeholder="請輸入帳號"
          outlined
          hide-details
        ></v-text-field>
      </div>
      <div class="password">
        <v-text-field
          label="密碼"
          placeholder="請輸入密碼"
          outlined
          v-model="userPassword"
          :type="'password'"
          hide-details
          @change="loginHandler"
        ></v-text-field>
      </div>
      <div class="login-btn">
        <v-btn elevation="2" outlined text @click="loginHandler">登入</v-btn>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "LoginPage",
  data() {
    return {
      userAccount: "",
      userPassword: ""
    };
  },
  created () {
    if (sessionStorage.getItem('username')){
      this.userAccount = sessionStorage.getItem('username')
    }
    // if(sessionStorage.getItem('token') === '200'){
    //   this.$router.push("/sales");
    // }
  },
  methods: {
    loginHandler() {
      const formData = new FormData();
      formData.append("username", this.userAccount);
      formData.append("password", this.userPassword);
      this.$api.Login.userLogin(formData)
        .then((res) => {
          sessionStorage.setItem('token', res.data.code);
          this.$router.push("/");
        })
        .catch(() => {
          console.log("fail");
        });
    }
  }
};
</script>
<style scoped>
.container {
  background: linear-gradient(to bottom right, #46aae6, #71bac3);
  /*background: linear-gradient(to bottom right, #c2c2c2 , #ea8888);*/
  height: 100%;
}
.title{
    margin-left: 100px;
}
.login-panel {
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.account {
  width: 200px;
  background-color: #fff;
  margin-bottom: 30px;
  border-radius: 5px;
  border: unset;
}
.password {
  background-color: #fff;
  width: 200px;
  margin-bottom: 100px;
  border-radius: 5px;
  border: unset;
}
.login-btn {
  background-color: #fff;
}
</style>
