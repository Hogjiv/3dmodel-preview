<script>
export default {
  data() {
    return {
      name: "",
    };
  },
  props: {
    actionName: String,
  },
  methods: {
    emitvalue() {
      this.$emit("input", this.name);
    },
  },
};
</script>

<template>
  <div class="d-flex flex-column">
    <div
      class="d-flex flex-row text-center align-items-center justify-content-end"
    >
      <!-- text to show -->
      <span> {{ actionName }} </span>
      <!-- input form -->
      <input
        type="text"
        :placeholder="actionName[selectedItemIndex]"
        v-model="name"
        class="input-form"
        @input="emitvalue"
      />
    </div>
  </div>
</template>

<style>
.input-form {
  width: 400px;
}
</style>
