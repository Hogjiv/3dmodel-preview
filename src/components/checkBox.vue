<script>
export default {
  props: {
    modelValue: Boolean // Это свойство для связи с v-model
  },
  emits: ['update:modelValue'], // Это событие для обновления значения
  methods: {
    onClick() {
      const next = !this.modelValue;
      this.$emit('update:modelValue', next); // Отправляем обновлённое значение
    }
  }
};
</script>

<template>
  <div class="d-flex flex-row">
    <div
      class="checkbox d-flex"
      @click="onClick"
      :style="{ backgroundColor: modelValue ? '#C97191' : '#F0EEF0' }"
    >
      <!-- Текстовый элемент убран -->
    </div>
  </div>
</template>


<style>
.checkbox { 
  width: 28px;
  height: 28px;
  border-radius: 5px;
  background-color: #F0EEF0;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.25); 
}
 
</style>
