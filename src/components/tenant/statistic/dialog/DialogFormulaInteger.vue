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
        <p class="text-capitalize">Integer Formula</p>
        <v-spacer></v-spacer>
        <v-btn icon color="error" @click="$emit('update:dialog', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-row>
            <v-col cols="12" lg="12">
              <v-text-field label="Name" v-model="params.name" :rules="rulesName"></v-text-field>
            </v-col>
            <v-col cols="12" lg="12">
              <v-select
                :items="operands"
                item-value="value"
                item-text="description"
                v-model="params.computationOperand"
                label="Computation Operand"
                :rules="rulesRequired"
              ></v-select>
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
    }
  },
  data() {
    return {
      valid: false,
      operands: [
        { value: "SUM", description: "SUMMARY" },
        { value: "AVG", description: "AVERAGE" }
      ],
      params: {
        name: "",
        computationOperand: "",
        includedIntegerFields: []
      }
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$emit("submit", this.params);
      }
    }
  }
};
</script>

<style>
</style>
