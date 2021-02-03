module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      "/erp": {
        target: "http://172.16.10.212:8194",
        changeOrigin: true
      }
    }
  }
};
