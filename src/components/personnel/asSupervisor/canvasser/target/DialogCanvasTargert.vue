<template>
  <v-dialog
    v-model="dialog"
    scrollable
    fullscreen
    persistent
    :overlay="false"
    max-width="600px"
    transition="dialog-transition"
  >
    <v-card :loading="loadingClient">
      <v-card-title>
        <p class="text-capitalize">Canvass Target</p>
        <v-spacer></v-spacer>
        <v-btn icon color="error" @click="$emit('update:dialog', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" lg="4" md="4" sm="6" xs="12">
            <v-text-field label="Search" v-model="search" outlined dense></v-text-field>
          </v-col>
          <v-col cols="12" lg="12">
            <v-data-table
              :search="search"
              v-model="selected"
              :headers="headers"
              :items="clients.list"
              class="elevation-1"
              :loading="loadingClient"
              show-select
              :single-select="false"
            ></v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn :loading="loading" @click="submit" color="primary">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";

export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {
      search: "",
      loading: false,
      loadingClient: false,
      selected: [],
      params: [],
      clients: { total: 0, list: [] },
      headers: [
        { text: "Name", value: "name", sortable: false },
        { text: "", value: "action", sortable: false, align: "right" }
      ]
    };
  },
  mounted() {
    this.getManageableClients();
  },
  methods: {
    getManageableClients() {
      this.loadingClient = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.$store.getters.getOrganizationId +
            "/manageable-clients",
          { headers: auth.getAuthHeader() }
        )
        .then(res => {
          this.clients = res.data.data;
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.loadingClient = false;
        });
    },
    submit() {
      if (this.selected.length !== 0) {
        this.addData();
      } else {
        bus.$emit("callNotif", "info", "No Client Selected");
      }
    },
    addData() {
      var params = this.refactorParams();
      this.params = params;
      this.loading = true;
      this.axios
        .post(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.$store.getters.getOrganizationId +
            "/assignment-plans/" +
            this.$route.params.planId +
            "/canvassers/" +
            this.$route.params.canvasserId +
            "/canvass-targets",
          params,
          { headers: auth.getAuthHeader() }
        )
        .then(() => {
          bus.$emit("callNotif", "success", "Canvass Target Submitted");
          this.$emit("refreshParent");
        })
        .catch(err => {
          bus.$emit("callNotif", "error", err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    refactorParams() {
      var params = [];
      this.selected.forEach(element => {
        params.push({ teritoryId: element.teritory.id, clientId: element.id });
      });

      return params;
    }
  }
};
</script>

<style>
</style>
