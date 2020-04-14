<template>
  <div>
    <v-card-title>Number Properties</v-card-title>
    <v-row class="pa-5">
      <v-col cols="auto" md="12">
        <v-text-field label="Label Name" v-model="field.name"></v-text-field>
      </v-col>
      <v-col cols="auto" md="12">
        <v-text-field label="Description" v-model="field.description"></v-text-field>
      </v-col>
      <v-col cols="auto" md="12">
        <v-text-field label="Placeholder" v-model="field.placeholder"></v-text-field>
      </v-col>
      <v-col cols="auto" md="6">
        <v-text-field label="Position" v-model="field.position" disabled></v-text-field>
      </v-col>
      <v-col cols="auto" md="6">
        <v-text-field label="Grid Position" disabled></v-text-field>
      </v-col>
      <v-col cols="auto" md="12">
        <v-text-field label="Default Value" v-model="field.defaultValue"></v-text-field>
      </v-col>
      <template v-if="field.mandatory">
        <v-col cols="auto" md="6">
          <v-text-field label="Min Value" v-model="field.minValue" type="number"></v-text-field>
        </v-col>
        <v-col cols="auto" md="6">
          <v-text-field label="Max Value" v-model="field.maxValue" type="number"></v-text-field>
        </v-col>
      </template>
      <v-col cols="auto" md="12">
        <v-checkbox v-model="field.mandatory" :label="`Required : ${field.mandatory.toString()}`"></v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  props: ["field", "index"],
  components: {},
  data: function() {
    return {
      clearable: true,
      value: ""
    };
  },
  watch: {
    "field.mandatory": "isRequired"
  },
  methods: {
    isRequired() {
      if (!this.field.mandatory) {
        this.field.minValue = 0;
        this.field.maxValue = 0;
        this.field.defaultValue = "";
      }
    }
  }
};
</script>
