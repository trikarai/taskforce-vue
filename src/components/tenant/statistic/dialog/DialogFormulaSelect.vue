<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title>
        <p class="text-capitalize">Selection Formula</p>
        <v-spacer></v-spacer>
        <v-btn icon color="error" @click="$emit('update:dialog', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-row>
            <!-- <v-col cols="12" lg="12">{{params}}</v-col> -->
            <v-col cols="12" lg="12">
              <v-text-field label="Name" v-model="params.name" :rules="rulesName"></v-text-field>
            </v-col>
            <v-col cols="12" lg="12">{{field.name}}</v-col>
            <v-col cols="12" lg="12">
              <v-radio-group v-model="params.optionId" :rules="rulesRequired">
                <template v-for="opt in field.options">
                  <v-radio :key="opt.id" :label="opt.name" :value="opt.id"></v-radio>
                </template>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="!valid" color="primary" @click="submit">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixins } from "@/mixins/validationMixins";

export default {
  mixins: [validationMixins],
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    formId: {
      type: String,
      required: true
    },
    field: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      valid: false,
      params: {
        name: "",
        assignmentFormId: this.formId,
        singleSelectFieldId: this.field.id,
        multiSelectFieldId: this.field.id,
        optionId: ""
      }
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$emit("submit", this.params, this.type);
      }
    }
  }
};
</script>

<style>
</style>
