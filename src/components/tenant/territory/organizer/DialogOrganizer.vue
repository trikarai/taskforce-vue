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
        <p class="text-capitalize">Client</p>
        <v-spacer></v-spacer>
        <v-btn icon color="error" @click="$emit('update:dialog', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-autocomplete
            label="Organization"
            :items="organizations.list"
            item-value="id"
            item-text="name"
            v-model="params.organizationId"
          ></v-autocomplete>
          <v-btn class="mr-2 mt-5" color="primary" @click="submit" :disabled="!valid">Assign</v-btn>
          <v-btn class="mt-5" @click="clear">clear</v-btn>
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
    isEdit: {
      type: Boolean,
      required: true
    },
    editId: {
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
      organizations: { total: 0, list: [] },
      params: {
        name: "",
        address: "",
        phone: "",
        coordinate: ""
      }
    };
  },
  watch: {},
  mounted() {
    this.getDataDetail();
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.addData();
      }
    },
    clear() {
      this.$refs.form.reset();
    },
    addData() {
      this.loading = true;
      this.axios
        .put(
          config.baseUri.api +
            "/admin/teritories/" +
            this.$route.params.territoryId +
            "/organizers",
          this.params,
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(() => {
          this.$emit("refresh");
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getDataDetail() {
      this.loading = true;
      this.axios
        .get(config.baseUri.api + "/admin/organizations", {
          headers: auth.getAuthHeader()
        })
        .then(res => {
          this.organizations = res.data.data;
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
