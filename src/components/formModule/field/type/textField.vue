<template>
  <v-col>
    <v-text-field
      :placeholder="field.placeholder"
      :hint="field.hint"
      :maxLength="field.maxValue"
      :minLength="field.minValue"
      :counter="field.maxValue"
      :rules="[rules.min, checkRequired]"
      autocomplete="off"
      outlined
      dense
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
  props: ["field", "modeReload", "index"],
  data() {
    return {
      value: ""
    };
  },
  created() {
    this.modeReload ? (this.value = this.field.value) : (this.value = "");
  }
};
</script>
