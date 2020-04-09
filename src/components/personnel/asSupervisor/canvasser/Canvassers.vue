<template>
  <v-container extended grid-list-xs>
    <v-row>
      <v-col md="12" lg="12" xs="12">
        <v-data-table
          :headers="headers"
          :items="data.list"
          class="elevation-2"
          item-key="id"
          :loading="loadingData"
        >
          <template v-slot:item.action="{item}">
            <v-btn small class="mr-2" color="accent" @click="gotoTarget(item.id, 'canvass')">
              <v-icon small left>mdi-bullseye-arrow</v-icon>Canvas Target
            </v-btn>
            <v-btn small class="mr-2" color="accent" @click="gotoTarget(item.id, 'survey')">
              <v-icon small left>mdi-bullseye-arrow</v-icon>Survey Target
            </v-btn>
            <v-btn small color="accent" :id="item.id" @click="openDetail(item.id)">
              <v-icon small>mdi-monitor-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialogDetail"
      scrollable
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>
          Canvasser Detail
          <v-spacer></v-spacer>
          <v-btn icon color="error" @click="dialogDetail = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="!loadingDetail">
          <p>{{dataDetail.fieldWorker.name}}</p>
          <p>{{dataDetail.fieldWorker.assignedPersonnel.name}}</p>
        </v-card-text>
        <v-skeleton-loader v-else type="paragraph" class="ma-2" />
      </v-card>
    </v-dialog>
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
      data: { total: 0, list: [] },
      headers: [
        { text: "Canvasser", value: "fieldWorker.name", sortable: false },
        { text: "", value: "action", sortable: false, align: "right" }
      ],
      loadingDetail: false,
      dialogDetail: false,
      dataDetail: {
        fieldWorker: {
          name: "",
          assignedPersonnel: { name: "" }
        }
      }
    };
  },
  created() {
    if (this.$store.getters.getOrganizationId === "") {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.dialogDetail = false;
      this.loadingData = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.$store.getters.getOrganizationId +
            "/assignment-plans/" +
            this.$route.params.planId +
            "/canvassers",
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
    getDataDetail(id) {
      this.loadingDetail = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.$store.getters.getOrganizationId +
            "/assignment-plans/" +
            this.$route.params.planId +
            "/canvassers/" +
            id,
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(res => {
          this.dataDetail = res.data.data;
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.loadingDetail = false;
        });
    },
    openDetail(id) {
      this.dialogDetail = true;
      this.getDataDetail(id);
    },
    gotoTarget(id, type) {
      switch (type) {
        case "canvass":
          this.$store.commit("setTargetType", type);
          this.$router.push({
            name: "personnel-spv-assignmentplans-canvasstarget",
            params: {
              planId: this.$route.params.planId,
              canvasserId: id
            }
          });
          break;
        case "survey":
          this.$store.commit("setTargetType", type);
          this.$router.push({
            name: "personnel-spv-assignmentplans-surveytarget",
            params: {
              planId: this.$route.params.planId,
              canvasserId: id
            }
          });
          break;
      }
    }
  }
};
</script>
<style scoped>
</style>
