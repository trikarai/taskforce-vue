<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    :overlay="true"
    max-width="350px"
    transition="dialog-transition"
  >
    <v-card :loading="loading">
      <v-card-title primary-title>{{dialogParams.text}}</v-card-title>
      <v-card-text>Confirm to {{dialogParams.action}}</v-card-text>
      <v-card-actions>
        <v-btn :loading="loading" small color="error" class="mr-2" @click="confirm">Confirm</v-btn>
        <v-btn small @click="$emit('update:dialog', false)">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    dialogParams: {
      type: Object
    },
    dialog: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    confirm() {
      this.$emit("confirm", this.dialogParams.id);
    }
  }
};
</script>
