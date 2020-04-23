<template>
  <v-container fluid>
    <v-row id="list" v-if="!showDetail">
      <v-col cols="12" lg="8" md="8" sm="12" xs="12">
        <v-data-table :headers="headers" :items="data.list" item-key="id" :loading="loadingData">
          <template v-slot:item.action="{item}">
            <v-btn
              color="accent"
              class="mr-2"
              small
              :to="{name: 'personnel-spv-statistic-ops-report', params: {statisticId: item.id}}"
            >
              <v-icon small left>mdi-finance</v-icon>Report
            </v-btn>
            <v-btn
              color="accent"
              small
              :to="{name: 'personnel-spv-statistic-ops-detail', params: {statisticId: item.id}}"
            >
              <v-icon small left>mdi-monitor-eye</v-icon>Detail
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row id="detail" v-else>
      <v-col cols="2">
        <v-btn text @click="showDetail = false">
          <v-icon color="red">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" lg="12" v-if="loadingDetail">
        <v-progress-linear :indeterminate="true" color="primary"></v-progress-linear>
      </v-col>
      <v-col cols="12" v-if="!loadingDetail">
        <v-row>
          <v-col cols="12" lg="12">{{dataDetail.name}}</v-col>
          <v-col cols="12" lg="12">{{dataDetail.description}}</v-col>
        </v-row>
      </v-col>
      <v-col cols="12" v-if="!loadingDetail">
        <v-row>
          <v-col
            cols="12"
            lg="12"
            v-for="data in dataDetail.integerFormulas"
            :key="data.id"
          >{{data}}</v-col>
        </v-row>
      </v-col>
      <v-col cols="12" v-if="!loadingDetail">
        <v-row>
          <v-col
            cols="12"
            lg="12"
            v-for="data in dataDetail.singleSelectFormulas"
            :key="data.id"
          >{{data}}</v-col>
        </v-row>
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
      loadingDetail: false,
      showDetail: false,
      data: { total: 0, list: [] },
      dataDetail: {
        id: "id",
        name: "dummy name",
        description: "dummy description",
        integerFormulas: [],
        singleSelectFormulas: [],
        multiSelectFormulas: []
      },
      headers: [
        {
          text: "Name",
          value: "name",
          sortable: false
        },
        { text: "", value: "action", sortable: false, align: "right" }
      ]
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
            "/personnel/with-supervisor-role/tenant-statistic-operations",
          { headers: auth.getAuthHeader() }
        )
        .then(res => {
          if (res.data.data.total === 0) {
            this.data = { total: 0, list: [] };
          }
          this.data = res.data.data;
        })
        .catch(err => {
          bus.$emit("callNotif", "error", err);
        })
        .finally(() => {
          this.loadingData = false;
        });
    },
    getDataDetail(id) {
      this.showDetail = true;
      this.loadingDetail = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/with-supervisor-role/tenant-statistic-operations/" +
            id,
          { headers: auth.getAuthHeader() }
        )
        .then(res => {
          this.dataDetail = res.data.data;
        })
        .catch(err => {
          bus.$emit("callNotif", "error", err);
        })
        .finally(() => {
          this.loadingDetail = false;
        });
    }
  }
};
</script>

<style>
</style>
