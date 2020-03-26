module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",

  transpileDependencies: ["vuetify"],

  pwa: {
    name: "TaskForce",
    themeColor: "#249c90",
    manifestOptions: {
      background_color: "#249C90"
    },
    msTileColor: "#121212",
    workboxOptions: {
      // skipWaiting: true,
      swSrc: "./src/sw.js",
      swDest: "service-worker.js"
    },
    workboxPluginMode: "InjectManifest"
  }
};
