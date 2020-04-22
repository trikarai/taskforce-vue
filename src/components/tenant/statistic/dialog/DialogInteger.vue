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
        <p class="text-capitalize">{{fieldName}}</p>
        <v-spacer></v-spacer>
        <v-btn icon color="error" @click="$emit('update:dialog', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-row>
            <v-col cols="12" lg="6">
              <v-select
                :items="operand"
                item-text="text"
                v-model="selected"
                label="Comparison Operand"
                :rules="rulesRequired"
                :append-outer-icon="getIcon()"
                return-object
              ></v-select>
            </v-col>
            <v-col cols="12" lg="6">
              <v-text-field
                :rules="rulesRequired"
                type="number"
                label="Comparison Value"
                v-model="params.comparisonValue"
                v-if="!disableComparison"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="submit" :disabled="!valid">Add</v-btn>
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
    fieldId: {
      type: String,
      required: true
    },
    fieldName: {
      type: String
    }
  },
  data() {
    return {
      valid: false,
      selected: "",
      operand: [
        { value: "=", text: "equal", icon: "mdi-code-equal" },
        { value: ">", text: "greater than", icon: "mdi-code-greater-than" },
        {
          value: ">=",
          text: "greater than or equal",
          icon: "mdi-code-greater-than-or-equal"
        },
        { value: "<", text: "less than", icon: "mdi-code-less-than" },
        {
          value: "<=",
          text: "less than or equal",
          icon: "mdi-code-less-than-or-equal"
        },
        { value: "IS NULL", text: "is null", icon: "mdi-null" },
        {
          value: "IS NOT NULL",
          text: "is not null",
          icon: "mdi-ellipse-outline mdi-rotate-90 "
        }
      ],
      disableComparison: false,
      params: {
        name: this.fieldName,
        assignmentFormId: this.formId,
        integerFieldId: this.fieldId,
        comparisonOperand: "",
        comparisonValue: ""
      }
    };
  },
  watch: {
    selected() {
      this.params.comparisonOperand = this.selected.value;
    },
    params: {
      handler() {
        if (
          this.params.comparisonOperand === "IS NULL" ||
          this.params.comparisonOperand === "IS NOT NULL"
        ) {
          this.disableComparison = true;
          this.params.comparisonValue = null;
        } else {
          this.disableComparison = false;
          this.params.comparisonValue = "";
        }
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$emit("submit", this.params);
      }
    },
    getIcon() {
      var icon = this.selected.icon;
      if (icon === undefined) {
        return "mdi-blank";
      } else {
        return icon;
      }
    }
  }
};
</script>

<style>
</style>
