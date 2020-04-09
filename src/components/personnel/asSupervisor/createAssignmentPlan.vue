<template>
  <v-container extended grid-list-xs>
    <v-row>
      <!-- {{$store.state.organizationId}} -->
      <v-col xs="12" sm="12" md="12" lg="6">
        <v-card>
          <v-card-title>Create Assignment Plan</v-card-title>
          <v-card-text>
            <v-form v-model="valid" ref="form" lazy-validation>
              <v-row>
                <v-col xs="12" sm="12" md="12" lg="6">
                  <v-select
                    :loading="loadingForm"
                    v-model="params.assignmentFormId"
                    :items="assignmentForms.list"
                    item-value="id"
                    item-text="name"
                    label="Assigment Form"
                    dense
                    outlined
                    :rules="rulesRequired"
                  ></v-select>
                </v-col>
                <v-col xs="12" sm="12" md="12" lg="6">
                  <v-text-field
                    v-model="params.name"
                    label="Plan Name"
                    outlined
                    dense
                    :rules="rulesName"
                  ></v-text-field>
                </v-col>
                <v-col xs="12" sm="12" md="12" lg="12">
                  <v-textarea
                    v-model="params.description"
                    label="Description"
                    rows="2"
                    outlined
                    dense
                  ></v-textarea>
                </v-col>
                <v-col xs="12" sm="12" md="6">
                  <v-select
                    v-model="params.periodUnit"
                    :items="['once','month', 'week', 'year']"
                    label="Periode Unit"
                    dense
                    outlined
                    :rules="rulesRequired"
                  ></v-select>
                </v-col>
                <v-col xs="12" sm="12" md="6">
                  <v-text-field
                    v-model="params.periodLength"
                    label="Periode Length"
                    outlined
                    dense
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col xs="12" sm="12" md="6">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="params.startDate"
                        label="Start Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-on="on"
                        clearable
                        :rules="rulesRequired"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      ref="picker"
                      :locale="$vuetify.lang.current"
                      v-model="params.startDate"
                      @input="menu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col sm="6" md="6">
                  <v-menu
                    ref="menu2"
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="params.endDate"
                        label="End Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-on="on"
                        clearable
                        :rules="rulesRequired"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      ref="picker2"
                      :locale="$vuetify.lang.current"
                      v-model="params.endDate"
                      :min="params.startDate"
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col sm="12" md="6">
                  <v-text-field
                    v-model="params.visitNumber"
                    label="Visit"
                    outlined
                    dense
                    type="number"
                    :rules="rulesRequired"
                    min="0"
                    required
                  ></v-text-field>
                </v-col>
                <v-col md="12">
                  <v-select
                    :loading="loadingWorker"
                    :items="fieldWorkers.list"
                    item-value="id"
                    item-text="name"
                    v-model="params.fieldWorkerIds"
                    label="Field Workers"
                    chips
                    outlined
                    dense
                    multiple
                    :rules="rulesRequired"
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn class="mr-2" color="primary" @click="submit" :disabled="!valid">submit</v-btn>
            <v-btn @click="clear">clear</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <!-- <dialog-fieldworker v-if="dialogFieldworker" :dialog.sync="dialogFieldworker" /> -->
  </v-container>
</template>

<script>
import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";

// import DialogFieldworker from "./DialogFieldWorkers";

import { validationMixins } from "@/mixins/validationMixins";

export default {
  mixins: [validationMixins],
  data() {
    return {
      valid: false,
      dialogFieldworker: false,
      menu: false,
      menu2: false,
      loadingForm: false,
      loadingWorker: false,
      loading: false,
      assignmentForms: {
        total: 0,
        list: []
      },
      fieldWorkers: {
        total: 0,
        list: []
      },
      params: {
        assignmentFormId: "",
        name: "",
        description: "",
        periodUnit: "once",
        periodLength: 0,
        startDate: "",
        endDate: "",
        visitNumber: 0,
        fieldWorkerIds: []
      },
      organizationId: "a8fb97d2-41be-40bb-83fa-28b571bce2ac"
    };
  },
  components: {
    // DialogFieldworker
  },
  mounted() {
    this.getAssigmentForms();
    this.getFieldWorkers();
  },
  methods: {
    openFieldWorkerDialog() {
      this.dialogFieldworker = true;
    },
    getFieldWorkers() {
      this.loadingWorker = true;
      this.axios
        .get(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.$store.getters.getOrganizationId +
            "/field-workers",
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(res => {
          this.fieldWorkers = res.data.data;
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.loadingWorker = false;
        });
    },
    getAssigmentForms() {
      this.loadingForm = true;
      this.axios
        .get(config.baseUri.api + "/personnel/assignment-forms", {
          headers: auth.getAuthHeader()
        })
        .then(res => {
          this.assignmentForms = res.data.data;
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.loadingForm = false;
        });
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.addData();
      }
    },
    clear() {
      this.$refs.form.reset();
    },
    addData() {
      this.loading = true;
      this.axios
        .post(
          config.baseUri.api +
            "/personnel/as-supervisor/" +
            this.$store.getters.getOrganizationId +
            "/assignment-plans",
          this.params,
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(res => {
          console.log(res);
          bus.$emit("callNotif", "info", "Assigment Plan Created");
          this.$router.go(-1);
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
