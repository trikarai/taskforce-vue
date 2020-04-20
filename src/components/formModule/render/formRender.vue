<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title primary-title></v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <template v-for="(field, index) in reOrderField(fields)">
              <v-row :key="field.id">
                <field-module :field="field" :index="index" :modeReload="false" />
              </v-row>
            </template>
          </v-form>
        </v-card-text>
        <v-card-text>
          <v-skeleton-loader v-if="loadingForm" type="card"></v-skeleton-loader>
        </v-card-text>
        <v-card-actions v-if="!loadingForm">
          <v-btn color="primary" :disabled="!valid" @click="sendtoParent">
            <v-icon left>mdi-send</v-icon>Submit
          </v-btn>
        </v-card-actions>
        <!-- <v-card-text>{{params}}</v-card-text> -->
        <!-- <v-card-text>{{test}}</v-card-text> -->
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import bus from "@/config/bus";
import { formDynamicMixins } from "@/mixins/formDynamicMixins";
import FieldModule from "@/components/formModule/field/field";

export default {
  mixins: [formDynamicMixins],
  components: {
    FieldModule
  },
  props: ["formTemplate", "loadingForm"],
  data() {
    return {
      loading: true,
      valid: false,
      fields: [],
      params: [],
      test: {}
    };
  },
  watch: {
    formTemplate() {
      this.refactorJSON(this.formTemplate);
    }
  },
  created() {
    bus.$on("getValue", (params, index) => {
      this.params.splice(index, 1, params);
    });
  },
  mounted() {},
  methods: {
    sendtoParent() {
      this.test = this.refactorParams(this.params);
      this.$emit("submit-form", this.test);
    }
  }
};
</script>

<style>
</style>
