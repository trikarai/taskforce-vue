import Vue from "vue";
import Vuetify from "vuetify/lib";

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
