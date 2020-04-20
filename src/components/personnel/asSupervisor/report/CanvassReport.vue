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
    <!-- <v-row>{{query}}</v-row> -->
    <v-row>
      <v-col cols="12" lg="3" md="6" sm="8" xs="12">
        <v-text-field v-model="query.clientName" label="Client Name" outlined dense></v-text-field>
      </v-col>
      <v-col cols="12" lg="3" md="6" sm="8" xs="12">
        <v-select
          :loading="loadingAssignment"
          :items="assignmentPlans.list"
          v-model="query.assignmentPlanId"
          item-value="id"
          item-text="name"
          label="Assigment Plans"
          outlined
          dense
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" lg="3" md="6" sm="8" xs="12">
        <v-select
          :loading="loadingWorker"
          :items="fieldWorkers.list"
          v-model="query.fieldWorkerId"
          item-value="id"
          item-text="name"
          label="Field Worker"
          outlined
          dense
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" lg="3" md="6" sm="8" xs="12">
        <v-select
          :loading="loadingTerritory"
          :items="territories.list"
          v-model="query.teritoryId"
          item-value="id"
          item-text="name"
          label="Territory"
          outlined
          dense
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" lg="3" md="6" sm="8" xs="12">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="query.endDateRangeFinish"
              label="Deadline"
              prepend-icon="mdi-calendar"
              readonly
              v-on="on"
              outlined
              dense
              clearable
            ></v-text-field>
          </template>
          <v-date-picker
            ref="picker"
            :locale="$vuetify.lang.current"
            v-model="query.endDateRangeFinish"
            @input="menu = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <!-- <v-col cols="12" lg="4" md="6" sm="8" xs="12">
        <v-text-field v-model="search" label="Search" outlined dense></v-text-field>
      </v-col>-->
      <v-col cols="12" lg="12" md="12">
        <v-data-table
          v-if="data.total > 0"
          :headers="headers"
          :items="data.list"
          item-key="id"
          :loading="loadingData"
          :search="search"
          elevations="2"
        >
          <template v-slot:item.submitTime="{item}">
            <v-row no-gutters>
              <v-col cols="12" lg="12" class="ma-1">
                <v-icon>mdi-calendar</v-icon>
                {{item.submitTime | moment("DD MMMM YYYY")}}
              </v-col>
              <v-col cols="12" lg="12" class="ma-1">
                <v-icon>mdi-clock</v-icon>
                {{item.submitTime | moment("HH:MM A")}}
              </v-col>
            </v-row>
          </template>
          <template
            v-slot:item.date="{item}"
          >{{item.canvassAssignment.startDate | moment("DD MMMM YYYY")}} - {{item.canvassAssignment.endDate | moment("DD MMMM YYYY")}}</template>
        </v-data-table>
        <v-alert type="info" :value="true" v-else>No Report Data Found</v-alert>
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
      menu: false,
      search: "",
      loadingOrganization: false,
      organizations: {
        total: 0,
        list: []
      },
      loadingAssignment: false,
      assignmentPlans: {
        total: 0,
        list: []
      },
      loadingWorker: false,
      fieldWorkers: {
        total: 0,
        list: []
      },
      loadingTerritory: false,
      territories: {
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
          text: "Assignment Date",
          value: "date",
          sortable: false
        },
        {
          text: "Client",
          value: "canvassAssignment.client.name",
          sortable: false
        },
        {
          text: "Field Worker",
          value: "canvassAssignment.fieldWorker.name",
          sortable: false
        },
        {
          text: "Teritory",
          value: "canvassAssignment.client.teritory.name",
          sortable: false
        },
        { text: "", value: "action", sortable: false, align: "right" }
      ],
      query: {
        assignmentPlanId: "",
        fieldWorkerId: "",
        teritoryId: "",
        clientName: "",
        endDateRangeFinish: ""
      }
    };
  },
  watch: {
    selectedOrganization() {
      this.getDataList();
      this.getAssignmentPlans();
      this.getFieldWorkers();
      this.getTerritories();
    },
    query: {
      handler() {
        this.getDataList();
      },
      deep: true
    }
  },
  mounted() {
    this.getOrganization();
    if (this.selectedOrganization.organization.id !== "") {
      this.getDataList();
      this.getAssignmentPlans();
      this.getFieldWorkers();
      this.getTerritories();
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
            headers: auth.getAuthHeader(),
            params: this.query
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
    },
    getAssignmentPlans() {
      this.loadingAssignment = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.selectedOrganization.organization.id +
            "/assignment-plans",
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(res => {
          this.assignmentPlans = res.data.data;
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.loadingAssignment = false;
        });
    },
    getFieldWorkers() {
      this.loadingWorker = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.selectedOrganization.organization.id +
            "/field-workers",
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(res => {
          this.fieldWorkers = res.data.data;
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.loadingWorker = false;
        });
    },
    getTerritories() {
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
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.loadingTerritory = false;
        });
    }
  }
};
</script>

<style>
</style>
