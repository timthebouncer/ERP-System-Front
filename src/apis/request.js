import axios from "axios";
import router from "../router";

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 60000 // request timeout
});

service.interceptors.request.use(
    function(config) {
        config.headers["X-XSRF-TOKEN"] = sessionStorage.getItem("token");
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
        return Promise.reject(error);
    }
);

export default service;
