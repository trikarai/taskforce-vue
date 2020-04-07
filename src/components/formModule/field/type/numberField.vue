<template>
  <v-col>
    <v-text-field
      v-if="field.required"
      dense
      :placeholder="field.placeholder"
      :hint="field.hint"
      :min="field.minValue"
      :max="field.maxValue"
      :rules="[rules.minValue, rules.maxValue, checkRequired]"
      :error="isError"
      type="number"
      autocomplete="off"
      outlined
      v-model="value"
    >
      <template v-slot:label>
        <div :class="{required : field.required}">{{field.name}}</div>
      </template>
    </v-text-field>
    <!-- not required -->
    <v-text-field
      v-else
      dense
      :placeholder="field.placeholder"
      :hint="field.hint"
      :max="field.maxValue"
      type="number"
      autocomplete="off"
      outlined
      v-model="value"
    >
      <template v-slot:label>
        <div :class="{required : field.required}">{{field.name}}</div>
      </template>
    </v-text-field>
  </v-col>
</template>
<script>
import { validationMixins } from "@/mixins/validationMixins";
import { formDynamicMixins } from "@/mixins/formDynamicMixins";
export default {
  mixins: [validationMixins, formDynamicMixins],
  props: {
    field: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    modeReload: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      value: "",
      isError: true
    };
  },
  created() {
    this.modeReload ? (this.value = this.field.value) : (this.value = "");
  },
  mounted() {
    this.field.required ? (this.isError = true) : (this.isError = false);
  }
};
</script>
