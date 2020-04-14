<template>
  <div>
    <v-row>
      <v-col cols="12" md="4">
        <v-card min-height="100%">
          <v-card-title primary-title>
            Element
            <v-spacer></v-spacer>
            <v-icon>mdi-forward</v-icon>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" lg="9" md="9" sm="6" xs="12">
                <v-text-field disabled dense label="Text" outlined clearable></v-text-field>
              </v-col>
              <v-col cols="12" lg="3" md="3" sm="6" xs="12">
                <v-btn class="mt-1" x-small fab color="primary" @click="addString">
                  <v-icon small>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="9" md="9" sm="6" xs="12">
                <v-textarea
                  class="my-0 py-0"
                  disabled
                  dense
                  rows="2"
                  label="Textarea"
                  outlined
                  clearable
                ></v-textarea>
              </v-col>
              <v-col cols="12" lg="3" md="3" sm="6" xs="12">
                <v-btn class="mt-1" x-small fab color="primary" @click="addTextarea">
                  <v-icon small>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="9" md="9" sm="6" xs="12">
                <v-text-field disabled dense label="Number" type="number" outlined clearable></v-text-field>
              </v-col>
              <v-col class="my-0 py-0" md="3">
                <v-btn class="mt-1" x-small fab color="primary" @click="addInteger">
                  <v-icon small>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="9" md="9" sm="6" xs="12">
                <v-radio-group>
                  <v-radio disabled v-for="n in 2" :key="n" :label="`Radio ${n}`" :value="n"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" lg="3" md="3" sm="6" xs="12">
                <v-btn class="mt-5" x-small fab color="primary" @click="addRadio">
                  <v-icon small>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="9" md="9" sm="6" xs="12">
                <v-select
                  disabled
                  dense
                  multiple
                  :items="items"
                  label="Select Multiple"
                  clearable
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12" lg="3" md="3" sm="6" xs="12">
                <v-btn class="mt-1" x-small fab color="primary" @click="addSelectMulti">
                  <v-icon small>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="9" md="9" sm="6" xs="12">
                <v-file-input disabled dense label="File input" clearable outlined></v-file-input>
              </v-col>
              <v-col cols="12" lg="3" md="3" sm="6" xs="12">
                <v-btn class="mt-1" x-small fab color="primary" @click="addAttachment" disabled>
                  <v-icon small>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card min-height="550px" :loading="loading">
          <v-card-title>
            Form Builder
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="dialogPreview = true" :disabled="fields.length == 0">
              <v-icon left>mdi-text-box-search-outline</v-icon>Form Preview
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" lg="12" md="12" sm="12">
                <v-text-field
                  outlined
                  counter="25"
                  maxlength="25"
                  label="name"
                  v-model="params.name"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="12" md="12" sm="12">
                <v-textarea
                  counter="500"
                  maxlength="500"
                  rows="3"
                  label="Description"
                  v-model="params.description"
                  outlined
                  dense
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text style="text-align:center;">
            <template v-if="params.name === ''">
              <v-chip color="warning" class="mr-2">
                <v-avatar left>
                  <v-icon>mdi-alert-outline</v-icon>
                </v-avatar>Insert Form Name
              </v-chip>
            </template>
            <template v-if="fields.length == 0">
              <v-chip color="warning">
                <v-avatar left>
                  <v-icon>mdi-alert-outline</v-icon>
                </v-avatar>No Fields Added
              </v-chip>
            </template>
            <template v-else>
              <v-divider></v-divider>
            </template>
          </v-card-text>
          <v-progress-circular indeterminate color="primary" v-if="loader"></v-progress-circular>
          <v-card-text>
            <transition-group name="slide-fade">
              <template v-for="(field, index) in fields">
                <v-row :key="index">
                  <v-col cols="12" lg="8" md="8" sm="8" xs="8">
                    <v-row>
                      <v-col cols="12" lg="2" md="2" sm="2">
                        <v-btn class="mt-2" fab x-small color="primary" @click="openProperties(index, field)">
                          <v-icon small>mdi-wrench-outline</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="12" lg="10" md="10" sm="10">
                        <field-module
                          :field="field"
                          :index="index"
                          :build="buildmode"
                          :modeReload="false"
                        ></field-module>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" lg="4" md="4" sm="4" xs="4">
                    <template>
                      <v-btn
                        class="mt-3"
                        :disabled="index === 0"
                        icon
                        small
                        fab
                        color="primary"
                        @click="swapUp(fields, index)"
                      >
                        <v-icon>mdi-chevron-up</v-icon>
                      </v-btn>
                      <v-btn
                        class="mt-3"
                        :disabled="index === fields.length - 1"
                        icon
                        small
                        fab
                        color="primary"
                        @click="swapDown(fields, index)"
                      >
                        <v-icon>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-btn
                      class="ml-2 mt-4"
                      x-small
                      fab
                      color="accent"
                      @click="duplicateEvent(index, field)"
                    >
                      <v-icon small>mdi-content-duplicate</v-icon>
                    </v-btn>
                    <v-btn
                      class="ml-2 mt-4"
                      x-small
                      fab
                      color="warning"
                      @click="deleteEvent(index)"
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </template>
            </transition-group>
          </v-card-text>
          <v-card-actions v-show="fields.length !== 0">
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="buildFormJSON()" :loading="loadBuild">
              <v-icon left>mdi-content-save</v-icon>Save
            </v-btn>
            <v-btn @click="resetField" color="warning">reset</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
      <v-btn color="blue" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>

    <dialog-preview
      :dialog.sync="dialogPreview"
      :fields="fields"
      :params="params"
      :buildmode="buildmode"
    />

    <dialog-prop
      v-if="dialogPropesties"
      :dialog.sync="dialogPropesties"
      :field="field"
      :index="indexPropesties"
    />
  </div>
