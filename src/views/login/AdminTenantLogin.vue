<template>
  <v-app>
    <v-container fluid id="loginpage">
      <v-row align="center" justify="center">
        <v-col xs="10" sm="8" md="4" lg="4" class="pertikal text-xs-center pa-0 elevation-6">
          <v-toolbar class="pt-0" color="primary">
            <v-toolbar-title class="white--text ml-2">
              <h4>
                login
                <v-chip color="#fafafa">
                  <span style="color:#777777;">Tenant</span>
                </v-chip>
              </h4>
            </v-toolbar-title>
            <v-toolbar-title class="ml-auto">
              <router-link v-bind:to="'/'">
                <v-icon class="white--text mb-2 ml-3">mdi-home</v-icon>
              </router-link>
            </v-toolbar-title>
          </v-toolbar>
          <v-card id="accentlg" style="padding:20px 30px 0px 30px;" class="text-center elevation-0">
            <v-card-text class="pa-8">
              <div>
                <v-form v-model="valid" ref="form">
                  <v-row>
                    <v-col>
                      <v-text-field
                        outlined
                        label="Incubator Identifier"
                        v-model="params.tenantCode"
                        :rules="rulesName"
                        prepend-icon="mdi-key"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        label="Email"
                        prepend-icon="mdi-email"
                        v-model="params.email"
                        autocomplete="email"
                        :rules="rulesEmail"
                        required
                        outlined
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        autocomplete="current-password"
                        label="Password"
                        prepend-icon="mdi-lock"
                        v-model="params.password"
                        min="8"
                        :append-icon="e1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="e1 ? 'password' : 'text'"
                        :rules="rulesPassword"
                        counter
                        required
                        outlined
                        @click:append="e1 = !e1"
                        v-on:keyup.enter="submit"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row justify-end class="mt-2">
                    <v-col class="mt-2"></v-col>
                    <v-btn
                      block
                      @click="submit"
                      :loading="loader"
                      :class=" { 'primary white--text' : valid}"
                      :disabled="!valid"
                      color="#e4e4e4"
                      style="color:#fff"
                    >Login</v-btn>
                  </v-row>
                </v-form>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script>
import bus from "@/config/bus";

import * as config from "@/config/config";
import { validationMixins } from "@/mixins/validationMixins";

export default {
  mixins: [validationMixins],
  name: "Login",
  data: function() {
    return {
      loader: false,
      response: "",
      valid: true,
      alert: false,
      e1: true,
      params: {
        tenantCode: "",
        email: "",
        password: ""
      },
      activate: false
    };
  },
  created: function() {},
  mounted: function() {},
  components: {},
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.login();
      }
    },
    login: function() {
      this.loader = true;
      var authUser = {};
      this.axios
        .post(config.baseUri.api + "/admin-login", this.params)
        .then(res => {
          this.$store.state.isLoggedIn = true;
          this.response = res.data.data;
          authUser.role = "ADMIN";
          authUser.data = res.data.data;
          authUser.token = res.data.credentials.token;
          authUser.valid_until = res.data.credentials.valid_until;
          window.localStorage.setItem("lbUser", JSON.stringify(authUser));

          this.$router.replace("/tenant/main");
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.loader = false;
        });
    },
    clear() {
      this.$refs.form.reset();
    }
  }
};
</script>
<style scoped>
#loginpage {
  /* background-image: url("https://picsum.photos/1080/720?grayscale"); */
  background-color: #e8e8e8;
  background-size: cover;
  background-position: center center;
  overflow: hidden;
  height: 100%;
}
#accentlg {
  position: relative;
}

#accentlg:before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  border-top: 20px solid #0f4c75;
  border-left: 20px solid #fff;
  width: 50%;
}
</style>

<style>
span.v-chip__content {
  margin: 0 auto;
}
.pertikal {
  /* position: absolute;
  top: 47%;
  left: 50%;
  transform: translate(-50%, -50%) */
  margin-top: calc(3% + 5px) !important;
}
</style>
