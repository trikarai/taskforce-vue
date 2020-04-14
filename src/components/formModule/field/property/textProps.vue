<template>
  <div>
    <v-card-title>Text/Text Area Properties</v-card-title>
    <v-row class="pa-5">
      <v-col cols="auto" md="12" sm="12" xs="12">
        <v-text-field label="Label Name" v-model="field.name"></v-text-field>
      </v-col>
      <v-col cols="auto"  md="12" sm="12" xs="12">
        <v-text-field label="Description" v-model="field.description"></v-text-field>
      </v-col>
      <v-col cols="auto"  md="12" sm="12" xs="12">
        <v-text-field label="Placeholder" v-model="field.placeholder"></v-text-field>
      </v-col>
      <v-col cols="auto" md="6" xs="6">
        <v-text-field label="Position" v-model="field.position" disabled></v-text-field>
      </v-col>
      <v-col cols="auto" md="12">
        <v-text-field label="Default Value" v-model="field.defaultValue"></v-text-field>
      </v-col>
      <v-col cols="auto" md="6">
        <v-text-field
          label="Min Char"
          v-model="field.minValue"
          type="number"
          :disabled="!field.mandatory"
        ></v-text-field>
      </v-col>
      <v-col cols="auto" md="6">
        <v-text-field label="Max Char" v-model="field.maxValue" type="number"></v-text-field>
      </v-col>
      <v-col cols="auto" md="12">
        <v-checkbox v-model="field.mandatory" :label="`Required : ${field.mandatory.toString()}`"></v-checkbox>
        <!-- {{pos}} -->
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  props: ["field", "index", "canvasMode"],
  components: {},
  data: function() {
    return {
      clearable: true,
      value: ""
    };
  },
  watch: {
    "field.required"() {
      if (this.field.mandatory === false) {
        this.field.minValue = 0;
      }
    }
  }
};
</script>
