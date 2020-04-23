<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="12" v-if="loadingData">
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-col>
      <v-col cols="12" lg="12" v-else>
        <v-card elevation="2">
          <v-card-title class="primary-title">{{data.name}}</v-card-title>
          <v-card-text class="subtitle">{{data.description}}</v-card-text>
          <v-btn
            color="accent"
            class="mr-2"
            small
            :to="{name: 'personnel-spv-statistic-ops-report', params: {statisticId: $route.params.statisticId}}"
          >
            <v-icon small left>mdi-finance</v-icon>Report
          </v-btn>
          <v-card-text>
            <v-row class="ml-2" v-for="data in data.integerFormulas" :key="data.id">
              <v-col cols="12" lg="6">{{data.name}}</v-col>
              <v-col cols="12" lg="6">{{data.computationOperand}}</v-col>
              <v-col cols="12" lg="12" v-for="data in data.includedIntegerFields" :key="data.id">
                <v-row class="ml-2">
                  <v-col cols="12" lg="6">Form Name : {{data.integerField.assignmentForm.name}}</v-col>
                  <v-col cols="12" lg="6">comparisonOperand : {{data.comparisonOperand}}</v-col>
                  <v-col cols="12" lg="6">Field Name : {{data.integerField.name}}</v-col>
                  <v-col cols="12" lg="6">comparisonValue : {{data.comparisonValue}}</v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <v-row class="ml-2" v-for="data in data.singleSelectFormulas" :key="data.id">
              <v-col cols="12" lg="12">{{data.name}}</v-col>
              <v-row class="ml-4">
                <v-col cols="12" lg="6">Form Name : {{data.singleSelectField.assignmentForm.name}}</v-col>
                <v-col cols="12" lg="6">Option : {{data.option.name}}</v-col>
                <v-col cols="12" lg="6">Field Name : {{data.singleSelectField.name}}</v-col>
              </v-row>
            </v-row>
            <v-row class="ml-2" v-for="data in data.multiSelectFormulas" :key="data.id">
              <v-col cols="12" lg="12">{{data.name}}</v-col>
              <v-row class="ml-4">
                <v-col cols="12" lg="6">Form Name : {{data.multiSelectField.assignmentForm.name}}</v-col>
                <v-col cols="12" lg="6">Option : {{data.option.name}}</v-col>
                <v-col cols="12" lg="6">Field Name : {{data.multiSelectField.name}}</v-col>
              </v-row>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as config from "@/config/config";
import auth from "@/config/auth";

export default {
  data() {
    return {
      data: {},
      loadingData: false
    };
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
            "/personnel/with-supervisor-role/tenant-statistic-operations/" +
            this.$route.params.statisticId,
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(res => {
          this.data = res.data.data;
        })
        .catch(() => {})
        .finally(() => {
          this.loadingData = false;
        });
    }
  }
};
</script>

<style>
</style>
