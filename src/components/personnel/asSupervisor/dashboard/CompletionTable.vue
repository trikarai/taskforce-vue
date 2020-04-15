<template>
  <v-data-table :headers="headers" :items="data" item-key="id">
    <template v-slot:item.completed="{item}">
      <v-icon color="green" v-if="item.completed">mdi-check</v-icon>
      <v-icon color="red" v-else>mdi-close</v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    data: Array
  },
  data() {
    return {
      headers: [
        { text: "Start Date", value: "startDate" },
        { text: "End Date", value: "endDate" },
        { text: "Completed", value: "completed" }
      ]
    };
  }
};
</script>

<style>
</style>
