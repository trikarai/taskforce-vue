<template>
  <v-container extend grid-list-xs>
    <v-row>
      <v-col md="8" xs="12">
        <v-btn color="primary" @click="openAdd">
          <v-icon left>mdi-account-plus</v-icon>Add Admin
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="6" lg="6" xs="12">
        <v-data-table
          :headers="headers"
          :items="data.list"
          hide-default-footer
          class="elevation-2"
          pagination.sync="pagination"
          item-key="id"
          :loading="loadingData"
        >
          <template v-slot:item.action="{item}">
            <template v-if="authData.data.id === item.id">
              <v-btn class="ml-2" small color="primary" router to="/sysadmin/profile">
                <v-icon small left>mdi-account-edit</v-icon>My Profile
              </v-btn>
            </template>
            <template v-else>
              <v-btn small color="warning">
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </template>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <dialog-admin :dialog.sync="dialog" @refresh="getDataList" />
  </v-container>
</template>
<script>
import * as config from "@/config/config";
import auth from "@/config/auth";

import DialogAdmin from "./DialogAdmin";

export default {
  data() {
    return {
      authData: "",
      dialog: false,
      data: { total: 0, list: [] },
      loadingData: false,
      headers: [
        { text: "Name", value: "name", sortable: false },
        { text: "", value: "action", sortable: false, align: "right" }
      ]
    };
  },
  components: {
    DialogAdmin
  },
  created: function() {
    this.authData = JSON.parse(auth.getAuthData());
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.dialog = false;
      this.loadingData = true;
      this.axios
        .get(config.baseUri.api + "/sys-admin/sys-admins", {
          headers: auth.getAuthHeader()
        })
        .then(res => {
          this.data = res.data.data;
        })
        .catch(() => {})
        .finally(() => {
          this.loadingData = false;
        });
    },
    openAdd() {
      this.dialog = true;
    }
  }
};
</script>
