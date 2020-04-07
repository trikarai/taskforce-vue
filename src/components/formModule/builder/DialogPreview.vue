<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    :overlay="true"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card class="pa-5">
      <v-card-title>
        <span class="headline">{{params.name}} Preview</span>
        <v-spacer></v-spacer>
        <v-btn icon color="error" @click="$emit('update:dialog', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <template v-for="(field, index) in reOrderField(fields)">
        <!-- <template v-for="(field, index) in (fields)"> -->
          <v-row :key="index">
            <field-module :field="field" :index="index" :build="buildmode" />
          </v-row>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import FieldModule from "../field/field";
import { formDynamicMixins } from "@/mixins/formDynamicMixins";

export default {
  mixins: [formDynamicMixins],
  props: {
    fields: {
      type: Array
    },
    params: {
      type: Object
    },
    dialog: {
      type: Boolean,
      default: false
    },
    buildmode: {
      type: Boolean,
      default: false
    }
  },
  components: {
    FieldModule
  }
};
</script>
