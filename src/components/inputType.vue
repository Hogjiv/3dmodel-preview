<script>
export default {
  data() {
    return {
      // actionName: [
      //   "Select folder from PC",
      //   "Where to put images",
      // ],
    };
  },
  props: ["actionName"],
};
</script>

<template>
  <div class="d-flex flex-column">
    <div
      class="d-flex flex-row text-center align-items-center justify-content-end"
    >
      <span> {{ actionName }} </span>
      <input
        type="text"
        :placeholder="actionName[selectedItemIndex]"
        class="input-form"
      />
    </div>
    <!-- <div
        v-for="(item, index) in actionName"
        :key="index"
        class=" d-flex flex-row text-center align-items-center justify-content-end"
      >
        <p>{{ item }}</p>
        <input
          type="text"
          v-model="actionName[selectedItemIndex]"
          :placeholder="actionName[selectedItemIndex]"
          class="input-form"
        />
      </div> -->
  </div>
</template>

<style>
.input-form {
  width: 400px;
}
</style>
