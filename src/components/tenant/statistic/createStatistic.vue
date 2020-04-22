<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="4">
        <v-row>
          <v-col cols="12" lg="12">
            <v-select
              :loading="loadingForm"
              class="mt-4"
              :items="forms.list"
              item-text="name"
              item-value="id"
              v-model="formId"
              label="Assignment Form"
              outlined
              dense
              @change="getFormDetail()"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="12">{{form.description}}</v-col>
        </v-row>
        <v-divider></v-divider>
        <span class="title">Integer Field</span>
        <template v-if="form.integerFields">
          <v-alert
            dense
            type="info"
            v-if="form.integerFields.length == 0"
            :value="true"
          >No Integer Field type found from Selected Form</v-alert>
        </template>
        <v-row v-for="field in form.integerFields" :key="field.id">
          <v-col cols="12" lg="10">{{field.name}}</v-col>
          <v-col cols="12" lg="2">
            <v-btn
              fab
              x-small
              color="primary"
              :disabled="!integerSelected"
              @click="dialogInteger = true, fieldId = field.id, fieldName = field.name"
            >
              <v-icon small>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row v-for="field in form.singleSelectFields" :key="field.id">
          <v-col cols="12" lg="10">{{field.name}}</v-col>
          <v-col cols="12" lg="2">
            <v-btn fab x-small color="primary" @click="addSelectFormula(field, 'single')">
              <v-icon small>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row v-for="field in form.multiSelectFields" :key="field.id">
          <v-col cols="12" lg="10">{{field.name}}</v-col>
          <v-col cols="12" lg="2">
            <v-btn fab x-small color="primary" @click="addSelectFormula(field, 'multi')">
              <v-icon small>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="8">
        <v-card>
          <v-card-text>
            <v-form v-model="valid" ref="form" lazy-validation>
              <v-row>
                <v-col cols="12" lg="12">
                  <v-text-field
                    v-model="params.name"
                    :rules="rulesRequired"
                    label="Name"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="12">
                  <v-textarea
                    rows="3"
                    v-model="params.description"
                    outlined
                    dense
                    label="Description"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" lg="4">
                  <v-btn color="primary" small @click="dialogFInteger = true">Add Integer Formula</v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-radio-group v-model="integerRadio" @change="integerChange">
                    <v-alert
                      type="info"
                      v-if="params.integerFormulas.length == 0"
                      :value="true"
                    >No Integer Formula Added</v-alert>
                    <v-row v-for="(data, index) in params.integerFormulas" :key="index">
                      <v-col cols="12" lg="2">
                        <v-radio :key="index" :value="index"></v-radio>
                      </v-col>
                      <v-col cols="12" lg="4">{{data.name}}</v-col>
                      <v-col cols="12" lg="4">{{data.computationOperand}}</v-col>
                      <v-col cols="12" lg="2">
                        <v-btn
                          small
                          color="warning"
                          icon
                          @click="params.integerFormulas.splice(index, 1)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="12" lg="12">
                        <v-alert
                          dense
                          type="warning"
                          v-if="data.includedIntegerFields.length ==0"
                          :value="true"
                        >No Field Added</v-alert>
                        <v-row
                          class="pl-5"
                          v-for="(field, indexField) in data.includedIntegerFields"
                          :key="indexField"
                        >
                          <v-col cols="12" lg="4">{{field.name}}</v-col>
                          <v-col cols="12" lg="1">{{field.comparisonOperand}}</v-col>
                          <v-col cols="12" lg="2">{{field.comparisonValue}}</v-col>
                          <v-col cols="12" lg="2">
                            <v-btn
                              x-small
                              color="warning"
                              icon
                              @click="data.includedIntegerFields.splice(indexField, 1)"
                            >
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="12">
                  <v-alert
                    small
                    type="info"
                    v-if="params.singleSelectFormulas.length == 0"
                    :value="true"
                  >No Select Formula Added</v-alert>
                  <v-row
                    class="pl-5"
                    v-for="(data, index) in params.singleSelectFormulas"
                    :key="index"
                  >
                    <v-col cols="12" lg="4">{{data.name}}</v-col>
                    <v-col cols="12" lg="2">
                      <v-btn
                        x-small
                        color="warning"
                        icon
                        @click="params.singleSelectFormulas.splice(index, 1)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-alert
                    small
                    type="info"
                    v-if="params.multiSelectFormulas.length == 0"
                    :value="true"
                  >No Multi Select Formula Added</v-alert>
                  <v-row
                    class="pl-5"
                    v-for="(data, index) in params.multiSelectFormulas"
                    :key="index"
                  >
                    <v-col cols="12" lg="4">{{data.name}}</v-col>
                    <v-col cols="12" lg="2">
                      <v-btn
                        x-small
                        color="warning"
                        icon
                        @click="params.multiSelectFormulas.splice(index, 1)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" :disabled="!valid" @click="submit">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <formula-integer
      v-if="dialogFInteger"
      :dialog.sync="dialogFInteger"
      @submit="addIntegerFormula"
    />
    <formula-selection
      v-if="dialogFSelection"
      :dialog.sync="dialogFSelection"
      :formId="formId"
      :field="field"
      :type="selectionType"
      @submit="addSelectionField"
    />
    <field-integer
      v-if="dialogInteger"
      :formId="formId"
      :fieldId="fieldId"
      :fieldName="fieldName"
      :dialog.sync="dialogInteger"
      @submit="addIntegerField"
    />
    <v-overlay :value="loadingData">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";

