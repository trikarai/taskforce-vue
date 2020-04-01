<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    :overlay="true"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card :loading="loading">
      <v-card-title>
        <p class="text-capitalize">Client</p>
        <v-spacer></v-spacer>
        <v-btn icon color="error" @click="$emit('update:dialog', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-text-field
            label="Client Name"
            v-model="params.name"
            :rules="rulesName"
            :counter="50"
            maxlength="50"
            required
          ></v-text-field>
          <v-textarea
            label="Client Address"
            v-model="params.address"
            :counter="500"
            maxlength="500"
            required
          ></v-textarea>
          <v-text-field label="Client Phone" v-model="params.phone" :rules="rulesPhone" counter></v-text-field>
          <v-text-field
            label="Client Coordinate"
            hint="Longitude, Latitude (-34.11242, 58.11547)"
            persistent-hint
            v-model="params.coordinate"
            :rules="rulesCoordinate"
            counter
          ></v-text-field>
          <v-btn
            v-if="!isEdit"
            class="mr-2 mt-5"
            color="primary"
            @click="submit"
            :disabled="!valid"
          >Submit</v-btn>
          <v-btn v-else class="mr-2" color="primary" @click="edit" :disabled="!valid">Update</v-btn>
          <v-btn class="mt-5" @click="clear">clear</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { validationMixins } from "@/mixins/validationMixins";
import bus from "@/config/bus";
import auth from "@/config/auth";
import * as config from "@/config/config";

export default {
  mixins: [validationMixins],
  props: {
    isEdit: {
      type: Boolean,
      required: true
    },
    editId: {
      type: String,
      required: false
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      valid: false,
      loading: false,
      params: {
        name: "",
        address: "",
        phone: "",
        coordinate: ""
      }
    };
  },
  watch: {},
  mounted() {
    if (this.isEdit) {
      this.getDataDetail();
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.addData();
      }
    },
    edit() {
      if (this.$refs.form.validate()) {
        this.editData();
      }
    },
    clear() {
      this.$refs.form.reset();
    },
    addData() {
      this.loading = true;
      this.axios
        .post(
          config.baseUri.api +
            "/admin/teritories/" +
            this.$route.params.territoryId +
            "/clients",
          this.params,
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(() => {
          this.$emit("refresh");
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    editData() {
      this.loading = true;
      this.axios
        .patch(
          config.baseUri.api +
            "/admin/teritories/" +
            this.$route.params.territoryId +
            "/clients/" +
            this.editId,
          this.params,
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(() => {
          this.$emit("refresh");
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getDataDetail() {
      this.loading = true;
      this.axios
        .get(
          config.baseUri.api +
            "/admin/teritories/" +
            this.$route.params.territoryId +
            "/clients/" +
            this.editId,
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(res => {
          this.params = res.data.data;
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
