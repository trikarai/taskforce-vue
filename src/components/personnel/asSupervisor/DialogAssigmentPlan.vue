<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    :overlay="true"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title>
        <p class="text-capitalize" v-if="!loading">{{assignmentPlan.name}} Detail</p>
        <v-spacer></v-spacer>
        <v-btn icon color="error" @click="$emit('update:dialog', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text v-if="!loading">
        <v-row>
          <v-col lg="12">{{assignmentPlan.description}}</v-col>
          <v-col lg="6">Periode : {{assignmentPlan.periodUnit}}</v-col>
          <v-col lg="6">Length : {{assignmentPlan.periodLength}}</v-col>
          <v-col lg="6">Start : {{assignmentPlan.startDate}}</v-col>
          <v-col lg="6">End : {{assignmentPlan.endDate}}</v-col>
          <v-col lg="12">Visit Number : {{assignmentPlan.visitNumber}}</v-col>
          <v-col lg="12">
            <template v-for="canvasser in assignmentPlan.canvassers">
              <v-chip
                :close="false"
                :key="canvasser.id"
              >{{canvasser.fieldWorker.name}} : {{canvasser.fieldWorker.assignedPersonnel.name}}</v-chip>
            </template>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-else>
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
// import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";

export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
      required: true
    },
    planId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      assignmentPlan: {
        id: "",
        name: "",
        description: "",
        periodUnit: "",
        periodLength: null,
        startDate: "",
        endDate: "",
        visitNumber: "",
        canvassers: []
      }
    };
  },
  mounted() {
    this.getAssigmentPlan();
  },
  methods: {
    getAssigmentPlan() {
      this.loading = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.$store.getters.getOrganizationId +
            "/assignment-plans/" +
            this.planId,
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(res => {
          this.assignmentPlan = res.data.data;
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style>
</style>
