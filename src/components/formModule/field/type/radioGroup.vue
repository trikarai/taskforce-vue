<template>
  <v-col>
    <div :class="{required: field.required}">{{field.name}}</div>
    <v-radio-group v-model="option" :error="isError">
      <v-radio
        v-for="(option, index) in field.options"
        :key="index"
        :label="option.name"
        :value="option.id"
      ></v-radio>
    </v-radio-group>
  </v-col>
</template>
<script>
import bus from "@/config/bus";
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
      option: "",
      isError: false,
      errorMessages: ["jancux"]
    };
  },
  created() {
    this.modeReload
      ? (this.option = this.field.selectedOption.id)
      : (this.field.options = this.reOrderField(this.field.options));
  },
  mounted() {
    this.field.required ? (this.isError = true) : (this.isError = false);
  },
  watch: {
    option: function() {
      this.isError = false;
      var params;
      if (this.modeReload) {
        params = {
          fieldId: this.field.singleSelectField.id,
          selectedOptionId: this.option,
          type: this.field.type
        };
      } else {
        params = {
          fieldId: this.field.id,
          selectedOptionId: this.option,
          type: this.field.type
        };
      }
      bus.$emit("getValue", params, this.index);
    }
  }
};
</script>
<style scoped>
</style>
