<template>
  <div>
    <string-field v-bind:index="index" v-bind:field="field" v-if="field.type === 'string'"></string-field>
    <string-field v-bind:index="index" v-bind:field="field" v-if="field.type === 'textarea'"></string-field>
    <integer-field v-bind:index="index" v-bind:field="field" v-if="field.type === 'integer'"></integer-field>
    <selection-field v-bind:index="index" v-bind:field="field" v-if="field.type === 'radio'"></selection-field>
    <selection-field v-bind:index="index" v-bind:field="field" v-if="field.type === 'select'"></selection-field>
    <attachment-field v-bind:index="index" v-bind:field="field" v-if="field.type === 'attachment'"></attachment-field>
  </div>
</template>

<script>
import string from "./property/textProps";
import integer from "./property/numberProps";
import selection from "./property/selectionProps";
// import attachment from "./properties/attachment";

export default {
  components: {
    "string-field": string,
    "integer-field": integer,
    "selection-field": selection
    // "attachment-field": attachment
  },
  props: ["field", "index"],
  data: function() {
    return {
      show: false,
      value: "",
      form: {
        value: ""
      }
    };
  }
};
</script>
