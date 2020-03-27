<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    :overlay="true"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card :loading="loading">
      <v-card-title>
        <p class="text-capitalize">Sys Admin</p>
        <v-spacer></v-spacer>
        <v-btn icon color="error" @click="$emit('update:dialog', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-text-field
            label="Name"
            v-model="params.name"
            :rules="rulesName"
            :counter="10"
            required
          ></v-text-field>
          <v-text-field label="E-mail" v-model="params.email" :rules="rulesEmail" required></v-text-field>
          <v-text-field
            autocomplete="new-password"
            type="password"
            label="Password"
            v-model="params.password"
            :rules="rulesPassword"
            required
          ></v-text-field>
          <v-btn class="mr-2" color="primary" @click="submit" :disabled="!valid">submit</v-btn>
          <v-btn @click="clear">clear</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { validationMixins } from "@/mixins/validationMixins";
import bus from "@/config/bus";
import auth from "@/config/auth";
import * as config from "@/config/config";

export default {
  mixins: [validationMixins],
  props: {
    adminId: {
      type: String,
      required: false
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      valid: false,
      loading: false,
      params: {
        name: "",
        email: "",
        password: ""
      }
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.addAdmin();
      }
    },
    clear() {
      this.$refs.form.reset();
    },
    addAdmin() {
      this.loading = true;
      this.axios
        .post(config.baseUri.api + "/sys-admin/sys-admins", this.params, {
          headers: auth.getAuthHeader()
        })
        .then(() => {
          this.$emit("refresh");
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
