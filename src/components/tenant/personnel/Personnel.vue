
<template>
  <v-container extended grid-list-xl>
    <v-row>
      <v-col md="8" xs="12">
        <v-btn color="primary" @click="openAdd">Add Personnel</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="8" lg="8" xs="12">
        <v-data-table
          :headers="headers"
          :items="data.list"
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
    <dialog-personnel
      v-if="dialog"
      :dialog.sync="dialog"
      :isEdit="isEdit"
      :editId="editId"
      @refresh="getDataList"
    />
  </v-container>
</template>
<script>
import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";
import DialogRemove from "@/components/DialogRemove";
import DialogPersonnel from "./DialogPersonnel";
export default {
  data() {
    return {
      authData: "",
      dialog: false,
      isEdit: false,
      editId: "",
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
    DialogPersonnel
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.dialog = false;
      this.loadingData = true;
      this.axios
        .get(config.baseUri.api + "/admin/personnels", {
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
      this.isBranch = false;
      this.isEdit = false;
    },
    openAddBranch(item) {
      this.dialog = true;
      this.isBranch = true;
      this.isEdit = false;
    },
    openEdit(item) {
      this.dialog = true;
      this.isEdit = true;
      this.editId = item;
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
        .delete(config.baseUri.api + "/admin/personnels/" + id, {
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
