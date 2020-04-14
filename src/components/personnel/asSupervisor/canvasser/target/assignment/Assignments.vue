<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" lg="12" xs="12">
        <v-data-table
          :headers="headers"
          :items="data.list"
          class="elevation-2"
          item-key="id"
          :loading="loadingData"
        >
          <template v-slot:item.startDate="{item}">{{item.startDate | moment("Do MMM, YYYY")}}</template>
          <template v-slot:item.endDate="{item}">{{item.endDate | moment("Do MMM, YYYY")}}</template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialogDetail"
      scrollable
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>
          Target Assignment Detail
          <v-spacer></v-spacer>
          <v-btn icon color="error" @click="dialogDetail = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="!loadingDetail">
          <p>Start Date : {{dataDetail.startDate}}</p>
          <p>End Date : {{dataDetail.endDate}}</p>
          <p>Visit Number : {{dataDetail.visitNumber}}</p>
        </v-card-text>
        <v-skeleton-loader v-else type="paragraph" class="ma-2" />
      </v-card>
    </v-dialog>
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
      data: { total: 0, list: [] },
      headers: [
        { text: "Start Date", value: "startDate", sortable: false },
        { text: "End Date", value: "endDate", sortable: false },
        { text: "Visit Number", value: "visitNumber", sortable: false },
        { text: "", value: "action", sortable: false, align: "right" }
      ],
      loadingDetail: false,
      dialogDetail: false,
      dataDetail: {
        id: "",
        startDate: "",
        endDate: "",
        visitNumber: ""
      }
    };
  },
  created() {
    if (this.$store.getters.getOrganizationId === "") {
      this.$router.go(-3);
    }
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.dialogDetail = false;
      this.loadingData = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.$store.getters.getOrganizationId +
            "/assignment-plans/" +
            this.$route.params.planId +
            "/canvassers/" +
            this.$route.params.canvasserId +
            "/" +
            this.$store.getters.getTargetType +
            "-targets/" +
            this.$route.params.targetId +
            "/" +
            this.$store.getters.getTargetType +
            "-assignments",
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
    getDataDetail(id) {
      this.loadingDetail = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.$store.getters.getOrganizationId +
            "/assignment-plans/" +
            this.$route.params.planId +
            "/canvassers/" +
            this.$route.params.canvasserId +
            "/" +
            this.$store.getters.getTargetType +
            "-targets/" +
            this.$route.params.targetId +
            "/" +
            this.$store.getters.getTargetType +
            "-assignments/" +
            id,
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(res => {
          this.dataDetail = res.data.data;
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.loadingDetail = false;
        });
    },
    openDetail(id) {
      this.dialogDetail = true;
      this.getDataDetail(id);
    }
  }
};
</script>

<style>
</style>