</template>
<script>
import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";

import FieldModule from "../field/field";

import DialogPreview from "./DialogPreview";
import DialogProp from "./DialogProps";

import { formDynamicMixins } from "@/mixins/formDynamicMixins";

export default {
  mixins: [formDynamicMixins],
  props: ["isEdit"],
  data() {
    return {
      loading: false,
      loader: false,
      buildmode: true,
      dialogPreview: false,
      dialogPropesties: false,
      indexPropesties: 0,
      fields: [],
      fieldsOrdered: [],
      field: {},
      loadBuild: false,
      items: ["Foo", "Bar", "Fizz", "Buzz"],
      params: {
        name: "",
        description: ""
      },
      snackbar: false,
      timeout: 700,
      text: "",
      dataSingle: ""
    };
  },
  components: {
    FieldModule,
    DialogPreview,
    DialogProp
  },
  created() {
    bus.$on("resetField", () => {
      this.resetField();
    });
    if (this.isEdit) {
      this.getDataSingle();
    }
  },
  methods: {
    getLastOrder() {
      var lastPost;
      if (this.fields.length === 0) {
        lastPost = 1;
      } else {
        lastPost = this.fields.slice(-1)[0].position + 1;
      }
      return lastPost;
    },
    addString() {
      // eslint-disable-next-line no-new-object
      var field = new Object({
        name: "String",
        description: "",
        position: "",
        mandatory: true,
        defaultValue: null,
        minValue: 3,
        maxValue: 150,
        placeholder: "",
        type: "string"
      });
      field.position = this.getLastOrder();
      this.fields.push(field);
      this.snackbar = true;
      this.text = "string Field Added";
    },
    addTextarea() {
      // eslint-disable-next-line no-new-object
      var field = new Object({
        name: "Text Area",
        description: "",
        position: "",
        mandatory: true,
        defaultValue: null,
        minValue: 10,
        maxValue: 350,
        placeholder: "",
        type: "textarea"
      });

      field.position = this.getLastOrder();

      this.fields.push(field);
      this.snackbar = true;
      this.text = "textarea Field Added";
    },
    addInteger() {
      // eslint-disable-next-line no-new-object
      var field = new Object({
        name: "Integer",
        description: "",
        position: "",
        mandatory: false,
        defaultValue: 0,
        minValue: 0,
        maxValue: 20,
        placeholder: "",
        type: "integer"
      });
      field.position = this.getLastOrder();
      this.fields.push(field);
      this.snackbar = true;

      this.text = "Number Field Added";
    },
    addRadio() {
      // eslint-disable-next-line no-new-object
      var field = new Object({
        name: "Single Selection",
        description: "",
        position: "",
        mandatory: false,
        defaultValue: "",
        options: [
          {
            id: "",
            name: "selection 1",
            description: "",
            position: 1
          },
          {
            id: "",
            name: "selection 2",
            description: "",
            position: 2
          }
        ],
        type: "radio"
      });
      field.position = this.getLastOrder();
      this.fields.push(field);
      this.snackbar = true;

      this.text = "single selection Field Added";
    },
    addSelectMulti() {
      // eslint-disable-next-line no-new-object
      var field = new Object({
        name: "Multi Selection",
        description: "",
        position: "",
        mandatory: false,
        defaultValue: "",
        minValue: 1,
        maxValue: 4,
        options: [
          {
            id: "",
            name: "selection 1",
            description: "",
            position: 1
          }
        ],
        type: "select"
      });
      field.position = this.getLastOrder();
      this.fields.push(field);
      this.snackbar = true;

      this.text = "multi selection Field Added";
    },
    addAttachment() {
      // eslint-disable-next-line no-new-object
      var field = new Object({
        name: "File Input",
        description: "",
        position: "",
        mandatory: true,
        minValue: 1,
        maxValue: 1,
        minSize: 0,
        maxSize: 10,
        type: "attachment"
      });
      field.position = this.getLastOrder();
      this.fields.push(field);
      this.snackbar = true;

      this.text = "attachment selection Field Added";
    },
    deleteEvent: function(index) {
      this.fields.splice(index, 1);
    },
    duplicateEvent(index, field) {
      var item = JSON.parse(JSON.stringify(field));
      item.position = this.getLastOrder();
      this.fields.push(item);
      this.snackbar = true;
      this.text = "Field Duplicated";
    },
    swapUp(arr, index) {
      var temp = this.fields[index];
      var pos = this.fields[index].position;
      temp.position = this.fields[index - 1].position;
      var temp2 = this.fields[index - 1];
      temp2.position = pos;

      arr.splice(index - 1, 2, temp, temp2);
      this.fields = arr;
    },
    swapDown(arr, index) {
      var temp = this.fields[index];
      var pos = this.fields[index].position;
      temp.position = this.fields[index + 1].position;
      var temp2 = this.fields[index + 1];
      temp2.position = pos;

      arr.splice(index, 2, temp2, temp);
      this.fields = arr;
    },
    openProperties(index, field) {
      this.field = field;
      this.indexPropesties = index;
      this.dialogPropesties = true;
    },
    resetField() {
      this.fields = [];
      this.resetField2();
    },
    resetField2() {
      this.params.stringFields = [];
      this.params.textAreaFields = [];
      this.params.integerFields = [];
      this.params.singleSelectFields = [];
      this.params.multiSelectFields = [];
      this.params.attachmentFields = [];
    },
    buildFormJSON() {
      this.resetField2();
      this.loadBuild = true;
      var i;
      for (i = 0; i < this.fields.length; i++) {
        if (this.fields[i].type === "string") {
          this.params.stringFields.push(this.fields[i]);
        } else if (this.fields[i].type === "integer") {
          this.params.integerFields.push(this.fields[i]);
        } else if (this.fields[i].type === "textarea") {
          this.params.textAreaFields.push(this.fields[i]);
        } else if (this.fields[i].type === "radio") {
          this.params.singleSelectFields.push(this.fields[i]);
        } else if (this.fields[i].type === "select") {
          this.params.multiSelectFields.push(this.fields[i]);
        } else if (this.fields[i].type === "attachment") {
          this.params.attachmentFields.push(this.fields[i]);
        }
      }
      this.loadBuild = false;
      this.postformtoParent();
    },
    postformtoParent() {
      this.$emit("postform", this.params);
    },
    getDataSingle() {
      this.dataSingle = "";
      this.loader = true;
      this.axios
        .get(
          config.baseUri.api +
            "/admin/assignment-forms/" +
            this.$route.params.formId,
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(res => {
          this.dataSingle = res.data.data;
          this.params.name = this.dataSingle.name;
          this.params.description = this.dataSingle.description;
          this.refactorJSON(res.data.data);
        })
        .catch(() => {
          // bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.loader = false;
        });
    }
  }
};
</script>
