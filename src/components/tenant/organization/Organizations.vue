<template>
  <v-container extend grid-list-xs>
    <v-row>
      <v-col md="8" xs="12">
        <v-btn color="primary" @click="openAdd">Add Organization</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="6" lg="6" xs="12">
        <v-data-table
          :headers="headers"
          :items="data.list"
          hide-default-footer
          class="elevation-2"
          item-key="id"
          :loading="loadingData"
        >
          <template v-slot:item.action="{item}">
            <v-btn small color="warning" @click="openRemove(item.id, item.name, 'delete')">
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <dialog-remove
      :dialog.sync="dialogRemove"
      :loading.sync="loadingData"
      :dialogParams="dialogParams"
      @confirm="confirmRemove"
    />
    <dialog-organization :dialog.sync="dialog" @refresh="getDataList" />
  </v-container>
</template>
<script>
import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";
import DialogRemove from "@/components/DialogRemove";
import DialogOrganization from "./DialogOrganization";

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
    DialogRemove,
    DialogOrganization
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.dialog = false;
      this.loadingData = true;
      this.axios
        .get(config.baseUri.api + "/admin/organizations", {
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
        .delete(config.baseUri.api + "/admin/organizations/" + id, {
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
<style scoped>
</style>
