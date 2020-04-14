<template>
  <v-container fluid>
    <v-row>
      <!-- <v-col lg="12">{{$store.getters.getTargetType}}</v-col> -->
      <v-col cols="12" md="12" lg="12" xs="12">
        <v-btn
          @click="openCanvassTarget()"
          color="primary"
          v-if="$store.getters.getTargetType === 'canvass'"
        >
          <v-icon left>mdi-target</v-icon>
          Add {{$store.getters.getTargetType}} Target
        </v-btn>
        <v-btn
          @click="openSuveyTarget()"
          color="primary"
          v-if="$store.getters.getTargetType === 'survey'"
        >
          <v-icon left>mdi-target</v-icon>
          Add {{$store.getters.getTargetType}} Target
        </v-btn>
      </v-col>
      <v-col cols="12" md="12" lg="12" xs="12" v-if="loadingData">
        <v-skeleton-loader type="table"></v-skeleton-loader>
      </v-col>
      <v-col cols="12" md="12" lg="12" xs="12" v-if="data.total > 0">
        <v-data-table
          :headers="headers"
          :items="data.list"
          class="elevation-2"
          item-key="id"
          :loading="loadingData"
        >
          <template v-slot:item.name="{item}">
            <span v-if="$store.getters.getTargetType == 'canvass'">{{item.client.name}}</span>
            <span v-if="$store.getters.getTargetType == 'survey'">{{item.teritory.name}}</span>
          </template>
          <template v-slot:item.action="{item}">
            <v-btn
              v-if="$store.getters.getTargetType == 'canvass'"
              small
              class="mr-2"
              color="accent"
              @click="gotoAssignment(item.id, 'canvass')"
            >
              <v-icon small left>mdi-bullseye-arrow</v-icon>Canvass Assigment
            </v-btn>
            <v-btn
              v-if="$store.getters.getTargetType == 'survey'"
              small
              class="mr-2"
              color="accent"
              @click="gotoAssignment(item.id, 'survey')"
            >
              <v-icon small left>mdi-bullseye-arrow</v-icon>Survey Assigment
            </v-btn>
            <v-btn small color="accent" :id="item.id" @click="openDetail(item.id)">
              <v-icon small>mdi-monitor-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" md="12" lg="12" xs="12" v-else>
        <v-alert type="info" :value="true">No {{$store.getters.getTargetType}} target available</v-alert>
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
          Target Detail
          <v-spacer></v-spacer>
          <v-btn icon color="error" @click="dialogDetail = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="!loadingDetail">
          <template v-if="$store.getters.getTargetType == 'canvass'">
            <p>{{dataDetail.client.name}}</p>
          </template>
          <template v-if="$store.getters.getTargetType == 'survey'">
            <p>{{dataDetail.teritory.name}}</p>
          </template>
        </v-card-text>
        <v-skeleton-loader v-else type="paragraph" class="ma-2" />
      </v-card>
    </v-dialog>

    <canvass-target v-if="dialogCanvass" :dialog.sync="dialogCanvass" @refreshParent="refresh" />
    <survey-target v-if="dialogSurvey" :dialog.sync="dialogSurvey" @refreshParent="refresh" />
  </v-container>
</template>

<script>
import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";

import CanvassTarget from "./DialogCanvasTargert";
import SurveyTarget from "./DialogSurveyTargert";

export default {
  data() {
    return {
      loadingData: false,
      data: { total: 0, list: [] },
      headers: [
        { text: "Name", value: "name", sortable: false },
        { text: "", value: "action", sortable: false, align: "right" }
      ],
      loadingDetail: false,
      dialogDetail: false,
      dataDetail: {
        client: {
          name: "",
          id: ""
        },
        teritory: {
          name: "",
          id: ""
        }
      },
      dialogCanvass: false,
      dialogSurvey: false
    };
  },
  components: {
    CanvassTarget,
    SurveyTarget
  },
  created() {
    if (this.$store.getters.getOrganizationId === "") {
      this.$router.go(-2);
    }
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.dialog = false;
      this.loadingData = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.$store.getters.getOrganizationId +
            "/assignment-plans/" +
            this.$route.params.planId +
            "/canvassers/" +
            this.$route.params.canvasserId +
            "/" +
            this.$store.getters.getTargetType +
            "-targets",
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
            this.$route.params.canvasserId +
            "/" +
            this.$store.getters.getTargetType +
            "-targets/" +
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
    gotoAssignment(id, type) {
      switch (type) {
        case "canvass":
          this.$store.commit("setTargetType", type);
          this.$router.push({
            name: "personnel-spv-assignmentplans-canvasstarget-assignments",
            params: {
              planId: this.$route.params.planId,
              canvasserId: this.$route.params.canvasserId,
              targetId: id
            }
          });
          break;
        case "survey":
          this.$store.commit("setTargetType", type);
          this.$router.push({
            name: "personnel-spv-assignmentplans-surveytarget-assignments",
            params: {
              planId: this.$route.params.planId,
              canvasserId: this.$route.params.canvasserId,
              targetId: id
            }
          });
          break;
      }
    },
    openCanvassTarget() {
      this.dialogCanvass = true;
    },
    openSuveyTarget() {
      this.dialogSurvey = true;
    },
    refresh() {
      this.dialogCanvass = false;
      this.dialogSurvey = false;
      this.getDataList();
    }
  }
};
</script>

<style>
</style>
