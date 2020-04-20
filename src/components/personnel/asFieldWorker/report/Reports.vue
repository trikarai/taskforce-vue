<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="6" md="8" sm="12" xs="12">
        <v-btn
          color="primary"
          :to="{name: 'personnel-fw-canvass-assignments-reports-form', params: {assignmentId: assignmentId}}"
        >
          <v-icon left small>mdi-send</v-icon>Send New Report
        </v-btn>
      </v-col>
      <v-col cols="12" lg="8" md="8" sm="12" xs="12">
        <v-data-table :loading="loadingData" :headers="headers" :items="reports.list" item-key="id">
          <template v-slot:item.submitTime="{item}">
            <v-row>
              <v-col>
                <v-icon>mdi-calendar</v-icon>
                {{item.submitTime | moment("Do MMMM YYYY")}}
              </v-col>
              <v-col>
                <v-icon>mdi-clock</v-icon>
                {{item.submitTime | moment("HH:MM:SS A")}}
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.action="{item}">
            <v-btn
              color="accent"
              :to="{name: 'personnel-fw-canvass-assignments-report-detail', params: {assignmentId: assignmentId, reportId: item.id}}"
            >
              <v-icon>mdi-monitor-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table>
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
      headers: [
        { text: "Submit Time", value: "submitTime" },
        { text: "", value: "action", sortable: false }
      ],
      loadingData: false,
      reports: { total: 0, list: [] },
      assignmentId: this.$route.params.assignmentId
    };
  },
  created() {
    if (this.$store.getters.getOrganizationId === "") {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.loadingData = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-field-worker/" +
            this.$store.getters.getOrganizationId +
            "/" +
            this.$store.getters.getFieldWorkerId +
            "/canvass-assignments/" +
            this.assignmentId +
            "/reports",
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(res => {
          if (res.data.data.total === 0) {
            this.reports = { total: 0, list: [] };
          }
          this.reports = res.data.data;
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
