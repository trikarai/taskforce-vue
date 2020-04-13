<template>
  <v-dialog
    v-model="dialog"
    scrollable
    fullscreen
    persistent
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card :loading="loadingTerritories">
      <v-card-title>
        <p class="text-capitalize">survey Target</p>
        <v-spacer></v-spacer>
        <v-btn icon color="error" @click="$emit('update:dialog', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col lg="4">
            <v-text-field label="Search" v-model="search" outlined dense></v-text-field>
          </v-col>
          <v-col lg="12">
            <v-data-table
              :search="search"
              v-model="selected"
              :headers="headers"
              :items="territories.list"
              class="elevation-1"
              :loading="loadingTerritories"
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
      loadingTerritories: false,
      territories: { total: 0, list: [] },
      selected: [],
      params: [],
      headers: [
        { text: "Name", value: "name", sortable: false },
        { text: "", value: "action", sortable: false, align: "right" }
      ]
    };
  },
  mounted() {
    this.getManageableTerritories();
  },
  methods: {
    getManageableTerritories() {
      this.loadingTerritories = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.$store.getters.getOrganizationId +
            "/manageable-teritories",
          { headers: auth.getAuthHeader() }
        )
        .then(res => {
          this.territories = res.data.data;
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.loadingTerritories = false;
        });
    },
    submit() {
      if (this.selected.length !== 0) {
        this.addData();
      } else {
        bus.$emit("callNotif", "info", "No Territory Selected");
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
            "/survey-targets",
          params,
          { headers: auth.getAuthHeader() }
        )
        .then(() => {
          bus.$emit("callNotif", "success", "Survey Target Submitted");
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
        params.push(element.id);
      });
      return params;
    }
  }
};
</script>

<style>
</style>
