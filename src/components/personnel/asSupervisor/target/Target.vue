<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="4" md="12" sm="12">
        <v-text-field v-model="search" label="Search Client by Name" outlined></v-text-field>
      </v-col>
      <v-col cols="12" lg="12" md="12" sm="12">
        <v-data-table
          :loading="loadingData"
          :headers="headers"
          :items="clients.list"
          class="elevation-1"
          :search="search"
          show-select
          v-model="selected"
          :single-select="false"
        >
          <template v-slot:item.fieldWorkers="{item}">
            <template v-for="fieldWorker in item.canvassTargets">
              <span :key="fieldWorker.id">{{fieldWorker.canvasser.fieldWorker.name}} </span>
            </template>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" lg="4">
        <v-select
          :loading="loadingCanvasser"
          :items="canvassers.list"
          item-text="fieldWorker.name"
          item-value="id"
          v-model="canvasserId"
          label="Assign to"
          outlined
        ></v-select>
      </v-col>
      <v-col cols="12" lg="12">
        <v-btn :disabled="canvasserId === ''" color="primary" @click="submit">Submit</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";

export default {
  data() {
    return {
      search: "",
      loadingData: false,
      loadingCanvasser: false,
      clients: { total: 0, list: [] },
      selected: [],
      canvassers: { total: 0, list: [] },
      fieldworkerId: "",
      headers: [
        { text: "Client Name", value: "name", sortable: false },
        { text: "Territory", value: "teritory.name", sortable: false },
        { text: "Field Workers", value: "fieldWorkers", sortable: false },
        { text: "", value: "action", sortable: false, align: "right" }
      ],
      canvasserId: ""
    };
  },
  created() {
    if (this.$store.getters.getOrganizationId === "") {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.getClients();
    this.getCanvassers();
  },
  methods: {
    getClients() {
      this.loadingData = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.$store.getters.getOrganizationId +
            "/assignment-plans/" +
            this.$route.params.planId +
            "/manageable-clients",
          { headers: auth.getAuthHeader() }
        )
        .then(res => {
          this.clients = res.data.data;
        })
        .catch(err => {
          bus.$emit("callNotif", "error", err);
        })
        .finally(() => {
          this.loadingData = false;
        });
    },
    getCanvassers() {
      this.loadingCanvasser = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.$store.getters.getOrganizationId +
            "/assignment-plans/" +
            this.$route.params.planId +
            "/canvassers",
          { headers: auth.getAuthHeader() }
        )
        .then(res => {
          this.canvassers = res.data.data;
        })
        .catch(err => {
          bus.$emit("callNotif", "error", err);
        })
        .finally(() => {
          this.loadingCanvasser = false;
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
            this.canvasserId +
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
