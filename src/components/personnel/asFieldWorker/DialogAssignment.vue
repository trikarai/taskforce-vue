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
        <p class="text-capitalize">Assignment Detail</p>
        <v-spacer></v-spacer>
        <v-btn icon color="error" @click="$emit('update:dialog', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text v-if="!loading">
        <p>Client: {{data.client.name}}</p>
        <p>Form: {{data.assignmentForm.name}}</p>
        <p>visit Number: {{data.visitNumber}}</p>
        <p>Start Date: {{data.startDate}}</p>
        <p>End Date: {{data.endDate}}</p>
        <p>
          Completed:
          <v-icon v-if="data.isCompleted" color="green">mdi-check</v-icon>
          <v-icon v-else color="red">mdi-close</v-icon>
        </p>
      </v-card-text>
      <v-card-text v-else>
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
      required: true
    },
    assignmentId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      data: {
        id: "",
        client: {
          id: "",
          name: ""
        },
        assignmentForm: {
          id: "",
          name: ""
        },
        visitNumber: 0,
        startDate: "1900-01-01",
        endDate: "1990-01-01",
        isCompleted: false
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-field-worker/" +
            this.$store.getters.getOrganizationId +
            "/" +
            this.$store.getters.getFieldWorkerId +
            "/canvass-assignments/" +
            this.assignmentId,
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
          this.loading = false;
        });
    }
  }
};
</script>

<style>
</style>
