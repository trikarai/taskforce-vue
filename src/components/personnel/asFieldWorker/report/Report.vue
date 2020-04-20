<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">{{data.submitTime | moment("Do MMMM YYYY, HH:MM:SS A")}}</v-col>
      <v-col cols="12">
        <v-skeleton-loader type="card" v-if="loadingData" />
        <render-record :fields="fields" v-else />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";
import { formDynamicMixins } from "@/mixins/formDynamicMixins";

import RenderRecord from "@/components/formModule/render/recordRender";

export default {
  mixins: [formDynamicMixins],
  data() {
    return {
      loadingData: false,
      data: { submitTime: "" },
      fields: []
    };
  },
  components: {
    RenderRecord
  },
  created() {
    if (this.$store.getters.getOrganizationId === "") {
      this.$router.go(-2);
    }
  },
  mounted() {
    this.getDataSingle();
  },
  methods: {
    getDataSingle() {
      this.loadingData = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-field-worker/" +
            this.$store.getters.getOrganizationId +
            "/" +
            this.$store.getters.getFieldWorkerId +
            "/canvass-assignments/" +
            this.$route.params.assignmentId +
            "/reports/" +
            this.$route.params.reportId,
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(res => {
          this.data = res.data.data;
          this.refactorRecordJSON(res.data.data);
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
