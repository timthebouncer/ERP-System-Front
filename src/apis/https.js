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
    const {status} = error.response
    if(status === 403 || status === 401)
      router.replace('/')
    // const { message } = error.response.data;
    // if (error.response.data.data.error === "Forbidden") {
    //     window.sessionStorage.removeItem("userData");
    //     window.sessionStorage.removeItem("token");
    //     window.sessionStorage.setItem("timeOut", true);
    //     router.push({ name: "Login" });
    // }

    // switch (message) {
    //     case "AUTH001":
    //     case "AUTH002":
    //         window.sessionStorage.removeItem("userData");
    //         window.sessionStorage.removeItem("token");
    //         if (router.currentRoute.name !== "Login") {
    //             router.push({ name: "Login" });
    //         }
    //         break;
    // }
    return Promise.reject(error);
  }
);

export default service;