import FormulaInteger from "./dialog/DialogFormulaInteger";
import FormulaSelection from "./dialog/DialogFormulaSelect";
import FieldInteger from "./dialog/DialogInteger";

import { validationMixins } from "@/mixins/validationMixins";

export default {
  mixins: [validationMixins],
  data() {
    return {
      valid: false,
      loadingData: false,
      loadingForm: false,
      loadingForms: false,
      form: {},
      forms: { total: 0, list: [] },
      formId: "",
      fieldId: "",
      fieldName: "",
      field: {},
      params: {
        name: "",
        description: "",
        integerFormulas: [],
        singleSelectFormulas: [],
        multiSelectFormulas: []
      },
      dialogInteger: false,
      dialogFInteger: false,
      dialogFSelection: false,
      integerRadio: "",
      integerSelected: false,
      selectionType: "single",
      value: ""
    };
  },
  components: {
    FormulaInteger,
    FormulaSelection,
    FieldInteger
  },
  mounted() {
    this.getForms();
  },
  methods: {
    getForms() {
      this.loadingForms = true;
      this.axios
        .get(config.baseUri.api + "/admin/assignment-forms", {
          headers: auth.getAuthHeader()
        })
        .then(res => {
          this.forms = res.data.data;
        })
        .catch(() => {})
        .finally(() => {
          this.loadingForms = false;
        });
    },
    getFormDetail() {
      this.loadingForm = true;
      this.axios
        .get(config.baseUri.api + "/admin/assignment-forms/" + this.formId, {
          headers: auth.getAuthHeader()
        })
        .then(res => {
          this.form = res.data.data;
        })
        .catch(() => {})
        .finally(() => {
          this.loadingForm = false;
        });
    },
    addIntegerFormula(params) {
      this.dialogFInteger = false;
      this.params.integerFormulas.push(params);
    },
    addIntegerField(params) {
      this.dialogInteger = false;
      var index = this.integerRadio;
      this.params.integerFormulas[index].includedIntegerFields.push(params);
    },
    integerChange() {
      this.integerSelected = true;
    },
    addSelectFormula(field, type) {
      this.selectionType = type;
      this.dialogFSelection = true;
      this.field = field;
    },
    addSelectionField(params, type) {
      this.dialogFSelection = false;
      if (type === "single") {
        this.params.singleSelectFormulas.push(params);
      } else {
        this.params.multiSelectFormulas.push(params);
      }
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.postStatistic();
      }
    },
    postStatistic() {
      this.loadingData = true;
      this.axios
        .post(
          config.baseUri.api + "/admin/tenant-statistic-operations",
          this.params,
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(() => {
          this.$router.go(-1);
        })
        .catch(err => {
          bus.$emit("callNotif", "error", err);
        })
        .finally(() => {
          this.loadingData = false;
        });
    }
  }
};
</script>

<style>
</style>
