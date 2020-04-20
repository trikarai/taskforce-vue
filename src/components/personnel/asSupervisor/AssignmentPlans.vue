<template>
  <v-container fluid>
    <v-row>
      <!-- {{$store.getters.getOrganizationId}} -->
      <v-col cols="12" lg="6" md="6" sm="12" xs="12">
        <v-select
          :items="organizations.list"
          item-text="organization.name"
          v-model="selectedOrganization"
          :hint="selectedOrganization.name"
          persistent-hint
          label="Assigned Organization"
          outlined
          return-object
          @change="mutateOrganization"
        ></v-select>
        <v-alert
          v-if="organizations.total === 0"
          type="warning"
          :value="true"
        >No Supervisor Role Assigned to your account</v-alert>
      </v-col>

      <v-col cols="12" md="12" lg="12" xs="12">
        <v-btn
          color="primary"
          :to="{name: 'personnel-spv-assignmentplans-create'}"
          :disabled="selectedOrganization.organization.id === ''"
        >
          <v-icon left>mdi-plus</v-icon>Create Assigment Plan
        </v-btn>
      </v-col>
      <v-col cols="12" md="12" lg="12" xs="12">
        <v-data-table
          :headers="headers"
          :items="data.list"
          class="elevation-2"
          item-key="id"
          :loading="loadingData"
        >
          <template v-slot:item.action="{item}">
            <v-btn
              small
              color="accent"
              class="mr-2"
              :to="{name:'personnel-spv-assignmentplans-targets', params: { planId: item.id }}"
            >
              <v-icon>mdi-target</v-icon>
            </v-btn>
            <v-btn
              class="mr-2"
              small
              color="accent"
              :to="{name:'personnel-spv-assignmentplans-canvassers', params: { planId: item.id }}"
            >
              <v-icon small>mdi-account-group</v-icon>
            </v-btn>
            <v-btn class="mr-2" small color="accent" @click="openPlanDetail(item.id)">
              <v-icon small>mdi-monitor-eye</v-icon>
            </v-btn>

            <!-- <v-btn small color="warning" @click="openRemove(item.id, item.name, 'delete')">
              <v-icon small>mdi-delete</v-icon>
            </v-btn>-->
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
    <dialog-plan v-if="dialogPlan" :dialog.sync="dialogPlan" :planId="planId" />
  </v-container>
</template>
<script>
import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";

import DialogPlan from "./DialogAssigmentPlan";
import DialogRemove from "@/components/DialogRemove";

export default {
  data() {
    return {
      loadingOrganization: false,
      organizations: {
        total: 0,
        list: []
      },
      selectedOrganization: {
        id: "",
        name: "",
        organization: { name: "", id: "" }
      },
      data: { total: 0, list: [] },
      loadingData: false,
      headers: [
        { text: "Plan Name", value: "name", sortable: false },
        { text: "", value: "action", sortable: false, align: "right" }
      ],
      dialogRemove: false,
      dialogPlan: false,
      planId: "",
      dialogParams: {
        id: "",
        action: "",
        text: ""
      }
    };
  },
  components: {
    DialogRemove,
    DialogPlan
  },
  watch: {
    selectedOrganization: "getDataList"
  },
  mounted() {
    this.getOrganization();
    if (this.selectedOrganization.organization.id !== "") {
      this.getDataList();
    }
  },
  methods: {
    getOrganization() {
      this.dialog = false;
      this.loadingOrganization = true;
      this.axios
        .get(config.baseUri.api + "/personnel/assigned-supervisors", {
          headers: auth.getAuthHeader()
        })
        .then(res => {
          this.organizations = res.data.data;
          this.selectedOrganization = this.organizations.list[0];
          this.$store.commit(
            "setOrganizationId",
            this.selectedOrganization.organization.id
          );
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.loadingOrganization = false;
        });
    },
    mutateOrganization() {
      this.$store.commit(
        "setOrganizationId",
        this.selectedOrganization.organization.id
      );
    },
    getDataList() {
      this.dialog = false;
      this.loadingData = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.selectedOrganization.organization.id +
            "/assignment-plans",
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
    openPlanDetail(id) {
      this.planId = id;
      this.dialogPlan = true;
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
        .delete(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.selectedOrganization.organization.id +
            "/assignment-plans/" +
            id,
          {
            headers: auth.getAuthHeader()
          }
        )
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
