<template>
  <div>
    <template v-for="(data, index) in reOrderRecord(fields)">
      <v-row :key="index">
        <v-col style="word-break: break-word" class="tabel-left" md="4" lg="4" xs="12">
          <span class="subtitle-2 font-weight-black">
            <span class="left-accent"></span>
            {{data.field.name}}
          </span>
        </v-col>
        <v-col
          class="tabel-right"
          md="8"
          lg="8"
          xs="12"
          :key="data.id"
          v-if="data.type == 'string'"
        >{{data.value}}</v-col>
        <v-col
          class="tabel-right"
          md="8"
          lg="8"
          xs="12"
          :key="data.id"
          v-if="data.type == 'integer'"
        >{{data.value}}</v-col>
        <v-col
          class="tabel-right"
          md="8"
          lg="8"
          xs="12"
          :key="data.id"
          v-if="data.type == 'textarea'"
        >{{data.value}}</v-col>
        <v-col class="tabel-right" md="8" lg="8" xs="12" :key="data.id" v-if="data.type == 'radio'">
          <template v-if="data.selectedOption != null">{{data.selectedOption.name}}</template>
          <template v-else>-</template>
        </v-col>
        <v-col
          class="tabel-right"
          md="8"
          lg="8"
          xs="12"
          :key="data.id"
          v-if="data.type == 'select'"
        >
          <template v-if="data.selectedOptions.length == 0">-</template>
          <template v-for="opt in data.selectedOptions">{{opt.option.name}} ,</template>
        </v-col>
        <v-col
          class="tabel-right"
          md="8"
          lg="8"
          xs="12"
          :key="data.id"
          v-if="data.type == 'attachment'"
        >
          <template v-if="data.attachedFiles.length == 0">-</template>
          <template v-else>
            <v-img
              :name="file.id"
              :src="storageUri+file.fileInfo.path"
              :key="file.id"
              @click="viewImage(file)"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="primary lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </template>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
import * as config from "@/config/config";
import { formDynamicMixins } from "@/mixins/formDynamicMixins";
// import pdf from "vue-pdf";

export default {
  mixins: [formDynamicMixins],
  props: ["fields"],
  data() {
    return {
      storageUri: config.baseUri.storage
    };
  },
  methods: {
    getFileExt(path) {
      return path.split(".").pop();
    }
  }
};
</script>

<style>
</style>
