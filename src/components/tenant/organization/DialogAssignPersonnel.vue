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
        <p class="text-capitalize">{{type}}</p>
        <v-spacer></v-spacer>
        <v-btn icon color="error" @click="$emit('update:dialog', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-autocomplete
            :disabled="isEdit"
            label="Personnel"
            :items="personnels.list"
            item-value="id"
            item-text="name"
            v-model="params.personnelId"
            :rules="rulesRequired"
          ></v-autocomplete>
          <v-text-field
            label="Position Name"
            v-model="params.name"
            :rules="rulesName"
            :counter="50"
            maxlength="50"
            required
          ></v-text-field>
          <v-textarea
            label="Position Description"
            v-model="params.description"
            :counter="250"
            maxlength="250"
            required
          ></v-textarea>
          <v-btn
            v-if="!isEdit"
            class="mr-2"
            color="primary"
            @click="submit"
            :disabled="!valid"
          >Submit</v-btn>
          <v-btn v-else class="mr-2" color="primary" @click="edit" :disabled="!valid">Update</v-btn>
          <v-btn @click="clear">clear</v-btn>
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
    type: {
      type: String,
      required: true
    },
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
      personnels: { total: 0, list: [] },
      params: {
        personnelId: "",
        name: "",
        description: ""
      }
    };
  },
  watch: {},
  mounted() {
    this.getPersonnels();
    if (this.isEdit) {
      this.getDataDetail();
    }
  },
  methods: {
    getPersonnels() {
      this.loading = true;
      this.axios
        .get(config.baseUri.api + "/admin/personnels", {
          headers: auth.getAuthHeader()
        })
        .then(res => {
          this.personnels = res.data.data;
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
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
            "/admin/organizations/" +
            this.$route.params.organizationId +
            "/" +
            this.type,
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
            "/admin/organizations/" +
            this.$route.params.organizationId +
            "/" +
            this.type +
            "/" +
            this.editId +
            "/update-profile",
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
            "/admin/organizations/" +
            this.$route.params.organizationId +
            "/" +
            this.type +
            "/" +
            this.editId,
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(res => {
          this.params = res.data.data;
          this.params.personnelId =
            res.data.data.assignedPersonnel.personnel.id;
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
