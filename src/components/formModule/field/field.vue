<template>
  <v-row>
    <text-field
      :modeReload="modeReload"
      v-bind:index="index"
      v-bind:field="field"
      v-if="field.type === 'string'"
    />
    <textarea-field
      :modeReload="modeReload"
      v-bind:index="index"
      v-bind:field="field"
      v-if="field.type === 'textarea'"
    />
    <number-field
      :modeReload="modeReload"
      v-bind:index="index"
      v-bind:field="field"
      v-if="field.type === 'integer'"
    />
    <radio-field
      :modeReload="modeReload"
      v-bind:index="index"
      v-bind:field="field"
      v-if="field.type === 'radio'"
    />
    <selection-field
      :modeReload="modeReload"
      v-bind:index="index"
      v-bind:field="field"
      v-if="field.type === 'select'"
      v-bind:build="build"
    />
  </v-row>
</template>

<script>
import NumberField from "./type/numberField";
import TextField from "./type/textField";
import TextareaField from "./type/textArea";
import RadioField from "./type/radioGroup";
import SelectionField from "./type/selectionMulti";
// import FileField from "./type/inputFile";

export default {
  props: ["field", "index", "build", "modeReload"],
  components: {
    TextField,
    NumberField,
    RadioField,
    TextareaField,
    SelectionField
    // FileField
  }
};
</script>
