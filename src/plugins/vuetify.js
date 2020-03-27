import Vue from "vue";
import Vuetify from "vuetify/lib";
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader

// Themes selector
import baraTheme from "./themes/baraTheme";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi"
  },
  dark: false,
  theme: {
    themes: baraTheme,
    options: {
      customProperties: true
    }
  }
});
