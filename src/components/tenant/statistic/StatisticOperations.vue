<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="6" md="8" xs="12">
        <v-btn color="primary" :to="{name:'tenant-statistic-operations-create'}">Add Statistic</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="12" md="12" xs="12">
        <v-data-table :headers="headers" :items="data.list" item-key="id" :loading="loadingData">
          <template v-slot:item.action="{item}">
            <v-btn color="accent" :id="item.id">Detail</v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";

export default {
  data() {
    return {
      data: { total: 0, list: [] },
      loadingData: false,
      headers: [
        { text: "Name", value: "name", sortable: false },
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
        .get(config.baseUri.api + "/admin/tenant-statistic-operations", {
          headers: auth.getAuthHeader()
        })
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
