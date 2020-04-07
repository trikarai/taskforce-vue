<template>
  <v-container extended grid-list-xs>
    <!-- build form module start -->
    <buildform-module @postform="postform" :isEdit="edit" />
    <!-- -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>
<script>
import bus from "@/config/bus";
import * as config from "@/config/config";
import auth from "@/config/auth";

import BuildformModule from "../../formModule/builder/formBuilder";

export default {
  data() {
    return {
      overlay: false,
      edit: false
    };
  },
  components: {
    BuildformModule
  },
  created() {
    this.$route.params.formId ? (this.edit = true) : (this.edit = false);
  },
  methods: {
    postform(params) {
      console.log("Params", params);
      this.edit ? this.editData(params) : this.addData(params);
    },
    addData(params) {
      this.overlay = true;
      this.axios
        .post(config.baseUri.api + "/admin/assignment-forms", params, {
          headers: auth.getAuthHeader()
        })
        .then(() => {
          bus.$emit("resetField");
          bus.$emit("callNotif", "success", "Form Created");
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.overlay = false;
        });
    },
    editData(params) {
      this.overlay = true;
      this.axios
        .patch(
          config.baseUri.api +
            "/admin/assignment-forms/" +
            this.$route.params.formId,
          params,
          {
            headers: auth.getAuthHeader()
          }
        )
        .then(() => {
          bus.$emit("resetField");
          bus.$emit("callNotif", "success", "Form Updated");
        })
        .catch(error => {
          bus.$emit("callNotif", "error", error);
        })
        .finally(() => {
          this.overlay = false;
        });
    }
  }
};
</script>
