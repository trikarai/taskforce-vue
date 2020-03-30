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
              <!-- <v-btn class="ml-2" small color="primary" router to="/sysadmin/profile">
                <v-icon small left>mdi-account-edit</v-icon>My Profile
              </v-btn> -->
            </template>
            <template v-else>
              <v-btn small color="warning" @click="openRemove(item.id, item.name, 'delete')">
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </template>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <dialog-admin :dialog.sync="dialog" @refresh="getDataList" />
    <dialog-remove
      :dialog.sync="dialogRemove"
      :loading.sync="loadingData"
      :dialogParams="dialogParams"
      @confirm="confirmRemove"
    />
  </v-container>
</template>
<script>
import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";

import DialogAdmin from "./DialogAdmin";
import DialogRemove from "@/components/DialogRemove";
export default {
  data() {
    return {
      authData: "",
      dialog: false,
      dialogRemove: false,
      dialogParams: {
        id: "",
        action: "",
        text: ""
      },
      data: { total: 0, list: [] },
      loadingData: false,
      headers: [
        { text: "Name", value: "name", sortable: false },
        { text: "", value: "action", sortable: false, align: "right" }
      ]
    };
  },
  components: {
    DialogAdmin,
    DialogRemove
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
    },
    openRemove(id, text, action) {
      this.dialogRemove = true;
      this.dialogParams.id = id;
      this.dialogParams.action = action;
      this.dialogParams.text = text;
    },
    confirmRemove(id) {
      this.loadingData = true;
      this.axios
        .delete(config.baseUri.api + "/sys-admin/sys-admins/" + id, {
          headers: auth.getAuthHeader()
        })
        .then(res => {
          this.dialogRemove = false;
          this.getDataList();
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
