<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <p>Client: {{data.client.name}}</p>
        <p>visit Number: {{data.visitNumber}}</p>
        <p>Start Date: {{data.startDate}}</p>
        <p>End Date: {{data.endDate}}</p>
      </v-col>
    </v-row>
    <form-render :loadingForm.sync="loadingForm" :formTemplate="form" :modeReload="false" @submit-form="submitForm" />
    <v-overlay :value="loading">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";

import FormRender from "@/components/formModule/render/formRender";

export default {
  data() {
    return {
      loading: true,
      loadingForm: true,
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
      },
      form: {},
      assignmentId: this.$route.params.assignmentId
    };
  },
  components: {
    FormRender
  },
  created() {
    if (this.$store.getters.getOrganizationId === "") {
      this.$router.go(-1);
    }
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
          this.getForm(res.data.data.assignmentForm.id);
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getForm(formId) {
      this.loadingForm = true;
      this.axios
        .get(config.baseUri.api + "/personnel/assignment-forms/" + formId, {
          headers: auth.getAuthHeader()
        })
        .then(res => {
          this.form = res.data.data;
        })
        .catch(err => {
          bus.$emit("callNotif", "error", err);
        })
        .finally(() => {
          this.loadingForm = false;
        });
    },
    submitForm(params) {
      this.loading = true;
      this.axios
        .post(
          config.baseUri.api +
            "/personnel/as-field-worker/" +
            this.$store.getters.getOrganizationId +
            "/" +
            this.$store.getters.getFieldWorkerId +
            "/canvass-assignments/" +
            this.assignmentId +
            "/reports",
          params,
          { headers: auth.getAuthHeader() }
        )
        .then(() => {
          bus.$emit("callNotif", "success", "Assignment Report Uploaded");
          this.$router.go(-1);
        })
        .catch(err => {
          bus.$emit("callNotif", "error", err);
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
