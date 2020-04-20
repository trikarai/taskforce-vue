<template>
  <v-container fluid>
    <v-row>
      <!-- {{$store.getters.getOrganizationId}} -->
      <v-col cols="12" lg="6" md="6" sm="12" xs="12">
        <v-select
          :items="organizations.list"
          item-text="organization.name"
          v-model="selectedOrganization"
          :hint="selectedOrganization.name"
          persistent-hint
          label="Assigned Organization"
          outlined
          return-object
          @change="mutateOrganization"
        ></v-select>
        <v-alert
          v-if="organizations.total === 0"
          type="warning"
          :value="true"
        >No Supervisor Role Assigned to your account</v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="4" md="6" sm="8" xs="12">
        <v-text-field v-model="search" label="Search" outlined dense></v-text-field>
      </v-col>
      <v-col cols="12" lg="12" md="12">
        <v-data-table
          v-if="data.total > 0"
          :headers="headers"
          :items="data.list"
          item-key="id"
          :loading="loadingData"
          :search="search"
        ></v-data-table>
        <v-alert type="info" :value="true" v-else>No Report Data</v-alert>
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
      loadingOrganization: false,
      organizations: {
        total: 0,
        list: []
      },
      selectedOrganization: {
        id: "",
        name: "",
        organization: { name: "", id: "" }
      },
      data: { total: 0, list: [] },
      loadingData: false,
      headers: [
        { text: "Submit Time", value: "submitTime", sortable: false },
        {
          text: "Start Date",
          value: "canvassAssignment.startDate",
          sortable: false
        },
        {
          text: "End Date",
          value: "canvassAssignment.endDate",
          sortable: false
        },
        {
          text: "fieldWorker",
          value: "canvassAssignment.fieldWorker.name",
          sortable: false
        },
        {
          text: "client",
          value: "canvassAssignment.client.name",
          sortable: false
        },
        {
          text: "teritory",
          value: "canvassAssignment.client.teritory.name",
          sortable: false
        },
        { text: "", value: "action", sortable: false, align: "right" }
      ]
    };
  },
  watch: {
    selectedOrganization: "getDataList"
  },
  mounted() {
    this.getOrganization();
    if (this.selectedOrganization.organization.id !== "") {
      this.getDataList();
    }
  },
  methods: {
    getOrganization() {
      this.dialog = false;
      this.loadingOrganization = true;
      this.axios
        .get(config.baseUri.api + "/personnel/assigned-supervisors", {
          headers: auth.getAuthHeader()
        })
        .then(res => {
          this.organizations = res.data.data;
          this.selectedOrganization = this.organizations.list[0];
          this.$store.commit(
            "setOrganizationId",
            this.selectedOrganization.organization.id
          );
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.loadingOrganization = false;
        });
    },
    mutateOrganization() {
      this.$store.commit(
        "setOrganizationId",
        this.selectedOrganization.organization.id
      );
    },
    getDataList() {
      this.loadingData = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.selectedOrganization.organization.id +
            "/canvass-reports",
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(res => {
          this.data = res.data.data;
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.loadingData = false;
        });
    }
  }
};
</script>

<style>
</style>
