<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    :overlay="true"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-text>
        <props-module :index="indexPropesties" :field="field" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="mb-5" color="primary" text @click="$emit('update:dialog', false)">Done</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import PropsModule from "../field/property";

export default {
  props: {
    field: {
      type: Object
    },
    dialog: {
      type: Boolean,
      default: false
    },
    indexPropesties: {
      type: Number
    }
  },
  components: {
    PropsModule
  }
};
</script>
