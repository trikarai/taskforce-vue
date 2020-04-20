<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="6" md="6" sm="12" xs="12">
        <v-select
          :items="organizations.list"
          item-text="name"
          v-model="selectedOrganization"
          :hint="selectedOrganization.organization.name"
          persistent-hint
          label="Assigned Organization"
          outlined
          return-object
          @change="mutateOrganization"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="6" md="6" sm="12" xs="12">
        <v-text-field v-model="search" label="Search" outlined dense></v-text-field>
      </v-col>
      <v-col cols="12" lg="12" md="10" sm="12" xs="12">
        <v-data-table
          :search="search"
          :headers="headers"
          :items="data.list"
          class="elevation-2"
          item-key="id"
          :loading="loadingData"
        >
          <template v-slot:item.isCompleted="{item}">
            <v-icon color="green" v-if="item.isCompleted">mdi-check</v-icon>
            <v-icon color="red" v-else>mdi-close</v-icon>
          </template>
          <template v-slot:item.action="{item}">
            <v-btn
              class="mr-2"
              color="accent"
              :to="{name: 'personnel-fw-canvass-assignments-reports-form', params: {assignmentId: item.id}}"
            >
              <v-icon>mdi-send</v-icon>
            </v-btn>
            <v-btn
              class="mr-2"
              color="accent"
              :to="{name: 'personnel-fw-canvass-assignments-reports', params: {assignmentId: item.id}}"
            >
              <v-icon>mdi-playlist-check</v-icon>
            </v-btn>
            <v-btn color="accent" @click="openDetail(item.id)">
              <v-icon>mdi-monitor-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <dialog-assignment
      v-if="dialogAssignment"
      :dialog.sync="dialogAssignment"
      :assignmentId="assignmentId"
    />
  </v-container>
</template>

<script>
import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";

import DialogAssignment from "./DialogAssignment";

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
        { text: "Assignment Name", value: "client.name", sortable: false },
        { text: "Start Date", value: "startDate", sortable: false },
        { text: "End Date", value: "endDate", sortable: false },
        { text: "Visit Number", value: "visitNumber", sortable: false },
        { text: "", value: "isCompleted", sortable: false },
        { text: "", value: "action", sortable: false, align: "right" }
      ],
      dialogAssignment: false,
      assignmentId: ""
    };
  },
  components: {
    DialogAssignment
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
        .get(config.baseUri.api + "/personnel/assigned-field-workers", {
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
      this.$store.commit("setFieldWorkerId", this.selectedOrganization.id);
    },
    getDataList() {
      this.dialogAssignment = false;
      this.loadingData = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-field-worker/" +
            this.selectedOrganization.organization.id +
            "/" +
            this.selectedOrganization.id +
            "/canvass-assignments",
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
    },
    openDetail(id) {
      this.assignmentId = id;
      this.dialogAssignment = true;
    }
  }
};
</script>

<style>
</style>
