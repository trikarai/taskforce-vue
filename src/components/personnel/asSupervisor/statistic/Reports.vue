<template>
  <v-container fluid>
    <v-row>
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
      <v-col cols="12" lg="6" md="12" sm="12">
        <v-select
          :loading="loadingTerritory"
          :items="territories.list"
          item-text="name"
          item-value="id"
          v-model="territoryId"
          outlined
          label="Territory"
        ></v-select>
      </v-col>
      <v-col cols="12" lg="12" md="12" sm="12">
        <v-data-table :headers="headers" :items="reports" item-key="id" :loading="loadingData"></v-data-table>
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
      loadingData: false,
      loadingOrganization: false,
      organizations: { list: [] },
      selectedOrganization: {
        id: "",
        name: "",
        organization: { name: "", id: "" }
      },
      loadingTerritory: false,
      territories: { list: [] },
      territoryId: "",
      reports: [],
      headers: [
        {
          text: "Formula",
          value: "formula",
          sortable: true
        },
        {
          text: "Result",
          value: "result",
          sortable: false
        }
      ],
      query: {
        tenantStatisticOperationId: this.$route.params.statisticId,
        teritoryId: "",
        startDate: "",
        endDate: ""
      }
    };
  },
  watch: {
    selectedOrganization: "getTerritory",
    territoryId: "getReports"
  },
  mounted() {
    this.getOrganization();
  },
  methods: {
    getOrganization() {
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
    getTerritory() {
      this.loadingTerritory = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.selectedOrganization.organization.id +
            "/manageable-teritories",
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(res => {
          this.territories = res.data.data;
          if (res.data.data.total !== 0) {
            this.territoryId = this.territories.list[0].id;
          }
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.loadingTerritory = false;
        });
    },
    getReports() {
      this.loadingData = true;
      this.query.teritoryId = this.territoryId;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.selectedOrganization.organization.id +
            "/report-statistic-operation",
          {
            headers: auth.getAuthHeader(),
            params: this.query
          }
        )
        .then(res => {
          this.reports = res.data.data;
        })
        .catch(err => {
          bus.$emit("callNotif", "error", err);
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
