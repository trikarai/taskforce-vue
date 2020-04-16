<template>
  <v-container fluid>
    <v-row id="list" v-if="!showDetail">
      <v-data-table
        :headers="headers"
        :items="data.list"
        class="elevation-1"
        item-key="id"
        :loading="loadingData"
      >
        <template v-slot:item.action="{item}">
          <v-btn color="accent" small @click="getDataDetail(item.id)">
            <v-icon small left>mdi-monitor-eye</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-row>
    <v-row id="detail" v-else>
      <v-col cols="2">
        <v-btn text @click="showDetail = false">
          <v-icon color="red">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12">
        <pre>
              {{dataDetail}}
          </pre>
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
      showDetail: false,
      data: { total: 0, list: [] },
      dataDetail: {},
      headers: [
        {
          text: "Name",
          value: "name"
        },
        {
          text: "",
          value: "action"
        }
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
          this.loadingData = false;
        });
    }
  }
};
</script>

<style>
</style>
