<template>
  <v-col>
    <v-textarea
      :hint="field.description"
      :placeholder="field.placeholder"
      :maxLength="field.maxValue"
      :counter="field.maxValue"
      :rules="[rules.min, checkRequired]"
      dense
      rows="3"
      outlined
      autocomplete="off"
      v-model="value"
    >
      <template v-slot:label>
        <div :class="{required : field.required}">{{field.name}}</div>
      </template>
    </v-textarea>
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
  data: function() {
    return {
      clearable: true,
      value: "",
      isError: false
    };
  },
  watch: {},
  created() {
    this.modeReload ? (this.value = this.field.value) : (this.value = "");
  }
};
</script>

<style scoped>
</style>
