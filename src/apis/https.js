import axios from "axios";
import router from "../router";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  headers: {
    // "Content-Type": "application/json"
  },
  timeout: 60000 // request timeout
});

service.interceptors.request.use(
  function(config) {
    // if (sessionStorage.getItem("token")) {
    //     config.headers["X-XSRF-TOKEN"] = sessionStorage.getItem("token");
    // }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    console.log(error, "res error");
    const { status } = error.response;
    if (status === 403 || status === 401) {
      window.sessionStorage.removeItem("token");
      router.replace("/login");
    }
    return Promise.reject(error)
  }
);

export default service;
